<template>
  <div class="flex-row items-center space-x-3 card mt-1 mb-2">
    <div class="avatar">
      <div class="rounded-full w-10 h-10 shadow clickable" @click="viewUser(user.username)">
        <img v-if="user.image" :src="url + '/'+ user.image">
        <img v-else :src="url + '/user/no-image.png'">
      </div>
    </div>
    <div class="flex flex-row space-x-1.5 items-center">
      <div class="font-bold text-lg ml-1 clickable" @click="viewUser(user.username)">{{ user.name }}</div>
      <div v-if="user.verified">
        <verification-svg height="17px" width="17px"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {user: {}},
  data() {
    return {
      url: this.$config.FILE_URL,
    }
  },
  methods: {
    viewUser(username) {
      this.$router.push({name: 'public-profile', params: {username: username}});
    },
  },
}
</script>

<style scoped>

</style>