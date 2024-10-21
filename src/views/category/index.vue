<template>
  <main class="justify-center mx-auto w-full md:w-3/4 lg:w-5/6">
    <div class="mx-1 my-4" v-if="infoLoading">
      <content-placeholders :rounded="true" :centered="true">
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
      </content-placeholders>
    </div>
    <div v-else>
      <div v-if="categories.length">
        <div v-for="(category,index) in categories" :key="index">
          <router-link :to="{name: 'category-status', params: {category: category.slug}}"
                       class="card p-4 shadow-lg compact bg-base-100 mx-1 mt-3 mb-2 clickable">
            <div class="flex justify-center items-center rounded"
                 :style="'background-image: url(&quot;'+url+ category.image +'&quot;); height: 200px'">
              <div class="italic font-mono text-4xl text-base-content font-bold">{{ category.name }}</div>
            </div>
          </router-link>

        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters} from "vuex";

export default {
  created() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  mounted() {
    this.getCategories();
    this.$Progress.finish();
  },
  computed: {
    ...mapGetters({
      categories: "categories"
    })
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      infoLoading: false,
    }
  },
  methods: {
    ...mapActions({
      getCategoriesData: "getCategories"
    }),
    getCategories() {
      if (!this.categories.length) {
        this.infoLoading = true;
        this.getCategoriesData()
            .then(() => {
              this.infoLoading = false;
            })
      }
    },
  },
}
</script>

<style scoped>

</style>