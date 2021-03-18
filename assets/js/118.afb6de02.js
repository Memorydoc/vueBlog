(window.webpackJsonp=window.webpackJsonp||[]).push([[118],{391:function(n,s,a){"use strict";a.r(s);var t=a(10),e=Object(t.a)({},function(){var n=this,s=n.$createElement,a=n._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[a("h2",{attrs:{id:"docker-compose-yml"}},[n._v("docker-compose.yml")]),n._v(" "),a("div",{staticClass:"language-sh line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[n._v("version: "),a("span",{pre:!0,attrs:{class:"token string"}},[n._v("'3.1'")]),n._v("\nservices:\n  nginx:\n    restart: always\n    image: nginx\n    container_name: nginx\n    links:\n      - tomcat-blog:blog1\n    ports:\n      - "),a("span",{pre:!0,attrs:{class:"token number"}},[n._v("80")]),n._v(":80\n      - "),a("span",{pre:!0,attrs:{class:"token number"}},[n._v("443")]),n._v(":443\n    volumes:\n      - ./conf/nginx.conf:/etc/nginx/nginx.conf\n      - ./wwwroot:/usr/share/nginx/wwwroot\n      - ./https:/usr/local/www.sizegang.cn\n      - /etc/letsencrypt:/etc/letsencrypt\n  tomcat-blog:\n    restart: always\n    image: tomcat\n    container_name: tomcat1\n    ports:\n      - "),a("span",{pre:!0,attrs:{class:"token number"}},[n._v("8100")]),n._v(":8100\n    volumes:\n      - /usr/local/docker/jenkins-sizegang/blog:/usr/local/blog\n      - /usr/local/docker/blog-nginx/tomcat-config/conf:/usr/local/tomcat/conf\n    environment:\n      TZ: Asia/Shanghai\n\n")])]),n._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[n._v("1")]),a("br"),a("span",{staticClass:"line-number"},[n._v("2")]),a("br"),a("span",{staticClass:"line-number"},[n._v("3")]),a("br"),a("span",{staticClass:"line-number"},[n._v("4")]),a("br"),a("span",{staticClass:"line-number"},[n._v("5")]),a("br"),a("span",{staticClass:"line-number"},[n._v("6")]),a("br"),a("span",{staticClass:"line-number"},[n._v("7")]),a("br"),a("span",{staticClass:"line-number"},[n._v("8")]),a("br"),a("span",{staticClass:"line-number"},[n._v("9")]),a("br"),a("span",{staticClass:"line-number"},[n._v("10")]),a("br"),a("span",{staticClass:"line-number"},[n._v("11")]),a("br"),a("span",{staticClass:"line-number"},[n._v("12")]),a("br"),a("span",{staticClass:"line-number"},[n._v("13")]),a("br"),a("span",{staticClass:"line-number"},[n._v("14")]),a("br"),a("span",{staticClass:"line-number"},[n._v("15")]),a("br"),a("span",{staticClass:"line-number"},[n._v("16")]),a("br"),a("span",{staticClass:"line-number"},[n._v("17")]),a("br"),a("span",{staticClass:"line-number"},[n._v("18")]),a("br"),a("span",{staticClass:"line-number"},[n._v("19")]),a("br"),a("span",{staticClass:"line-number"},[n._v("20")]),a("br"),a("span",{staticClass:"line-number"},[n._v("21")]),a("br"),a("span",{staticClass:"line-number"},[n._v("22")]),a("br"),a("span",{staticClass:"line-number"},[n._v("23")]),a("br"),a("span",{staticClass:"line-number"},[n._v("24")]),a("br"),a("span",{staticClass:"line-number"},[n._v("25")]),a("br"),a("span",{staticClass:"line-number"},[n._v("26")]),a("br"),a("span",{staticClass:"line-number"},[n._v("27")]),a("br"),a("span",{staticClass:"line-number"},[n._v("28")]),a("br")])])])},[],!1,null,null,null);s.default=e.exports}}]);