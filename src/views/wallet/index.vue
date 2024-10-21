<template>
  <main class="mx-2 my-4">
    <main v-if="infoLoading">
      <content-placeholders :centered="true" :rounded="true">
        <content-placeholders-img/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-img/>
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
            <div class="stat-title text-sm">Available Balance</div>
            <div class="stat-value text-4xl mt-4">
              <div class="flex flex-row space-x-2 items-center">
                <div>{{ info.currency.symbol }}</div>
                <div>{{ parseFloat(balance).toFixed(4) }}</div>
              </div>
            </div>
          </div>
          <div class="stat-value text-lg mt-2">
            <div class="flex flex-row space-x-2 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ info.balance }}</div>
            </div>
          </div>
          <div class="mt-5">
            <div class="flex flex-row items-center justify-evenly mx-2">
              <div class="text-base text-opacity-75">
                <div class="flex flex-row space-x-1 items-center">
                  <div>Lifetime =</div>
                  <div class="flex flex-row space-x-1 items-center">
                    <div>{{ info.currency.symbol }} {{ parseFloat(lifetimeBalance).toFixed(4) }}</div>
                  </div>
                </div>
              </div>
              <div class="divider divider-vertical"></div>
              <div class="text-base text-opacity-75">
                <div class="flex flex-row space-x-1 items-center">
                  <div>1 {{ info.currency.symbol }} =</div>
                  <div class="flex flex-row space-x-1 items-center">
                    <div>{{ info.currency.rate }}</div>
                    <coin-svg height="10px" width="10px"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div
          class="flex flex-row w-full shadow-xl bg-base-300 justify-evenly rounded-box text-center mt-1 px-2 py-2 md:px-4 md:py-4"
      >
        <router-link to="/withdrawals" class="clickable">
          <div class="text-lg font-extrabold">Withdrawal History</div>
        </router-link>
        <div class="divider divider-vertical"></div>
        <router-link to="/withdrawal-methods" class="clickable">
          <div class="text-lg font-extrabold">Withdraw Balance</div>
        </router-link>
      </div>

      <div class="divider">Latest Transactions</div>

      <div v-for="(trx, index) in transactions" :key="index">
        <div
            class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2" :class="trx.status ? 'clickable' : ''"
            @click="trxClickAction(trx)"
        >
          <div
              class="flex-row items-center space-x-2.5 card mx-2 md:mx-4 px-1 pb-1"
          >

            <div class="flex-1">
              <div class="flex-row items-center space-x-3 card mt-1 mb-2">
                <div class="avatar">
                  <div
                      class="rounded-full w-10 h-10 shadow"
                  >
                    <img v-if="trx.status && trx.status.thumb" :src="url + '/' + trx.status.thumb"/>
                    <img v-else :src="url + '/user/no-image.png'"/>
                  </div>
                </div>
                <div class="flex flex-col space-y-1.5 items-start">
                  <div class="font-bold text-left">
                    <h1
                        v-if="trx.details && trx.details.length < 80"
                        class="text-lg"
                    >
                      {{ trx.details }}
                    </h1>
                    <h1
                        v-if="trx.details && trx.details.length > 80"
                        class="text-lg"
                    >
                      {{ trx.details.substring(0, 80) + "..." }}
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-0">
              <div class="flex flex-col space-y-1.5 items-end">
                <div class="flex-row items-center space-x-2 card mt-1 mb-2">
                  <div class="flex flex-row space-x-1 items-center">
                    <coin-svg height="17px" width="17px"/>
                    <div class="text-base font-semibold">
                      {{ trx.points }}
                    </div>
                  </div>
                </div>
                <div class="badge badge-accent">{{ trx.created_at | fromNow }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </main>
</template>

<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  created() {
    this.getInfo();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      infoLoading: false,
      info: {
        balance: 0,
        lifetime: 0,
        currency: {},
      },
      transactions: {},
    };
  },
  computed: {
    balance() {
      if (this.info.balance) {
        return this.info.balance / this.info.currency.rate;
      } else {
        return "00";
      }
    },
    lifetimeBalance() {
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
      axios
          .get("/wallet-info")
          .then(({data}) => {
            this.info = data.info;
            this.transactions = data.transactions;
            this.infoLoading = false;
          })
          .catch((error) => {
            this.infoLoading = false;
            this.$noti("error", "Something went wrong");
          });
    },
    trxClickAction(trx) {
      if (trx.status_id && trx.status.code) {
        this.$router.push({name: 'view-status', params: {code: trx.status.code}});
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
