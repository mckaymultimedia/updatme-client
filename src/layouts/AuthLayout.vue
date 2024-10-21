<template>
  <div class="grid min-h-screen place-items-center bg-base-100 py-4">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    axios.get('/sanctum/csrf-cookie').then(() => {
    });
  }
}
</script>

<style scoped>

</style>