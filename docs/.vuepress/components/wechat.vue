<template>
    <div>
        <img :src="$withBase('/img/pwc/me.jpg')" class="wechat">
    </div>
</template>

<script>
    export default {
        name: "wechat"
    }
</script>

<style scoped>

    .wechat{
        width: 130px;
        height: 130px;
    }
</style>