import { ref, type Ref } from "vue";

export interface User {
  id: string;
  token: string;
  name: string;
}

function getLoggedUser(): Ref<User | null> {
  const storedUser: string | null = localStorage.getItem("mock-credentials");
  const user = ref<User | null>(null);
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
  return user;
}

async function check(data: {
  name: string;
  id?: boolean;
}): Promise<{ id: string; token: string; success: boolean }> {
  const xhr = new XMLHttpRequest();
  return new Promise<{ id: string; token: string; success: boolean }>(
    (resolve, reject) => {
      xhr.open("POST", "http://localhost:3000/auth", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            resolve(responseData);
          } else {
            const errorData = JSON.parse(xhr.responseText);
            reject(errorData);
          }
        }
      };
      xhr.send(JSON.stringify(data));
    }
  );
}

export const AuthService = {
  check,
  getLoggedUser,
};
