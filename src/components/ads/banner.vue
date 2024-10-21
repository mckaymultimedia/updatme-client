<template>
  <main v-if="info.banner">
    <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1 items-center">
      <figure>
        <img @click="adClick" :src="url + info.banner" :alt="info.title"
             class="clickable rounded mx-auto max-w-full h-auto align-middle border-none"
             style="height: 50px; width: 320px;"/>
      </figure>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.getAd();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      info: {
        id: null,
        title: null,
        banner: null,
      },
      isValid: false,
    }
  },
  watch: {
    isValid(newValue, oldValue) {
      if (oldValue === false && newValue === true) {
        this.adView();
      }
    }
  },
  methods: {
    getAd() {
      axios.get('/banner-ads')
          .then(({data}) => {
            this.info = data;
            setTimeout(() => {
              this.isValid = true;
            }, 5000);
          })
    },
    adView() {
      if (this.info.id) {
        axios.patch('/ad-view', {id: this.info.id})
      }
    },
    adClick() {
      axios.patch('/ad-click', {id: this.info.id})
          .then(() => {
            window.open(this.info.url, '_blank').focus();
          })
    }
  },
  destroyed() {
    this.isValid = false;
  },
}
</script>
