<template>
  <div class="backdrop" @click.self="closeModal">
    <div class="card" :style="{ ...styles }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
interface Props {
  styles?: {
    width?:string
    height?:string
    background?: string;
    color?: string;
    border?: string;
    cursor?: string;
    borderRadius?: string;
  };
}
const props = defineProps<Props>();
const { styles } = toRefs(props);
const emit = defineEmits(["close"]);

const closeModal = () => emit("close");
</script>

<style scoped>
.backdrop {
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  width: 50%;
  max-width: 600px;
  min-width: 450px;
  background: white;
  padding: 10px;
  border-radius: var(--border-radius-s);
}
</style>
