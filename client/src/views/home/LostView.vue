<template>
    <form action="https://localhost:3100/api/lost" method="POST" >
    <div class="imgcontainer">
        <img src="@/assets/img/logo.png" alt="Logo" class="logo">
    </div>

    <div class="container">
        <label for="name"><b>Nom de compte*</b></label>
        <input type="text" placeholder="Entrez votre nom de compte" name="name" pattern="(?=[a-z]).{4,}" required>

        <label for="mail"><b>Mail*</b></label>
        <input type="email" placeholder="Entrez votre adresse Mail" name="mail" required>
        <button type="submit" class="button_sub">reinitialiser</button>
        <span class="acceuil"><a href="/">Retour à l'acceuil</a></span>
    </div>
    </form>
</template>
