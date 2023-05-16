<template>
  <div class="card" :style="style">
    <slot></slot>
  </div>
</template>


<script lang="ts">
export default {
  props:{style:{default:{}}}
};
</script>


<style scoped>
.card {
  padding: 10px;
  border: 1px solid;
  border-radius: 10px;
}
</style>
