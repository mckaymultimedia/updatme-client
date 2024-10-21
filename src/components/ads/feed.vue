<template>
  <div v-if="info.image" class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-3 mb-2">
    <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
      <div class="flex-1">
        <div class="flex-row items-center space-x-3 card mt-1 mb-2">
          <div class="avatar">
            <div
                class="rounded-full w-10 h-10 shadow clickable"
                @click="viewUser(info.user.username)"
            >
              <img
                  v-if="info.user.image"
                  :src="url + '/' + info.user.image"
              />
              <img v-else :src="url + '/user/no-image.png'" />
            </div>
          </div>
          <div class="flex flex-row space-x-1.5 items-center">
            <div
                class="font-bold text-lg ml-1 clickable"
                @click="viewUser(info.user.username)"
            >
              {{ info.user.name }}
            </div>
            <div v-if="info.user.verified">
              <verification-svg height="17px" width="17px" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-0">
        <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
          <h2 class="text-sm mr-1">Sponsored</h2>
        </div>
      </div>
    </div>

    <div class="relative">
      <span v-if="info.status && info.status.type" class="status-type">
        <i v-if="info.status.type === 'image'" class="bx bx-image-alt"></i>
        <i v-if="info.status.type === 'video'" class="bx bx-video"></i>
        <i v-if="info.status.type === 'youtube'" class="bx bxl-youtube"></i>
      </span>
      <span class="status-type" v-else>
        <i class="bx bx-image-alt"></i>
      </span>
      <figure>
        <img v-if="mobile"
            :src="url + info.image"
            class="rounded clickable"
            style="height: 250px"
            @click="adClick"
        />
        <img v-else
            :src="url + info.image"
            class="rounded clickable"
            style="height: 400px"
            @click="adClick"
        />
      </figure>
    </div>

    <div class="p-2">
      <h1 v-if="info.title && info.title.length < 80" class="text-lg">
        {{ info.title }}
      </h1>
      <h1 v-if="info.title && info.title.length > 80" class="text-lg">
        {{ info.title.substring(0, 80) + "..." }}
      </h1>
    </div>

  </div>
</template>

<script>
import EyeSvg from "../../assets/svg/eye-svg";
import axios from "axios";
export default {
  components:{EyeSvg},
  created() {
    this.getAd();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      mobile: this.$mobileview,
      info:{
        id: null,
        title:null,
        image:null,
        url:null,
        status:{
          id: null,
          code: null,
        },
        user:{},
      },
      isValid: false,
    }
  },
  watch: {
    isValid(newValue, oldValue) {
      if (oldValue === false && newValue === true){
        this.adView();
      }
    }
  },
  methods:{
    getAd(){
      axios.get('/feed-ads')
          .then(({data})=>{
            this.info = data;
            setTimeout(()=> {
              this.isValid = true;
            }, 5000);
          })
    },
    adView(){
      if (this.info.id){
        axios.patch('/ad-view',{id:this.info.id})
      }
    },
    adClick(){
      axios.patch('/ad-click',{id:this.info.id})
          .then(()=>{
            if (this.info.url){
              window.open(this.info.url,'_blank').focus();
            } else if (this.info.status.code){
              this.$router.push("/status/" + this.info.status.code + "");
            }
          })
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
  destroyed() {
    this.isValid = false;
  },
}
</script>

<style scoped>

</style>