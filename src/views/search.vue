<template>
  <main class="justify-center mx-auto w-full md:w-3/4 lg:w-5/6">
    <div
        class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
    >
      <div class="flex flex-row items-center mx-1 mt-2 mb-1 rounded">
        <div class="flex-grow">
          <textarea
              v-model="search"
              class="textarea h-12 w-full textarea-bordered"
              placeholder="Search here..."
          ></textarea>
          <small v-if="errors.search" class="text-red-600">{{
              errors.search[0]
            }}</small>
        </div>
      </div>
    </div>

    <div class="mx-2">
      <div class="flex flex-row w-full justify-between">
        <div
            :class="listType === 1 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="listType = 1"
        >
          Users
        </div>
        <div
            :class="listType === 2 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="listType = 2"
        >
          Status
        </div>
      </div>
    </div>

    <main>
      <div v-if="listType === 1">
        <div v-if="infoLoading" class="mx-1 my-4">
          <content-placeholders :centered="true" :rounded="true">
            <content-placeholders-img/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
            <content-placeholders-img/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
          </content-placeholders>
        </div>
        <div v-else>
          <div v-if="userData.length">
            <div v-for="(user, index) in userData" :key="index">
              <div
                  class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
              >
                <user-list :user="user"/>
              </div>
            </div>
          </div>
          <div v-else>
            <div
                class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
            >
              <h2 v-if="search === ''" class="font-bold text-lg">Type something to search</h2>
              <h2 v-else class="font-bold text-lg">Nothing to Show</h2>
            </div>
          </div>
          <infinite-loading
              v-if="userData.length"
              :identifier="listType"
              spinner="waveDots"
              @infinite="loadMoreUsers"
          >
            <div slot="no-more">
              <div
                  :class="userData.length < 10 ? 'hidden' : ''"
                  class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
                  @click="scrollToTop"
              >
                <h2 class="font-bold text-lg">
                  No More | Back to Top
                  <i class="bx bx-up-arrow-alt font-bold text-lg"></i>
                </h2>
              </div>
            </div>
            <div slot="no-results">
              <div
                  :class="userData.length < 10 ? 'hidden' : ''"
                  class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
                  @click="scrollToTop"
              >
                <h2 class="font-bold text-lg">
                  No Results Found | Back to Top
                  <i class="bx bx-up-arrow-alt font-bold text-lg"></i>
                </h2>
              </div>
            </div>
          </infinite-loading>
        </div>
      </div>

      <div v-if="listType === 2">
        <!-- User Posts -->
        <div v-if="statusLoading" class="mx-1 my-4">
          <content-placeholders :centered="true" :rounded="true">
            <content-placeholders-img/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
            <content-placeholders-img/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
          </content-placeholders>
        </div>
        <div v-else>
          <div v-if="statusData.length">
            <div v-for="(status, index) in statusData" :key="index">
              <status-card :status="status"/>
            </div>
          </div>
          <div v-else>
            <div
                class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
            >
              <h2 v-if="search === ''" class="font-bold text-lg">Type something to search</h2>
              <h2 v-else class="font-bold text-lg">Nothing to Show</h2>
            </div>
          </div>
          <infinite-loading
              v-if="statusData.length"
              :identifier="listType"
              spinner="waveDots"
              @infinite="loadMoreStatus"
          >
            <div slot="no-more">
              <div
                  class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
                  @click="scrollToTop"
              >
                <h2 class="font-bold text-lg">
                  No More | Back to Top
                  <i class="bx bx-up-arrow-alt font-bold text-lg"></i>
                </h2>
              </div>
            </div>
            <div slot="no-results">
              <div
                  class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
                  @click="scrollToTop"
              >
                <h2 class="font-bold text-lg">
                  No Results Found | Back to Top
                  <i class="bx bx-up-arrow-alt font-bold text-lg"></i>
                </h2>
              </div>
            </div>
          </infinite-loading>
        </div>
      </div>
    </main>
  </main>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import axios from "axios";
import userList from "../components/user-list";

export default {
  components: {InfiniteLoading, userList},
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      search: '',
      listType: 1,
      isSubmitting: false,
      userData: [],
      statusData: [],
      userCP: 1,
      userLP: 1,
      statusCP: 1,
      statusLP: 1,
      infoLoading: false,
      statusLoading: false,
      errors: {},
      timer: null,
    };
  },
  computed: {
    changeType() {
      return this.listType;
    },
    searchTerm() {
      return this.search;
    },
  },
  watch: {
    changeType() {
      if (this.searchTerm) {
        if (this.listType === 1) {
          try {
            this.userCP = 1;
            this.userLP = 1;
            this.userData = [];
          } finally {
            this.getUsers();
          }
        } else if (this.listType === 2) {
          try {
            this.statusCP = 1;
            this.statusLP = 1;
            this.statusData = [];
          } finally {
            this.getStatus();
          }
        }
      }
    },
    searchTerm() {
      if (this.searchTerm) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.searchAction();
        }, 600);
      }
    },
  },
  methods: {
    searchAction() {
      if (this.search) {
        if (this.listType === 1) {
          this.getUsers();
        } else if (this.listType === 2) {
          this.getStatus();
        }
      }
    },
    getUsers() {
      console.log("from getUsers");
      this.infoLoading = true;
      this.isSubmitting = true;
      axios
          .get("/search", {
            params: {term: this.search, type: this.listType, page: 1},
          })
          .then(({data}) => {
            this.userData = data.data;
            this.userLP = data.last_page;
            if (data.data.length) {
              this.userCP += 1;
            }
            this.infoLoading = false;
            this.isSubmitting = false;
          })
          .catch((error) => {
            this.infoLoading = false;
            this.isSubmitting = false;
            this.errors = error.response.data.error;
          });
    },
    getStatus() {
      console.log("from getStatus");
      this.statusLoading = true;
      this.isSubmitting = true;
      axios
          .get("/search", {
            params: {term: this.search, type: this.listType, page: 1},
          })
          .then(({data}) => {
            this.statusData = data.data;
            this.statusLP = data.last_page;
            if (data.data.length) {
              this.statusCP += 1;
            }
            this.statusLoading = false;
            this.isSubmitting = false;
          })
          .catch((error) => {
            this.statusLoading = false;
            console.log(this.statusLoading);
            this.isSubmitting = false;
            this.errors = error.response.data.error;
          });
    },
    loadMoreUsers($state) {
      console.log("from loadMoreUsers");
      if (this.userCP > this.userLP) {
        $state.complete();
      } else {
        if (this.userCP === 1) {
          this.userCP += 1;
        }
        axios
            .get("/search", {
              params: {
                term: this.search,
                type: this.listType,
                page: this.userCP,
              },
            })
            .then(({data}) => {
              if (data.data.length) {
                this.userData.push(...data.data);
                this.userLP = data.last_page;
                this.userCP += 1;
                $state.loaded();
              } else {
                $state.complete();
              }
            });
      }
    },

    loadMoreStatus($state) {
      console.log("from loadMoreStatus");
      if (this.statusCP > this.statusLP) {
        $state.complete();
      } else {
        if (this.statusCP === 1) {
          this.statusCP += 1;
        }
        axios
            .get("/search", {
              params: {
                term: this.search,
                type: this.listType,
                page: this.statusCP,
              },
            })
            .then(({data}) => {
              if (data.data.length) {
                this.statusData.push(...data.data);
                this.statusLP = data.last_page;
                this.statusCP += 1;
                $state.loaded();
              } else {
                $state.complete();
              }
            });
      }
    },

    statusClickAction(status) {
      this.$router.push("/status/" + status.code + "");
    },

    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>
