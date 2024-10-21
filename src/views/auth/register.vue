<template>
  <main class="justify-center sm:mx-auto sm:w-full sm:max-w-md">

    <div class="card w-full mt-4 shadow-2xl bg-base-200">
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
        <p class="text-center text-primary-content">Register a new account</p>
        <form @submit.prevent="register">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div class="form-control mt-5">
              <input type="text" placeholder="Full Name" class="input input-accent" v-model="form.name">
              <small class="text-red-600" v-if="errors.name">{{ errors.name[0] }}</small>
            </div>
            <div class="form-control mt-2 md:mt-5">
              <input type="text" placeholder="Username" class="input input-accent" v-model="form.username">
              <small class="text-red-600" v-if="errors.username">{{ errors.username[0] }}</small>
            </div>
            <div class="form-control mt-2">
              <input type="email" placeholder="Email Address" class="input input-accent" v-model="form.email">
              <small class="text-red-600" v-if="errors.email">{{ errors.email[0] }}</small>
            </div>
            <div class="form-control mt-2">
              <select class="select select-bordered select-accent" v-model="form.gender">
                <option value="" disabled="disabled" selected>Select Gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Others</option>
              </select>
              <small class="text-red-600" v-if="errors.gender">{{ errors.gender[0] }}</small>
            </div>
            <div class="form-control mt-2">
              <input type="password" placeholder="Password" class="input input-accent" v-model="form.password">
              <small class="text-red-600" v-if="errors.password">{{ errors.password[0] }}</small>
            </div>
            <div class="form-control mt-2">
              <input type="password" placeholder="Confirm Password" class="input input-accent"
                     v-model="form.password_confirmation">
              <small class="text-red-600" v-if="errors.password_confirmation">{{
                  errors.password_confirmation[0]
                }}</small>
            </div>

            <div class="form-control mt-2">
              <select class="select select-accent" v-model="form.country_code">
                <option value="" disabled="disabled" selected="selected">Choose Country</option>
                <option :value="country.code" v-for="country in countries">{{
                    country.name
                  }}
                </option>
              </select>
              <small class="text-red-600" v-if="errors.country_code">{{ errors.country_code[0] }}</small>
            </div>
            <div class="form-control mt-2">
              <input type="text" placeholder="Mobile Number" class="input input-accent" v-model="form.phone">
              <small class="text-red-600" v-if="errors.phone">{{ errors.phone[0] }}</small>
            </div>

            <div class="form-control mt-2">
              <input type="text" placeholder="(optional) Referrer Username" class="input input-accent"
                     v-model="form.referrer_id">
              <small class="text-red-600" v-if="errors.referrer_id">{{ errors.referrer_id[0] }}</small>
            </div>

          </div>

          <div class="flex justify-center">
            <div class="form-control w-1/2 mt-6">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <svg-loading height="16px" width="16px" class="mr-1" v-if="loading"/>
                Sign Up
              </button>
            </div>
          </div>
        </form>
        <div class="form-control mt-5">
          <div class="flex flex-row space-x-2 items-center">
            <div>Already have an account?</div>
            <router-link to="/login" class="link link-accent">Login Here</router-link>
          </div>
        </div>
      </div>

    </div>

  </main>
</template>

<script>
export default {
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  created() {
    this.$axios.get('/country-list')
        .then(({data}) => (this.countries = data))
  },
  mounted() {
    this.$Progress.finish();
    if (this.$route.query.ref) {
      this.form.referrer_id = this.$route.query.ref;
    }
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      sitename: this.$sitename,
      form: {
        name: null,
        username: null,
        email: null,
        phone: null,
        referrer_id: null,
        gender: "",
        country_code: "",
        password: null,
        password_confirmation: null,
      },
      errors: {},
      countries: {},
      loading: false,
    }
  },

  methods: {
    register() {
      this.loading = true;
      this.errors = {};
      this.$axios.post('/register', this.form)
          .then(({data}) => {
            this.loading = false;
            this.$noti('success', 'Registration Successful');
            if (data.next) {
              this.$router.replace({name: 'login'})
            } else {
              localStorage.setItem('email', this.form.email)
              localStorage.setItem('username', this.form.username)
              this.$router.replace({name: 'verify'})
            }
          })
          .catch((error) => {
            this.loading = false;
            this.errors = error.response.data.errors
            this.$noti('error', 'Something Went Wrong !');
          })
    }
  }
}
</script>
