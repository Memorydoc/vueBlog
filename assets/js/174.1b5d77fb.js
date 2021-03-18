(window.webpackJsonp=window.webpackJsonp||[]).push([[174],{447:function(t,a,s){"use strict";s.r(a);var n=s(10),r=Object(n.a)({},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"cas介绍"}},[t._v("CAS介绍")]),t._v(" "),s("div",{staticClass:"tip custom-block"},[s("p",[t._v("在jdk 1.5中增加的一个最主要的支持是Atomic类，比如说AtomicInteger, AtomicLong，这些类可帮助最大限度地减少在多线程中对于一些基本操作（例如，增加或减少多个线程之间共享的值）的复杂性。而这些类的实现都依赖于CAS（compare and swap）的算法。")])]),t._v(" "),s("p",[t._v("在CAS中有三个概念 cas只针对一个变量")]),t._v(" "),s("ul",[s("li",[t._v("第一个是V（主存中的变量值）")]),t._v(" "),s("li",[t._v("第二个是A  (当前存储当前线程中的变量值)")]),t._v(" "),s("li",[t._v("第三个是B  (当前线程将要修改成的值)\n通过调用unsafe的方法，可以通过偏移量获取属性值或设置属性值\n获取属性偏移量的值\n"),s("img",{attrs:{src:"/img/interviewtopic/cas1.png",alt:"cas1"}})])]),t._v(" "),s("hr"),t._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getAndAddInt")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),t._v(" var1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("long")]),t._v(" var2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" var4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" var5"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("do")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            var5 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getIntVolatile")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("var1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" var2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("compareAndSwapInt")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("var1"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" var2"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" var5"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" var5 "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),t._v(" var4"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" var5"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br")])]),s("p",[t._v("（通过compareAndSwapInt方法可以获取线程中\n的变量值， var1当前对象，var2 当前属性内存偏移量）\n最后通过cas操作， compareAndSwapInt 这里只是针对int的介绍，还有 Object 、Long\n"),s("img",{attrs:{src:"/img/interviewtopic/cas2.png",alt:"cas1"}})]),t._v(" "),s("div",{staticClass:"warning custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("提示")]),t._v(" "),s("p",[t._v("cas操作有一个特点： 当B的值返回将要修改V的值的时候，此时，会判断内存中的值和当前线程A的值 是否相等。当且仅当当前线程中的变量值A（一些文章中解释成预期值）和 主存中的变量值V 相等时，才会将主存中的V改成B（修改值）,否则将重新将V值赋给A值并重新计算得到B。\n如果A值和V值总是不相等，那么会产生自旋。在循环中不断的进行CAS操作，就是主存中的值和线程中的值如果一直不相等，就一直等到他们相等，再修改成B值\n在语言中不做处理，而是使用CPU和内存实现CAS")])]),t._v(" "),s("p",[s("img",{attrs:{src:"/img/interviewtopic/cas3.png",alt:"cas1"}})]),t._v(" "),s("h2",{attrs:{id:"cas中的aba问题"}},[t._v("CAS中的ABA问题")]),t._v(" "),s("p",[t._v("如果一开始位置V得到的旧值是A，当进行赋值操作时再次读取发现仍然是A，并不能说明变量没有被其它线程改变过。有可能是其它线程将变量改为了B，后来又改回了A。大部分情况下ABA问题不会影响程序并发的正确性，如果要解决ABA问题，用传统的互斥同步可能比原子类更高效。")]),t._v(" "),s("h2",{attrs:{id:"aba问题的解决办法"}},[t._v("ABA问题的解决办法")]),t._v(" "),s("p",[t._v("1.在变量前面追加版本号：每次变量更新就把版本号加1，则A-B-A就变成1A-2B-3A。\n2.atomic包下的AtomicStampedReference类：其compareAndSet方法首先检查当前引用是否等于预期引用，并且当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用的该标志的值设置为给定的更新值。")])])},[],!1,null,null,null);a.default=r.exports}}]);