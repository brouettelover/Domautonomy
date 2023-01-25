<template>
   <div id="arroseur_main">
           <h1> Arroseur</h1>
           <hr>
           <div class="input-group mb-3">
              <input type="text" class="form-control water_input" placeholder="t en sec" aria-label="t en sec" aria-describedby="basic-addon2">
              <div class="input-group-append">
                <button class="water_btn btn btn-outline-secondary" type="button">Envoie eau</button>
              </div>
            </div>
           <hr>
   </div>
</template>
<style scoped>
  @import '@/assets/css/arroseur.css';
</style>
<script>
export default {
  name: 'ArroseurComp'
}
</script>
