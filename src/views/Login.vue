<template>
  <main>
    <div class="logincard">
      <h1>Bienvenue</h1>
      <form @submit.prevent="handleSubmit">
        <InputTextVue v-model="name" placeholder="Entrez un nom"></InputTextVue>
        <CustomButton text="GO"></CustomButton>
      </form>
      <p class="error bold" v-show="showError">{{ error }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputTextVue from "@/components/atom/InputText/InputText.vue";
import { inject, ref } from "vue";
import { AuthService, type User } from "@/service/auth/auth.bdl";
import CustomButton from "@/components/atom/Button/CustomButton.vue";
import router from "@/router/router";
const updateUser = inject("updateUser") as (newUser: User) => void;
const name = ref<string>("");
const showError = ref<boolean>(false);
const error = "Vos identifiants doivent faire entre 2 et 32 caractères";
function handleSubmit() {
  if (name.value.length <= 2) {
    showError.value = true;
  } else {
    AuthService.check({ name: name.value }).then((res) => {
      showError.value = !res.success;
      if (res.success) {
        const newUser: User = {
          name: name.value,
          id: res.id,
          token: res.token,
        };
        localStorage.setItem("mock-credentials", JSON.stringify(newUser));
        updateUser(newUser);
        router.push("/rooms");
      }
    });
  }
}
</script>

<style scoped>
.logincard {
  position: absolute;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  margin: 0 auto;
  padding: 30px 15px;
  border-radius: 5px;
  width: fit-content;
  box-shadow: 5px 5px 19px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 5px 5px 19px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 5px 5px 19px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  margin-bottom: 10px;
}
main {
  width: 100vw;
}
button {
  background: rgb(255, 199, 45);
  border-radius: 5px;
  padding: 10px 40px;
  text-decoration: none;
  border: none;
}

form {
  display: flex;
  gap: 10px;
  padding: 10px;
  margin: 0 auto;
  width: fit-content;
}
</style>
