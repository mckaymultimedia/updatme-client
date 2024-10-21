<template>

  <main class="justify-center mx-auto sm:w-4/5 md:w-3/4 lg:w-4/6">

    <div class="w-full shadow-2xl mt-3">

      <div class="card-body pt-0">
        <main v-if="isLoading">
          <content-placeholders :centered="true" :rounded="true">
            <content-placeholders-img/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
          </content-placeholders>
        </main>
        <main v-else>
          <form @submit.prevent="withdrawBalance">
            <div class="divider">Withdrawal Details</div>

            <div class="form-control font-bold mt-5">
              <div class="flex flex-row justify-between items-center">
                <div>Your Balance :</div>
                <div class="flex flex-row space-x-1 items-center">
                  <coin-svg height="15px" width="15px"/>
                  <div>{{ info.balance }}</div>
                </div>
              </div>
            </div>

            <div class="form-control font-bold mt-2">
              <div class="flex flex-row justify-between items-center">
                <div>Minimum Amount :</div>
                <div class="flex flex-row space-x-1 items-center">
                  <coin-svg height="15px" width="15px"/>
                  <div>{{ info.method.min_amount }}</div>
                </div>
              </div>
            </div>

            <div class="form-control font-bold mt-2">
              <div class="flex flex-row justify-between items-center">
                <div>Payment Method :</div>
                <div class="flex flex-row space-x-1 items-center">
                  <div>{{ info.method.name }}</div>
                </div>
              </div>
            </div>

            <div class="form-control font-bold">
              <label class="label">
                <span class="label-text font-bold">Amount : </span>
              </label>
              <input type="text" placeholder="Withdraw amount" class="input input-accent" v-model.number="form.amount"
                     @change="minAmount">
              <small class="text-red-600" v-if="errors.amount">{{ errors.amount[0] }}</small>
            </div>

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
        </main>
      </div>

    </div>

  </main>
</template>
<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = 'Withdraw by ' + this.$route.params.slug + ' | ' + this.$sitename;
  },
  created() {
    this.getMethodInfo();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      info: {
        balance: null,
        method: {
          min_amount: null
        }
      },
      form: {
        amount: null,
        info: null,
        method_id: '',
      },
      errors: {},
      loading: false,
      isLoading: false,
    }
  },
  methods: {
    getMethodInfo() {
      this.isLoading = true;
      let slug = this.$route.params.slug
      axios.get('/withdraw-info', {params: {slug: slug}})
          .then(({data}) => {
            this.info = data;
            this.form.method_id = data.method.id;
            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.response.status === 404) {
              this.$router.replace({name: 'notFound'})
            }
          })
    },
    withdrawBalance() {
      this.loading = true;
      this.errors = {};
      axios.post('/submit-withdraw', this.form)
          .then(() => {
            this.$noti('success', 'Submitted Successfully');
            this.form = {};
            this.getMethodInfo();
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            this.errors = error.response.data.errors
            this.$noti('error', 'Something Went Wrong !');
          })
    },
    minAmount() {
      this.errors = {};
      let a = parseFloat(this.info.balance);
      let b = parseFloat(this.form.amount);
      let c = parseFloat(this.info.method.min_amount);
      if (a < b) {
        this.errors = {
          amount: ['*Should be equal or greater than your balance']
        };
        this.$noti('error', 'insufficient Balance !');
      }
      if (b < c) {
        this.errors = {
          amount: ['*Should be equal or greater than minimum withdraw amount']
        };
        this.$noti('error', 'Something Went Wrong !');
      }
    }

  }

}
</script>