<template>
  <main class="justify-center mx-auto sm:w-4/5 md:w-3/4 lg:w-4/6">

    <div class="w-full shadow-2xl">

      <div class="card-body pt-0">
        <form @submit.prevent="changePassword">

          <div class="form-control mt-5">
            <label class="label">
              <span class="label-text font-bold">Current Password</span>
            </label>
            <input type="password" placeholder="Current Password" class="input input-accent"
                   v-model="form.current_password">
            <small class="text-red-600" v-if="errors.current_password">{{ errors.current_password }}</small>
          </div>
          <div class="form-control mt-5">
            <label class="label">
              <span class="label-text font-bold">New Password</span>
            </label>
            <input type="password" placeholder="New Password" class="input input-accent" v-model="form.password">
            <small class="text-red-600" v-if="errors.password">{{ errors.password[0] }}</small>
          </div>
          <div class="form-control mt-5">
            <label class="label">
              <span class="label-text font-bold">Confirm Password</span>
            </label>
            <input type="password" placeholder="Confirm Password" class="input input-accent"
                   v-model="form.password_confirmation">
            <small class="text-red-600" v-if="errors.password_confirmation">{{
                errors.password_confirmation[0]
              }}</small>
          </div>
          <div class="p-6 card bordered">
            <div class="form-control">
              <label class="cursor-pointer label">
                <span class="label-text">Logout from all sessions</span>
                <input type="checkbox" class="checkbox checkbox-accent" v-model="form.check">
              </label>
            </div>
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

  </main>
</template>

<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  mounted() {
    this.$Progress.finish()
  },
  data() {
    return {
      form: {
        current_password: null,
        password: null,
        password_confirmation: null,
        check: false,
      },
      errors: {},
      loading: false,
    }
  },
  methods: {
    changePassword() {
      this.loading = true;
      this.errors = {};
      axios.patch('/change-password', this.form)
          .then(() => {
            this.loading = false;
            this.$noti('success', 'Updated Successfully');
            if (this.form.check) {
              axios.post('/all-logout')
                  .then(() => {
                    this.$store.dispatch('clearData').then(() => this.$router.push({name: 'login'}))
                  })
            }
            this.password = {};
          })
          .catch((error) => {
            if (error.response.status === 403) {
              this.loading = false;
              this.$noti('error', 'Password Invalid');
              this.errors = {current_password: 'Current Password Invalid'}
            } else {
              this.loading = false;
              this.$noti('error', 'Something Went Wrong !');
              this.errors = error.response.data.errors
            }
          })
    }
  },
}
</script>

<style scoped>

</style>