---
title: '并发集合'
---

## 高并发下的集合

>下面看一个普通的ArrayList 在高并发情况下的运行情况，模拟一个售票系统（1000张票），一100个终端售票
```java 
    public class T {
    
        private static final Integer ticket = 1000;
        private static final Integer terminal = 1000;
    
        private static List list = new ArrayList();
    
        static {
            for (Integer integer = 0; integer < ticket; integer++) {
                list.add(integer);
            }
        }
    
        public static void main(String[] args) {
            for (int integer = 0; integer < terminal; integer++) {
                int finalInteger = integer;
                new Thread(() -> {
                    while (list.size() > 0){
                        try {
                            Thread.sleep(100);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        Object tick = list.get(finalInteger);
                        System.out.println(tick);
                        list.remove(tick);
                    }
                }).start();
            }
        }
    }
 ```
 **以上代码会出现问题，线程不安全，在while循环判断的地方可能会出现多个线程进入的情况，因为是在高并发环境下。这个时候，考虑使用并发队列**
 
 
 >以下代码完美解决并发问题，
 ```java 
public class T {

    private static final Integer ticket = 1000;
    private static final Integer terminal = 1000;

    private static Queue list = new ConcurrentLinkedQueue();

    static {
        for (Integer integer = 0; integer < ticket; integer++) {
            list.add(integer);
        }
    }

    public static void main(String[] args) {
        for (int integer = 0; integer < terminal; integer++) {
            int finalInteger = integer;
            new Thread(() -> {
                while (list.size() > 0){
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    Object poll = list.poll();
                    if(poll != null){
                        System.out.println(poll);//这里可以具体的售票操作，
                    }else{
                        //显示售票为空，各个售票终端显示票已售空
                        System.out.println("售票完成, 余票为0" + list.size());
                        break;
                    }
                }
            }).start();
        }
    }
}
  ```
## 非阻塞队列
>非阻塞队列的特色就是队列里面没有数据时，操作队列出现异常返回null， 不具有等待/阻塞
### ConcurrentHashMap
ConcurrentHashMap线程安全的，实现原理是使用分段锁技术，将数据结构分成16份，对读取和写入进行分段加锁，这样多线程并发量提高，并且是线程安全


### ConcurrentSkipListMap
ConcurrentSkipListMap线程安全，并且有顺序


### ConcurrentSkipListSet
ConcurrentSkipListSet 线程安全，有顺序，只有key值，没有value
### ConcurrentLinkedQueue
ConcurrentLinkedQueue 
1.提供了并发环境下的队列操作，方法poll()当没有获取到数据的时候，返回null;如果有数据时，则移除表头数据，并返回。
2.方法element()当没有获取到数据时出现NoSuchElementException异常，如果有数据则返回
3.方法peek()当没有数据的时候，返回null，如果有数据则返回数据，但不移除数据

### ConcurrentLinkedDeque
ConcurrentLinkedDeque（双端队列）：可以从列头获取值，也可以从列尾获取值

### CopyOnWriteArrayList
### CopyOnWriteArraySet
### DelayQueue 定时任务

## 阻塞队列
>所谓的阻塞队列即为：BlockQueue， 其实就是如果BlockQueue为空，从其中获取东西的操作将会被阻塞进入等待状态，直到BlockQueue添加进新的元素才会被唤醒。同样
如果BlockQueue是满的，试图往队列中添加元素的操作将会被阻塞。直到有剩余空间才会被唤醒

### ArrayBlockQueue
>是一个有界的队列阻塞队列 同样也是提供poll(): peek() :size():element()方法，方法使用方法同上面原理相同

### LinkedBlockQueue
>是一个无界的阻塞队列，当然也可以指定为有界的

### LinkedTransferQueue
> 调用transfer(),线程会一直等待队列中的数据被消费，如果不消费。则会一直等待
>调用add()和put()则不会等待

### SynchronousQueue
是一种特殊的TransferQueue，队列中的内容直接怼到消费者，队列本身容量为空
> SynchronousQueue 和 LinkedTransferQueue 都应该先创建消费者，再创建生产者。 LinkedTransferQueue 和 SynchronousQueue的区别就是
> SynchronousQueue （不能添加元素的队列）容量为空，LinkedTransferQueue可以进行嗅探容量，就是可以往对队列中添加元素

### add():offer():put()区别
1.add往队列中加入元素，如果超出队列限定值，则抛出异常
2.offer加入元素。如果超出则return false
3.put() 往队列中加入元素，如果超出则等待阻塞


  
  
  
  