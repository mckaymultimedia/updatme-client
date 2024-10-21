<template>
  <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-3 mb-2">

    <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
      <div class="flex-1">
        <div class="flex-row items-center space-x-3 card mt-1 mb-2">
          <div class="avatar">
            <div
              class="rounded-full w-10 h-10 shadow clickable"
              @click="viewUser(status.user.username)"
            >
              <img
                v-if="status.user.image"
                :src="url + '/' + status.user.image"
              />
              <img v-else :src="url + '/user/no-image.png'" />
            </div>
          </div>
          <div class="flex flex-row space-x-1.5 items-center">
            <div
              class="font-bold text-lg ml-1 clickable"
              @click="viewUser(status.user.username)"
            >
              {{ status.user.name }}
            </div>
            <div v-if="status.user.verified">
              <verification-svg height="17px" width="17px" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-0">
        <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
          <h2 class="text-sm">{{ status.date | fromNow }}</h2>
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
        <img
          :src="url + status.thumb"
          class="rounded clickable status-img-md lg:status-img-lg"
          @click="statusClickAction(status)"
        />
      </figure>
    </div>

    <div class="p-2">
      <h1 v-if="status.title && status.title.length < 80" class="text-lg">
        {{ status.title }}
      </h1>
      <h1 v-if="status.title && status.title.length > 80" class="text-lg">
        {{ status.title.substring(0, 80) + "..." }}
      </h1>
    </div>

    <div class="flex flex-row justify-between bg-base-300 p-1 rounded px-2">
      <div class="flex mt-1 items-center">
        <eye-svg class="text-lg"></eye-svg>
        <h2 class="font-bold text-lg ml-2">
          {{ status.views | formatNumber }}
        </h2>
      </div>
      <div class="flex mt-1 items-center">
        <span><i class="bx bx-heart text-lg"></i> </span>
        <h2 class="font-bold text-lg ml-2">
          {{ status.likes | formatNumber }}
        </h2>
      </div>
      <div class="flex mt-1 items-center">
        <span><i class="bx bx-comment text-lg"></i> </span>
        <h2 class="font-bold text-lg ml-2">
          {{ status.comments | formatNumber }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import EyeSvg from "../../assets/svg/eye-svg";

export default {
  components: { EyeSvg },
  props: { status: {} },
  data() {
    return {
      url: this.$config.FILE_URL,
      mobile: this.$mobileview,
    };
  },
  methods: {
    statusClickAction(status) {
      this.$router.push("/status/" + status.code + "");
    },
    viewUser(username) {
      let self = this.$store.getters.userInfo.username;
      if (self == username) {
        this.$router.push({ name: "profile" });
      } else {
        this.$router.push({
          name: "public-profile",
          params: { username: username },
        });
      }
    },
  },
};
</script>

<style scoped></style>