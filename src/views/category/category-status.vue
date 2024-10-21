<template>

  <main class="justify-center mx-auto w-full md:w-3/4 lg:w-5/6">

    <!-- User Posts -->
    <div class="mx-1 my-4" v-if="statusLoading || !checkCategory">
      <content-placeholders :rounded="true" :centered="true">
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
      </content-placeholders>
    </div>
    <div v-else>

      <div v-if="refreshButton" class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
           @click="refreshStatus">
        <h2 class="font-bold text-lg">Get New Statues <i class="bx bx-refresh font-bold text-lg"></i></h2>
      </div>

      <div v-if="statuses.length">
        <div v-for="(status, index) in statuses" :key="index">
          <status-card :status="status"/>
        </div>
      </div>
      <div v-else>
        <empty-status-card/>
      </div>

      <infinite-loading spinner="waveDots" @infinite="loadMore">
        <div slot="no-more">
          <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2" @click="scrollToTop">
            <h2 class="font-bold text-lg">No More | Back to Top <i class="bx bx-up-arrow-alt font-bold text-lg"></i>
            </h2>
          </div>
        </div>
        <div slot="no-results">
          <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2" @click="scrollToTop">
            <h2 class="font-bold text-lg">No Results Found | Back to Top <i
                class="bx bx-up-arrow-alt font-bold text-lg"></i></h2>
          </div>
        </div>
      </infinite-loading>

    </div>


  </main>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {InfiniteLoading},
  mounted() {
    this.getStatus();
    if (this.statuses.length) {
      this.refreshButton = true;
    }
    this.$Progress.finish()
  },
  computed: {
    ...mapGetters({
      statuses: "category_statuses",
      newStatuses: "category_newStatuses",
      currentPage: 'category_currentPage',
      lastPage: "category_LastPage",
      currentCategory: "currentCategory",
      previousCategory: "previousCategory",
    }),
    checkCategory() {
      let c_name = this.$route.params.category;
      return c_name == this.currentCategory;
    },
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      infoLoading: false,
      statusLoading: false,
      refreshButton: false,
    }
  },
  methods: {
    ...mapActions({
      getStatusData: 'category_getStatus',
      refreshStatusData: 'category_refreshStatus',
    }),
    refreshStatus() {
      this.statusLoading = true;
      let category = this.$route.params.category;
      this.refreshStatusData(category)
          .then(() => {
            this.refreshButton = false;
            this.statusLoading = false;
          })
    },
    async getStatus() {
      let category = this.$route.params.category;
      let currentCategory = this.currentCategory;
      if (category != currentCategory) {
        this.statusLoading = true;
        try {
          await this.getStatusData(category)
              .then(() => {
                this.statusLoading = false;
              })
        } catch (e) {
          if (e.response.status === 404) {
            this.$router.replace({name: 'notFound'})
          }
        }
      } else {
        if (!this.statuses.length) {
          this.statusLoading = true;
          try {
            await this.getStatusData(category)
                .then(() => {
                  this.statusLoading = false;
                })
          } catch (e) {
            if (e.response.status === 404) {
              this.$router.replace({name: 'notFound'})
            }
          }
        }
      }

    },
    loadMore($state) {
      let category = this.$route.params.category;
      if (this.currentPage > this.lastPage) {
        $state.complete();
      } else {
        this.getStatusData(category)
            .then(() => {
              if (!this.refreshButton) {
                this.refreshButton = true;
              }
              if (this.newStatuses.length) {
                $state.loaded();
              } else {
                $state.complete();
              }
            });
      }
    },

    statusClickAction(status) {
      this.$router.push('/status/' + status.code + '')
    },

    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }

  },
}
</script>
