---
title: 环形队列
---

## 环形队列


::: waring
充分利用数组空间, 通过取模的算法， 当数组满了的时候，通过取模将指针移动到最开头，这样就可以重复利用空间
:::

```java  
package com.pwc.datastructure.queue;

import java.util.Scanner;

/**
 * 环形队列
 */
public class CircleArrayQueue {


    static class CircleArray {
        private int maxSize; // 表示数组的最大容量
        //front 变量的含义做一个调整： front 就指向队列的第一个元素, 也就是说 arr[front] 就是队列的第一个元素
        //front 的初始值 = 0
        private int front;
        //rear 变量的含义做一个调整：rear 指向队列的最后一个元素的后一个位置. 因为希望空出一个空间做为约定.
        //rear 的初始值 = 0
        private int rear; // 队列尾
        private int[] arr; // 该数据用于存放数据, 模拟队列

        public CircleArray(int arrMaxSize) {
            maxSize = arrMaxSize;
            arr = new int[maxSize];
        }

        // 判断队列是否满
        public boolean isFull() {
            return (rear  + 1) % maxSize == front;
        }

        // 判断队列是否为空
        public boolean isEmpty() {
            return rear == front;
        }

        // 添加数据到队列
        public void addQueue(int n) {
            // 判断队列是否满
            if (isFull()) {
                System.out.println("队列满，不能加入数据~");
                return;
            }
            //直接将数据加入
            arr[rear] = n;
            //将 rear 后移, 这里必须考虑取模
            rear = (rear + 1) % maxSize;
        }

        // 获取队列的数据, 出队列
        public int getQueue() {
            // 判断队列是否空
            if (isEmpty()) {
                // 通过抛出异常
                throw new RuntimeException("队列空，不能取数据");
            }
            // 这里需要分析出 front是指向队列的第一个元素
            // 1. 先把 front 对应的值保留到一个临时变量
            // 2. 将 front 后移, 考虑取模
            // 3. 将临时保存的变量返回
            int value = arr[front];
            front = (front + 1) % maxSize;
            return value;

        }

        // 显示队列的所有数据
        public void showQueue() {
            // 遍历
            if (isEmpty()) {
                System.out.println("队列空的，没有数据~~");
                return;
            }
            // 思路：从front开始遍历，遍历多少个元素
            // 动脑筋
            for (int i = front; i < front + size() ; i++) {
                System.out.printf("arr[%d]=%d\n", i % maxSize, arr[i % maxSize]);
            }
        }

        // 求出当前队列有效数据的个数
        public int size() {
            // rear = 2
            // front = 1
            // maxSize = 3
            return (rear + maxSize - front) % maxSize;
        }

        // 显示队列的头数据， 注意不是取出数据
        public int headQueue() {
            // 判断
            if (isEmpty()) {
                throw new RuntimeException("队列空的，没有数据~~");
            }
            return arr[front];
        }
    }

    public static void main(String[] args) {
        CircleArray arrayQueue = new CircleArray(3);
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