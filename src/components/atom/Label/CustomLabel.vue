<script lang="ts">
export default {
  props: ["classNames", "text"],
};
</script>

<template>
  <label :class="classNames">{{ text }}<slot></slot></label>
</template>
