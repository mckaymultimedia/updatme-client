<template>
  <main class="mx-2 my-4">
    <main v-if="isLoading">
      <content-placeholders :centered="true" :rounded="true">
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
      </content-placeholders>
    </main>
    <main v-else>
      <div class="divider">Payment Methods</div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 place-items-center">
        <div v-for="(method, index) in methods" :key="index">
          <div
              class="card p-2 shadow-lg compact bg-accent mx-1 clickable"
              @click="methodClickAction(method)"
          >
            <div class="card">
              <figure>
                <img
                    :alt="method.name"
                    :src="url + method.logo"
                />
              </figure>
              <div class="justify-center items-center card-body">
                <h2 class="card-title">{{ method.name }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </main>
</template>

<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  created() {
    this.getMethods();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      methods: {},
      isLoading: false,
    };
  },
  methods: {
    getMethods() {
      this.isLoading = true;
      axios.get("/withdrawal-methods").then(({data}) => {
        this.methods = data;
        this.isLoading = false;
      });
    },
    methodClickAction(method) {
      if (method.gift_card === 1) {
        this.$router.push({name: "gift-card", params: {slug: method.slug}});
      } else {
        this.$router.push({name: "withdraw", params: {slug: method.slug}});
      }
    },
  },
};
</script>

<style scoped></style>
