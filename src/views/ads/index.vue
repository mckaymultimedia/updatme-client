<template>
  <main class="justify-center mx-auto md:w-5/6">

    <div class="mx-2 mt-3">
      <div class="flex flex-row w-full justify-between">
        <div
            :class="formType === 1 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="formType = 1"
        >
          My Ads
        </div>
        <div
            :class="formType === 2 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="formType = 2"
        >
          Create Ad
        </div>
      </div>
    </div>

    <div v-if="formType === 1">
      <div class="w-full shadow-2xl">
        <div class="card-body p-1 pb-6">
          <div class="mt-5" v-if="infoLoading">
            <content-placeholders :rounded="true" :centered="true">
              <content-placeholders-heading/>
              <content-placeholders-heading/>
              <content-placeholders-heading/>
              <content-placeholders-heading/>
              <content-placeholders-heading/>
            </content-placeholders>
          </div>
          <div v-else>

            <div class="mt-5" v-if="adsData.length">

              <div v-for="(ad, index) in adsData" :key="index">
                <div
                    class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mb-2 clickable"
                    @click="clickAction(ad)"
                >
                  <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
                    <div class="flex-1">
                      <div class="flex-row items-center space-x-3 card mt-1 mb-2">
                        <div class="avatar">
                          <div class="w-10 h-10 shadow clickable">
                            <img v-if="ad.image" :src="url + '/' + ad.image"/>
                            <img v-else :src="url + '/user/no-image.png'"/>
                          </div>
                        </div>
                        <div class="flex flex-col space-y-1.5 items-start">
                          <div class="font-bold text-lg ml-1 clickable">
                            <h1 v-if="ad.title && ad.title.length > 60">
                              {{ ad.title.substring(0, 60) + "..." }}
                            </h1>
                            <h1 v-else>
                              {{ ad.title }}
                            </h1>
                          </div>
                          <div>
                            <div v-if="ad.stat === 0" class="badge badge-warning">Pending</div>
                            <div v-if="ad.stat === 1" class="badge badge-success">Active</div>
                            <div v-if="ad.stat === 2" class="badge badge-info">Completed</div>
                            <div v-if="ad.stat === 3" class="badge badge-error">Rejected</div>
                            <div v-if="ad.stat === 4" class="badge badge-secondary">On Hold</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex-0">
                      <div class="flex flex-col space-y-1.5 items-end">
                        <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
                          <div class="flex flex-row space-x-1 items-center">
                            <coin-svg height="15px" width="15px"/>
                            <div class="text-base font-semibold">
                              {{ ad.cost }}
                            </div>
                          </div>
                        </div>
                        <div class="badge badge-accent">{{ ad.created_at | fromNow }}</div>
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
                v-if="adsData.length"
                spinner="waveDots"
                @infinite="loadMoreAds"
            >
              <div slot="no-more">
                <div
                    :class="adsData.length < 10 ? 'hidden' : ''"
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
                    :class="adsData.length < 10 ? 'hidden' : ''"
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

          </div>

        </div>

      </div>
    </div>

    <div v-if="formType === 2">
      <div class="pt-4 w-full shadow-2xl">

        <div class="card-body pt-0">
          <form @submit.prevent="createAd">

            <div class="form-control mt-5">
              <label class="label">
                <span class="label-text font-bold">Ad Type : </span>
              </label>
              <select class="select select-accent" v-model="form.ad_type" @change="resetForm">
                <option value="" disabled="disabled" selected="selected">Choose Type</option>
                <option value="1">Custom Ad</option>
                <option value="2">Boost Status</option>
              </select>
              <small class="text-red-600" v-if="errors.ad_type">{{ errors.ad_type[0] }}</small>
            </div>

            <div class="form-control" v-if="form.ad_type != ''">
              <label class="label">
                <span class="label-text font-bold">Ad Location : </span>
              </label>
              <select class="select select-accent" v-model="form.location" @change="locationAction">
                <option value="" disabled="disabled" selected="selected">Choose Location</option>
                <option value="0" v-if="form.ad_type != 2">Feed + Banner</option>
                <option value="1">Only In Feed</option>
                <option value="2" v-if="form.ad_type != 2">Only Banner</option>
              </select>
              <small class="text-red-600" v-if="errors.location">{{ errors.location[0] }}</small>
            </div>

            <section v-if="form.location != ''">

              <div class="form-control" v-if="form.ad_type == 2">
                <label class="label">
                  <span class="label-text font-bold">Status : </span>
                </label>
                <select class="select select-accent" v-model="form.status_id" @change="statusChange">
                  <option value="" disabled="disabled" selected="selected">Choose Status</option>
                  <option :value="status.id" v-for="status in statuses">{{
                      status.title.substring(0, 50)
                    }}
                  </option>
                </select>
                <small class="text-red-600" v-if="errors.status_id">{{ errors.status_id[0] }}</small>
              </div>

              <div class="form-control mt-4" v-if="form.ad_type == 2 && status_thumb">
                <div class="flex flex-wrap justify-center">
                  <div class="w-10/12 sm:w-8/12 px-4">
                    <img :src="url + status_thumb" alt="..."
                         class="rounded max-w-full h-auto align-middle border-none"/>
                  </div>
                </div>
              </div>

              <section v-if="form.ad_type == 1">


                <div class="form-control mt-3" v-if="form.location == 0 || form.location == 1">
                  <label class="label">
                    <span class="label-text font-bold">Feed Image <span class="text-xs">(500x281)</span> : </span>
                  </label>
                  <input type="file" accept=".jpg,.png,.jpeg,.heic" class="file" @change="feedImageChange">
                  <small class="text-red-600" v-if="errors.image">{{ errors.image[0] }}</small>
                </div>
                <div class="form-control mt-4" v-if="form.image">
                  <div class="flex flex-wrap justify-center">
                    <div class="w-8/12 sm:w-6/12 px-4">
                      <img :src="form.image" alt="..."
                           class="rounded max-w-full h-auto align-middle border-none"/>
                    </div>
                  </div>
                </div>

                <div class="form-control mt-3" v-if="form.location == 0 || form.location == 2">
                  <label class="label">
                    <span class="label-text font-bold">Banner Image <span class="text-xs">(320x50)</span> : </span>
                  </label>
                  <input type="file" accept=".jpg,.png,.jpeg,.heic" class="file" @change="bannerImageChange">
                  <small class="text-red-600" v-if="errors.banner">{{ errors.banner[0] }}</small>
                </div>
                <div class="form-control mt-4" v-if="form.banner">
                  <div class="flex flex-wrap justify-center">
                    <div class="w-8/12 sm:w-6/12 px-4">
                      <img :src="form.banner" alt="..."
                           class="rounded max-w-full h-auto align-middle border-none"
                           style="height: 50px; width: 320px;"/>
                    </div>
                  </div>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-bold">Title : </span>
                  </label>
                  <input type="text" placeholder="Ad Title" class="input input-accent" v-model="form.title">
                  <small class="text-red-600" v-if="errors.title">{{ errors.title[0] }}</small>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-bold">Url : </span>
                  </label>
                  <input type="text" placeholder="Action URL" class="input input-accent" v-model="form.url">
                  <small class="text-red-600" v-if="errors.url">{{ errors.url[0] }}</small>
                </div>

              </section>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-bold">Pricing Type : </span>
                </label>
                <select class="select select-accent" v-model="form.type">
                  <option value="" disabled="disabled" selected="selected">Choose Pricing Type</option>
                  <option value="1" v-if="adsInfo.type == 1 || adsInfo.type == 0">Pay Per View</option>
                  <option value="2" v-if="adsInfo.type == 2 || adsInfo.type == 0">Pay Per Day</option>
                </select>
                <small class="text-red-600" v-if="errors.type">{{ errors.type[0] }}</small>
              </div>

              <div class="form-control" v-if="form.type == 1">
                <label class="label">
                  <span class="label-text font-bold">Amount : </span>
                </label>
                <input type="number" placeholder="How many?" class="input input-accent" v-model="form.max_views">
                <small class="text-red-600" v-if="errors.max_views">{{ errors.max_views[0] }}</small>
              </div>

              <div class="form-control" v-if="form.type == 2">
                <label class="label">
                  <span class="label-text font-bold">Duration : </span>
                </label>
                <select class="select select-accent" v-model="form.days">
                  <option value="" disabled="disabled" selected="selected">Select days</option>
                  <option :value="n" v-for="n in adsInfo.ppd_max" v-if="n >= adsInfo.ppd_min">{{ n }} Days</option>
                </select>
                <small class="text-red-600" v-if="errors.type">{{ errors.type[0] }}</small>
              </div>

              <section v-if="form.type">

                <div class="form-control font-bold mt-4">
                  <div class="flex flex-row justify-between items-center">
                    <div>{{ adPriceTitle }} :</div>
                    <div class="flex flex-row space-x-1 items-center">
                      <coin-svg height="15px" width="15px"/>
                      <div>{{ adPrice }}</div>
                    </div>
                  </div>
                </div>
                <div class="form-control font-bold mt-2">
                  <div class="flex flex-row justify-between items-center">
                    <div>Min Amount :</div>
                    <div class="flex flex-row space-x-1 items-center">
                      <div>{{ parseInt(adMinAmount) }} {{ form.type == 1 ? 'views' : 'Days' }}</div>
                    </div>
                  </div>
                </div>
                <div class="form-control font-bold mt-2">
                  <div class="flex flex-row justify-between items-center">
                    <div>Max Amount :</div>
                    <div class="flex flex-row space-x-1 items-center">
                      <div>{{ parseInt(adMaxAmount) > 0 ? adMaxAmount : 'Unlimited' }}
                        {{ form.type == 1 ? 'views' : 'Days' }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-control font-bold mt-2">
                  <div class="flex flex-row justify-between items-center">
                    <div>Balance :</div>
                    <div class="flex flex-row space-x-1 items-center">
                      <coin-svg height="15px" width="15px"/>
                      <div>{{ fundBalance }} <span
                          class="text-xs">({{ adsInfo.currency.symbol + '' + adsInfo.balance }})</span></div>
                    </div>
                  </div>
                </div>
                <div class="form-control font-bold mt-4">
                  <div class="flex flex-row justify-between items-center">
                    <div>Total Price :</div>
                    <div class="flex flex-row space-x-1 items-center">
                      <coin-svg height="15px" width="15px"/>
                      <div>{{ TotalAmount }}</div>
                    </div>
                  </div>
                </div>

              </section>

            </section>

            <div class="form-control mt-8">
              <button type="submit" class="btn btn-primary" :disabled="isUpdating">
                <svg-loading height="16px" width="16px" class="mr-1" v-if="isUpdating"/>
                Create Ad
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>


    <modal :showing="showModal" :if-close="true" @update:modal="showModal = $event">

      <div v-if="showModal" class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
        <div class="divider">Advertisement Details</div>

        <div class="form-control font-bold mt-3">
          <div class="flex flex-row justify-between">
            <div class="mr-2">Title :</div>
            <div class="text-right text-sm" v-if="selectedInfo.title && selectedInfo.title.length > 80">
              {{ selectedInfo.title }}
            </div>
            <div v-else class="text-right">
              {{ selectedInfo.title }}
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Type :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div v-if="selectedInfo.type === 1">Pay Per View</div>
              <div v-if="selectedInfo.type === 2">Pay Per Day</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Location :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div v-if="selectedInfo.location === 0">Feed + Banner</div>
              <div v-if="selectedInfo.location === 1">In Feed</div>
              <div v-if="selectedInfo.location === 2">Banner</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2" v-if="selectedInfo.type === 1">
          <div class="flex flex-row justify-between items-center">
            <div>Amount :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div>{{ selectedInfo.max_views }} Views</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2" v-if="selectedInfo.type === 2">
          <div class="flex flex-row justify-between items-center">
            <div>Duration :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div>{{ selectedInfo.days }} Days</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2" v-if="selectedInfo.type === 2 && selectedInfo.expire_at">
          <div class="flex flex-row justify-between items-center">
            <div>Expire Date :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div>{{ selectedInfo.expire_at | fromNow }}</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Status :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div v-if="selectedInfo.stat === 0" class="badge badge-warning">Pending</div>
              <div v-if="selectedInfo.stat === 1" class="badge badge-success">Active</div>
              <div v-if="selectedInfo.stat === 2" class="badge badge-info">Completed</div>
              <div v-if="selectedInfo.stat === 3" class="badge badge-error">Rejected</div>
              <div v-if="selectedInfo.stat === 4" class="badge badge-secondary">On Hold</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Views :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div>{{ selectedInfo.views }}</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Clicks :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div>{{ selectedInfo.clicks }}</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2" v-if="selectedInfo.image">
          <div class="flex flex-col text-left">
            <div class="mb-2">Feed Image:</div>
            <div class="flex items-center">
              <div class="flex flex-wrap justify-center">
                <div class="w-8/12 sm:w-6/12 px-4">
                  <img :src="url + selectedInfo.image" :alt="selectedInfo.title"
                       class="rounded max-w-full h-auto align-middle border-none"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2" v-if="selectedInfo.banner">
          <div class="flex flex-col text-left">
            <div class="mb-2">Banner :</div>
            <div class="flex items-center">
              <div class="flex flex-wrap justify-center">
                <div class="w-8/12 sm:w-6/12 px-4">
                  <img :src="url + selectedInfo.banner" :alt="selectedInfo.title"
                       class="rounded max-w-full h-auto align-middle border-none"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2">
          <div class="flex flex-row justify-between items-center">
            <div>Url :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div v-if="selectedInfo.url">{{ selectedInfo.url }}</div>
              <div v-if="selectedInfo.status_id">Status</div>
              <div v-else>N/A</div>
            </div>
          </div>
        </div>

        <div class="form-control font-bold mt-2 mb-3">
          <div class="flex flex-row justify-between items-center">
            <div>Created :</div>
            <div class="flex flex-row space-x-1 items-center">
              <div class="text-sm">{{ selectedInfo.created_at | dateFormat }}</div>
            </div>
          </div>
        </div>

      </div>
    </modal>

  </main>
</template>

<script>
import {mapActions} from "vuex";
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  created() {
    this.getAdsInfo();
    this.getAds();
  },
  mounted() {
    this.$Progress.finish()
  },
  computed: {
    fundBalance() {
      if (this.adsInfo.currency.rate) {
        return (this.adsInfo.balance * this.adsInfo.currency.rate).toFixed()
      }
    },
    adPriceTitle() {
      if (this.form.type == 1) {
        return 'Price (1000 views)';
      } else if (this.form.type == 2) {
        return 'Price (24 Hours)';
      } else {
        return 'Select Ad Type';
      }
    },
    adPrice() {
      if (this.form.type == 1) {
        return this.adsInfo.ppv_price;
      } else if (this.form.type == 2) {
        return this.adsInfo.ppd_price;
      } else {
        return 'Select Ad Type';
      }
    },
    TotalAmount() {
      if (this.form.days > 0 || this.form.max_views > 0) {
        if (this.form.type == 1) {
          return this.adsInfo.ppv_price * this.form.max_views / 1000;
        } else if (this.form.type == 2) {
          return this.adsInfo.ppd_price * this.form.days;
        }
      } else {
        return '00';
      }
    },
    adMinAmount() {
      if (this.form.type == 1) {
        return this.adsInfo.ppv_min;
      } else if (this.form.type == 2) {
        return this.adsInfo.ppd_min;
      }
    },
    adMaxAmount() {
      if (this.form.type == 1) {
        return this.adsInfo.ppv_max;
      } else if (this.form.type == 2) {
        return this.adsInfo.ppd_max;
      }
    },
  },

  data() {
    return {
      url: this.$config.FILE_URL,
      formType: 1,
      adsInfo: {
        balance: null,
        currency: {},
        type: null,
        ppv_price: null,
        ppv_min: null,
        ppv_max: null,
        ppd_price: null,
        ppd_min: null,
        ppd_max: null,
      },
      statuses: {},
      adsData: [],
      CP: 1,
      LP: 1,
      selectedInfo: {},
      form: {
        title: null,
        type: '',
        location: '',
        image: null,
        banner: null,
        url: null,
        max_views: null,
        days: '',
        status_id: '',
        ad_type: '',
      },
      status_thumb: '',
      isLoading: false,
      statusLoading: false,
      isUpdating: false,
      errors: {},
      infoLoading: false,
      showModal: false,
    }
  },
  methods: {
    getAds() {
      this.isLoading = true;
      axios.get("/my-ads", {
        params: {page: 1},
      })
          .then(({data}) => {
            this.adsData = data.data;
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
    loadMoreAds($state) {
      if (this.CP > this.LP) {
        $state.complete();
      } else {
        if (this.CP === 1) {
          this.CP += 1;
        }
        axios.get("/my-ads", {
          params: {
            page: this.CP,
          },
        })
            .then(({data}) => {
              if (data.data.length) {
                this.adsData.push(...data.data);
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
        this.selectedInfo = data;
      } finally {
        this.showModal = true;
      }
    },
    statusChange(event) {
      let list = this.statuses;
      let id = event.target.value;
      this.status_thumb = list.find(status => status.id == id).thumbnail;
    },
    getAdsInfo() {
      this.isLoading = true;
      axios.get('/ads-info').then(({data}) => {
        this.adsInfo = data;
		this.adsInfo.ppd_min = parseInt(data.ppd_min);
        this.adsInfo.ppd_max = parseInt(data.ppd_max);
        this.isLoading = false;
      })
    },
    locationAction() {
      if (this.form.ad_type == 1) {
        if (this.form.location == 1) {
          this.form.banner = null;
        } else if (this.form.location == 2) {
          this.form.image = null;
        }
      }
      if (this.form.ad_type == 2 && this.form.location == 1) {
        this.statusLoading = true;
        axios.get('/ad-status').then(({data}) => {
          this.statuses = data;
          this.statusLoading = false;
        })
      }
    },
    resetForm(event) {
      this.form = {
        ad_type: event.target.value,
        title: null,
        type: '',
        location: '',
        image: null,
        banner: null,
        url: null,
        max_views: null,
        days: null,
        status_id: ''
      };
      this.status_thumb = '';
    },
    resetAll() {
      this.form = {
        ad_type: '',
        title: null,
        type: '',
        location: '',
        image: null,
        banner: null,
        url: null,
        max_views: null,
        days: null,
        status_id: ''
      };
      this.status_thumb = '';
    },
    feedImageChange(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = event => {
        this.form.image = event.target.result
      };
      reader.readAsDataURL(file);
    },
    bannerImageChange(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = event => {
        this.form.banner = event.target.result
      };
      reader.readAsDataURL(file);
    },
    createAd() {
      this.isUpdating = true;
      this.errors = {};
      axios.post('/create-ad', this.form)
          .then(({data}) => {
            this.isUpdating = false;
            this.$noti('success', data.message);
            this.resetAll();
            this.getAdsInfo();
          })
          .catch((error) => {
            this.isUpdating = false;
            if (error.response.status === 406) {
              this.$noti('warning', error.response.data.message);
            } else {
              this.errors = error.response.data.errors
              this.$noti('error', 'Something Went Wrong !');
            }
          })
    },

    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
  },
}
</script>

<style scoped>

</style>