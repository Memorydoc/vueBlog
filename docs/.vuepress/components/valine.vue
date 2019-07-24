<template>
    <div>
       <div class="valineDiv">
           <!-- id 将作为查询条件 -->
           <span :id="page.path" class="leancloud-visitors readSpan"  :data-flag-title="page.title">
            <em class="post-meta-item-text">阅读量 </em>
                <i class="leancloud-visitors-count">1000000</i>
        </span>
           <div id="vcomments" ></div>
       </div>
    </div>
</template>
<script>
    export default {
        methods: {
            renderValine: function () {
                // Register AV objects to the global
                window.AV = require('leancloud-storage');
                const Valine = require('valine');
                return new Valine({
                    el: '#vcomments',
                    appId: 'Iry8oeIS8seCzDTjFo1XybNo-gzGzoHsz',
                    appKey: 'BaQCguG56Kjb4lukX2CDqzV1',
                    path: window.location.pathname,
                    avatar: 'mm',
                    meta: ['nick', 'mail', 'link'],
                    pageSize: 10,
                    recordIP: true,
                    visitor: true
                })
            }
        },
        mounted: function () {
            this.renderValine();
        },
        computed: {
            page: function () {
                let {path = '/', title = '首页'} = this.$page;
                console.log({path, title})
                return {path, title};
            }
        },
        watch: {
            '$route': function (to, from) {
                if (to.path !== from.path) {
                    this.$nextTick(function () {
                        this.renderValine();
                    })

                }
            }
        }
    }
</script>
<style scoped>
    .valineDiv {
        max-width: 740px;
        margin: 0 auto;
        padding: 2rem 2.5rem;
    }
    .readSpan{
        color: #ccc;
    }
</style>