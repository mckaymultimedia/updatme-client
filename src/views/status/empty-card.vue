<template>
  <div class="card p-4 shadow-lg compact bg-base-100 mx-1 mt-3 mb-2">
    <div class="relative">
          <span class="status-type">
            <i class="bx bx-image-alt"></i>
          </span>
      <figure>
        <img v-if="mobile" class="rounded" :src="url+ '/default.png'" style="height: 250px" alt="no post available">
        <img v-else class="rounded" :src="url+ '/default.png'" style="height: 400px" alt="no post available">
      </figure>
    </div>
    <div class="p-2 text-center">
      <h1 class="text-lg">Please try again later !!</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: this.$config.FILE_URL,
      mobile: this.$mobileview,
    }
  },
}
</script>
