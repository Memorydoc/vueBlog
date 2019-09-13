---
title: AQS(AbstractQueuedSynchronizer)
---

## 采用设计模式
模板模式

 **模板方法**
 * 独占方式获取
     * accquire
     * accquireInterruptibly
     * tryAcquireNanos
 * 共享方式获取
     * accquireShared
     * accquireSharedInterruptibly
     * tryAcquireSharedNanos
 * 独占方式释放
     * release
 * 共享方式释放
     * releaseShared
 
    
**需要子类覆盖的流程方法**      
    * 独占式获取
        * tryAcquire
    * 独占式释放
        * tryRelease
    * 共享式获取
        * tryAcquireShared
    * 共享式释放
        * tryReleaseShared    
**同步器是否处于占用状态**    
    * isHeldExclusively
  
* 同步状态<code>state</code>
  * getState() 获取同步状态
  * setState() 设置同步状态
  * compareAndSetState(int expect, int update) CAS方式同步状态
  
## 原理介绍
AQS建立的初衷就是为 **锁** 定义的一套设计方法
Doug Lea 大神在设计AQS时候，创建了一个同步队列（CLH同步队列是一个FIFO双向队列），AQS依赖它来完成同步状态的管理，当前线程如果获取同步状态失败时，AQS则会将当前线程已经等待状态等信息构造成一个节点（Node）并将其加入到CLH同步队列，同时会阻塞当前线程，当同步状态释放时，会把首节点唤醒（公平锁），使其再次尝试获取同步状态
![aqs2](/img/current/aqs2.png)


## Node节点
在CLH同步队列中，一个节点(Node)表示一个线程，它保存着线程的引用（thread）、状态（waitStatus）、前驱节点（prev）、后继节点（next） 


## 思路梳理
我们在设计锁的时候， 一般 应该有一个<code>lock()</code> 和<code>unlock()</code> 方法，因为AQS是 使用模板模式实现的
那么， 我们调用的 <code>lock()</code> 方法 和 <code>unlock()</code> 方法，其实是调用AQS内部的 公共的模板方法，
那么我们先从  <code>lock()</code>  方法出发，看一下AQS中是怎么实现的

下面以 <code>ReentrantLock</code> 为例，追踪链路，看一下AQS内部是怎么做的
 ## 非公平锁lock方法调用链
 在 ReentrantLock 中我们调用的 <code>lock()</code> 方法， 其中sync 是 一个抽象的静态内部类，其中就是利用AQS的原理实现的
 ```java  
     abstract static class Sync extends AbstractQueuedSynchronizer
 ```
 因为  <code>ReentrantLock</code>  中有两种锁，公平锁和非公平锁，我们先从非公平锁入手
  <code>ReentrantLock</code>  默认的构造函数就是创建 非公平锁
```java 
public ReentrantLock() {
        sync = new NonfairSync();
    }
```
 
 <code>ReentrantLock</code> 内部的 非公平锁 <code>NonfairSync</code>
```java 
static final class NonfairSync extends Sync
```


在<code>NonfairSync</code> 中的<code>lock()</code> 方法中。会直接通过CAS的方式获取锁，因为是非公平锁，所以根本不会考虑，直接去获取锁。其实
就是设置 <code>AbstractQueuedSynchronizer</code> 的 <code>state</code> 为 1(其实就是去修改 这个state变量的值，如果修改为1成功说明获取锁成功.如果设置不成功，则没有获取到锁。 )并将当前 锁拥有线程设置为 自己

如果设置不成功，那么说明当前 锁 被别的线程 占用。那么需要使用AQS的 方式 获取锁（acquire(1)） - 即将线程加入等待队列（双向链）


```java 
 final void lock() {
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                acquire(1);
        }
```
#### acquire() 方法
```java 
public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```
* <code>tryAcquire</code>尝试去获取锁，如果获取失败则将执行加入同步队列的操作（acquireQueued(addWaiter(Node.EXCLUSIVE), arg))）
<code>tryAcquire</code> 需要具体的子类重写该方法
```java  
 protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires); // 这里是非公平锁的尝试获取锁方式
        }
```

* <code>nonfairTryAcquire</code> 方法， 获取锁成功则返回true, 那么 acquire 直接结束， 即获取锁成功，无需 将线程加入等待队列
```java 
 final boolean nonfairTryAcquire(int acquires) {
            final Thread current = Thread.currentThread();//获取当前正在执行的线程
            int c = getState();
            if (c == 0) { //如果 状态为0 说明 没有获取锁 直接尝试获取锁。
                if (compareAndSetState(0, acquires)) { // CAS方式 设置 状态（state）为 acquires（1）
                    setExclusiveOwnerThread(current);  // 设置锁拥有者为当前线程
                    return true; 
                }
            }
            else if (current == getExclusiveOwnerThread()) { //  如果当前锁拥有者是 自己，那么将 state 状态 加加 ，
                int nextc = c + acquires;  //  为 可重入锁 提供了条件
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
``` 

* 如果获取锁失败， 则要将当前线程 加入等待队列
```java 
acquireQueued(addWaiter(Node.EXCLUSIVE), arg)
```
**addWaiter** 方法
```java 
  private Node addWaiter(Node mode) {
        Node node = new Node(Thread.currentThread(), mode);
        // Try the fast path of enq; backup to full enq on failure
        Node pred = tail;
        if (pred != null) {
            node.prev = pred;
            if (compareAndSetTail(pred, node)) {
                pred.next = node;
                return node;
            }
        }
        enq(node);
        return node;
    }
```
1.将当前线程 设置成为一个Node节点， 并从等待队列中获取 tail 节点（是末尾节点），**如果tail节点 不等于 null**， 说明 当前竞争锁的线程不是孤身一人在队列中
那么将 当前线程的节点的前面的节点 指向 tail 节点 （<code>node.prev = pred;</code>）， 并用CAS的方式 将 当前线程节点加入到等待队列末尾，并将
next节点指向自己(<code>pred.next = node</code>)

![aqs2](/img/current/aqs1.png)

2. **如果 tail节点等于 null**, 则执行enq() 方法， 将当前节点设置为首节点

enq()方法
```java 
  private Node enq(final Node node) {
    for (;;) {  // 通过 死循环的方式 这是CAS的经典实现
        Node t = tail;
        if (t == null) { // Must initialize
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
```
**这里如果同步队列中没有Node节点，那么需要创建一个 节点放入 同步队列**

* 下一个流程acquireQueued(), 在这个方法中, 会实现线程节点的阻塞和唤醒. 所有节点在这个方法的处理下,等待资源
```java 
final boolean acquireQueued(final Node node, int arg) { 
    boolean failed = true;  //是否拿到资源
    try {        
        boolean interrupted = false;  //等待过程中是否被中断过
        for (;;) {        //又是一个自旋配合CAS设置变量
            final Node p = node.predecessor();       //当前节点的前驱节点  
            if (p == head && tryAcquire(arg)) { 
                //如果前驱节点是头节点, 则当前节点已经具有资格尝试获取资源
                 //(可能是头节点任务完成之后唤醒的后继节点, 当然也可能是被interrup了)
                setHead(node);    //获取资源后,设置当前节点为头节点   
                p.next = null; // help GC                
                failed = false;   
                return interrupted;   
            }            
              //如果不能获取资源, 就进入waiting状态
            if (shouldParkAfterFailedAcquire(p, node) && parkAndCheckInterrupt())                
                interrupted = true;        
        }    
    } finally {        
        if (failed)            
            cancelAcquire(node);    
    }
}
```

* shouldParkAfterFailedAcquire
```java 
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {    
    int ws = pred.waitStatus; //获取前一个节点的状态,还记得waitStatus是上面意思呒?
    if (ws == Node.SIGNAL)
      /*
      *如果前驱节点完成任务后能够唤醒自己,那么当前节点就可以放心的睡觉了.
      *记住,唤醒当前节点的任务是前驱节点完成
      */
        return true;    
    if (ws > 0) { //ws大于0表示节点已经被取消,应该踢出队列.               
        do {            
            //节点的前驱引用指向更前面的没有被取消的节点. 所以被取消的节点没有引用之后会被GC
            node.prev = pred = pred.prev;        
        } while (pred.waitStatus > 0);        
        pred.next = node;    
    } else {      
        //找到了合适的前驱节点后,将其状态设置为SIGNAL
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);    
    }    
    return false;
}
```

接下来是 parkAndCheckInterrupt() 方法, 真正让节点进入waiting状态的方法,实在这个方法中调用的..

```java 
private final boolean parkAndCheckInterrupt() {  
    LockSupport.park(this);    //JNI调用, 使线程进入waiting状态
    return Thread.interrupted(); //检查是否被中断
}

```
* selfInterrupt()
上面也说了, acquire()方法不是立即响应中断的. 而是在获取资源后进行自我中断处理


## 非公平锁 unlock()
在 unlock内部会调用 AQS中的 <code>release</code> 方法
```java 
public void unlock() {
        sync.release(1);
    }
```

*  **release**
```java 
 public final boolean release(int arg) {
        if (tryRelease(arg)) { // 尝试释放锁
            Node h = head;
            if (h != null && h.waitStatus != 0)
                unparkSuccessor(h);
            return true;
        }
        return false;
    }
```

* tryRelease
```java 
protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    if (Thread.currentThread() != getExclusiveOwnerThread())  /// 释放锁，所以 锁拥有者必须为当前线程 （独占锁）
        throw new IllegalMonitorStateException();
    boolean free = false;
    if (c == 0) { //独占锁模式下,state为0时表示没有线程获取锁,这时才算是当前线程完全释放锁
        free = true;
        setExclusiveOwnerThread(null);
    }
    setState(c);
    return free;
}
```
* unparkSuccessor 用这个方法唤醒后继节点
```java 
private void unparkSuccessor(Node node) { 
    int ws = node.waitStatus;    
    if (ws < 0)        
        compareAndSetWaitStatus(node, ws, 0);      
    Node s = node.next;    
    if (s == null || s.waitStatus > 0) {   //waitStatus表示节点已经被取消,应该踢出队列
        s = null;        
          //从后想前找到最靠前的合法节点
        for (Node t = tail; t != null && t != node; t = t.prev)            
            if (t.waitStatus <= 0)                
                s = t;    
    }    
    if (s != null)       
        LockSupport.unpark(s.thread);
}
```
这个方法也比较简单,就是用一个JNI方法unpark()唤醒队列中下一个需要处理的节点

##  公平锁

```java 
protected final boolean tryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                //在这里 公平锁要判断 同步队列中的当前线程节点之前是否存在别的节点，如果不存在再进行CAS获取锁
                //就是说所有的线程都要有顺序的执行， 而非公平锁是抢占式的获取锁
                if (!hasQueuedPredecessors() &&  
                    compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
```
 
 
  
  