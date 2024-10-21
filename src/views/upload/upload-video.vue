<template>
  <main class="justify-center mx-auto mt-3 mb-4 sm:w-4/5 md:w-3/4 lg:w-4/6 overflow-hidden">

    <div class="pt-6 w-full shadow-2xl">

      <div class="card-body pt-0">

        <div class="flex justify-between items-center py-2.5 px-2 rounded-box bg-warning">
          <div>
            <label class="mr-3 text-base-100">Daily Limit Left =</label>
          </div>
          <div>
            <a class="btn btn-sm btn-success">{{ limit_left }}</a>
          </div>
        </div>

        <div v-if="limit_left <= 0 && limit_left != null" class="mt-4 text-center">
          <label class="text-red-700 text-2xl font-bold"> Limit Over,<br> Try Again Tomorrow !! </label>
        </div>

        <form @submit.prevent="uploadVideo" :class="parseInt(limit_left) <= 0 ? 'disabledArea' : ''">

          <div>
            <div class="form-control mt-5">
              <label class="label">
                <span class="label-text font-bold">Choose Video :</span>
              </label>
              <div class="mx-2">
                <input type="file" ref="selectVideo" accept=".mp4" class="file" @change="getVideoSize">
                <small class="text-red-600" v-if="errors.video">{{ errors.video[0] }}</small>
              </div>
            </div>
          </div>

          <div>
            <div class="form-control mt-2">
              <label class="label">
                <span class="label-text font-bold">Thumbnail <small v-if="ffmpeg != 0">(optional)</small> :</span>
              </label>
              <div class="mx-2">
                <input type="file" ref="select" accept=".jpg,.png,.jpeg" class="file" @change="imageChange">
                <small class="text-red-600" v-if="errors.image">{{ errors.image[0] }}</small>
              </div>
            </div>

            <div class="form-control mt-5" v-if="form.image">
              <label class="label">
                <span class="label-text font-bold">Preview :</span>
              </label>
              <div class="flex flex-wrap justify-center">
                <div class="w-8/12 sm:w-6/12 px-4">
                  <img :src="form.image" alt="..."
                       class="rounded max-w-full h-auto align-middle border-none"/>
                </div>
              </div>
            </div>
          </div>

          <div class="form-control mt-5">
            <label class="label">
              <span class="label-text font-bold">Title</span>
            </label>
            <input type="text" placeholder="Write a title..." class="input input-accent" v-model="form.title">
            <small class="text-red-600" v-if="errors.title">{{ errors.title[0] }}</small>
          </div>
          <div class="form-control mt-3">
            <label class="label">
              <span class="label-text font-bold">Description :</span>
            </label>
            <textarea class="textarea h-24 textarea-bordered textarea-accent"
                      placeholder="Write a description about the status"
                      v-model="form.description"></textarea>
            <small class="text-red-600" v-if="errors.description">{{ errors.description[0] }}</small>
          </div>

          <div class="form-control mt-5">
            <label class="label">
              <span class="label-text font-bold">Categories :</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div class="truncate" v-for="category in categories" :key="category.id">
                <label class="inline-flex items-center">
                  <input type="checkbox" checked="checked" class="checkbox checkbox-accent" :value="category.id"
                         v-model="form.categories">
                  <span class="label-text ml-1 md:ml-2">{{ category.name }}</span>
                </label>
              </div>
            </div>
            <small class="text-red-600" v-if="errors.categories">{{ errors.categories[0] }}</small>
          </div>

          <div class="form-control mt-5">
            <label class="label">
              <span class="label-text font-bold">Languages :</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div class="truncate" v-for="language in languages" :key="language.id">
                <label class="inline-flex items-center">
                  <input type="checkbox" checked="checked" class="checkbox checkbox-accent" :value="language.id"
                         v-model="form.languages">
                  <span class="label-text ml-1 md:ml-2">{{ language.name }}</span>
                </label>
              </div>
            </div>
            <small class="text-red-600" v-if="errors.languages">{{ errors.languages[0] }}</small>
          </div>

          <div class="mt-4 p-6" v-if="uploading === 1">
            <progress class="progress progress-accent" :value="uploadPercentage" max="100"></progress>
          </div>

          <div class="form-control mt-8 mb-3" :class="uploading === 1 ? 'disabledArea' : ''">
            <button type="submit" class="btn btn-primary">
              <svg-loading height="16px" width="16px" class="mr-1" v-if="uploading === 1"/>
              Upload
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
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  created() {
    this.getUploadInfo();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      form: {
        title: null,
        description: null,
        image: null,
        video: null,
        categories: [],
        languages: [],
      },
      uploading: 0,
      uploadPercentage: 0,
      errors: {},
      limit_left: null,
      categories: [],
      languages: [],
      ffmpeg: 0,
      max_mb: 0,
    }
  },
  methods: {
    getUploadInfo() {
      axios.get('/upload-info')
          .then(({data}) => {
            this.limit_left = data.limit_left;
            this.categories = data.categories;
            this.languages = data.languages;
            this.ffmpeg = data.ffmpeg;
            this.max_mb = data.max_mb;
          })
          .catch((error) => {
            console.log('Something went wrong')
          })
    },
   async uploadVideo() {
     this.uploading = 1;
     try {
       let categories = JSON.stringify(this.form.categories);
       let languages = JSON.stringify(this.form.languages);
       let formData = new FormData();
       formData.append('video', this.$refs.selectVideo.files[0]);
       formData.append('title', this.form.title);
       formData.append('description', this.form.description);
       if (this.form.image){
         formData.append('image', this.form.image);
       }
       formData.append('categories', categories);
       formData.append('languages', languages);
       let response = await axios.post('/upload-video', formData, {
         headers: {'content-type': 'multipart/form-data'},
         onUploadProgress: function (progressEvent) {
           this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
         }.bind(this)
       })
       this.uploading = 0;
       this.uploadPercentage = 0;
       this.form = {title: null, description: null, image: null, video: null, categories: [], languages: []};
       this.getUploadInfo();
       this.$refs.select.value = null;
       this.$refs.selectVideo.value = null;
       this.$noti('success', '' + response.data.message + '')

      } catch (error){
       this.uploading = 0;
       this.uploadPercentage = 0;
       this.errors = error.response.data.errors;
       if (error.response.status === 422){
         this.$noti('error', 'Field Missing')
       } else {
         this.$noti('error', '' + error.response.data.error + '')
       }
      }
    },
    imageChange(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = event => {
        this.form.image = event.target.result
      };
      reader.readAsDataURL(file);
    },
    getVideoSize(event) {
      let maxSize = this.max_mb * 1048576;
      let file = event.target.files[0];
      let reader = new FileReader();
      let fileSize = file.size;
      if (fileSize > maxSize) {
        this.$noti('error', 'Video too large');
        this.errors = {errors: {video: ['Video Too Large']}}
        this.$refs.selectVideo.value = null;
      }
    },
  },
}
</script>

<style scoped>

</style>