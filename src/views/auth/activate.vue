<template>
  <main class="justify-center sm:mx-auto sm:w-full sm:max-w-md">
    <div class="card w-full shadow-2xl bg-base-200">
      <div class="flex flex-col space-y-2 justify-center items-center pt-3">
        <div class="w-12 h-12 shadow">
          <img :src="url + '/logo.png'" :alt="sitename">
        </div>
        <div class="card-title mb-0 text-center">
          <a href="/" class="text-2xl"><b>{{ sitename }}</b></a>
        </div>
      </div>
      <div class="divider divide-base-300"></div>
      <div class="card-body pt-0">
        <p class="text-center text-primary-content"><strong>Not Activated !!</strong></p>
        <p class="text-center text-primary-content">Please Activate Your License From Admin Panel.</p>
      </div>
      
    </div>

  </main>
</template>

<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  created() {
    this.getInfo();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      sitename: this.$sitename,
      loading: false,
    }
  },
  mounted() {
    this.$Progress.finish();
  },
  methods: {
    getInfo(){
      axios.get('/activated')
          .then(({data})=>{
            if (data.active === 1 || data.active === 2){
              this.$router.replace('/');
            }
          })
    }
  }
}
</script>
