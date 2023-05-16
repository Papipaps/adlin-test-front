<script setup lang="ts">
import router from "@/router";
import type { User } from "@/service/auth/auth.service";
import { inject, type Ref, ref, watchEffect, onMounted } from "vue";
import List from "@/assets/icons/list.vue";
import Menu_book from "@/assets/icons/menu_book.vue";
import Logout from "@/assets/icons/logout.vue";

const injected = inject("user") as Ref<User>;
const user = ref<User>();
function greet(): string {
  const greetings: string[] = [
    "Salut [NAME] ! \t \u{1F600} \u{1F44B}",
    "Bonjour [NAME] ! \t \u{1F601} \u{1F44B}",
    "Coucou [NAME] ! \t \u{1F603} \u{1F44B}",
    "Hello [NAME] ! \t \u{1F604} \u{1F44B}",
    "Salutations [NAME] ! \t \u{1F609} \u{1F44B}",
  ];

  const randomIndex: number = Math.floor(Math.random() * greetings.length);
  const randomGreeting: string = greetings[randomIndex];

  const userName: string | undefined = user.value?.name;
  const greetingMessage: string = randomGreeting.replace(
    "[NAME]",
    userName || ""
  );

  return greetingMessage;
}
onMounted(() => {
  user.value = injected.value;
});
watchEffect(() => {
  user.value = injected?.value;
});
function disconnect() {
  localStorage.removeItem("mock-credentials");
  router.push("/");
}
</script>

<template>
  <header>
    <div class="nav-wrapper">
      <nav>
        <p class="greeting">{{ greet() }}</p>
        <div class="nav-item">
          <List />
          <RouterLink to="/rooms"> Salles</RouterLink>
        </div>
        <div class="nav-item">
          <Menu_book />
          <RouterLink to="/bookings">Reservations</RouterLink>
        </div>
        <div class="nav-item">
          <Logout />
          <a @click="disconnect">Quitter</a>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  border-bottom: 1px solid;
  font-weight: 600;
}
.nav-wrapper {
  z-index: 10;
  position: fixed;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 10px;
}
.nav-wrapper:hover {
  transition: var(--transition-ease-01);
  top: -5px;
}
nav > div {
  flex: 1;
  width: 75px;
}
nav {
  display: flex;
  width: 33vw;
  min-width: 450px;
  max-width: 600px;
  justify-content: space-around;
  align-items: center;
  background: white;
  height: 80px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
.nav-item svg {
  width: 20px;
  height: 20px;
}
.nav-item {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: var(--border-radius-m);
  transition: var(--transition-ease-02);
}
.nav-item:hover {
  filter: brightness(0.9);
}
.greeting{
  padding: 5px;
}
a {
  font-size: 1rem;
  color: black;
  border: none;
  background: none;
  text-decoration: none;
  cursor: pointer;
}
a:hover {
  font-weight: bolder;
}
</style>
