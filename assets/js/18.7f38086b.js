(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{291:function(s,t,n){"use strict";n.r(t);var a=n(10),r=Object(a.a)({},function(){var s=this,t=s.$createElement,n=s._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h2",{attrs:{id:"学习目标"}},[s._v("学习目标")]),s._v(" "),n("ul",[n("li",[s._v("目标\n"),n("ul",[n("li",[s._v("说明TensorFlow的数据流图结构")])])]),s._v(" "),n("li",[s._v("应用\n"),n("ul",[n("li",[s._v("无")])])]),s._v(" "),n("li",[s._v("内容预览\n"),n("ul",[n("li",[s._v("2.1.1 案例：TensorFlow实现一个加法运算\n"),n("ul",[n("li",[s._v("1 代码")]),s._v(" "),n("li",[s._v("2 TensorFlow结构分析")])])]),s._v(" "),n("li",[s._v("2.1.2 数据流图介绍")])])])]),s._v(" "),n("p",[s._v("案例：\nTensorFlow实现一个加法运算")]),s._v(" "),n("div",{staticClass:"language-python line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-python"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("def")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("tensorflow_demo")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token triple-quoted-string string"}},[s._v('"""\n    通过简单案例来了解tensorflow的基础结构\n    :return: None\n    """')]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 一、原生python实现加法运算")]),s._v("\n    a "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),s._v("\n    b "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("20")]),s._v("\n    c "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" a "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" b\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("print")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"原生Python实现加法运算方法1：\\n"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" c"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("def")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("a"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" b"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" a "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" b\n    "),n("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("sum")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" add"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("a"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" b"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("print")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"原生python实现加法运算方法2：\\n"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("sum")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 二、tensorflow实现加法运算")]),s._v("\n    a_t "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" tf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("constant"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("10")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    b_t "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" tf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("constant"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("20")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 不提倡直接运用这种符号运算符进行计算")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 更常用tensorflow提供的函数进行计算")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# c_t = a_t + b_t")]),s._v("\n    c_t "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" tf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("add"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("a_t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" b_t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("print")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"tensorflow实现加法运算：\\n"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" c_t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 如何让计算结果出现？")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 开启会话")]),s._v("\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("with")]),s._v(" tf"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("Session"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" sess"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n        sum_t "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" sess"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("run"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("c_t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n        "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("print")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"在sess当中的sum_t:\\n"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" sum_t"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n    "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("None")]),s._v("\n\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br")])]),n("blockquote",[n("p",[s._v("注意问题：警告指出你的CPU支持AVX运算加速了线性代数计算，即点积，矩阵乘法，卷积等。可以从源代码安装TensorFlow来编译，当然也可以选择关闭")])]),s._v(" "),n("div",{staticClass:"language-python line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-python"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("import")]),s._v(" os\nos"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("environ"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'TF_CPP_MIN_LOG_LEVEL'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'2'")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("h2",{attrs:{id:"tensorflow结构分析"}},[s._v("TensorFlow结构分析")]),s._v(" "),n("p",[s._v("TensorFlow 程序通常被组织成一个构建图阶段和一个执行图阶段。")]),s._v(" "),n("p",[s._v("在构建阶段，数据与操作的执行步骤被描述成一个图。")]),s._v(" "),n("p",[s._v("在执行阶段，使用会话执行构建好的图中的操作。")]),s._v(" "),n("ul",[n("li",[s._v("图和会话 ：\n"),n("ul",[n("li",[s._v("图：这是 TensorFlow 将计算表示为指令之间的依赖关系的一种表示法")]),s._v(" "),n("li",[s._v("会话：TensorFlow 跨一个或多个本地或远程设备运行数据流图的机制")])])]),s._v(" "),n("li",[s._v("张量：TensorFlow 中的基本数据对象")]),s._v(" "),n("li",[s._v("节点：提供图当中执行的操作")])]),s._v(" "),n("h2",{attrs:{id:"数据流图介绍"}},[s._v("数据流图介绍")]),s._v(" "),n("p",[n("img",{attrs:{src:"/img/articial/%E6%95%B0%E6%8D%AE%E6%B5%81%E5%9B%BE.png",alt:"数据流图"}}),s._v("\nTensorFlow是一个采用数据流图（data flow graphs），用于数值计算的开源框架。")]),s._v(" "),n("p",[s._v("节点（Operation）在图中表示数学操作，线（edges）则表示在节点间相互联系的多维数据数组，即张量（tensor）。")])])},[],!1,null,null,null);t.default=r.exports}}]);