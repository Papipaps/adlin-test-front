// UserProvider.vue
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { getLoggedUser, type User } from "@/service/auth/auth.service";
import { provide } from "vue";
const user =  getLoggedUser();
function updateUser(newUser: User) {user.value = newUser} 
console.log(user)
provide("user", user); 
provide("updateUser", updateUser); 
</script>
