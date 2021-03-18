(window.webpackJsonp=window.webpackJsonp||[]).push([[83],{356:function(v,_,t){"use strict";t.r(_);var i=t(10),a=Object(i.a)({},function(){var v=this,_=v.$createElement,t=v._self._c||_;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h2",{attrs:{id:"索引"}},[v._v("索引")]),v._v(" "),t("ul",[t("li",[v._v("数据库索引，是数据库管理系统（DBMS）中的数据结构，以协助快速查询，更新数据库表中数据")]),v._v(" "),t("li",[v._v("索引类型分为三种： 普通索引（Normal）、唯一索引（Unique）、全文索引（Fulltext）")]),v._v(" "),t("li",[v._v("唯一索引值不能相同")]),v._v(" "),t("li",[v._v("主键索引又叫做特殊的唯一索引， 主键索引有一个特点： 值不能为空")])]),v._v(" "),t("h2",{attrs:{id:"索引的推引"}},[v._v("索引的推引")]),v._v(" "),t("h3",{attrs:{id:"二叉树"}},[v._v("二叉树")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802133117788.png",alt:"image-20200802133117788"}})]),v._v(" "),t("blockquote",[t("p",[v._v("数据的映射是按照顺序排序的， 但是特殊情况下，会出现复杂度log(N)")])]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802133237801.png",alt:"image-20200802133237801"}})]),v._v(" "),t("h3",{attrs:{id:"平衡二叉树"}},[v._v("平衡二叉树")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802133313595.png",alt:"image-20200802133313595"}})]),v._v(" "),t("blockquote",[t("p",[v._v("当左右子树深度差绝对值超过1之后，会出现左右旋转 如下：")])]),v._v(" "),t("ol",[t("li",[v._v("左旋")])]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802133411988.png",alt:"image-20200802133411988"}})]),v._v(" "),t("ol",{attrs:{start:"2"}},[t("li",[t("p",[v._v("右旋")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802133513755.png",alt:"image-20200802133513755"}})])])]),v._v(" "),t("p",[v._v("AVL树的数据存储方式")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802133547154.png",alt:"image-20200802133547154"}})]),v._v(" "),t("p",[t("strong",[v._v("存在的问题:")]),v._v("  每个节点只会存在一个数据，这样树的深度会很大，会造成大量的IO操作， 每次查询Page的大小为16K，如果只放一个数据在节点上，会大大浪费")]),v._v(" "),t("p",[v._v("这16k的查询空间， 猜想是否可以将多个数据节点（数据、数据地址、左右子节点的指针） 存放在一个磁盘块，而每个磁盘块的大小为16k，事实证明。16k可以存放很多很多数据")]),v._v(" "),t("h3",{attrs:{id:"多路平衡二叉树（b-tree）"}},[v._v("多路平衡二叉树（B Tree）")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802134016408.png",alt:"image-20200802134016408"}})]),v._v(" "),t("blockquote",[t("p",[v._v("节点存储索引值，也存储 子节点的地址，但是有个问题， 如果值都存储的话，势必会导致树的深度变大，因为个磁盘块是16K， 如果存放的数据的话，那么会导致纵向变大")])]),v._v(" "),t("h3",{attrs:{id:"b-tree-加强版多路平衡查找树"}},[v._v("B+Tree 加强版多路平衡查找树")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802162328560.png",alt:"image-20200802162328560"}})]),v._v(" "),t("h4",{attrs:{id:"优点"}},[v._v("优点")]),v._v(" "),t("ul",[t("li",[v._v("B Tree 能解决的问题， B+Tree 都能解决")]),v._v(" "),t("li",[v._v("扫库、扫表能力更强")]),v._v(" "),t("li",[v._v("磁盘读写能力更强")]),v._v(" "),t("li",[v._v("排序、范围查找能力更强")]),v._v(" "),t("li",[v._v("效率更加稳定")])]),v._v(" "),t("h3",{attrs:{id:"哈希索引（只有memory存储引擎才能使用）"}},[v._v("哈希索引（只有Memory存储引擎才能使用）")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802162548129.png",alt:"image-20200802162548129"}})]),v._v(" "),t("blockquote",[t("p",[v._v("确定是不能进行对比大小， 因为hash是无序的，还会导致hash冲突问题")])]),v._v(" "),t("h2",{attrs:{id:"不同存储引擎"}},[v._v("不同存储引擎")]),v._v(" "),t("h3",{attrs:{id:"mysam-主键索引"}},[v._v("MySAM 主键索引")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802162714092.png",alt:"image-20200802162714092"}})]),v._v(" "),t("blockquote",[t("p",[v._v("主键索引存储主键值、行数据地址")])]),v._v(" "),t("h3",{attrs:{id:"mysam-辅助索引（二级索引）"}},[v._v("MySAM 辅助索引（二级索引）")]),v._v(" "),t("p",[v._v("![image-20200802163023389](/img/mysql/image-20200802163023389.png"),t("img",{attrs:{src:"/img/mysql/image-20200802163104338.png",alt:"image-20200802163104338"}})]),v._v(" "),t("blockquote",[t("p",[v._v("叶子节点存储行地址信息")])]),v._v(" "),t("h3",{attrs:{id:"innodb-主键索引"}},[v._v("InnoDB 主键索引")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802163158051.png",alt:"image-20200802163158051"}})]),v._v(" "),t("blockquote",[t("p",[v._v("叶子节点存储主键值 和 行数据")])]),v._v(" "),t("h3",{attrs:{id:"innodb-辅助索引（二级索引）"}},[v._v("InnoDB 辅助索引（二级索引）")]),v._v(" "),t("p",[t("img",{attrs:{src:"/img/mysql/image-20200802163250536.png",alt:"image-20200802163250536"}})]),v._v(" "),t("blockquote",[t("p",[v._v("叶子节点存储索引值 和主键值， 如果没有索引没有覆盖的话，那么会发生回表，数据会到主键索引中 根据id 再查询需要的字段")])]),v._v(" "),t("h3",{attrs:{id:"因为疑问？-如果没有主键呢？"}},[v._v("因为疑问？ 如果没有主键呢？")]),v._v(" "),t("ul",[t("li",[v._v("如果定义了主索引，那么主键索引就是聚集索引")]),v._v(" "),t("li",[v._v("如果你没有主键索引，但是你有一个不包含空值的唯一索引，那么就将这个唯一索引，当做聚集索引")]),v._v(" "),t("li",[v._v("如果既没有主键主键索引，也没有不包含空值的唯一索引，那么InnoDB中会为每一个生成一个RowId 当做聚集索引")])]),v._v(" "),t("h2",{attrs:{id:"索引创建和使用原则"}},[v._v("索引创建和使用原则")]),v._v(" "),t("h3",{attrs:{id:"散列度小的列，不要建立索引"}},[v._v("散列度小的列，不要建立索引")]),v._v(" "),t("p",[v._v("比如在性别上， 除了男 就是女 ，那么在建立索引的时候， 还不如直接差全表快")]),v._v(" "),t("h3",{attrs:{id:"最左匹配原则"}},[v._v("最左匹配原则")]),v._v(" "),t("h3",{attrs:{id:"覆盖索引"}},[v._v("覆盖索引")]),v._v(" "),t("h3",{attrs:{id:"在什么字段上创建索引？"}},[v._v("在什么字段上创建索引？")]),v._v(" "),t("ul",[t("li",[v._v("where 、join 、order by")]),v._v(" "),t("li",[v._v("索引个数不要过度")]),v._v(" "),t("li",[v._v("散列度低的字段不要创建索引")]),v._v(" "),t("li",[v._v("随机无序或者频繁更新的值，不适合建立索引（用递增的ID作为主键索引，而不要用这种无序的UUID）")]),v._v(" "),t("li",[v._v("创建复合索引时避免冗余索引")])]),v._v(" "),t("h3",{attrs:{id:"什么时候索引失效"}},[v._v("什么时候索引失效")]),v._v(" "),t("ul",[t("li",[v._v("索引列上使用函数、表达式、运算符")]),v._v(" "),t("li",[v._v("出现隐式转换")]),v._v(" "),t("li",[v._v("like 条件字符前面带% （最左前缀） （不一定）ICP")]),v._v(" "),t("li",[v._v("负向查询<> != not in")])])])},[],!1,null,null,null);_.default=a.exports}}]);