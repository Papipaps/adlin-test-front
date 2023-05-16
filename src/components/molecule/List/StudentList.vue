<script lang="ts">
export default {
  props: ["studentList"],
  updated() {
      console.log(this.studentList)
  },
};
</script>

<template>
  <ul class="list">
    <li v-for="student in studentList">{{ student.firstName }}</li>
  </ul>
</template>

<style scoped lang="scss">
.list {
  background: #eee;
  padding: 20px;
  max-height: 300px;
  overflow-y: scroll;

  li {
    background: #eee;
    line-height: 2rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    list-style: none;
  }

  li:hover {
    filter: brightness(0.95);
    cursor: pointer;
  }
}
</style>
