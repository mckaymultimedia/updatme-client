<template>
  <main class="justify-center mx-auto sm:w-4/5 md:w-3/4 lg:w-4/6">

    <div class="mx-2 mt-3">
      <div class="flex flex-row w-full justify-between">
        <div
            :class="formType === 1 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="formType = 1"
        >
          Edit Info
        </div>
        <div
            :class="formType === 2 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="formType = 2"
        >
          Update Image
        </div>
      </div>
    </div>

    <div v-if="formType === 1">
      <div class="w-full shadow-2xl">
        <div class="card-body pt-0">
          <div class="mt-5" v-if="infoLoading">
            <content-placeholders :rounded="true" :centered="true">
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

            <form @submit.prevent="updateInfo">

              <div class="form-control mt-5">
                <label class="label">
                  <span class="label-text font-bold">Full Name</span>
                </label>
                <input type="text" placeholder="Full Name" class="input input-accent" v-model="form.name">
                <small class="text-red-600" v-if="errors.name">{{ errors.name[0] }}</small>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Bio</span>
                </label>
                <textarea class="textarea h-24 textarea-bordered textarea-accent" placeholder="Add a Bio"
                          v-model="form.bio"></textarea>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Username</span>
                </label>
                <input type="text" placeholder="username" class="input input-accent" v-model="form.username" disabled>
                <span class="text-xs text-right pt-1 mr-1">Contact the support team to change your username</span>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Email</span>
                </label>
                <input type="email" placeholder="Email Address" class="input input-accent" v-model="form.email">
                <small class="text-red-600" v-if="errors.email">{{ errors.email[0] }}</small>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Country</span>
                </label>
                <select class="select select-bordered select-accent" disabled="disabled">
                  <option value="" disabled="disabled" selected="selected">{{ form.country_name }}</option>
                </select>
                <span class="text-xs text-right pt-1 mr-1">Contact the support team to change your country</span>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Phone Number</span>
                </label>
                <input type="text" placeholder="Mobile Number" class="input input-accent" v-model="form.phone">
                <small class="text-red-600" v-if="errors.phone">{{ errors.phone[0] }}</small>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Gender</span>
                </label>
                <select class="select select-bordered select-accent" v-model="form.gender">
                  <option value="" disabled="disabled" selected>Select Gender</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Others</option>
                </select>
                <small class="text-red-600" v-if="errors.gender">{{ errors.gender[0] }}</small>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Facebook</span>
                </label>
                <input type="text" placeholder="Facebook Username" class="input input-accent" v-model="form.fb">
                <small class="text-red-600" v-if="errors.fb">{{ errors.fb[0] }}</small>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Instagram</span>
                </label>
                <input type="text" placeholder="Instagram Username" class="input input-accent" v-model="form.ig">
                <small class="text-red-600" v-if="errors.ig">{{ errors.ig[0] }}</small>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">YouTube</span>
                </label>
                <input type="text" placeholder="YouTube Username" class="input input-accent" v-model="form.yt">
                <small class="text-red-600" v-if="errors.yt">{{ errors.yt[0] }}</small>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">TikTok</span>
                </label>
                <input type="text" placeholder="TikTok Username" class="input input-accent" v-model="form.tt">
                <small class="text-red-600" v-if="errors.tt">{{ errors.tt[0] }}</small>
              </div>
              <div class="form-control mt-2">
                <label class="label">
                  <span class="label-text font-bold">Twitter</span>
                </label>
                <input type="text" placeholder="Twitter Username" class="input input-accent" v-model="form.tw">
                <small class="text-red-600" v-if="errors.tw">{{ errors.tw[0] }}</small>
              </div>

              <div class="form-control mt-6">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <svg-loading height="16px" width="16px" class="mr-1" v-if="loading"/>
                  Update
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>

    <div v-if="formType === 2">
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
    </div>

  </main>
</template>

<script>
import {mapActions} from "vuex";
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  created() {
    this.getInfo();
  },
  mounted() {
    this.$Progress.finish()
  },
  data() {
    return {
      formType: 1,
      form: {
        name: null,
        username: null,
        email: null,
        phone: null,
        gender: "",
        country_name: null,
        bio: "",
        fb: "",
        ig: "",
        yt: "",
        tt: "",
        tw: "",
      },
      image: null,
      uploading: false,
      uploadPercentage: 0,
      errors: {},
      loading: false,
      infoLoading: false,
    }
  },
  methods: {
    ...mapActions({
      'updateUser': 'updateInfo'
    }),
    getInfo() {
      this.infoLoading = true;
      this.$axios.get('/edit-info')
          .then(({data}) => {
            this.form = data;
            this.infoLoading = false;
          })
    },
    updateInfo() {
      this.loading = true;
      this.errors = {};
      this.$axios.post('/edit-info', this.form)
          .then(() => {
            this.loading = false;
            this.updateUser();
            this.$noti('success', 'Info Updated')
          })
          .catch((error) => {
            this.loading = false;
            this.errors = error.response.data.errors
            this.$noti('error', 'Something Went Wrong')
          })
    },
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