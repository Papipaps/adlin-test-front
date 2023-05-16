import { ref, type Ref } from "vue";

export interface User {
  id: string;
  name: string;
}
export function getLoggedUser(): Ref<User | null> {
  const storedUser: string | null = localStorage.getItem("mock-credentials");
  const user = ref<User | null>(null); 
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
  console.log(user)
  return user;
}
