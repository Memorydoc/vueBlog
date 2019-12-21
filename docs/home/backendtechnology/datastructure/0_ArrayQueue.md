---
title: 普通队列
---


## 普通队列
::: warning
 普通队列，插入的数据会添加到队列尾部，如果队列已满，则无法插入，但是有一个问题， 指针会一直往后添加，这样数组的指针会无线
 扩大，这个时候，可以使用环形队列解决这个问题
:::

```java 
package com.pwc.datastructure.queue;

import java.util.Scanner;

/**
 * 这是一个普通队列， 只能用一次，指针会一直往后叠加，考虑转成环形列表
 */
public class ArrayQueueDemo {


    static class ArrayQueue {
        private int maxSize = 3;
        private int front = -1;  // 队列的第一个元素的前一个地址
        private int rear = -1; // 队列的最后一个元素
        private int[] arr = new int[maxSize];//存放数据的数组

        public ArrayQueue(int maxSize) {
        }

        public boolean isFull() {
            return rear == maxSize - 1;
        }

        public boolean isEmpty() {
            return rear == front;
        }

        //添加元素
        public void addQueue(int n) {
            if (isFull()) {
                System.out.println("数组满了");
                return;
            }
            rear++;
            arr[rear] = n;
        }

        public int getQueue() {
            if (isEmpty()) {
                throw new RuntimeException("队列为空");
            }
            front++;
            return arr[front];
        }

        public void showQueue() {
            for (int i = 0; i < arr.length; i++) {
                System.out.println(arr[i]);
            }
        }
    }

    public static void main(String[] args) {
        ArrayQueue arrayQueue = new ArrayQueue(10);
        char key = ' ';
        Scanner scanner = new Scanner(System.in);
        boolean loop = true;
        while (loop) {
            key = scanner.next().charAt(0);
            switch (key) {
                case 'a':
                    System.out.println("请输入一个数字");
                    int value = scanner.nextInt();
                    arrayQueue.addQueue(value);
                    break;
                case 'g':
                    System.out.println(arrayQueue.getQueue());
                    break;
                case 'e':
                    break;
                case 's':
                    arrayQueue.showQueue();
            }
        }
        System.out.println("程序退出~~");

    }

}

```