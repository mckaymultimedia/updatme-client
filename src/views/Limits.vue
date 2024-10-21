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
      </content-placeholders>
    </div>
    <div v-else>
      <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mb-2">

        <div class="text-center">
          <div class="stat-title text-base font-bold">Daily Limits</div>
        </div>

        <div class="divider"></div>

        <div class="text-md text-center px-3 md:px-6">Here's a list of your interaction daily limits. You
          won't be able to post new status or get points from views, likes, and comments if you reach your maximum
          limit. You can get more limits by upgrading your membership package.<br><br> <span class="text-opacity-80">N.B: There's no limit on your author points.</span>
        </div>

        <div class="divider"></div>

        <div class="mb-2">
          <div class="flex flex-row items-center content-center justify-evenly">
            <div class="italic text-base font-bold">Limit Reset :</div>

            <div class="grid grid-flow-col gap-3 md:gap-5 text-center auto-cols-max">
              <div class="flex flex-col text-semibold">
                <span class="font-mono text-xl countdown">
                  <span v-if="time > 0" :style="'--value:' + r_hours + ';'"></span>
                  <span v-else>00</span>
                </span>
                Hours
              </div>
              <div class="flex flex-col text-semibold">
                <span class="font-mono text-xl countdown">
                  <span v-if="time > 0" :style="'--value:' + r_minutes + ';'"></span>
                  <span v-else>00</span>
                </span>
                Mins
              </div>
              <div class="flex flex-col text-semibold">
                <span class="font-mono text-xl countdown">
                  <span v-if="time > 0" :style="'--value:' + r_seconds + ';'"></span>
                  <span v-else>00</span>
                </span>
                Secs
              </div>
            </div>

          </div>
        </div>

      </div>

      <div class="divider">Limit Used</div>

      <div class="card p-2 shadow-lg compact text-center bg-accent mx-1 mb-2">
        <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
          <div class="flex-1">
            <div class="flex-row items-center space-x-3 card font-bold text-lg">
              Status Limit :
            </div>
          </div>
          <div class="flex-0">
            <div class="flex-row items-center space-x-2.5 card text-base font-bold">
              {{ user.daily_limit }} / {{ package.daily_limit == 0 ? 'Unlimited' : package.daily_limit }}
            </div>
          </div>
        </div>
      </div>

      <div class="card p-2 shadow-lg compact text-center bg-success mx-1 mb-2">
        <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
          <div class="flex-1">
            <div class="flex-row items-center space-x-3 card font-bold text-lg">
              View Limit :
            </div>
          </div>
          <div class="flex-0">
            <div class="flex-row items-center space-x-2.5 card text-base font-bold">
              {{ user.view_limit }} / {{ package.view_limit == 0 ? 'Unlimited' : package.view_limit }}
            </div>
          </div>
        </div>
      </div>

      <div class="card p-2 shadow-lg compact text-center bg-secondary mx-1 mb-2">
        <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
          <div class="flex-1">
            <div class="flex-row items-center space-x-3 card font-bold text-lg">
              Like Limit :
            </div>
          </div>
          <div class="flex-0">
            <div class="flex-row items-center space-x-2.5 card text-base font-bold">
              {{ user.like_limit }} / {{ package.like_limit == 0 ? 'Unlimited' : package.like_limit }}
            </div>
          </div>
        </div>
      </div>

      <div class="card p-2 shadow-lg compact text-center bg-error mx-1 mb-4">
        <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
          <div class="flex-1">
            <div class="flex-row items-center space-x-3 card font-bold text-lg">
              Comment Limit :
            </div>
          </div>
          <div class="flex-0">
            <div class="flex-row items-center space-x-2.5 card text-base font-bold">
              {{ user.comment_limit }} / {{ package.comment_limit == 0 ? 'Unlimited' : package.comment_limit }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  created() {
    this.getInfo();
  },
  mounted() {
    this.$Progress.finish();
  },
  computed: {
    r_hours() {
      if (this.time > 0) {
        return Math.floor(this.time / 3600);
      } else {
        return 0;
      }
    },
    r_minutes() {
      if (this.time > 0) {
        return Math.floor((this.time % 3600) / 60);
      } else {
        return 0;
      }
    },
    r_seconds() {
      if (this.time > 0) {
        return this.time % 60;
      } else {
        return 0;
      }
    },
  },
  data() {
    return {
      infoLoading: false,
      user: {},
      package: {},
      time: 0,
      timer: null,
    };
  },

  methods: {
    getInfo() {
      this.infoLoading = true;
      axios
          .get("/daily-limits")
          .then(({data}) => {
            this.user = data.user;
            this.package = data.package;
            this.time = data.time;
            this.infoLoading = false;
            this.timer = setInterval(() => {
              this.countDown();
            }, 1000);
          })
          .catch((error) => {
            this.infoLoading = false;
            this.$noti("error", "Something went wrong");
          });
    },
    countDown() {
      this.time = this.time - 1;
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
