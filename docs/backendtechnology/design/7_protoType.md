---
title: 原型模式（克隆对象，深度复制、浅度复制）
---
## 简介
原型模式（Prototype Pattern）是用于创建重复的对象，同时又能保证性能。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

这种模式是实现了一个原型接口，该接口用于创建当前对象的克隆。当直接创建对象的代价比较大时，则采用这种模式。例如，一个对象需要在一个高代价的数据库操作之后被创建。我们可以缓存该对象，在下一个请求时返回它的克隆，在需要的时候更新数据库，以此来减少数据库调用。

## 案例场景
克隆一个对象，判断克隆之后的对象和原先的对象是否相等

## 深克隆和浅克隆（自定义克隆对象）
1. 通过 new 产生一个对象需要非常繁琐的数据准备或访问权限，则可以使用原型模式。
2.一个对象需要提供给其他对象访问，而且各个调用者可能都需要修改其值时，可以考虑使用原型模式拷贝多个对象供调用者使用

注释掉的代码是深克隆相关代码，通过序列化转成流实现深度克隆
```java 
public abstract class Shape implements  Cloneable, Serializable {
    protected String type;
    protected String size;
    public Object clone() throws CloneNotSupportedException {
        //clone对象之后，对象本身不一样了，但是对象中的属性还是一样的
        //所以要是要求完全不一样的时候，就要使用序列化和反序列进行克隆对象
      /* 
       Shape clone= null;
       ByteArrayOutputStream bos = null;
        ObjectOutputStream oos = null;
        ByteArrayInputStream bis = null;
        ObjectInputStream ois = null;
        try {
            bos = new ByteArrayOutputStream();
            oos = new ObjectOutputStream(bos);
            oos.writeObject(this);

            bis = new ByteArrayInputStream(bos.toByteArray());
            ois = new ObjectInputStream(bis);
            clone = (Shape)ois.readObject();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }finally{
            try {
                bos.close();
                oos.close();
                bis.close();
                ois.close();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    */
        return super.clone();
    }
    abstract void draw();
}
```
## 实现克隆对象
```java 
public class Rectangle extends  Shape  {
    public Rectangle(){
        this.type = "Rectangle";
        this.size= "222";
    }
    @Override
    public void draw() {
        System.out.println("Inside Rectangle::draw() method.");
    }
}

```
## 测试
```java 
public class MianTest {
    public static void main(String[] args) throws CloneNotSupportedException {
        try {
            Rectangle rectangle = new Rectangle();
            Object clone = (Rectangle)rectangle.clone();
            System.out.println(rectangle  == clone);
            System.out.println("rectangle 的hashCode :" + rectangle.hashCode() );
            System.out.println("clone 的hashCode :" + clone.hashCode() );

            System.out.println(rectangle.size ==((Rectangle) clone).size);
            System.out.println(rectangle.type == ((Rectangle) clone).type);
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }

    }
}

```
#### 测试结果
```sh 
false
rectangle 的hashCode :1627674070
clone 的hashCode :1360875712
true
true

```
## 总结
深克隆是通过序列化，在内存中堆中将新 用一块空间存放 克隆之后的对象
浅克隆是通过实现 Cloneable 调用clone方法（Object.clone），只是将引用复制，引用指针指向的堆中的对象还是 克隆之前的对象
如果克隆对象和克隆之后的引用其中一个改变了值，会影响另一个，但是修改基本数据类型与Stirng类型时，
不会造成数据的改变，基本数据类型例如int，在clone的时候会重新开辟一个四个字节的大小的空间，将其赋值。
而String则由于String变量的唯一性，如果改变了String类型的值，则会生成一个新的String对象，对之前的没有影响。


