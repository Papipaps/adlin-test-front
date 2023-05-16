<script lang="ts">
export default {
  props: {
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "..." },
  },
  data() {
    return {
      value: "",
    };
  }, 
};
</script>

<template>
  <input :type="type" :placeholder="placeholder" v-model="value"/>
</template>
