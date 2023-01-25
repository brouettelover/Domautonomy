<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous" />
    <sidebarComp />
    <title>Modules</title>
    <div class="dashboard">
        <frigoComp />
        <arroseur-comp />
    </div>
</template>
<style scoped>
    @import '@/assets/css/dashboard.css';
</style>
<script>
import SidebarComp from '@/components/SidebarComp.vue'
import FrigoComp from '@/components/FrigoComp'
import ArroseurComp from '@/components/ArroseurComp.vue'

export default {
  components: {
    SidebarComp,
    FrigoComp,
    ArroseurComp
  }
}
</script>
