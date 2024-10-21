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
            <div class="divider">Deposit Methods</div>
            <small class="text-red-600" v-if="errors.method_id">{{ errors.method_id[0] }}</small>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div v-for="(method, index) in methods.data" :key="index" v-if="method.manual == 0">
                <div
                    class="card p-2 shadow-lg compact bg-accent mx-1 clickable"
                    @click="getMethodInfo(method.id)"
                >
                  <div class="card">
                    <div class="indicator">
                      <div v-if="method.id === method_info.id" class="indicator-item pt-10 pr-10"><i
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

              <div v-if="methods.manual == 1">
                <div
                    class="card p-2 shadow-lg compact bg-accent mx-1 clickable"
                    @click="toggleManual"
                >
                  <div class="card">
                    <div class="indicator">
                      <div v-if="showManual" class="indicator-item pt-10 pr-10"><i
                          class="bx bxs-check-circle bx-sm text-neutral"></i></div>
                      <figure>
                        <img
                            alt="Manual Image"
                            :src="url + '/deposit-method/manual.jpg'"
                        />
                      </figure>
                    </div>
                    <div class="justify-center items-center p-2">
                      <div class="flex flex-row space-x-1 items-center">
                        <div class="font-semibold text-base">Manual Payments</div>
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
          <div class="divider">Deposit Details</div>
          <form class="mb-4">
            <main class="mt-4 mb-3" v-if="infoLoading">
              <content-placeholders :centered="true" :rounded="true">
                <content-placeholders-heading/>
                <content-placeholders-heading/>
              </content-placeholders>
            </main>
            <main v-else>

              <div class="form-control font-bold mt-5" v-if="showManual">
                <label class="label">
                  <span class="label-text font-bold">Manual Methods</span>
                </label>
                <select class="select select-accent" v-model="form.method_id"
                        @change="getMethodInfo($event.target.value)">
                  <option value="" disabled="disabled" selected="selected">Choose Method</option>
                  <option :value="method.id" v-for="method in methods.data" v-if="method.manual == 1">
                    {{ method.name }}
                  </option>
                </select>
                <small class="text-red-600" v-if="errors.method_id">{{ errors.method_id[0] }}</small>
              </div>

              <div class="form-control font-bold mt-2">
                <div class="form-control font-bold mt-2" v-if="method_info.instructions">
                  <label class="label"><span class="label-text font-bold">Payment Method Instructions</span></label>
                  <div class="card p-2 shadow-lg compact bg-accent mx-1" v-html="method_info.instructions">
                    {{ method_info.instructions }}
                  </div>
                </div>
                <div class="form-control font-bold mt-2" v-if="method_info.min_amount">
                  <label class="label"><span class="label-text font-bold">Minimum Deposit Amount:</span></label>
                  <input type="text" class="input input-accent"
                         :value="minAmount" disabled>
                </div>
              </div>
              <div class="form-control font-bold mt-2">
                <label class="label"><span class="label-text font-bold">Amount:</span></label>
                <small class="text-red-600" v-if="errors.amount">{{ errors.amount[0] }}</small>
                <input type="number" placeholder="Enter Amount" class="input input-accent" v-model.number="form.amount">
              </div>
              <div class="form-control font-bold mt-2" v-if="showManual">
                <label class="label"><span class="label-text font-bold">Your Payment Info</span></label>
                <small class="text-red-600" v-if="errors.info">{{ errors.info[0] }}</small>
                <textarea placeholder="Enter details about your payment"
                          class="textarea h-24 textarea-bordered textarea-accent" v-model="form.info"></textarea>
              </div>
              <div class="form-control font-bold mt-2" v-if="method_info.id == 1">
                <label class="label"><span class="label-text font-bold">Card Info:</span></label>
                <small class="text-red-600" v-if="stripe.errorMessage">{{ stripe.errorMessage }}</small>
                <StripeElements
                    :stripe-key="stripe.stripeKey"
                    :instance-options="stripe.instanceOptions"
                    :elements-options="stripe.elementsOptions"
                    #default="{ elements }"
                    ref="elms"
                    v-if="refreshed"
                >
                  <StripeElement
                      type="card"
                      :elements="elements"
                      :options="stripe.cardOptions"
                      ref="card"
                  />
                </StripeElements>
              </div>

            </main>


            <div class="form-control mt-6 mx-2 md:mx-4">
              <button class="btn btn-primary" :disabled="loading || !method_info.id" @click.prevent="pay">
                <svg-loading height="16px" width="16px" class="mr-1" v-if="loading"/>
                {{ buttonText }}
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
import {StripeElements, StripeElement} from 'vue-stripe-elements-plus'

export default {
  components: {StripeElements, StripeElement},
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  created() {
    this.getPaymentMethods();
  },
  mounted() {
    this.$Progress.finish();
    let externalScript = document.createElement('script')
    externalScript.setAttribute('src', 'https://js.stripe.com/v3/')
    externalScript.setAttribute('id', 'stripeScript')
    document.head.appendChild(externalScript)
  },
  computed: {
    minAmount() {
      if (this.method_info.min_amount) {
        return this.methods.currency.symbol + ' ' + this.method_info.min_amount;
      } else {
        return '00';
      }
    },
    buttonText() {
      if (this.method_info.slug) {
        let slug = this.method_info.slug
        if (slug === 'stripe') {
          return 'Pay Now'
        } else {
          if (slug === 'mollie') {
            return 'Continue To Pay'
          } else {
            return 'Submit For Review'
          }
        }
      } else {
        return 'Select A Method';
      }
    },
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      stripe: {
        stripeKey: '',
        instanceOptions: {},
        elementsOptions: {},
        cardOptions: {
          value: {
            postalCode: ''
          },
        }
      },
      form: {
        amount: null,
        info: null,
        method_id: '',
      },
      errors: {},
      methods: {
        currency: {},
        manual: 0,
        stripeKey: ''
      },
      method_info: {
        id: null,
        slug: null,
        min_amount: null,
        instructions: null,
      },
      loading: false,
      refreshed: true,
      showManual: false,
      isLoading: false,
      infoLoading: false,
    }
  },
  methods: {
    getPaymentMethods() {
      this.isLoading = true;
      axios.get('/payment-methods')
          .then(({data}) => {
            this.methods = data;
            if (data.stripeKey) {
              this.stripe.stripeKey = data.stripeKey
            }
            this.isLoading = false
          })
    },
    getMethodInfo(id) {
      this.infoLoading = true;
      axios.get('/payment-methods-info', {params: {id: id}})
          .then(({data}) => {
            this.method_info = data;
            this.infoLoading = false;
            if (!this.method_info.manual) {
              this.showManual = false
            }
          })
    },
    pay() {
      let slug = this.method_info.slug
      if (slug === 'stripe') {
        this.payStripe();
      } else {
        if (slug === 'mollie') {
          this.payMollie();
        } else {
          this.addDeposit();
        }
      }
    },
    errorHandler(event) {
      this.stripe.errorMessage = event.error ? event.error.message : ''
    },
    async payStripe() {
      this.loading = true;
      const groupComponent = this.$refs.elms
      const cardComponent = this.$refs.card
      const cardElement = cardComponent.stripeElement
      groupComponent.instance.createToken(cardElement).then(result => {
        console.log(result.token)
        axios.post('/stripe-payment', {
          stripeToken: result.token.id,
          amount: this.form.amount,
          method_id: this.method_info.id
        })
            .then(() => {
              this.showSuccess();
              this.forceRerender();
              this.form = {amount: null, info: null, method_id: ''};
              this.loading = false;
            })
            .catch((error) => {
              this.loading = false;
              this.errors = error.response.data.errors
              this.showError();
            })
      })
    },
    payMollie() {
      this.loading = true;
      axios.post('/mollie-payment', {amount: this.form.amount, method_id: this.method_info.id})
          .then(({data}) => {
            this.loading = false;
            this.form = {amount: null, info: null, method_id: ''};
            window.location.href = data.url
          })
          .catch((error) => {
            this.loading = false;
            this.errors = error.response.data.errors;
            this.showError();
          })
    },
    forceRerender() {
      this.refreshed = false;
      this.$nextTick(() => {
        this.refreshed = true;
      })
    },
    toggleManual() {
      this.showManual = !this.showManual;
      this.method_info = {id: null, min_amount: null, instructions: null}
    },
    addDeposit() {
      this.loading = true;
      this.errors = {};
      axios.post('/submit-deposit', this.form)
          .then(() => {
            this.loading = false;
            this.showSuccess();
            this.form = {amount: null, info: null, method_id: ''};
            this.method_info = {};
          })
          .catch((error) => {
            this.loading = false;
            this.errors = error.response.data.errors
            this.showError();
          })
    },
    showSuccess() {
      this.$noti("success", "Successful");
    },
    showError() {
      this.$noti("error", "Something went wrong");
    },

  },
  destroyed() {
    document.head.removeChild(document.getElementById('stripeScript'));
  }

}
</script>
