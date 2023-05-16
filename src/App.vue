<script setup lang="ts">
import UserProvider from "./utils/UserProvider.vue";
</script>

<template>
  <UserProvider>
    <RouterView />
  </UserProvider>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Rubik:ital,wght@0,400;0,700;1,700&display=swap");
* {
  font-family: "Roboto", sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  --primary-text-color: rgb(50, 50, 50);
  --secondary-text-color: rgb(94, 94, 94);
  --background-color: #f1f1f1;
  --accent-color: #337ab7;
  --border-radius-s: 5px;
  --border-radius-m: 10px;
  --border-radius-l: 15px;
  --transition-ease-01: ease-in 0.1s;
  --transition-ease-02: ease-in 0.2s;
  --transition-ease-05: ease-in 0.5s;
  --box-shadow:0px 0px 10px rgba(0, 0, 0, 0.1);
  --box-shadow-darker:0px 0px 10px rgba(0, 0, 0, 0.3)

}
body{
  background: var(--background-color);
}
.disable {
  filter: grayscale();
  cursor: not-allowed!important;
}
.bold{
  font-weight: 700;
}
.error{
  color: red;
}

@media (width <= 900px) {
  main {
    margin-top: 80px;
  }
}
</style>
