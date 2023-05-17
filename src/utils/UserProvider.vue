// UserProvider.vue
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
 import { AuthService } from "@/service/auth/auth.bdl";
import { provide } from "vue";
const user =  AuthService.getLoggedUser(); 
provide("user", user);  
</script>
