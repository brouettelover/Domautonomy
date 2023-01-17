<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous" />
   <div id="arroseur_main">
        <form>
           <h1> Arroseur composant: </h1>
           <hr>
           <h2> Metrics :</h2>
           <div id="arroseur_texte">niveau de l'eau: {{ niveau_eau }}</div>
           <hr>
           <button class="arroseur_button"> Envoie eau</button>
           <button class="arroseur_button"> Stop envoie eau</button>
           <hr>
           <div id="arroseur_texte">
            <table id="RFID">
            <tr>
                <th class="title">Nom d'Utilisateur</th>
                <th class="title">Num carte</th>
                <th class="title">action</th>
            </tr>
            <tr class="card_rfid">
                <th>User01</th>
                <th>01</th>
                <th>
                    <span onclick="return confirm('Etes-vous sûr ?');" class="action">Supprimer</span>
                </th>
            </tr>
    </table>
            </div>
        </form>
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
