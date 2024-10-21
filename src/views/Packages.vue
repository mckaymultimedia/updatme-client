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
      <div class="grid p-4 py-6 shadow-xl bg-base-100 rounded-box place-items-center w-full">
        <div class="flex flex-col items-center justify-center">
          <div class="flex flex-col items-center content-center">
            <div class="stat-title text-sm">My Package</div>
            <div class="stat-value text-4xl mt-3">
              <div>{{ my_package.title }}</div>
            </div>
          </div>
          <div class="mt-1">
            <div class="font-semibold text-base mt-4">
              <div class="flex flex-row space-x-2 items-center">
                <div class="text-opacity-75">End Date :</div>
                <div v-if="end_date">{{ end_date | timeDate }}</div>
                <div v-else>Lifetime</div>
              </div>
            </div>
          </div>
          <div class="mt-1">
            <div class="text-sm mt-4 text-center px-2 md:px-4">
              NB: Package will automatically renew at the end date. Please make sure to keep enough funds available. If
              you don't have enough funds then you'll be downgraded to the free package.
            </div>
          </div>
        </div>
      </div>

      <div class="divider">Available Packages</div>
      <div v-for="(pkg, index) in packages" :key="index">
        <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2 clickable"
             @click="pkgClickAction(pkg)">
          <div v-if="pkg.id === selected.id" class="absolute top-0.5 right-1">
            <div class="pb-0.5 px-2 rounded-b-box text-sm bg-primary text-primary-content">selected</div>
          </div>
          <div class="flex-row items-center space-x-2.5 card mx-2 md:mx-4 p-1">
            <div class="flex-1">
              <div class="flex-row items-center space-x-3 mt-1 mb-2">
                <div class="flex flex-col space-y-1.5 items-start">
                  <div class="font-bold text-left">
                    <div class="flex flex-col space-y-2 items-start">
                      <div>
                        <div class="text-xl">
                          {{ pkg.title }}
                        </div>
                      </div>
                      <div>
                        <div v-if="pkg.description && pkg.description.length < 80">
                          {{ pkg.description }}
                        </div>
                        <div v-else>
                          {{ pkg.description.substring(0, 80) + "..." }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-0">
              <div class="flex-row items-center space-x-2 card mt-1 mb-2">
                <div class="flex flex-row space-x-1 items-center">
                  <div class="text-2xl font-semibold">
                    {{ symbol }}
                  </div>
                  <div class="text-3xl font-semibold">
                    {{ pkg.price }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center mx-1 py-3">
        <template>
          <div v-if="selected.id === my_package.id" class="btn w-2/3 md:w-1/2"
               :class="my_package.id === 1 ? 'btn-active btn-disabled' : 'btn-primary'"
               @click="()=>{this.modalType = 3; this.showModal = true}">Extend Package
          </div>
          <template v-else>
            <div v-if="my_package.price > selected.price" class="btn btn-primary w-2/3 md:w-1/2"
                 @click="()=>{this.modalType = 2; this.showModal = true}">Downgrade Package
            </div>
            <div v-else class="btn btn-primary w-2/3 md:w-1/2" @click="()=>{this.modalType = 1; this.showModal = true}">
              Upgrade Package
            </div>
          </template>
        </template>
      </div>

      <div class="divider">Package Details</div>
      <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2">

        <div class="grid p-4 py-6 place-items-center w-full">
          <div class="flex flex-col items-center justify-center">
            <div class="stat-value text-4xl mt-3">
              {{ selected.title }}
            </div>
            <div class="mt-1">
              <div class="text-lg mt-4">
                {{ selected.description }}
              </div>
            </div>
          </div>
        </div>

        <div class="divider">Daily Limit</div>
        <div class="flex flex-col space-y-2 font-semibold mx-1 md:mx-2">
          <div class="flex flex-row space-x-2 justify-between">
            <div>Status Limit :</div>
            <div>{{ selected.daily_limit == 0 ? 'Unlimited' : selected.daily_limit }}</div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>View Limit :</div>
            <div>{{ selected.view_limit == 0 ? 'Unlimited' : selected.view_limit }}</div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Like Limit :</div>
            <div>{{ selected.like_limit == 0 ? 'Unlimited' : selected.like_limit }}</div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Comment Limit :</div>
            <div>{{ selected.comment_limit == 0 ? 'Unlimited' : selected.comment_limit }}</div>
          </div>
        </div>

        <div class="divider">Image Points</div>
        <div class="flex flex-col space-y-2 font-semibold mx-1 md:mx-2">
          <div class="flex flex-row space-x-2 justify-between">
            <div>Add :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.add_image }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>View :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.view_image }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Like :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.like_image }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Comment :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.comment_image }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author View :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_view_image }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author Like :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_like_image }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author Comment :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_comment_image }}</div>
            </div>
          </div>
        </div>

        <div class="divider">Video Points</div>
        <div class="flex flex-col space-y-2 font-semibold mx-1 md:mx-2">
          <div class="flex flex-row space-x-2 justify-between">
            <div>Add :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.add_video }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>View :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.view_video }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Like :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.like_video }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Comment :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.comment_video }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author View :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_view_video }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author Like :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_like_video }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author Comment :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_comment_video }}</div>
            </div>
          </div>
        </div>

        <div class="divider">YouTube Points</div>
        <div class="flex flex-col space-y-2 font-semibold mx-1 md:mx-2">
          <div class="flex flex-row space-x-2 justify-between">
            <div>Add :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.add_youtube }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>View :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.view_youtube }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Like :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.like_youtube }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Comment :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.comment_youtube }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author View :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_view_youtube }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author Like :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_like_youtube }}</div>
            </div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Author Comment :</div>
            <div class="flex flex-row space-x-1 items-center">
              <coin-svg height="15px" width="15px"/>
              <div>{{ selected.author_comment_youtube }}</div>
            </div>
          </div>
          <div class="font-normal text-sm py-2 px-1">
            NB: Author points will only be applied to yourself.
          </div>
        </div>


      </div>

    </main>

    <modal :if-close="true" :showing="showModal" @update:modal="showModal = $event">
      <div v-if="showModal" class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
        <div v-if="modalType === 1" class="divider">Upgrade Package</div>
        <div v-if="modalType === 2" class="divider">Downgrade Package</div>
        <div v-if="modalType === 3" class="divider">Extend Package</div>
        <div class="flex flex-col space-y-2 font-semibold py-3 px-1 md:px-2">
          <div class="flex flex-row space-x-2 justify-between">
            <div>Package Name :</div>
            <div>{{ selected.title }}</div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Price :</div>
            <div>{{ symbol }} {{ selected.price }}</div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Discount :</div>
            <div>- {{ symbol }} {{ discountPrice }}</div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Your Fund :</div>
            <div>{{ symbol }} {{ fund }}</div>
          </div>
          <div class="flex flex-row space-x-2 justify-between">
            <div>Total Amount :</div>
            <div>{{ symbol }} {{ totalPrice }}</div>
          </div>
          <div class="font-normal text-sm pt-2"> If you're upgrading from a paid package then you'll get a refund and
            amount will be added as discount. If you're downgrading you won't get any refund.
          </div>
        </div>
        <div class="form-control mt-5 mb-3">
          <div class="flex flex-row space-x-5 justify-center">
            <button :disabled="isUpdating" class="btn btn-outline" @click="showModal = false">Cancel</button>
            <button :disabled="isUpdating" class="btn btn-primary" @click="updatePackage">
              <svg-loading v-if="isUpdating" class="mr-1" height="16px" width="16px"/>
              {{ modalType === 1 ? 'Upgrade' : modalType === 2 ? 'Downgrade' : 'Extend' }}
            </button>
          </div>

        </div>
      </div>
    </modal>

  </main>
</template>

<script>
import axios from "axios";
import moment from "moment";

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
  computed: {
    symbol() {
      return this.$store.state.siteInfo.c_symbol;
    },
    discountPrice() {
      if (this.end_date && this.modalType === 1) {
        let end = moment.utc(this.end_date);
        let today = moment.utc();
        let left = end.diff(today, 'hours');
        let hourly_price = this.my_package.price / 720;
        return (hourly_price * left).toFixed(2);
      } else {
        return 0;
      }
    },
    totalPrice() {
      return (this.selected.price - this.discountPrice).toFixed(2);
    }
  },
  data() {
    return {
      moment,
      url: this.$config.FILE_URL,
      infoLoading: false,
      packages: [],
      my_package: {},
      p_id: null,
      end_date: null,
      fund: 0,
      selected: {},
      modalType: 1,
      showModal: false,
      isUpdating: false
    };
  },
  methods: {
    async getInfo() {
      this.infoLoading = true;
      await this.getPackages();
    },
    getPackages() {
      axios
          .get("/packages")
          .then(({data}) => {
            this.packages = data.packages;
            this.p_id = data.p_id;
            this.end_date = data.end_date;
            this.fund = data.fund;
            this.my_package = data.packages.find(x => x.id == data.p_id);
            this.selected = this.my_package;
            this.infoLoading = false;
          })
          .catch(() => {
            this.infoLoading = false;
            this.$noti("error", "Something went wrong");
          });
    },
    async updatePackage() {
      this.isUpdating = true;
      let id = this.selected.id;
      try {
        let r = await axios.post('/update-package', {id: id});
        this.isUpdating = false;
        this.$noti('success', r.data.message);
        this.getPackages();
        this.showModal = false;
      } catch (e) {
        this.isUpdating = false;
        this.$noti('error', e.response.data.message);
      }
    },
    pkgClickAction(pkg) {
      this.selected = pkg;
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
