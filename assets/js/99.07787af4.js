(window.webpackJsonp=window.webpackJsonp||[]).push([[99],{372:function(s,e,t){"use strict";t.r(e);var r=t(10),a=Object(r.a)({},function(){var s=this,e=s.$createElement,t=s._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[s._v("国内从 Docker Hub 拉取镜像有时会遇到困难，此时可以配置镜像加速器。Docker 官方和国内很多云服务商都提供了国内加速器服务，例如：")]),s._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://docs.docker.com/registry/recipes/mirror/#use-case-the-china-registry-mirror",target:"_blank",rel:"noopener noreferrer"}},[s._v("Docker 官方提供的中国 registry mirror"),t("OutboundLink")],1)]),s._v(" "),t("li",[t("a",{attrs:{href:"https://cr.console.aliyun.com/#/accelerator",target:"_blank",rel:"noopener noreferrer"}},[s._v("阿里云加速器"),t("OutboundLink")],1)]),s._v(" "),t("li",[t("a",{attrs:{href:"https://www.daocloud.io/mirror#accelerator-doc",target:"_blank",rel:"noopener noreferrer"}},[s._v("DaoCloud 加速器"),t("OutboundLink")],1)])]),s._v(" "),t("p",[s._v("我们以 Docker 官方加速器为例进行介绍。")]),s._v(" "),t("h2",{attrs:{id:"ubuntu-14-04、debian-7-wheezy"}},[s._v("Ubuntu 14.04、Debian 7 Wheezy")]),s._v(" "),t("p",[s._v("对于使用 "),t("a",{attrs:{href:"http://upstart.ubuntu.com/",target:"_blank",rel:"noopener noreferrer"}},[s._v("upstart"),t("OutboundLink")],1),s._v(" 的系统而言，编辑 "),t("code",[s._v("/etc/default/docker")]),s._v(" 文件，在其中的 DOCKER_OPTS 中配置加速器地址：")]),s._v(" "),t("div",{staticClass:"language-sh line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("DOCKER_OPTS")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"--registry-mirror=https://registry.docker-cn.com"')]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("重新启动服务。")]),s._v(" "),t("div",{staticClass:"language-sh line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[s._v("$ "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("service")]),s._v(" docker restart\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("h2",{attrs:{id:"ubuntu-16-04-、debian-8-、centos-7"}},[s._v("Ubuntu 16.04+、Debian 8+、CentOS 7")]),s._v(" "),t("p",[s._v("对于使用 "),t("a",{attrs:{href:"https://www.freedesktop.org/wiki/Software/systemd/",target:"_blank",rel:"noopener noreferrer"}},[s._v("systemd"),t("OutboundLink")],1),s._v(" 的系统，请在 "),t("code",[s._v("/etc/docker/daemon.json ")]),s._v("中写入如下内容（如果文件不存在请新建该文件）")]),s._v(" "),t("div",{staticClass:"language-sh line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"registry-mirrors"')]),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"https://registry.docker-cn.com"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br")])]),t("div",{staticClass:"warning custom-block"},[t("p",{staticClass:"custom-block-title"},[s._v("警告")]),s._v(" "),t("p",[s._v("注意，一定要保证该文件符合 json 规范，否则 Docker 将不能启动。")])]),s._v(" "),t("p",[s._v("之后重新启动服务。")]),s._v(" "),t("div",{staticClass:"language-sh line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[s._v("$ "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" systemctl daemon-reload\n$ "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("sudo")]),s._v(" systemctl restart docker\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("h2",{attrs:{id:"检查加速器是否生效"}},[s._v("检查加速器是否生效")]),s._v(" "),t("pre",[t("code",[s._v("配置加速器之后，如果拉取镜像仍然十分缓慢，请手动检查加速器配置是否生效，在命令行执行 docker info，如果从结果中看到了如下内容，说明配置成功。\n")])]),s._v(" "),t("div",{staticClass:"language-sh line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-sh"}},[t("code",[s._v("    \n    Registry Mirrors:\n     https://registry.docker-cn.com/\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])])])},[],!1,null,null,null);e.default=a.exports}}]);