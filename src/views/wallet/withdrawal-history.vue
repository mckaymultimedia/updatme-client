<template>
  <main class="mx-2 my-4">
    <main v-if="infoLoading">
      <content-placeholders :centered="true" :rounded="true">
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
      </content-placeholders>
    </main>
    <main v-else>
      <div
          class="grid p-4 py-6 shadow-xl bg-base-100 rounded-box place-items-center w-full"
      >
        <div class="flex flex-col items-center justify-center">
          <div class="flex flex-col items-center content-center">
            <div class="stat-title text-sm">Total Withdraw</div>
            <div class="stat-value text-4xl mt-4">
              <div class="flex flex-row space-x-2 items-center">
                <div>{{ info.currency.symbol }}</div>
                <div>{{ parseFloat(lifetime).toFixed(4) }}</div>
              </div>
            </div>
          </div>
          <div class="stat-value text-lg mt-2">
            <div class="flex flex-row space-x-2 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ info.lifetime }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="divider">Withdrawal History</div>

      <main>

        <div v-if="withdrawalsData.length">

          <div v-for="(withdraw, index) in withdrawalsData" :key="index">
            <div
                class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2 clickable"
                @click="clickAction(withdraw)"
            >
              <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
                <div class="flex-1">
                  <div class="flex-row items-center space-x-3 card mt-1 mb-2">
                    <div class="avatar">
                      <div
                          class="rounded-full w-10 h-10 shadow clickable"
                      >
                        <img v-if="withdraw.method.logo" :src="url + '/' + withdraw.method.logo"/>
                        <img v-else :src="url + '/user/no-image.png'"/>
                      </div>
                    </div>
                    <div class="flex flex-col space-y-1.5 items-start">
                      <div class="font-bold text-lg ml-1 clickable">
                        {{ withdraw.method.name }}
                      </div>
                      <div>
                        <div v-if="withdraw.status === 0" class="badge badge-warning">Pending</div>
                        <div v-if="withdraw.status === 1" class="badge badge-success">Successful</div>
                        <div v-if="withdraw.status === 2" class="badge badge-error">Rejected</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex-0">
                  <div class="flex flex-col space-y-1.5 items-end">
                    <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
                      <div class="flex flex-row space-x-1 items-center">
                        <coin-svg height="17px" width="17px"/>
                        <div class="text-base font-semibold">
                          {{ withdraw.amount }}
                        </div>
                      </div>
                    </div>
                    <div class="badge badge-accent">{{ withdraw.date | fromNow }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div v-else>
          <div
              class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
          >
            <h2 class="font-bold text-lg">Nothing to Show</h2>
          </div>
        </div>

        <infinite-loading
            v-if="withdrawalsData.length"
            spinner="waveDots"
            @infinite="loadMoreWithdrawals"
        >
          <div slot="no-more">
            <div
                :class="withdrawalsData.length < 10 ? 'hidden' : ''"
                class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
                @click="scrollToTop"
            >
              <h2 class="font-bold text-lg">
                No More | Back to Top
                <i class="bx bx-up-arrow-alt font-bold text-lg"></i>
              </h2>
            </div>
          </div>
          <div slot="no-results">
            <div
                :class="withdrawalsData.length < 10 ? 'hidden' : ''"
                class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2"
                @click="scrollToTop"
            >
              <h2 class="font-bold text-lg">
                No Results Found | Back to Top
                <i class="bx bx-up-arrow-alt font-bold text-lg"></i>
              </h2>
            </div>
          </div>
        </infinite-loading>

      </main>

    </main>

    <modal :showing="showModal" :if-close="true" @update:modal="showModal = $event">

      <div v-if="showModal" class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
        <div class="divider">Withdrawal Details</div>

        <div class="form-control font-bold mt-3">
          <div class="flex flex-row justify-between items-center">
            <div>Method Name :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div>{{ methodInfo.method.name }}</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Amount :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ methodInfo.amount }}</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Status :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div v-if="methodInfo.status === 0" class="badge badge-warning">Pending</div>
              <div v-if="methodInfo.status === 1" class="badge badge-success">Successful</div>
              <div v-if="methodInfo.status === 2" class="badge badge-error">Rejected</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Date :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div class="text-sm">{{ methodInfo.created_at | dateFormat }}</div>
            </div>
          </div>
        </div>

        <div v-if="methodInfo.status === 2 && methodInfo.reject_note" class="form-control font-bold mt-2">
          <div class="flex flex-col items-start">
            <div>Reject Note :</div>
            <div class="flex flex-row space-x-1 items-center">
              <p class="text-sm font-thin ml-2 text-error">{{ methodInfo.reject_note }}</p>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2 mb-3">
          <div class="flex flex-col items-start">
            <div>Payment Details :</div>
            <div class="flex flex-row space-x-1 items-center">
              <p class="text-sm font-thin ml-2">{{ methodInfo.details }}</p>
            </div>
          </div>
        </div>

      </div>
    </modal>

  </main>
</template>

<script>
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";
import modal from "../../components/modal";

export default {
  components: {InfiniteLoading, modal},
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  created() {
    this.getInfo();
    this.getWithdrawals();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      infoLoading: false,
      isLoading: false,
      info: {
        lifetime: 0,
        currency: {},
      },
      withdrawalsData: [],
      CP: 1,
      LP: 1,
      methodInfo: {},
      showModal: false,
      errors: {}
    };
  },
  computed: {
    lifetime() {
      if (this.info.lifetime) {
        return this.info.lifetime / this.info.currency.rate;
      } else {
        return "00";
      }
    },
  },
  methods: {
    getInfo() {
      this.infoLoading = true;
      axios.get("/withdrawals-info")
          .then(({data}) => {
            this.info = data;
            this.infoLoading = false;
          })
          .catch((error) => {
            this.infoLoading = false;
            this.$noti("error", "Something went wrong");
          });
    },
    getWithdrawals() {
      this.isLoading = true;
      axios.get("/withdrawals", {
        params: {page: 1},
      })
          .then(({data}) => {
            this.withdrawalsData = data.data;
            this.LP = data.last_page;
            if (data.data.length) {
              this.CP += 1;
            }
            this.isLoading = false;
          })
          .catch((error) => {
            this.isLoading = false;
            this.errors = error.response.data.error;
          });
    },
    loadMoreWithdrawals($state) {
      if (this.CP > this.LP) {
        $state.complete();
      } else {
        if (this.CP === 1) {
          this.CP += 1;
        }
        axios.get("/withdrawals", {
          params: {
            page: this.CP,
          },
        })
            .then(({data}) => {
              if (data.data.length) {
                this.withdrawalsData.push(...data.data);
                this.LP = data.last_page;
                this.CP += 1;
                $state.loaded();
              } else {
                $state.complete();
              }
            });
      }
    },
    clickAction(data) {
      try {
        this.methodInfo = data;
      } finally {
        this.showModal = true;
      }
    },
    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>
