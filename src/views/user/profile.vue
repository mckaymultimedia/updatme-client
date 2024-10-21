<template>
  <main class="mx-2 my-4">
    <main v-if="firstLoading">
      <content-placeholders :rounded="true" :centered="true">
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
      </content-placeholders>
    </main>
    <main v-else>
      <div class="indicator w-full">
        <div class="indicator-item indicator-top indicator-end mt-24 mr-8">
          <div class="flex flex-col space-y-1 items-end">
            <div v-if="user.fb" class="mt-0.5 clickable" @click="socialClickAction('fb')"><i
                class="bx bxl-facebook bx-sm"></i></div>
            <div v-if="user.ig" class="mt-0.5 clickable" @click="socialClickAction('ig')"><i
                class="bx bxl-instagram bx-sm"></i></div>
            <div v-if="user.yt" class="mt-0.5 clickable" @click="socialClickAction('yt')"><i
                class="bx bxl-youtube bx-sm"></i></div>
            <div v-if="user.tt" class="mt-0.5 clickable" @click="socialClickAction('tt')"><i
                class="bx bxl-tiktok bx-sm"></i></div>
            <div v-if="user.tw" class="mt-0.5 clickable" @click="socialClickAction('tw')"><i
                class="bx bxl-twitter bx-sm"></i></div>
          </div>
        </div>
        <div class="grid p-4 py-6 shadow-xl bg-base-100 rounded-box place-items-center w-full">
          <div class="indicator">
            <div v-if="user.verified" class="pt-2 mr-3 indicator-item">
              <verification-svg height="25px" width="25px"/>
            </div>
            <div class="avatar">
              <div v-if="user.image" class="w-24 h-24 p-px mask mask-squircle bg-base-content bg-opacity-10"><img
                  :src="url + '/'+ user.image" width="94" height="94"
                  :alt="user.name" class="mask mask-squircle"></div>
              <div v-else class="w-24 h-24 p-px mask mask-squircle bg-base-content bg-opacity-10"><img
                  :src="url + '/user/no-image.png'" width="94" height="94"
                  :alt="user.name" class="mask mask-squircle"></div>
            </div>
          </div>
          <div class="text-center">
            <div class="text-lg font-extrabold">{{ user.name }}</div>
            <div class="text-md text-opacity-70">@{{ user.username }}</div>
			<div class="badge badge-primary mt-2" v-if="user.package && user.package.title">{{ user.package.title }}</div>
            <div class="mt-2 mb-3 text-sm text-base-content text-opacity-60">
              {{ user.bio }}
            </div>
          </div>
          <router-link to="/edit-profile" class="btn-group">
            <a class="btn btn-accent btn-sm">Edit Profile</a>
            <a aria-label="button component" class="btn btn-accent btn-sm btn-square">
              <i class="bx bx-edit"></i>
            </a>
          </router-link>
        </div>
      </div>
      <div
          class="flex flex-row w-full shadow-xl bg-base-100 justify-between rounded-box text-center mt-1 px-2 py-2 md:px-4 md:py-4">
        <div class="flex-col mx-auto">
          <div class="text-sm text-base-content text-opacity-60 text-center">Status</div>
          <div class="text-lg font-extrabold">{{ user.statuses_count }}</div>
        </div>
        <div class="divider divider-vertical"></div>
        <div class="flex-col mx-auto clickable" @click="$refs.followModal.openModal(1)">
          <div class="text-sm text-base-content text-opacity-60">Followers</div>
          <div class="text-lg font-extrabold">{{ user.followers_count }}</div>
        </div>
        <div class="divider divider-vertical"></div>
        <div class="flex-col mx-auto clickable" @click="$refs.followModal.openModal(2)">
          <div class="text-sm text-base-content text-opacity-60">Following</div>
          <div class="text-lg font-extrabold">{{ user.followings_count }}</div>
        </div>
      </div>
    </main>

    <!-- User Posts -->
    <div v-if="statusLoading">
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

          <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-3 mb-2">

            <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
              <div class="flex-1">
                <div class="flex-row items-center space-x-3 card mt-1 mb-2">
                  <div class="avatar">
                    <div class="rounded-full w-10 h-10 shadow">
                      <img v-if="user.image" :src="url + '/'+ user.image">
                      <img v-else :src="url + '/user/no-image.png'">
                    </div>
                  </div>
                  <div class="flex flex-row space-x-1.5 items-center">
                    <div class="font-bold text-lg ml-1">{{ user.name }}</div>
                    <div v-if="user.verified">
                      <verification-svg height="17px" width="17px"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex-0">
                <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
                  <i v-if="status.status === 0" class="badge btn-warning">In Review</i>
                  <h2 v-else class="text-sm">{{ status.date | fromNow }}</h2>
                </div>
              </div>
            </div>

            <div class="relative">
          <span class="status-type">
            <i v-if="status.type === 'image'" class="bx bx-image-alt"></i>
            <i v-if="status.type === 'video'" class="bx bx-video"></i>
            <i v-if="status.type === 'youtube'" class="bx bxl-youtube"></i>
          </span>
              <figure>
                <img v-if="status.status === 0" class="rounded status-img-md lg:status-img-lg" :src="url+ status.thumb">
                <img v-else class="rounded clickable status-img-md lg:status-img-lg" :src="url+ status.thumb"
                     @click="statusClickAction(status)">
              </figure>
            </div>

            <div class="p-2">
              <h1 v-if="status.title && status.title.length<80" class="text-lg">{{ status.title }}</h1>
              <h1 v-if="status.title && status.title.length>80" class="text-lg">{{
                  status.title.substring(0, 80) + '...'
                }}</h1>
            </div>

            <div class="flex flex-row justify-between bg-base-300 p-1 rounded px-2">
              <div class="flex mt-1 items-center">
                <eye-svg class="text-lg"></eye-svg>
                <h2 class="font-bold text-lg ml-2">{{ status.views | formatNumber }}</h2>
              </div>
              <div class="flex mt-1 items-center">
                <span><i class="bx bx-heart text-lg"></i> </span>
                <h2 class="font-bold text-lg ml-2">{{ status.likes | formatNumber }}</h2>
              </div>
              <div class="flex mt-1 items-center">
                <span><i class="bx bx-comment text-lg"></i> </span>
                <h2 class="font-bold text-lg ml-2">{{ status.comments | formatNumber }}</h2>
              </div>
            </div>

          </div>

        </div>
      </div>
      <div v-else>
        <div class="card p-4 shadow-lg compact bg-base-100 mx-1 mt-3 mb-2">
          <div class="relative">
          <span class="status-type">
            <i class="bx bx-image-alt"></i>
          </span>
            <figure>
              <img class="rounded" :src="url+ '/default.png'" style="height: 250px" alt="no post available">
            </figure>
          </div>
          <div class="p-2 text-center">
            <h1 class="text-lg">Please try again later !!</h1>
          </div>
        </div>
      </div>
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

    <follow-list :username="user.username" ref="followModal"/>

  </main>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import EyeSvg from "../../assets/svg/eye-svg";
import followList from "../../components/follow-list";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {InfiniteLoading, EyeSvg, followList},
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  created() {
    this.getInfo();
  },
  mounted() {
    this.getStatus();
    if (this.statuses.length) {
      this.refreshButton = true;
    }
    this.$Progress.finish()
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      user: {
        name: "",
        username: "",
        image: null,
        bio: "",
        fb: "",
        ig: "",
        tt: "",
        tw: "",
        yt: "",
        verified: 0,
        followings_count: 0,
        followers_count: 0,
        statuses_count: 0
      },
      firstLoading: false,
      statusLoading: false,
      refreshButton: false,

    }
  },
  computed: {
    ...mapGetters({
      statuses: "my_statuses",
      newStatuses: "my_newStatuses",
      currentPage: 'my_currentPage',
      lastPage: "my_LastPage",
    })
  },
  methods: {
    ...mapActions({
      getStatusData: 'my_getStatus',
      refreshStatusData: 'my_refreshStatus',
    }),
    getInfo() {
      this.firstLoading = true;
      this.$axios.get('/my-info')
          .then(({data}) => {
            this.user = data;
            this.firstLoading = false;
          })
          .catch((error) => {
            this.firstLoading = false;
          })
    },
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
    socialClickAction(type) {
      if (type === 'fb') {
        window.location.href = 'https://facebook.com/' + this.user.fb;
      } else if (type === 'ig') {
        window.location.href = 'https://instagram.com/' + this.user.ig;
      } else if (type === 'yt') {
        window.location.href = 'https://www.youtube.com/channel/' + this.user.yt;
      } else if (type === 'tt') {
        window.location.href = 'https://www.tiktok.com/@' + this.user.tt;
      } else if (type === 'tw') {
        window.location.href = 'https://twitter.com/' + this.user.tw;
      }
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

<style scoped>

</style>