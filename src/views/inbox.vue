<template>
  <main v-if="isLoading">
    <content-placeholders :centered="true" :rounded="true">
      <content-placeholders-heading/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
    </content-placeholders>
  </main>
  <main v-else class="justify-center mx-auto w-full">
    <div
        id="container"
        ref="container"
        class="card rounded-t-none p-2 shadow-lg compact bg-base-100 mx-1 mt-1 h-78vh md:h-85vh"
        style="overflow-y: scroll" v-chat-scroll>
      <div class="divider">Messages</div>
      <div class="grid grid-cols-1 gap-2">
        <div v-if="messages.count > 0">
          <div v-for="(message,index) in messages.items" :key="index">
            <div class="flex flex-col space-y-1  w-4/5 md:w-3/4">
              <div class="text-right mx-2">
                <span class="text-xs font-thin">{{ message.created_at | timeDate }}</span>
              </div>
              <div class="indicator w-full items-center ml-2">
                <div class="indicator-item indicator-middle indicator-start"><i
                    class="bx bxs-left-arrow text-success bx-xs"></i></div>
                <div class="card w-full rounded p-2 shadow-lg compact bg-success mx-1 mt-1" v-html="message.message">

                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="flex flex-col space-y-1  w-4/5 md:w-3/4">
            <div class="indicator w-full items-center ml-2">
              <div class="indicator-item indicator-middle indicator-start"><i
                  class="bx bxs-left-arrow text-success bx-xs"></i></div>
              <div class="card w-full rounded p-2 shadow-lg compact bg-success mx-1 mt-1">
                No Messages to show !
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  beforeCreate() {
    document.title = this.$route.meta.title + " | " + this.$sitename;
  },
  created() {
    this.getMessages();
  },
  mounted() {
    this.$Progress.finish();
  },
  data() {
    return {
      messages: {
        count: 10,
        items: {},
      },
      errors: {},
      isLoading: false,
    };
  },
  methods: {
    getMessages() {
      this.isLoading = true;
      axios
          .get("/messages")
          .then(({data}) => {
            this.messages.items = data.messages;
            this.messages.count = data.total;
            this.isLoading = false;
            this.messageRead();
            this.$store.dispatch('clearUnread');
          })
          .catch((error) => {
            this.isLoading = false;
            this.errors = error;
          });
    },
    messageRead() {
      axios.patch("/message-seen");
    },
  },
};
</script>
<style scoped>
#container {
  scroll-behavior: smooth;
}
</style>