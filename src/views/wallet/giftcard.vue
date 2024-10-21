<template>
  <main class="justify-center mx-auto w-full ">
    <div class="flex flex-col space-x-0 md:space-x-2 md:flex-row md:items-start mx-1">
      <!-- Options -->
      <div class="basis-full md:basis-1/2">
        <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2">
          <main v-if="isLoading">
            <content-placeholders :centered="true" :rounded="true">
              <content-placeholders-heading/>
              <content-placeholders-heading/>
              <content-placeholders-heading/>
              <content-placeholders-heading/>
              <content-placeholders-heading/>
              <content-placeholders-heading/>
            </content-placeholders>
          </main>
          <main v-else>
            <div class="divider">Gird Card Options</div>
            <small class="text-red-600" v-if="errors.method_id">{{ errors.method_id[0] }}</small>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div v-for="(method, index) in methods" :key="index">
                <div
                    class="card p-2 shadow-lg compact bg-accent mx-1 clickable"
                    @click="getMethodInfo(method.slug)"
                >
                  <div class="card">
                    <div class="indicator">
                      <div v-if="method.id === info.method.id" class="indicator-item pt-10 pr-10"><i
                          class="bx bxs-check-circle bx-sm text-neutral"></i></div>
                      <figure>
                        <img
                            :alt="method.name"
                            :src="url + method.logo"
                        />
                      </figure>
                    </div>
                    <div class="justify-center items-center p-2">
                      <div class="flex flex-row space-x-1 items-center">
                        <div class="font-semibold text-base">{{ method.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
      <!-- Details -->
      <div class="basis-full md:basis-1/2 w-full">
        <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2">
          <div class="divider">Withdrawal Details</div>
          <form class="mb-4" @submit.prevent="withdrawBalance">
            <main class="mt-4 mb-3" v-if="infoLoading">
              <content-placeholders :centered="true" :rounded="true">
                <content-placeholders-heading/>
                <content-placeholders-heading/>
              </content-placeholders>
            </main>
            <main v-else>
              <div class="form-control font-bold mt-5">
                <div class="flex flex-row justify-between items-center">
                  <div>Payment Method :</div>
                  <div v-if="info.method.name" class="flex flex-row space-x-1 items-center">
                    <div>{{ info.method.name }}</div>
                  </div>
                  <div v-else class="text-sm">Choose A Option First</div>
                </div>
              </div>
              <div class="form-control font-bold mt-2">
                <div class="flex flex-row justify-between items-center">
                  <div>Price :</div>
                  <div v-if="info.method.min_amount" class="flex flex-row space-x-1 items-center">
                    <coin-svg height="15px" width="15px"/>
                    <div>{{ info.method.min_amount }}</div>
                  </div>
                  <div v-else class="text-sm">Choose A Option First</div>
                </div>
              </div>
              <div v-if="info.balance" class="form-control font-bold mt-2">
                <div class="flex flex-row justify-between items-center">
                  <div>Your Balance :</div>
                  <div class="flex flex-row space-x-1 items-center">
                    <coin-svg height="15px" width="15px"/>
                    <div>{{ info.balance }}</div>
                  </div>
                </div>
              </div>
            </main>

            <div class="form-control font-bold">
              <label class="label">
                <span class="label-text font-bold">Your Payment Info : </span>
              </label>
              <textarea class="textarea h-24 textarea-bordered textarea-accent" placeholder="Payment account info.."
                        v-model="form.info"></textarea>
              <small class="text-red-600" v-if="errors.info">{{ errors.info[0] }}</small>
            </div>


            <div class="form-control mt-6 mx-2 md:mx-4">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <svg-loading height="16px" width="16px" class="mr-1" v-if="loading"/>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = 'Buy ' + this.$route.params.slug + ' | ' + this.$sitename;
  },
  created() {
    this.getPaymentMethods();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      form: {
        info: null,
        method_id: '',
      },
      errors: {},
      methods: {},
      info: {
        balance: null,
        commission: null,
        method: {
          id: null,
          name: null,
          min_amount: null,
          slug: null,
        }
      },
      loading: false,
      isLoading: false,
      infoLoading: false,
    }
  },
  methods: {
    getPaymentMethods() {
      this.isLoading = true;
      let slug = this.$route.params.slug
      axios.get('/withdraw-method-options', {params: {slug: slug}})
          .then(({data}) => {
            this.methods = data;
            this.isLoading = false
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.response.status === 404) {
              this.$router.replace({name: 'notFound'})
            }
          })
    },
    getMethodInfo(slug) {
      this.infoLoading = true;
      axios.get('/withdraw-info', {params: {slug: slug}})
          .then(({data}) => {
            this.info = data
            this.form.method_id = data.method.id
            this.infoLoading = false
          })
    },
    withdrawBalance() {
      this.loading = true;
      this.errors = {};
      axios.post('/buy-gift-card', this.form)
          .then(() => {
            this.$noti('success', 'Submitted Successfully');
            this.form = {};
            this.info = {balance: null, commission: null, method: {id: null, name: null, min_amount: null, slug: null}};
            this.loading = false;
          })
          .catch((error) => {
            this.errors = error.response.data.errors
            this.$noti('error', 'Something Went Wrong !');
            this.loading = false;
          })
    },

  }

}
</script>
