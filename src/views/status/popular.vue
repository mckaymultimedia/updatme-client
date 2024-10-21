<template>

  <main class="mx-2 my-2">

    <!-- User Posts -->
    <div class="mx-1 my-4" v-if="statusLoading">
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
          <feed-ad v-if="showAd && index % siteInfo.ads === 0 && index !== 0" />
          <status-card :status="status"/>
        </div>
      </div>
      <div v-else>
        <empty-status-card />
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
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  mounted() {
    this.getStatus();
    if (this.statuses.length){
      this.refreshButton = true;
    }
    this.$Progress.finish();
    this.showAd = true;
  },
  computed: {
    ...mapGetters({
      statuses: "popular_statuses",
      newStatuses: "popular_newStatuses",
      currentPage: 'popular_currentPage',
      lastPage: "popular_LastPage",
      siteInfo: "siteInfo"
    })
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      infoLoading: false,
      statusLoading: false,
      refreshButton: false,
      showAd: false,
    }
  },
  methods: {
    ...mapActions({
      getStatusData: 'popular_getStatus',
      refreshStatusData: 'popular_refreshStatus',
    }),
    refreshStatus() {
      this.statusLoading = true;
      this.refreshStatusData()
          .then(() => {
            this.refreshButton = false;
            this.statusLoading = false;
          })
    },
    getStatus() {
      if (!this.statuses.length) {
        this.statusLoading = true;
        this.getStatusData()
            .then(() => {
              this.statusLoading = false;
            })
      }
    },
    loadMore($state) {
      if (this.currentPage > this.lastPage) {
        $state.complete();
      } else {
        this.getStatusData()
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
