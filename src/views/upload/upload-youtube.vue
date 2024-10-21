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

        <form @submit.prevent="uploadYoutube" :class="parseInt(limit_left) <= 0 ? 'disabledArea' : ''">

          <div class="form-control mt-5">
            <label class="label">
              <span class="label-text font-bold">Youtube URL</span>
            </label>
            <input type="text" placeholder="Youtube Video URL..." class="input input-accent" v-model="form.url">
            <small class="text-red-600 ml-2" v-if="errors.url">{{ errors.url[0] }}</small>
          </div>

          <div>
            <div class="form-control mt-2">
              <label class="label">
                <span class="label-text font-bold">Thumbnail <small>(optional)</small> :</span>
              </label>
              <div class="mx-2">
                <input type="file" ref="select" accept=".jpg,.png,.jpeg" class="file" @change="imageChange">
                <small class="text-red-600 ml-2" v-if="errors.image">{{ errors.image[0] }}</small>
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
            <small class="text-red-600 ml-2" v-if="errors.title">{{ errors.title[0] }}</small>
          </div>
          <div class="form-control mt-3">
            <label class="label">
              <span class="label-text font-bold">Description :</span>
            </label>
            <textarea class="textarea h-24 textarea-bordered textarea-accent"
                      placeholder="Write a description about the status"
                      v-model="form.description"></textarea>
            <small class="text-red-600 ml-2" v-if="errors.description">{{ errors.description[0] }}</small>
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
            <small class="text-red-600 ml-2" v-if="errors.categories">{{ errors.categories[0] }}</small>
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
            <small class="text-red-600 ml-2" v-if="errors.languages">{{ errors.languages[0] }}</small>
          </div>

          <div class="mt-4 p-6" v-if="uploading">
            <progress class="progress progress-accent" :value="uploadPercentage" max="100"></progress>
          </div>

          <div class="form-control mt-8 mb-3" :class="uploading ? 'disabledArea' : ''">
            <button type="submit" class="btn btn-primary">
              <svg-loading height="16px" width="16px" class="mr-1" v-if="uploading"/>
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
        url: null,
        title: null,
        description: null,
        image: null,
        categories: [],
        languages: [],
      },
      uploading: false,
      uploadPercentage: 0,
      errors: {},
      limit_left: null,
      categories: [],
      languages: [],
    }
  },
  methods: {
    getUploadInfo() {
      axios.get('/upload-info')
          .then(({data}) => {
            this.limit_left = data.limit_left;
            this.categories = data.categories;
            this.languages = data.languages;
          })
          .catch((error) => {
            console.log('Something went wrong')
          })
    },
    uploadYoutube() {
      this.uploading = true;
      axios.post('/upload-youtube', this.form, {
        onUploadProgress: function (progressEvent) {
          this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }.bind(this)
      })
          .then(({data}) => {
            this.uploading = false;
            this.uploadPercentage = 0;
            this.form = {url: null, title: null, description: null, image: null, categories: [], languages: []};
            this.getUploadInfo();
            this.$refs.select.value = null;
            this.$noti('success', '' + data.message + '')
          })
          .catch((error) => {
            this.uploading = false;
            this.uploadPercentage = 0;
            this.errors = error.response.data.errors;
            this.$noti('error', 'Something Went Wrong')
          })
    },
    imageChange(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = event => {
        this.form.image = event.target.result
      };
      reader.readAsDataURL(file);
    },
  },
}
</script>

<style scoped>

</style>