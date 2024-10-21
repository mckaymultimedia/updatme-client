<template>
  <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
  >
    <div v-show="showing" class="fixed inset-0 z-999 overflow-y-auto" style="z-index: 999;"
         :style="!mobileView ? 'left: 250px;' : ''">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <button
              v-if="ifClose"
              aria-label="close"
              class="absolute z-50 bg-white rounded-full py-2 px-2 top-3 right-3 cursor-pointer focus:outline-none"
              @click.prevent="close()"
          >
            <svg class="h-4 w-4 text-gray-600"
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="close"></div>
        </div>

        <div
            class="m-6 inline-block align-middle w-full overflow-hidden max-w-3xl rounded-lg shadow-xl transform transition-all">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
export default {
  name: 'Modal',
  props: {
    showing: {
      type: Boolean,
      default: false
    },
    ifClose: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    mobileView() {
      return this.$mobileview;
    },
  },
  updated() {
    if (this.showing) {
      document.documentElement.style.overflow = 'hidden';
    }
    if (!this.showing) {
      document.documentElement.style.overflow = '';
    }
  },
  methods: {
    close() {
      if (this.ifClose) {
        this.$emit('update:modal', !this.showing)
      }
    }
  }
}
</script>
<style>

</style>