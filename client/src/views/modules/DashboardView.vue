<template>
    <sidebarComp />
    <title>Modules</title>
    <frigoComp />
    <!-- <div class="container-modules" >
        <a class="modules-content" href="/module/add">
            <div class="content-up">
                <span class="content-state"><span class="dot-state"></span> état</span>
            </div>
            <div class="content-bottom">
                Ajouter manuellement
            </div>
        </a>
    </div> -->
</template>

<style scoped>
    @import '@/assets/css/modules.css';
</style>

<script>
import SidebarComp from '@/components/SidebarComp.vue'
import FrigoComp from '@/components/FrigoComp'

export default {
  components: {
    SidebarComp,
    FrigoComp
  }
}
</script>
