<script setup lang="ts">
import Button from 'primevue/button';
import { toRefs } from 'vue';
interface Props {
  btnType?: string;
  text?: string;
  disabled?: boolean;
  styles?: {
    background?: string;
    color?: string;
    border?: string;
    cursor?: string;
    borderRadius?: string;
  };
}
const props = defineProps<Props>();
const { btnType="button", text="Confirmer", disabled, styles } = toRefs(props);

</script>

<template>
  <button :class="{disable: disabled}" :style="{...styles}">
    {{ text }}
  </button>
</template>

<style scoped>
button {
  padding: 10px 20px;
  background: var(--accent-color);
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: var(--border-radius-s);
}
</style>
