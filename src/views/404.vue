<template>
  <main class="flex flex-col justify-center items-center bg-base-200 space-y-6 min-h-screen">
    <div class="flex flex-row justify-center items-center space-x-2">
      <div class="text-7xl font-bold text-warning animate-pulse">4</div>
      <div class="text-7xl font-bold text-primary animate-pulse">0</div>
     <div class="text-7xl font-bold text-accent animate-pulse">4</div>
    </div>
    <div class="text-2xl text-base-content">Page Not Found !</div>
  </main>
</template>

<script>
export default {
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  mounted() {
    this.$Progress.finish();
  },
}
</script>
<style scoped>
.text-warning{
  animation-delay: 0.1s;
}
.text-primary{
  animation-delay: 0.2s;
}
.text-accent{
  animation-delay: 0.3s;
}
</style>