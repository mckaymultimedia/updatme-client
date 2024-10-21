<template>
  <div class="flex flex-col justify-center items-center space-y-8 min-h-screen w-full bg-base-200" style="z-index: 99">
    <div>
      <img alt="Reward Status" class="h-20 w-20" :src="url+'/logo.png'"/>
    </div>
    <div class="flex flex-row space-x-1">
      <div class="bg-primary p-2 w-4 h-4 rounded-full animate-bounce"></div>
      <div class="bg-success p-2 w-4 h-4 rounded-full animate-bounce"></div>
      <div class="bg-secondary p-2 w-4 h-4 rounded-full animate-bounce"></div>
      <div class="bg-accent p-2 w-4 h-4 rounded-full animate-bounce"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: this.$config.FILE_URL
    }
  },
}
</script>

<style scoped>
.bg-primary {
  animation-delay: 0.1s;
}

.bg-success {
  animation-delay: 0.2s;
}

.bg-secondary {
  animation-delay: 0.3s;
}

.bg-accent {
  animation-delay: 0.4s;
}
</style>