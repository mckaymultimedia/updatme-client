<template>
  <main class="bg-base-100">

    <div class="sidebar open bg-base-100">
      <div class="flex flex-col space-y-2.5 items-start text-primary-content font-semibold">

        <div class="card rounded-none w-full p-2 pt-0 shadow-lg compact mb-3">
          <div class="flex flex-row space-x-2 items-center">
            <div>
              <img :alt="siteName" class="h-10 w-10" :src="url + '/logo.png' " />
            </div>
            <div v-if="siteName.length <= 8" class="text-3xl text-base-content font-bold ml-2">{{ siteName }}</div>
            <div v-else class="text-xl text-base-content font-bold ml-2">{{ siteName }}</div>
          </div>
        </div>

        <div
          class="card rounded-md w-full p-2 shadow-lg compact bg-primary mt-5">
          <router-link :to="{ name: 'home' }" class="flex flex-row space-x-2 items-center">
            <div class="text-xl"><i class="bx bx-grid-alt"></i></div>
            <div>
              <div class="text-xl ml-2"
                >Home</div
              >
            </div>
          </router-link>
        </div>

        <div
          class="card rounded-md w-full p-2 shadow-lg compact bg-primary mt-5">
          <router-link :to="{ name: 'following' }" class="flex flex-row space-x-2 items-center">
            <div class="text-xl"><i class="bx bxs-star"></i></div>
            <div>
              <div  class="text-xl ml-2"
                >Following</div
              >
            </div>
          </router-link>
        </div>

        <div
          class="card rounded-md w-full p-2 shadow-lg compact bg-primary mt-5">
          <router-link  :to="{ name: 'popular' }" class="flex flex-row space-x-2 items-center">
            <div class="text-xl"><i class="bx bx-trending-up"></i></div>
            <div>
              <div class="text-xl ml-2"
                >Trending</div
              >
            </div>
          </router-link>
        </div>

        <div
          class="card rounded-md w-full p-2 shadow-lg compact bg-primary mt-5">
          <router-link :to="{ name: 'categories' }" class="flex flex-row space-x-2 items-center">
            <div class="text-xl"><i class="bx bxs-category"></i></div>
            <div>
              <div class="text-xl ml-2"
                >Categories</div
              >
            </div>
          </router-link>
        </div>

        <div
          class="card rounded-md w-full p-2 shadow-lg compact bg-primary mt-5">
          <router-link :to="{ name: 'wallet' }" class="flex flex-row space-x-2 items-center">
            <div class="text-xl"><i class="bx bxs-wallet"></i></div>
            <div>
              <div class="text-xl ml-2"
                >Wallet</div
              >
            </div>
          </router-link>
        </div>

        <div
          class="card rounded-md w-full p-2 shadow-lg compact bg-primary mt-5">
          <div class="flex flex-col">
            <div class="flex flex-row space-x-2 items-center justify-between clickable" @click="switchMenu">
              <div class="flex flex-row space-x-2 items-center">
                <div class="text-xl"><i class="bx bx-upload"></i></div>
                <div>
                  <div class="text-xl ml-2"
                  >Upload
                  </div>
                </div>
              </div>
              <div class="text-sm">
                <i v-if="uploadMenu" class="bx bx-up-arrow"></i>
                <i v-else class="bx bx-down-arrow"></i>
              </div>
            </div>
            <div v-if="uploadMenu" class="divider m-1"></div>
            <div v-if="uploadMenu" class="flex flex-col space-y-1 ml-2">
              <router-link :to="{ name: 'upload-image' }" class="flex flex-row space-x-2 items-center">
                <div><i class="bx bxs-image-add bx-xs"></i></div>
                <div>
                  <div class="text-base ml-2">Upload Image</div>
                </div>
              </router-link>
              <router-link :to="{ name: 'upload-video' }" class="flex flex-row space-x-2 items-center">
                <div><i class="bx bxs-video bx-xs"></i></div>
                <div>
                  <div class="text-base ml-2">Upload Video</div>
                </div>
              </router-link>
              <router-link :to="{ name: 'upload-youtube' }" class="flex flex-row space-x-2 items-center">
                <div><i class="bx bxl-youtube bx-xs"></i></div>
                <div>
                  <div class="text-base ml-2">Upload Youtube</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <div
            class="card rounded-md w-full p-2 shadow-lg compact bg-primary mt-5">
          <router-link :to="{ name: 'menu' }" class="flex flex-row space-x-2 items-center">
            <div><i class="bx bx-menu bx-sm"></i></div>
            <div>
              <div class="text-xl ml-2"
              >Main Menu</div
              >
            </div>
          </router-link>
        </div>

        <div class="profile-box text-base-content">
          <div class="card rounded-none w-full p-2 pt-0 shadow-lg compact">
            <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
              <div class="flex-1">
                <div
                  class="flex-row items-center space-x-3 card mt-1 mb-1 clickable"
                  @click="viewUser"
                >
                  <div class="avatar">
                    <div class="rounded-full w-10 h-10 shadow">
                      <img v-if="user.image" :alt="user.name" :src="url + '/' + user.image"/>
                      <img v-else :src="url + '/user/no-image.png'" alt="No Image"/>
                    </div>
                  </div>
                  <div class="flex flex-col space-y-0 items-start">
                    <div class="font-semibold text-base ml-1">
                      {{ user.name }}
                    </div>
                    <div class="text-sm font-thin text-opacity-60 ml-1">
                      @{{ user.username }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex-0">
                <div class="flex-row items-center space-x-2.5 card mt-1 mb-1">
                  <button
                    class="btn btn-square btn-error btn-sm"
                    @click="signOut"
                  >
                    <i class="bx bx-log-out bx-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="home-section bg-base-200 pb-3">
      <header class="nav-bar sticky top-0 bg-base-100">
        <div class="flex flex-row justify-end mb-2 shadow-lg">
          <div class="mx-1 space-x-2">
            <div class="flex flex-row space-x-2 items-center justify-center">
              <div class="dropdown dropdown-end">
                <div class="btn btn-ghost btn-square" tabindex="0">
                  <i
                      class="bx bx-dots-vertical text-2xl sm:text-4xl font-semibold"
                  ></i>
                </div>
                <ul
                    class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                    tabindex="0"
                >
                  <li
                      v-if="$route.path !== '/search'"
                      class="card text-base-content w-full p-2 shadow compact mt-1 mb-1 clickable"
                      @click="dropdownClickAction('search')"
                  >
                    <div class="flex flex-row space-x-1 items-center">
                      <div><i class="bx bx-search"></i></div>
                      <div>Search</div>
                    </div>
                  </li>
                  <li
                      class="card text-base-content w-full p-2 shadow compact mb-1 clickable"
                      @click="dropdownClickAction('theme')"
                  >
                    <div class="flex flex-row space-x-1 items-center">
                      <div><i class="bx bxs-palette"></i></div>
                      <div>Change Theme</div>
                    </div>
                  </li>
                  <li
                      class="card text-base-content w-full p-2 shadow compact mb-1 clickable"
                      @click="dropdownClickAction('settings')"
                  >
                    <div class="flex flex-row space-x-1 items-center">
                      <div><i class="bx bx-cog"></i></div>
                      <div>Settings</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div class="container mx-auto min-h-screen rounded-b pb-2" style="max-width: 58rem">
        <div class="mx-1">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <modal
      :if-close="true"
      :showing="showModal"
      @update:modal="showModal = $event"
    >
      <div v-if="modalType === 1">
        <theme-modal />
      </div>
    </modal>

  </main>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      user: "userInfo",
    }),
    url() {
      return this.$config.FILE_URL;
    },
    siteName() {
      return this.$sitename;
    },
  },
  data() {
    return {
      modalType: 0,
      showModal: false,
      uploadMenu: false,
    };
  },
  methods: {
    ...mapActions({
      signOutAction: "signOut",
    }),
    signOut() {
      this.signOutAction().then(() => {
        this.$router.replace({ name: "login" });
      });
    },
    dropdownClickAction(type) {
      if (type === "search") {
        this.$router.push("/search");
      } else if (type === "theme") {
        this.modalType = 1;
        this.showModal = true;
      } else if (type === "settings") {
        this.$router.push("/settings");
      }
    },
    viewUser(){
      this.$router.push('/profile')
    },
    switchMenu(){
      this.uploadMenu = !this.uploadMenu;
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 250px;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 5px;
  z-index: 99;
  transition: all 0.5s ease;
}

.home-section {
  position: relative;
  min-height: 100vh;
  top: 0;
  left: 250px;
  width: calc(100% - 250px);
  transition: all 0.5s ease;
  z-index: 2;
}

.nav-bar {
  left: 250px;
  z-index: 98;
}

.profile-box {
  position: fixed;
  height: 60px;
  width: 250px;
  left: 0;
  bottom: 0;
  margin-bottom: 2px;
  transition: all 0.5s ease;
  overflow: hidden;
}
</style>