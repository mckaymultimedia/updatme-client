<template xmlns="http://www.w3.org/1999/html">
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
        <p class="text-center text-primary-content">We've sent a verification code to <span
            class="font-bold">{{ form.email }}</span> . Please enter that code to verify your account. <br><small>(Please check spam if not arrived in inbox)</small></p>
        <div>
          <div class="form-control mt-5">
            <input type="text" placeholder="Verification Code" class="input input-accent" v-model="form.code">
            <small class="text-red-600" v-if="errors.email">{{ errors.email[0] }}</small>
            <small class="text-red-600" v-if="errors.code">{{ errors.code[0] }}</small>
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" :disabled="loading" @click.prevent="verify">
              <svg-loading height="16px" width="16px" class="mr-1" v-if="loading"/>
              Verify Account
            </button>
          </div>
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-accent" :disabled="codeLoading" @click.prevent="resendCode">
              <svg-loading height="16px" width="16px" class="mr-1" v-if="codeLoading"/>
              Resend Code
            </button>
          </div>

        </div>

        <div class="divider divide-base-300 text-base-100">OR</div>
        <div class="form-control">
          <div>
            <router-link class="btn w-full btn-secondary" to="/login"> ← Sign In</router-link>
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
    if (localStorage.getItem('email') != 'undefined') {
      this.form.email = localStorage.getItem('email');
    }
    if (localStorage.getItem('username') != 'undefined') {
      this.form.username = localStorage.getItem('username');
    }
  },
  mounted() {
    this.$Progress.finish();
    if (!localStorage.getItem('username')) {
      this.$router.replace('login');
    }
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      sitename: this.$sitename,
      form: {
        email: 'your email address',
        username: '',
        code: null,
      },
      errors: {},
      loading: false,
      codeLoading: false,
    }
  },
  methods: {
    verify() {
      this.loading = true;
      this.errors = {};
      this.$axios.post('/verify', this.form)
          .then(() => {
            this.loading = false;
            this.$noti('success', 'Verification Successful');
            if (localStorage.getItem('username')) {
              localStorage.removeItem('username');
            }
            if (localStorage.getItem('email')) {
              localStorage.removeItem('email');
            }
            this.$router.replace({name: 'login'});
          })
          .catch((error) => {
            this.loading = false;
            if (error.response.status === 422) {
              this.errors = error.response.data.errors;
              this.$noti('error', 'Something Went Wrong !', 3000);
            } else {
              let err = error.response.data.error;
              this.$noti('error', '' + err + '', 3000);
            }
          })
    },
    resendCode() {
      this.codeLoading = true;
      this.errors = {};
      this.$axios.post('/resend', {username: this.form.username})
          .then(() => {
            this.codeLoading = false;
            this.$noti('success', 'Resend Successful', 2000);
          })
          .catch((error) => {
            this.codeLoading = false;
            if (error.response.status === 422) {
              this.errors = error.response.data.errors;
              this.$noti('error', 'Something Went Wrong !', 3000);
            } else {
              let err = error.response.data.error;
              this.$noti('error', '' + err + '', 3000);
            }
          })
    }
  }

}
</script>
