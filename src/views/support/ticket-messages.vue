<template>
  <main v-if="isLoading">
    <content-placeholders :centered="true" :rounded="true">
      <content-placeholders-heading/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
    </content-placeholders>
  </main>
  <main v-else class="justify-center mx-auto w-full">
    <div class="card p-2 shadow-lg compact bg-base-100 mx-1">
      <div class="card p-2 pt-1 shadow-lg compact bg-base-100 mx-1">
        <div class="flex flex-col items-start space-y-1.5 mx-1 mt-2 mb-1">
          <div class="flex flex-row items-center space-x-2">
            <div class="font-semibold">Subject :</div>
            <div>{{ details.title }}</div>
          </div>
          <div class="flex flex-row items-center space-x-2">
            <div class="font-semibold">Date :</div>
            <div>{{ details.date | timeDate }}</div>
          </div>
        </div>
      </div>
      <div class="divider mb-0">Ticket Replies</div>
      <div
          id="container"
          ref="container"
          class="card rounded-t-none p-2 shadow-lg compact bg-base-100 mx-1 mt-1 h-52vh md:h-62vh"
          style="overflow-y: scroll" v-chat-scroll>
        <div>
          <div v-if="details.messages" class="flex flex-col space-y-1">
            <div v-for="(message, index) in details.messages" :key="index">
              <div v-if="message.is_staff === 1" class="flex justify-start">
                <div class="flex flex-col space-y-0.5 w-4/5 md:w-3/4">
                  <div class="text-right mx-2">
                    <span class="text-xs font-thin">{{
                        message.created_at | timeDate
                      }}</span>
                  </div>
                  <div class="indicator w-full items-center ml-2">
                    <div
                        class="indicator-item indicator-bottom indicator-start mb-3"
                    >
                      <i class="bx bxs-left-arrow text-success bx-xs"></i>
                    </div>
                    <div
                        class="card w-full rounded p-2 shadow-lg compact bg-success mx-1 mt-1"
                    >
                      {{ message.message }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="message.is_staff === 0" class="flex justify-end">
                <div class="flex flex-col space-y-0.5 w-5/6 md:w-4/5">
                  <div class="text-left mx-2">
                    <span class="text-xs font-thin">{{
                        message.created_at | timeDate
                      }}</span>
                  </div>
                  <div class="indicator w-full items-center mr-2">
                    <div
                        class="indicator-item indicator-top indicator-end mt-4"
                    >
                      <i class="bx bxs-right-arrow text-info bx-xs"></i>
                    </div>
                    <div
                        class="card w-full rounded p-2 shadow-lg compact bg-info mx-1 mt-1"
                    >
                      {{ message.message }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="flex flex-col space-y-1 w-4/5 md:w-3/4">
              <div class="indicator w-full items-center ml-2">
                <div class="indicator-item indicator-middle indicator-start">
                  <i class="bx bxs-left-arrow text-success bx-xs"></i>
                </div>
                <div
                    class="card w-full rounded p-2 shadow-lg compact bg-success mx-1 mt-1"
                >
                  No Messages to show !
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
          v-if="details.active === 1"
          class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1"
      >
        <div class="flex flex-row items-center mx-1 mt-2 mb-1 rounded">
          <div class="flex-grow">
            <textarea
                v-model="message_text"
                class="textarea h-12 w-full textarea-bordered textarea-accent"
                placeholder="Write a comment..."
            ></textarea>
            <small v-if="errors.message" class="text-red-600">{{
                errors.message[0]
              }}</small>
          </div>
          <div class="ml-2">
            <button
                :disabled="submitting"
                class="btn btn-primary btn-sm py-2"
                type="submit"
                @click="sendMessage"
            >
              <svg-loading
                  v-if="submitting"
                  class="mr-1"
                  height="16px"
                  width="16px"
              />
              Reply
            </button>
          </div>
        </div>
      </div>

      <div
          v-if="details.active === 0"
          class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1"
      >
        <div class="text-center">
          <span class="m-1 px-3 py-2 bg-error font-bold"> Ticket Closed </span>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.getMessages();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      details: {
        active: null,
        messages: {},
      },
      message_text: null,
      errors: {},
      submitting: false,
      isLoading: false,
    };
  },
  methods: {
    getMessages() {
      this.isLoading = true;
      let code = this.$route.params.code;
      axios
          .get("/ticket-messages", {params: {code: code}})
          .then(({data}) => {
            this.details = data;
            this.isLoading = false;
            this.messageRead();
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.response.status === 404 || 401) {
              this.$router.replace({name: "notFound"});
            }
          });
    },
    refreshMessages() {
      let code = this.$route.params.code;
      axios
          .get("/ticket-messages", {params: {code: code}})
          .then(({data}) => {
            this.details = data;
            this.messageRead();
          })
          .catch((error) => {
            if (error.response.status === 404 || 401) {
              this.$router.replace({name: "notFound"});
            }
          });
    },
    sendMessage() {
      this.submitting = true;
      this.errors = {};
      let code = this.$route.params.code;
      axios
          .post("/ticket-reply", {code: code, message: this.message_text})
          .then(({data}) => {
            this.submitting = false;
            this.message_text = null;
            this.$noti("success", data.message);
            this.refreshMessages();
          })
          .catch((error) => {
            this.submitting = false;
            if (error.response.status === 406) {
              this.$noti("warning", error.response.data.message);
            } else {
              this.submitting = false;
              this.$noti("error", "Something Went Wrong !");
              this.errors = error.response.data.errors;
            }
          });
    },
    messageRead() {
      let code = this.$route.params.code;
      axios.patch("/ticket-view", {code: code});
    },
  },
};
</script>
<style scoped>
#container {
  scroll-behavior: smooth;
}
</style>
