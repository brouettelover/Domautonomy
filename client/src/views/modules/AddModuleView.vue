<style scoped>
    @import '@/assets/css/ajoutmodule.css';
</style>

<template>
    <SidebarComp />
    <div class="main">
        <form action="/module/add" method="POST">
            <br>
            <span class="addmodule">Type de module :</span>
            <hr class="addmodule">
            <div class="addmodule">
                <input type="radio" id="frigo" name="type" value="frigo" checked class="addmodule">
                <label for="frigo" class="addmodule">Frigo</label>
            </div>
            <div class="addmodule">
                <input type="radio" id="arroseur" name="type" value="arroseur" class="addmodule">
                <label for="arroseur" class="addmodule">Arroseur</label>
            </div>
            <hr class="addmodule">
            <label for="topic">nom : </label>
            <input type="text" id="title" name="topic" placeholder="Entrez le nom" required>
            <div class="addmodule">
                <br>
                <button type="submit" class="addmodule">Valider</button>
            </div>
            <hr class="addmodule">
        </form>
    </div>
</template>

<script>
import SidebarComp from '@/components/SidebarComp.vue'

export default {
  components: {
    SidebarComp
  }
}
</script>
