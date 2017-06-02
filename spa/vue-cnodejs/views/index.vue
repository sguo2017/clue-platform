<template>
    <div>
        <img class="index" src="../assets/images/index.png">
    </div>
</template>
<script>
    export default {
        mounted() {
            setTimeout(() => {
                this.$router.push({
                    name: 'list'
                });
            }, 2000);
        }
    };
</script>
<style lang="scss">
    .index {
        width: 100%;
        background-color: #fff;
        margin-top: 40%;
    }
</style>
