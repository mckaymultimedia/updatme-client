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
      <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mb-2">

        <div class="flex flex-col items-center content-center">
          <div class="stat-title text-sm">Invite Link</div>
          <div class="form-control w-1/2 mt-3">
            <input type="text" class="input w-full input-accent" v-model="info.url">
          </div>
          <div class="text-md text-center mt-4 mb-2 px-3 md:px-6">Invite your friends to join us and win amazing rewards
            ! You'll receive <span class="inline-flex"> <coin-svg height="14px" width="14px"/></span> <span
                class="text-base font-bold">
              {{ info.rr_amount | formatNumber }}
            </span> for every friends you refer. You'll get this reward <span
                class="font-bold"> {{ info.rr_type == 1 ? 'Once' : 'Everytime' }}</span>, when your friend makes an
            withdrawal.
          </div>
        </div>


      </div>

      <div class="divider">Recently Joined</div>
      <template v-if="referrals && referrals.length">
        <div v-for="(user, index) in referrals" :key="index">
          <div
              class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2"
          >
            <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
              <div class="flex-1">
                <div class="flex-row items-center space-x-3 card mt-1 mb-2">
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
                    <div class="text-sm font-semibold">
                      {{ user.created_at | fromNow }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2">
          <span class="text-lg font-semibold">No User available</span>
        </div>
      </template>
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
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      referrals: {},
      info: {
        rr_type: 0,
        rr_amount: 0,
        url: null,
      },
      infoLoading: false,
    };
  },
  methods: {
    getList() {
      this.infoLoading = true;
      axios
          .get("/referrals")
          .then(({data}) => {
            this.referrals = data.referrals;
            this.info = data.info;
            this.infoLoading = false;
          })
          .catch((error) => {
            this.infoLoading = false;
            this.$noti("error", "Something went wrong");
          });
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
  },
};
</script>

<style scoped></style>
