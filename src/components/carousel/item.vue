<template>
  <transition :name="transitionEffect">
    <div
        class="carousel-item"
        v-show="currentSlide === index"
        @mouseenter="$emit('mouseenter')"
        @mouseout="$emit('mouseout')"
    >
      <template v-if="slide.image">
        <img v-if="mobile" class="w-full" :class="(slide.type == 3 && !slide.url) ? '' : 'clickable'"
             :src="url + slide.image"
             :alt="slide.title" style="max-height: 300px"
             @click="slideClickAction(slide)">
        <img v-else class="w-full" :class="(slide.type == 3 && !slide.url) ? '' : 'clickable'" :src="url + slide.image"
             :alt="slide.title" style="max-height: 400px"
             @click="slideClickAction(slide)">
      </template>
      <template v-else>
        <img class="w-full" :src="url + '/default.png'"
             alt="Demo Slide" style="max-height: 300px">
      </template>
    </div>
  </transition>
</template>

<script>
export default {
  emits: ["mouseenter", "mouseout"],
  props: ["slide", "currentSlide", "index", "direction"],
  computed: {
    transitionEffect() {
      return this.direction === "right" ? "slide-out" : "slide-in";
    },
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      mobile: this.$mobileview,
    }
  },
  methods: {
    slideClickAction(slide) {
      if (slide.type == 1) {
        this.$router.push('/status/' + slide.status.code + '')
      } else if (slide.type == 2) {
        this.$router.push('/category/' + slide.category.slug + '')
      } else if (slide.type == 3 && slide.url) {
        window.location.href = slide.url;
      }
    },
  }
};
</script>

<style scoped>
.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.slide-in-enter-active,
.slide-in-leave-active,
.slide-out-enter-active,
.slide-out-leave-active {
  transition: all 1s ease-in-out;
}

.slide-in-enter-from {
  transform: translateX(-100%);
}

.slide-in-leave-to {
  transform: translateX(100%);
}

.slide-out-enter-from {
  transform: translateX(100%);
}

.slide-out-leave-to {
  transform: translateX(-100%);
}
</style>