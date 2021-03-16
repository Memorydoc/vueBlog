---
title: 线程通信
---

## Exchanger 进行线程通信
>通过exchanger.exchange进行线程通信，双方线程必须都执行此方法，否则会阻塞等待

```java 
    public class Test1 {
        private static Exchanger exchanger = new Exchanger();
    
        public static void main(String[] args) {
            new Thread(() -> {
                try {
                    Object exchange = exchanger.exchange("我是" + Thread.currentThread().getName() );
                    System.out.println(Thread.currentThread().getName() +"获取到了->" +exchange);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
    
            }).start();
    
            new Thread(() -> {
                try {
                    Object exchange = exchanger.exchange("我是" + Thread.currentThread().getName());
                    System.out.println(Thread.currentThread().getName() +"获取到了->" +exchange);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }

```