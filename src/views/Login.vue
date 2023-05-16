<template>
  <main>
    <div class="logincard">
      <h1>Bienvenue</h1>
      <form @submit.prevent="handleSubmit">
        <InputTextVue v-model="name" placeholder="Entrez un nom"></InputTextVue>
        <CustomButton text="GO"></CustomButton>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputTextVue from "@/components/atom/InputText/InputText.vue";
import { inject, ref, type Ref } from "vue";
import router from "@/router";
import type { User } from "@/service/auth/auth.service";
import CustomButton from "@/components/atom/Button/FormButton/CustomButton.vue";

const name = ref<string>("");
const user = inject("user") as Ref<User>;  
function handleSubmit() {
  const newUser = { name: name.value, id: crypto.randomUUID() };
  user.value = newUser;
  localStorage.setItem("mock-credentials", JSON.stringify(newUser));
  router.push("/rooms");
}
</script>

<style scoped>
.logincard {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  padding: 15px;
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
