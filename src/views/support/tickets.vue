<template>
  <main class="justify-center mx-auto md:w-5/6">

    <div class="mx-2 mt-3">
      <div class="flex flex-row w-full justify-between">
        <div
            :class="formType === 1 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="formType = 1"
        >
          Support Tickets
        </div>
        <div
            :class="formType === 2 ? 'tab-active' : ''"
            class="flex-grow tab tab-bordered"
            @click="formType = 2"
        >
          Create Ticket
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

            <div class="flex flex-col mt-6" v-if="ticketsData.length">

              <div v-for="(ticket, index) in ticketsData" :key="index">
                <div
                    class="card w-full p-2 shadow-lg compact text-center bg-base-100 mr-1 mb-2 clickable"
                    @click="clickAction(ticket)"
                >
                  <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
                    <div class="flex-1">
                      <div class="flex flex-col space-y-1.5 items-start">
                        <div class="font-bold text-lg ml-1 text-left">
                          <h1 v-if="ticket.title && ticket.title.length < 80">
                            {{ ticket.title }}
                          </h1>
                          <h1 v-if="ticket.title && ticket.title.length > 80">
                            {{ ticket.title.substring(0, 80) + "..." }}
                          </h1>
                        </div>
                        <div class="flex flex-row space-x-1 items-center">
                          <div>Status :</div>
                          <div>
                            <div v-if="ticket.active === 0" class="badge badge-error">Closed</div>
                            <div v-if="ticket.active === 1" class="badge badge-info">Active</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex-0">
                      <div class="flex flex-col space-y-1.5 items-end">
                        <div class="flex-row items-center space-x-2.5 card mt-1 mb-2">
                          <div class="flex flex-row space-x-1 items-center">
                            <div>Staff :</div>
                            <div class="text-xs">
                              <span v-if="ticket.staff_status === 0">Unseen</span>
                              <span v-if="ticket.staff_status === 1">Seen</span>
                              <span v-if="ticket.staff_status === 2">Replied</span>
                            </div>
                          </div>
                        </div>
                        <div class="flex flex-row space-x-1 items-center">
                          <div class="badge badge-accent text-xs">{{ ticket.created_at | dateFormat }}</div>
                        </div>
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
                v-if="ticketsData.length"
                spinner="waveDots"
                @infinite="loadMoreTickets"
            >
              <div slot="no-more">
                <div
                    :class="ticketsData.length < 10 ? 'hidden' : ''"
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
                    :class="ticketsData.length < 10 ? 'hidden' : ''"
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
          <form @submit.prevent="createTicket">

            <div class="form-control mt-5">
              <label class="label">
                <span class="label-text font-bold">Subject : </span>
              </label>
              <input type="text" placeholder="Ticket Subject" class="input input-accent" v-model="form.title">
              <small class="text-red-600" v-if="errors.title">{{ errors.title[0] }}</small>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-bold">Message : </span>
              </label>
              <textarea class="textarea h-24 textarea-bordered textarea-accent" placeholder="Describe full issue.."
                        v-model="form.message"></textarea>
              <small class="text-red-600" v-if="errors.message">{{ errors.message[0] }}</small>
            </div>

            <div class="form-control mt-8">
              <button type="submit" class="btn btn-primary" :disabled="isUpdating">
                <svg-loading height="16px" width="16px" class="mr-1" v-if="isUpdating"/>
                Create Ticket
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>

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
    this.getTickets();
  },
  mounted() {
    this.$Progress.finish()
  },
  data() {
    return {
      formType: 1,
      ticketsData: [],
      CP: 1,
      LP: 1,
      form: {
        title: null,
        message: null,
      },
      isUpdating: false,
      errors: {},
      infoLoading: false,
    }
  },
  methods: {
    createTicket() {
      this.isUpdating = true;
      this.errors = {};
      axios.post('/create-ticket', this.form)
          .then(({data}) => {
            this.isUpdating = false;
            this.$noti('success', data.message);
            this.form = {title: '', message: ''};
            this.getTickets();
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
    getTickets() {
      this.infoLoading = true;
      axios.get("/support-tickets", {
        params: {page: 1},
      })
          .then(({data}) => {
            this.ticketsData = data.data;
            this.LP = data.last_page;
            if (data.data.length) {
              this.CP += 1;
            }
            this.infoLoading = false;
          })
          .catch((error) => {
            this.infoLoading = false;
            this.errors = error.response.data.error;
          });
    },
    loadMoreTickets($state) {
      if (this.CP > this.LP) {
        $state.complete();
      } else {
        if (this.CP === 1) {
          this.CP += 1;
        }
        axios.get("/support-tickets", {
          params: {
            page: this.CP,
          },
        })
            .then(({data}) => {
              if (data.data.length) {
                this.ticketsData.push(...data.data);
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
      this.$router.push({name: 'ticket-details', params: {code: data.code}})
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