<template>
  <main class="justify-center mx-auto w-full md:w-3/4 lg:w-5/6">
    <div v-if="infoLoading" class="mx-1 my-4">
      <content-placeholders :centered="true" :rounded="true">
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
      </content-placeholders>
    </div>
    <div v-else>
      <div
          v-if="info.prize"
          class="card p-2 shadow-lg compact bg-base-100 mx-1 mb-2"
      >
        <div class="flex space-x-2 justify-evenly">
          <div class="flex flex-col items-center content-center">
            <div class="stat-title text-sm">1st Prize</div>
            <div class="stat-value text-2xl">
              <div class="flex flex-row space-x-1 items-center">
                <coin-svg/>
                <div>{{ info.prize.a | formatNumber }}</div>
              </div>
            </div>
          </div>
          <div class="divider divider-vertical"></div>
          <div class="flex flex-col place-items-center place-content-center">
            <div class="stat-title text-sm">2nd Prize</div>
            <div class="stat-value text-2xl">
              <div class="flex flex-row space-x-1 items-center">
                <coin-svg/>
                <div>{{ info.prize.b | formatNumber }}</div>
              </div>
            </div>
          </div>
          <div class="divider divider-vertical"></div>
          <div class="flex flex-col place-items-center place-content-center">
            <div class="stat-title text-sm">3rd Prize</div>
            <div class="stat-value text-2xl">
              <div class="flex flex-row space-x-1 items-center">
                <coin-svg/>
                <div>{{ info.prize.c | formatNumber }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div v-if="info.time" class="mb-2">
          <div class="flex flex-row items-center content-center justify-evenly">
            <div class="italic text-base font-bold">Next Reward :</div>

            <div
                class="grid grid-flow-col gap-3 md:gap-5 text-center auto-cols-max"
            >
              <div class="flex flex-col text-semibold">
                <span class="font-mono text-xl countdown">
                  <span v-if="info.time > 0" :style="'--value:' + lb_hours + ';'"></span>
                  <span v-else>00</span>
                </span>
                Hours
              </div>
              <div class="flex flex-col text-semibold">
                <span class="font-mono text-xl countdown">
                  <span v-if="info.time > 0" :style="'--value:' + lb_minutes + ';'"></span>
                  <span v-else>00</span>
                </span>
                Mins
              </div>
              <div class="flex flex-col text-semibold">
                <span class="font-mono text-xl countdown">
                  <span v-if="info.time > 0" :style="'--value:' + lb_seconds + ';'"></span>
                  <span v-else>00</span>
                </span>
                Secs
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="divider">Your Rank</div>
      <div class="card p-2 shadow-lg compact text-center bg-primary mx-1 mb-2">
        <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
          <div class="flex-1">
            <div class="flex-row items-center space-x-3 card mt-1 mb-2">
              <div>
                <kbd class="kbd">{{ info.place }}</kbd>
              </div>
              <div class="avatar">
                <div
                    class="rounded-full w-10 h-10 shadow clickable"
                    @click="viewUser(myInfo.username)"
                >
                  <img v-if="myInfo.image" :src="url + '/' + myInfo.image"/>
                  <img v-else :src="url + '/user/no-image.png'"/>
                </div>
              </div>
              <div class="flex flex-row space-x-1.5 items-center">
                <div
                    class="font-bold text-lg ml-1 clickable"
                    @click="viewUser(myInfo.username)"
                >
                  {{ myInfo.name }}
                </div>
                <div v-if="myInfo.verified">
                  <verification-svg height="17px" width="17px"/>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-0">
            <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
              <div class="flex flex-row space-x-1 items-center">
                <coin-svg height="17px" width="17px"/>
                <div class="text-base font-semibold">
                  {{ info.points | formatNumber }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="divider">Top Users</div>
      <div v-for="(user, index) in userList" :key="index">
        <div
            class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2"
        >
          <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
            <div class="flex-1">
              <div class="flex-row items-center space-x-3 card mt-1 mb-2">
                <div>
                  <kbd
                      :class="
                      index === 0
                        ? 'bg-accent-focus'
                        : index === 1
                        ? 'bg-info'
                        : index === 2
                        ? 'bg-error'
                        : ''
                    "
                      class="kbd"
                  >{{ index + 1 }}</kbd
                  >
                </div>
                <div class="avatar">
                  <div
                      class="rounded-full w-10 h-10 shadow clickable"
                      @click="viewUser(user.username)"
                  >
                    <img v-if="user.image" :src="url + '/' + user.image"/>
                    <img v-else :src="url + '/user/no-image.png'"/>
                  </div>
                </div>
                <div class="flex flex-row space-x-1.5 items-center">
                  <div
                      class="font-bold text-lg ml-1 clickable"
                      @click="viewUser(user.username)"
                  >
                    {{ user.name }}
                  </div>
                  <div v-if="user.verified">
                    <verification-svg height="17px" width="17px"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-0">
              <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
                <div class="flex flex-row space-x-1 items-center">
                  <coin-svg height="17px" width="17px"/>
                  <div class="text-base font-semibold">
                    {{ user.lb_points | formatNumber }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import {mapGetters} from "vuex";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  mounted() {
    this.getList();
    this.$Progress.finish();
  },
  computed: {
    ...mapGetters({
      myInfo: "userInfo",
    }),
    lb_hours() {
      if (this.info.time > 0) {
        return Math.floor(this.info.time / 3600);
      } else {
        return 0;
      }
    },
    lb_minutes() {
      if (this.info.time > 0) {
        return Math.floor((this.info.time % 3600) / 60);
      } else {
        return 0;
      }
    },
    lb_seconds() {
      if (this.info.time > 0) {
        return this.info.time % 60;
      } else {
        return 0;
      }
    },
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      userList: {},
      info: {
        time: null,
      },
      timer: null,
      infoLoading: false,
    };
  },
  methods: {
    getList() {
      this.infoLoading = true;
      axios
          .get("/leaderboard")
          .then(({data}) => {
            this.userList = data.list;
            this.info = data.info;
            this.infoLoading = false;
            this.timer = setInterval(() => {
              this.countDown();
            }, 1000);
          })
          .catch((error) => {
            this.infoLoading = false;
            if (error.response.status === 406) {
              this.$router.replace({name: "notFound"});
            }
            this.$noti("error", "Something went wrong");
          });
    },
    countDown() {
      this.info.time = this.info.time - 1;
    },
    viewUser(username) {
      let self = this.$store.getters.userInfo.username;
      if (self == username) {
        this.$router.push({name: "profile"});
      } else {
        this.$router.push({
          name: "public-profile",
          params: {username: username},
        });
      }
    },
    clearTimer() {
      clearInterval(this.timer);
    },
  },

  beforeDestroy() {
    this.clearTimer();
  },
};
</script>

<style scoped></style>
