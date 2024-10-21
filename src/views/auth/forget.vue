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
        <p class="text-center text-primary-content" v-html="infoText" v-if="completed"></p>
        <p class="text-center text-primary-content" v-html="infoText" v-else></p>

        <div v-if="!completed">

          <div class="form-control mt-5" v-if="!mailSent">
            <input type="text" placeholder="Your Username" class="input input-accent" v-model="form.username">
            <small class="text-red-600" v-if="errors.username">{{ errors.username[0] }}</small>
          </div>

          <div class="form-control mt-5" v-if="mailSent">
            <input type="number" placeholder="Verification Code" class="input input-accent" v-model.number="form.code">
            <small class="text-red-600" v-if="errors.code">{{ errors.code[0] }}</small>
          </div>

          <div class="form-control mt-6" v-if="!mailSent">
            <button type="submit" class="btn btn-primary" :disabled="loading" @click.prevent="sendCode">
              <svg-loading height="16px" width="16px" class="mr-1" v-if="loading"/>
              Send Code
            </button>
          </div>
          <div class="form-control mt-6" v-if="mailSent">
            <button type="submit" class="btn btn-primary" :disabled="resetLoading" @click.prevent="resetPassword">
              <svg-loading height="16px" width="16px" class="mr-1" v-if="resetLoading"/>
              Reset Password
            </button>
          </div>

        </div>
        <div class="divider divide-base-300 text-base-100">OR</div>
        <div class="form-control">
          <div>
            <router-link class="btn w-full btn-secondary" to="/login">← Sign In</router-link>
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
  data() {
    return {
      url: this.$config.FILE_URL,
      sitename: this.$sitename,
      form: {
        username: null,
        code: null,
      },
      errors: {},
      loading: false,
      resetLoading: false,
      mailSent: false,
      completed: false,
      infoText: 'Enter your username to receive a verification code.',
    }
  },
  mounted() {
    this.$Progress.finish();
  },
  methods: {
    sendCode() {
      this.loading = true;
      let username = this.form.username;
      this.errors = {};
      this.$axios.post('/forget', {username: username})
          .then(({data}) => {
            this.loading = false;
            this.mailSent = true;
            localStorage.setItem('username', username);
            this.infoText = data.message;
            this.$noti('success', 'Code has been sent', 3000);
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
    resetPassword() {
      this.resetLoading = true;
      let username = localStorage.getItem('username');
      this.errors = {};
      this.$axios.post('/reset-password', {username: username, code: this.form.code})
          .then(({data}) => {
            this.resetLoading = false;
            this.infoText = data.message;
            this.$noti('success', 'Password Reset Successful', 3000);
            localStorage.removeItem('username')
            this.completed = true;
          })
          .catch((error) => {
            this.resetLoading = false;
            if (error.response.status === 422) {
              this.errors = error.response.data.errors;
              this.$noti('error', 'Something Went Wrong !', 3000);
            } else {
              let err = error.response.data.error;
              this.$noti('error', '' + err + '', 3000);
            }
          })
    },
  }

}
</script>
