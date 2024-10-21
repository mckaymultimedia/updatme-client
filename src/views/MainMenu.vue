<template>
  <main>
    <div
        class="grid p-4 py-4 shadow-xl bg-base-200 rounded-box place-items-center w-full"
    >
      <div class="avatar">
        <div
            v-if="user.image"
            class="w-24 h-24 p-px mask mask-squircle bg-base-content bg-opacity-10"
        >
          <img
              :alt="user.name"
              :src="this.$config.FILE_URL + '/' + user.image"
              class="mask mask-squircle"
              height="94"
              width="94"
          />
        </div>
        <div
            v-else
            class="w-24 h-24 p-px mask mask-squircle bg-base-content bg-opacity-10"
        >
          <img
              :src="this.$config.FILE_URL + '/user/no-image.png'"
              alt="RewardStatus"
              class="mask mask-squircle"
              height="94"
              width="94"
          />
        </div>
      </div>
      <div class="text-center mt-3">
        <div class="text-xl font-extrabold">{{ user.name }}</div>
        <div class="text-md text-opacity-70">@{{ user.username }}</div>
      </div>
    </div>

    <div
        class="flex flex-col w-full shadow-xl bg-base-100 text-primary-content rounded-box text-center mt-1 px-2 py-2 md:px-4 md:py-4"
    >
      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/profile"
      >
        <div class="flex-none">
          <i class="bx bxs-user-circle text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> My Profile </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          v-if="siteInfo.earnings"
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/wallet"
      >
        <div class="flex-none">
          <i class="bx bxs-wallet text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> My Points </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/packages"
      >
        <div class="flex-none">
          <i class="bx bxs-user-account text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Packages </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/inbox"
      >
        <div class="flex-none">
          <i class="bx bx-message-dots text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <div class="flex flex-row space-x-3 items-center">
            <div class="text-lg font-bold"> Inbox</div>
            <div v-if="unread > 0" class="bg-error px-2 rounded-full"> {{ unread < 99 ? unread : "99+" }}</div>
          </div>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/fund"
      >
        <div class="flex-none">
          <i class="bx bxs-wallet-alt text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Funds </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/ads"
      >
        <div class="flex-none">
          <i class="bx bx-dollar text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Advertisements </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          v-if="siteInfo.leaderboard"
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/leaderboard"
      >
        <div class="flex-none">
          <i class="bx bxs-bar-chart-alt-2 text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> LeaderBoard </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/favourites"
      >
        <div class="flex-none">
          <i class="bx bxs-heart text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Favourites </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/referrals"
      >
        <div class="flex-none">
          <i class="bx bxs-group text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Invite Friends </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/limits"
      >
        <div class="flex-none">
          <i class="bx bxs-bar-chart-square text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Daily Limits </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/support-tickets"
      >
        <div class="flex-none">
          <i class="bx bx-support text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Support Tickets </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <router-link
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          to="/settings"
      >
        <div class="flex-none">
          <i class="bx bxs-cog text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Settings </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </router-link>

      <div
          class="navbar mb-2 shadow-lg bg-primary rounded-box px-4 md:px-6"
          style="cursor: pointer"
          @click="signOut"
      >
        <div class="flex-none">
          <i class="bx bx-log-out text-lg"></i>
        </div>
        <div class="flex-1 px-2 mx-2">
          <span class="text-lg font-bold"> Logout </span>
        </div>
        <div class="flex-none">
          <i class="bx bxs-chevron-right text-lg"></i>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  mounted() {
    this.$store.dispatch('getUnread');
    this.$Progress.finish();
  },
  computed: {
    ...mapGetters({
      user: "userInfo",
      siteInfo: "siteInfo",
      unread: "unread",
    }),
  },
  methods: {
    ...mapActions({
      signOutAction: "signOut",
    }),
    signOut() {
      this.signOutAction().then(() => {
        this.$router.replace({name: "login"});
      });
    },
  },
};
</script>

<style scoped></style>