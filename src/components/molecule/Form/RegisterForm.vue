<template>
  <form @submit.prevent="handleSubmit">
    <CustomLabel text="Prénom">
      <InputText v-model="firstName" />
    </CustomLabel>
    <CustomLabel text="Password">
      <InputText type="password" v-model="password" />
    </CustomLabel>
    <select v-model="role">
      <option value="1">Un</option>
      <option value="2">Deux</option>
      <option value="3">Trois</option>
    </select>
    <FormButton text="Envoyer" />
  </form>
</template>

<script lang="ts">
import InputText from "../../atom/InputText/InputText.vue";
import CustomLabel from "../../atom/Label/CustomLabel.vue";
import FormButton from "@/components/atom/Button/FormButton/FormButton.vue";

export default {
  components: {
    InputText,
    CustomLabel,
    FormButton,
  },
  data() {
    return {
      firstName: "",
      password: "",
      role: "1",
    };
  },
  methods: {
    handleSubmit() {
      console.log(this.firstName);
    },
  },
};
</script>
