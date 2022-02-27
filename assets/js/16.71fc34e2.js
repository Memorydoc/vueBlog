(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{289:function(s,t,r){"use strict";r.r(t);var n=r(10),e=Object(n.a)({},function(){var s=this,t=s.$createElement,r=s._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[r("h2",{attrs:{id:"学习目标"}},[s._v("学习目标")]),s._v(" "),r("ul",[r("li",[r("p",[s._v("目标")]),s._v(" "),r("ul",[r("li",[s._v("了解常见的深度学习框架")]),s._v(" "),r("li",[s._v("了解TensorFlow框架")])])])]),s._v(" "),r("h2",{attrs:{id:"常见深度学习框架对比"}},[s._v("常见深度学习框架对比")]),s._v(" "),r("p",[r("img",{attrs:{src:"/img/articial/%E6%A1%86%E6%9E%B6%E5%85%B3%E6%B3%A8.png",alt:"框架关注"}})]),s._v(" "),r("p",[s._v("tensorflow的github：\n"),r("img",{attrs:{src:"/img/articial/tensorflowgithub.png",alt:"tensorflowgithub"}})]),s._v(" "),r("h2",{attrs:{id:"tensorflow的特点"}},[s._v("TensorFlow的特点")]),s._v(" "),r("p",[r("img",{attrs:{src:"/img/articial/tensorflow.png",alt:"tensorflow"}})]),s._v(" "),r("p",[r("a",{attrs:{href:"https://www.tensorflow.org/",target:"_blank",rel:"noopener noreferrer"}},[s._v("官网"),r("OutboundLink")],1)]),s._v(" "),r("ul",[r("li",[r("p",[s._v("语言多样（Language Options）")]),s._v(" "),r("ul",[r("li",[s._v("TensorFlow使用C++实现的，然后用Python封装。谷歌号召社区通过SWIG开发更多的语言接口来支持TensorFlow")])])]),s._v(" "),r("li",[r("p",[s._v("使用分发策略进行分发训练")]),s._v(" "),r("ul",[r("li",[s._v("对于大型 ML 训练任务，分发策略 API使在不更改模型定义的情况下，可以轻松地在不同的硬件配置上分发和训练模型。由于 TensorFlow 支持一系列硬件加速器，如 CPU、GPU 和 TPU")])])]),s._v(" "),r("li",[r("p",[s._v("Tensorboard可视化")]),s._v(" "),r("ul",[r("li",[s._v("TensorBoard是TensorFlow的一组Web应用，用来监控TensorFlow运行过程")])])]),s._v(" "),r("li",[r("p",[s._v("在任何平台上的生产中进行强大的模型部署")])])]),s._v(" "),r("p",[s._v("一旦您训练并保存了模型，就可以直接在应用程序中执行它，或者使用部署库为其提供服务：")]),s._v(" "),r("pre",[r("code",[s._v("* TensorFlow 服务：允许模型通过 HTTP/REST 或 GRPC/协议缓冲区提供服务的 TensorFlow 库构建。\n* TensorFlow Lite：TensorFlow 针对移动和嵌入式设备的轻量级解决方案提供了在 Android、iOS 和嵌入式系统上部署模型的能力。\n* tensorflow.js：支持在 JavaScript 环境中部署模型，例如在 Web 浏览器或服务器端通过 Node.js 部署模型。TensorFlow.js 还支持在 JavaScript 中定义模型，并使用类似于 Kera 的 API 直接在 Web 浏览器中进行训练。\n")])]),s._v(" "),r("h2",{attrs:{id:"tensorflow的安装"}},[s._v("TensorFlow的安装")]),s._v(" "),r("p",[s._v("安装 TensorFlow在64 位系统上测试这些系统支持 TensorFlow：")]),s._v(" "),r("ul",[r("li",[r("p",[s._v("Ubuntu 16.04 或更高版本")])]),s._v(" "),r("li",[r("p",[s._v("Windows 7 或更高版本")])]),s._v(" "),r("li",[r("p",[s._v("macOS 10.12.6 (Sierra) 或更高版本（不支持 GPU）\n进入虚拟环境当中再安装。刚开始的环境比较简单，只要下载tensorflow即可")])]),s._v(" "),r("li",[r("p",[s._v("环境包：\n安装较慢，指定镜像源，请在带有numpy等库的虚拟环境中安装")])]),s._v(" "),r("li",[r("p",[s._v("ubuntu安装")])])]),s._v(" "),r("div",{staticClass:"language-sh line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-sh"}},[r("code",[s._v("pip "),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("tensorflow")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),r("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.12")]),s._v(" -i https://mirrors.aliyun.com/pypi/simple\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("ul",[r("li",[s._v("MacOS安装")])]),s._v(" "),r("div",{staticClass:"language-sh line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-sh"}},[r("code",[s._v("pip "),r("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),r("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("tensorflow")]),r("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),r("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.12")]),s._v(" -i https://mirrors.aliyun.com/pypi/simple\n")])]),s._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[s._v("1")]),r("br")])]),r("blockquote",[r("p",[s._v("注：如果需要下载GPU版本的（TensorFlow只提供windows和linux版本的，没有Macos版本的）参考官网https://www.tensorflow.org/install/gpu?hl=zh-cn,")])]),s._v(" "),r("blockquote",[r("p",[s._v("1、虚拟机下linux也是用不了GPU版本TensorFlow")])]),s._v(" "),r("blockquote",[r("p",[s._v("2、本机单独的windows和本机单独的unbuntu可以使用GPU版本TensorFlow，需要安装相关驱动")])]),s._v(" "),r("h2",{attrs:{id:"tenssorlfow使用技巧"}},[s._v("Tenssorlfow使用技巧")]),s._v(" "),r("p",[s._v("使用 "),r("a",{attrs:{href:"https://www.tensorflow.org/guide/keras",target:"_blank",rel:"noopener noreferrer"}},[s._v("tf.keras "),r("OutboundLink")],1),s._v("构建、训练和验证您的模型，tf相关API用于损失计算修改等\ntensorflow提供模型训练模型部署")])])},[],!1,null,null,null);t.default=e.exports}}]);