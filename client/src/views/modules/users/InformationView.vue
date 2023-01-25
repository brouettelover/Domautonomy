<template>
    <SidebarComp></SidebarComp>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">    <div class="content-info">
        <form action="update_name" method="POST">
            <details class="detail-info">
            <summary> Modifier  - nom <hr> </summary>
            <br>
                <label for="newname"><b>Nouveau nom :</b></label>
                <input type="text" placeholder="Entrez votre nouveau nom" name="newname" pattern="(?=[a-z]).{4,}" required>
                <label for="newpassword"><b>Mot de passe:</b></label>
                <input type="password" placeholder="Entrez votre mot de passe" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}" name="password" required>
                <button class="btn btn-warning" type="submit">Confirmer</button>
            </details>
        </form>
        <form action="update_password" method="POST" oninput='check()'>
            <details class="detail-info">
            <summary> Modifier  - mot de passe <hr> </summary>
            <br>
                <label for="oldpassword"><b>Mot de passe actuel :</b></label>
                <input type="password" placeholder="Entrez votre mot de passe actuel"  name="oldpassword" required>
                <label for="newpassword"><b>Nouveau mot de passe :</b></label>
                <input type="password" placeholder="Entrez votre nouveau mot de passe" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}" id="password" required>
                <label for="newpassword"><b>Confirmer nouveau mot de passe:</b></label>
                <input type="password" placeholder="Entrez votre nouveau mot de passe" name="password_confirm" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}" id="password_confirm" required>
                <button class="btn btn-warning" type="submit">Confirmer</button>
            <hr>
            </details>
        </form>
        <details class="detail-info">
        <summary> Modifier  - Mail <hr></summary>
        <br>
        <form action="update_email" method="post">
            <label for="newmail"><b>Nouveau Mail :</b></label>
            <input type="email" placeholder="Entrez votre nouvelle adresse mail" name="newmail" required>
            <label for="password"><b>Mot de passe :</b></label>
            <input type="password" placeholder="Entrez votre mot de passe" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}" required>
            <button class="btn btn-warning" type="submit">Confirmer</button>
        </form>
        <hr>
        </details>
        <details class="attention detail-info">
            <summary><i class="fas fa-exclamation-triangle"></i> Suppression du compte <i class="fas fa-exclamation-triangle"></i><hr></summary>
            <br>
            <form action="delete_user" method="post">
                <label for="password"><b>Mot de passe:</b></label>
                <input type="password" placeholder="mot de passe" name="password" required>
                <button class="btn btn-danger">Confirmer</button>
            </form>
            <hr>
        </details>
        <div class="deconnect-container">
            <button class="deconnect-but" @click=logUserOut >Se déconnecter</button>
        </div>
    </div>
</template>

<style scoped src='@/assets/css/information.css'></style>

<script>
import SidebarComp from '@/components/SidebarComp.vue'

export default {
  components: {
    SidebarComp
  },
  methods: {
    logUserOut () {
      localStorage.removeItem('jwt')
      this.$router.push('/')
    }
  }
}
</script>
