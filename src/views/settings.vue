<template>
  <main>
    <div
        class="flex flex-col w-full shadow-xl bg-base-100 rounded-box text-center text-primary-content mt-3 px-2 py-2 md:px-4 md:py-4"
    >
      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/change-password"
      >
        <div class="flex-none">
          <i class="bx bxs-lock text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Change Password </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <div
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6 clickable"
          @click="openModal(1)"
      >
        <div class="flex-none">
          <i class="bx bxs-palette text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold">App Theme </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </div>

      <div
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6 clickable"
          @click="openModal(2)"
      >
        <div class="flex-none">
          <i class="bx bx-globe text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold">Choose Language </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </div>

      <div
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6 clickable"
          @click="openModal(3)"
      >
        <div class="flex-none">
          <i class="bx bx-money text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold">Choose Currency </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </div>

    </div>

    <modal
        :if-close="true"
        :showing="showModal"
        @update:modal="showModal = $event"
    >
      <div v-if="modalType === 1">
        <theme-modal/>
      </div>
      <div v-if="modalType === 2">
        <language-modal/>
      </div>
      <div v-if="modalType === 3">
        <currency-modal/>
      </div>

    </modal>

  </main>
</template>

<script>
export default {
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      modalType: 0,
      showModal: false,
    };
  },
  methods: {
    openModal(type) {
      if (type === 1) {
        this.modalType = 1;
        this.showModal = true;
      } else if (type === 2) {
        this.modalType = 2;
        this.showModal = true;
      } else if (type === 3) {
        this.modalType = 3;
        this.showModal = true;
      }
    },

  },
};
</script>

<style scoped></style>