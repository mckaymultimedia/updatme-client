<template>
  <main class="bg-base-300">
    <div class="container mx-auto max-w-4xl min-h-screen bg-base-200" style="padding-bottom: 60px">

      <header class="sticky top-0 z-50">
        <div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
          <div class="mx-1 navbar-start">
            <div v-if="!showButton"></div>
            <button @click="titleButtonAction" v-if="showButton"><i
                class="bx bx-arrow-back text-2xl sm:text-4xl font-bold"></i>
            </button>
          </div>
          <div class="px-2 mx-2 navbar-center">
            <div class="flex items-stretch items-center">
              <div class="flex items-center">
                <img :src="url + '/logo.png' " :alt="siteName" class="h-8 w-8">
              </div>
              <div class="flex items-center">
                <div class="text-2xl md:text-4xl font-bold ml-2">{{ siteName }}</div>
              </div>
            </div>
          </div>
          <div class="mx-1 navbar-end space-x-2">
            <div class="flex flex-row space-x-2 items-center justify-center">
              <div class="dropdown dropdown-end">
                <div tabindex="0" class="btn btn-ghost btn-square"><i
                    class="bx bx-dots-vertical text-2xl sm:text-4xl font-semibold"></i></div>
                <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                  <li v-if="$route.path !== '/search'"
                      class="card text-base-content w-full p-2 shadow compact mt-1 mb-1 clickable"
                      @click="dropdownClickAction('search')">
                    <div class="flex flex-row space-x-1 items-center">
                      <div><i class="bx bx-search"></i></div>
                      <div>Search</div>
                    </div>
                  </li>
                  <li class="card text-base-content w-full p-2 shadow compact mb-1 clickable"
                      @click="dropdownClickAction('theme')">
                    <div class="flex flex-row space-x-1 items-center">
                      <div><i class="bx bxs-palette"></i></div>
                      <div>Change Theme</div>
                    </div>
                  </li>
                  <li class="card text-base-content w-full p-2 shadow compact mb-1 clickable"
                      @click="dropdownClickAction('settings')">
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

      <div class="standalone:mb-3">

        <router-view></router-view>

      </div>
      <BottomNavigation
          :options="options"
          :main-color="mainColor"
          :badge-color="badgeColor"
          :foreground-color="foregroundColor"
          v-model="selected"
      />
      <modal
          :if-close="true"
          :showing="showModal"
          @update:modal="showModal = $event"
      >
        <div v-if="modalType === 1">
          <theme-modal/>
        </div>

      </modal>
    </div>
  </main>
</template>
<script>
import BottomNavigation from "../components/navbar/BottomNavigation";
import {mapGetters} from "vuex";

export default {
  components: {BottomNavigation},
  created() {
    this.routeNumber();
    this.uploadButtons();
  },
  computed: {
    ...mapGetters({
      'siteInfo': "siteInfo"
    }),
    siteName() {
      return this.$sitename;
    },
    showButton() {
      return this.$route.name !== 'home';
    },
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      selected: null,
      transitionName: '',
      modalType: 0,
      showModal: false,
      options: [
        {
          id: 1,
          icon: "bx bxs-home",
          title: "Home",
        },
        {id: 2, icon: "bx bxs-star", title: "Following"},
        {id: 3, icon: "bx bx-trending-up", title: "Trending"},
        {
          id: 4,
          icon: "bx bxs-message-square-add",
          title: "Add New",
          childs: [
            {id: 101, icon: "bx bxs-image-add", title: "Image"},
            {id: 102, icon: "bx bxs-videos", title: "Video"},
            {id: 103, icon: "bx bxl-youtube", title: "Youtube"},
          ],
        },
        {id: 5, icon: "bx bxs-category", title: "Category"},
        {id: 6, icon: "bx bx-menu", title: "Menu"},
      ],
      mainColor: "#171616",
      foregroundColor: "#ff2a66",
      badgeColor: "#FBC02D",
    }
  },

  methods: {
    titleButtonAction() {
      if (this.$router.history.entities) {
        this.backButton = true;
      }
      this.$router.go(-1);
    },
    uploadButtons() {
      let info = this.siteInfo;
      let i = this.options;
      let childs = i[3].childs;
      if (!info.youtube) {
        let arr = childs.map(item => item.id).indexOf(103)
        childs.splice(arr, 1)
      }
      if (!info.video) {
        let arr = childs.map(item => item.id).indexOf(102)
        childs.splice(arr, 1)
      }
      if (!info.image) {
        let arr = childs.map(item => item.id).indexOf(101)
        childs.splice(arr, 1)
      }

      if (!childs.length) {
        this.$delete(i, 3)
      }
    },
    routeNumber() {
      if (this.$route.name === 'home') {
        this.selected = 1;
      } else if (this.$route.name === 'following') {
        this.selected = 2;
      } else if (this.$route.name === 'popular') {
        this.selected = 3;
      } else if (this.$route.name === 'categories') {
        this.selected = 5;
      } else if (this.$route.name === 'menu') {
        this.selected = 6;
      }
    },
    dropdownClickAction(type) {
      if (type === 'search') {
        this.$router.push('/search')
      } else if (type === 'theme') {
        this.modalType = 1;
        this.showModal = true;
      } else if (type === 'settings') {
        this.$router.push('/settings')
      }
    },

  },
}
</script>

<style scoped>
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100px)
}

.slide-left-enter-active {
  transition: all 0.25s ease-out
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100px)
}

.slide-left-leave-active {
  transition: all 0.25s ease-in
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100px)
}

.slide-right-enter-active {
  transition: all 0.25s ease-in
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100px)
}

.slide-right-leave-active {
  transition: all 0.25s ease-out
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>