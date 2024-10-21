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
        <p class="text-center text-primary-content">Sign in to your account</p>
        <form @submit.prevent="login">
          <div class="form-control mt-5">
            <label class="label">Username :</label>
            <input type="text" required autocomplete="username" class="input input-accent" v-model="form.username">
            <small class="text-red-600" v-if="errors.username">{{ errors.username[0] }}</small>
          </div>
          <div class="form-control mt-2">
            <label class="label">Password :</label>
            <input type="password" required autocomplete="password"  class="input input-accent" v-model="form.password">
            <small class="text-red-600" v-if="errors.password">{{ errors.password[0] }}</small>
          </div>
          <div class="form-control mt-2 text-right mx-2">
            <router-link to="/forget" class="link">Forgot Password?</router-link>
          </div>
          <div class="flex justify-center">
            <div class="form-control w-3/4 sm:w-2/3 mt-5">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <svg-loading height="16px" width="16px" class="mr-1" v-if="loading"/>
                Sign In
              </button>
            </div>
          </div>
        </form>
        <div class="form-control mt-4">
          <div class="flex flex-row space-x-2 items-center">
            <div>Don't have an account?</div>
            <router-link to="/register" class="link link-accent">Register Here</router-link>
          </div>
        </div>

      </div>
    </div>

  </main>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      sitename: this.$sitename,
      form: {
        username: null,
        password: null
      },
      errors: {},
      loading: false,
    }
  },
  mounted() {
    this.$Progress.finish();
  },
  methods: {
    ...mapActions({
      signIn: 'signIn'
    }),
    login() {
      this.loading = true;
      this.errors = {};
      this.signIn(this.form)
          .then(() => {
            this.loading = false;
            this.$noti('success', 'Login Successful !');
            this.$router.replace({name: 'home'})
          })
          .catch((error) => {
            this.loading = false;
            if (error.response.status === 401) {
              this.$noti('error', '' + error.response.data.error + ' !', 3000);
            } else if (error.response.status === 417) {
                localStorage.setItem('email', error.response.data.email);
                localStorage.setItem('username', error.response.data.username);
                this.$noti('error', 'Not Verified !', 3000);
                this.$router.replace({name: 'verify'})
            } else {
              this.loading = false;
              this.errors = error.response.data.errors
              this.$noti('error', 'Something Went Wrong !');
            }
          })
    }
  }
}
</script>
