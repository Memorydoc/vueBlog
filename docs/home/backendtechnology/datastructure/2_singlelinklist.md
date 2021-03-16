---
title: 单链表实现
---


## 单链表

::: warning
add 方法是普通的往链表中插入数据
addByOrder 是将插入的节点排序,并判断当前节点是否已经存在，如果存在则禁止重复插入
:::

```java 
package com.pwc.datastructure.linklist;

/**
 * 单链表
 */
public class SingLinkListDemo {
    public static void main(String[] args) {
        //创建节点
        HearNode hearNode1 = new HearNode("宋江", 1, "宋江");

        HearNode hearNode2 = new HearNode("刘备", 2, "刘备");

        HearNode hearNode3 = new HearNode("曹操", 3, "曹操");

        HearNode hearNode4 = new HearNode("张飞", 4, "张飞");

        //将节点加入链表

     /*   SingLinkList singLinkList = new SingLinkList();
        singLinkList.add(hearNode1);
        singLinkList.add(hearNode2);
        singLinkList.add(hearNode3);
        singLinkList.add(hearNode4);
        singLinkList.list();*/

        // 按照节点的no顺序将数据插入到链表中

        SingLinkList singLinkList = new SingLinkList();

        singLinkList.addByOrder(hearNode1);
        singLinkList.addByOrder(hearNode3);
        singLinkList.addByOrder(hearNode2);
        singLinkList.addByOrder(hearNode4);
        singLinkList.addByOrder(hearNode2); //这里就不能再插入 节点2了
        singLinkList.list();
    }

}

// 创建SingLinkList单链表 管理节点（HearNode）
class SingLinkList {
    //初始化一个头节点
    private HearNode head = new HearNode("", 0, "");//头结点不存储具体的数据，只是为了寻找链表的头

    public void add(HearNode hearNode) {//添加节点的时候，要添加到链表的最后
        // 思路： 当不考虑编号的顺序时， 找到当前链表的最后一个节点，将最后这个节点的next域指向这个新的 hearNode 节点
        // 因为head 节点不能动，因此我们需要一个辅助指针
        HearNode temp = head;


        //开始使用这个temp指针去找最后一个节点，最后一个节点有什么特点呢？ 那就是next 是为null的 就是 最后一个节点
        while (true) {
            if (temp.next == null)
                break;
            //如果找到的不是null，那么将temp的指针往后移
            temp = temp.next;
        }
        temp.next = hearNode; //这时的temp已经指向最后一个节点了
    }

    public void addByOrder(HearNode hearNode){

        //首先 要通过辅助指针，找到 要添加节点位置的前一个节点
        HearNode temp = head;// 辅助指针从头位置开始查找
        boolean isExist = false;// 判断当前节点是否存在
        while (true){
            if(temp.next == null) //这种情况是  当前temp指针指向最后一个元素了，可以直接使用这个temp指向的对象
                break;
            if(temp.next.no > hearNode.no){//说明 temp已经到了要插入的节点的位置的下一个位置
                break;
            }
            if(temp.next.no == hearNode.no){//说明当前节点的数据已经存在
                isExist = true;
            }
            temp = temp.next;
        }
        if(isExist){
            System.out.printf("当前编号数据 %d 已经存在，不能插入 \n", hearNode.no);
        }else{
            //将节点加入到链表中
            // 首先将当前要插入的节点的next域指针连接
            hearNode.next = temp.next;
            // 然后将temp指针的next指针指向 当前插入的节点
            temp.next = hearNode;
        }
    }




    //显示遍历链表

    public void list() {
        if (head.next == null) {
            System.out.println("链表为空");
            return;
        }
        HearNode temp = head.next;
        while (true) {
            if (temp == null) {
                break;
            }
            System.out.println(temp);
            temp = temp.next;
        }
    }


}


//定义一个节点  这里自定义 HearNode  节点类名
class HearNode {
    public String nickName;
    public int no;
    public String name;
    public HearNode next;//指向下一个节点(next域)

    public HearNode(String nickName, int no, String name) {
        this.nickName = nickName;
        this.no = no;
        this.name = name;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setNext(HearNode next) {
        this.next = next;
    }

    @Override
    public String toString() {
        return "HearNode{" +
                "nickName='" + nickName + '\'' +
                ", no=" + no +
                ", name='" + name + '\'' +
                "}";
    }
}

```
