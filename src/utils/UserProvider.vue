// UserProvider.vue
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { type User } from "@/service/auth/auth.bdl";
import { provide, ref, onBeforeMount } from "vue";

const storedUser = localStorage.getItem("mock-credentials");
const user = ref<User | null>(null);

onBeforeMount(() => {
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});
provide("user", user);

function updateUser(newUser: User) {
  user.value = newUser;
}
provide("updateUser", updateUser);
</script>
