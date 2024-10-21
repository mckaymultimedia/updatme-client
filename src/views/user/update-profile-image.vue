<template>
  <main class="justify-center mx-auto sm:w-4/5 md:w-3/4 lg:w-4/6">

    <div class="pt-6 w-full shadow-2xl">

      <div class="card-body pt-0">
        <form @submit.prevent="updateImage">
          <div class="form-control mt-5">
            <input type="file" accept=".jpg,.png,.jpeg,.heic" class="file" @change="imageChange">
            <small class="text-red-600" v-if="errors.image">{{ errors.image[0] }}</small>
          </div>
          <div class="form-control mt-5" v-if="image">
            <div class="flex flex-wrap justify-center">
              <div class="w-8/12 sm:w-6/12 px-4">
                <img :src="image" alt="..."
                     class="rounded max-w-full h-auto align-middle border-none"/>
              </div>
            </div>
          </div>

          <div class="mt-4 p-6" v-if="uploading">
            <progress class="progress progress-accent" :value="uploadPercentage" max="100"></progress>
          </div>

          <div class="form-control mt-8">
            <button type="submit" class="btn btn-primary" :disabled="uploading">
              <svg-loading height="16px" width="16px" class="mr-1" v-if="uploading"/>
              Update
            </button>
          </div>
        </form>
      </div>

    </div>

  </main>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      image: null,
      uploading: false,
      uploadPercentage: 0,
      errors: {}
    }
  },
  methods: {
    updateImage() {
      this.uploading = true;
      axios.post('/update-image', {image: this.image}, {
        onUploadProgress: function (progressEvent) {
          this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }.bind(this)
      })
          .then(({data}) => {
            this.uploading = false;
            this.image = null;
            this.$store.dispatch('updateInfo');
            this.$noti('success', '' + data.message + '')
          })
          .catch((error) => {
            this.uploading = false;
            this.$noti('error', 'Something Went Wrong')
          })
    },
    imageChange(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = event => {
        this.image = event.target.result
      };
      reader.readAsDataURL(file);
    },
  },
}
</script>

<style scoped>

</style>