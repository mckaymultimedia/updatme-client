<template>
  <main v-if="infoLoading">
    <content-placeholders :centered="true" :rounded="true">
      <content-placeholders-img/>
      <content-placeholders-heading/>
      <content-placeholders-heading/>
    </content-placeholders>
  </main>
  <main v-else class="justify-center mx-auto w-full">
    <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
      <figure>
        <img
            v-if="info.status.media.url && info.status.type === 'image'"
            :alt="info.status.title"
            :class="
            fullImage
              ? 'status-image-full'
              : 'status-image md:status-image-desktop'
          "
            :src="url + info.status.media.url"
            class="object-fill w-full rounded"
            @click="toggleHeight"
        />

        <vue-plyr v-if="info.status.media.url && info.status.type === 'video'">
          <video :data-poster="url + info.status.thumb" controls>
            <source
                :src="url + info.status.media.url"
                type="video/mp4"
            />
          </video>
        </vue-plyr>

        <vue-plyr
            v-if="info.status.media.url && info.status.type === 'youtube'"
        >
          <div
              :data-plyr-embed-id="info.status.media.ext"
              data-plyr-provider="youtube"
          ></div>
        </vue-plyr>
      </figure>

      <div class="p-2 pb-1">
        <h1 class="text-base font-medium">{{ info.status.title }}</h1>
      </div>
    </div>

    <div class="card p-2 compact bg-base-300 mx-1 mt-1">
      <div class="flex flex-row justify-between mx-1 rounded">
        <div></div>
        <div
            :class="!info.liked ? 'clickable' : ''"
            class="flex flex-col items-center"
        >
          <span v-if="info.liked"
          ><i class="bx bxs-heart bx-sm text-red-700"></i>
          </span>
          <span v-else @click="addLike"><i class="bx bx-heart bx-sm"></i></span>
          <span v-if="info.liked" class="text-md font-bold">Liked</span>
          <span v-else class="text-md font-bold" @click="addLike">Like</span>
        </div>
        <div class="divider divider-vertical"></div>
        <div
            class="flex flex-col items-center clickable"
            @click="toggleFavourite"
        >
          <span v-if="info.favourite"
          ><i class="bx bxs-star bx-sm text-warning"></i>
          </span>
          <span v-else><i class="bx bx-star bx-sm"></i></span>
          <span v-if="info.favourite" class="text-md font-bold">Favourite</span>
          <span v-else class="text-md font-bold">Favourite</span>
        </div>
        <div
            v-if="info.status.type !== 'youtube'"
            class="divider divider-vertical"
        ></div>
        <div
            v-if="info.status.type !== 'youtube'"
            class="flex flex-col items-center clickable"
            @click="downloadFile"
        >
          <span><i class="bx bxs-cloud-download bx-sm"></i> </span>
          <span class="text-md font-bold">Download</span>
        </div>
        <div class="divider divider-vertical"></div>
        <div
            class="flex flex-col items-center clickable"
            @click="showModal = !showModal"
        >
          <span><i class="bx bxs-flag-alt bx-sm"></i> </span>
          <span class="text-md font-bold">Report</span>
        </div>
        <div></div>
      </div>
    </div>

    <banner-ad v-if="showAd"/>

    <div v-if="info.status.user" class="card p-2 compact bg-base-100 mx-1 mt-1">
      <div class="flex-row items-center space-x-2.5 card px-1 pb-1">
        <div class="flex-1">
          <div class="flex-row items-center space-x-3 card mt-1 mb-1">
            <div class="avatar">
              <div
                  class="rounded-full w-10 h-10 shadow clickable"
                  @click="viewUser(info.status.user.username)"
              >
                <img
                    v-if="info.status.user.image"
                    :src="url + '/' + info.status.user.image"
                />
                <img v-else :src="url + '/user/no-image.png'"/>
              </div>
            </div>
            <div class="flex flex-col space-y-0 items-start">
              <div
                  class="flex flex-row space-x-1.5 items-center clickable"
                  @click="viewUser(info.status.user.username)"
              >
                <div class="font-bold text-lg ml-1">
                  {{ info.status.user.name }}
                </div>
                <div v-if="info.status.user.verified">
                  <verification-svg height="17px" width="17px"/>
                </div>
              </div>
              <div class="text-sm font-thin text-opacity-60 ml-1">
                @{{ info.status.user.username }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex-0">
          <div class="flex-row items-center space-x-2.5 card mt-1 mb-1">
            <router-link
                v-if="info.follow_type == 3"
                :to="{ name: 'profile' }"
                class="btn-warning btn-sm"
            >My Profile
            </router-link>
            <button
                v-if="info.follow_type == 4"
                class="btn-error btn-sm"
                @click="followUser"
            >
              Follow Back
            </button>
            <button
                v-if="info.follow_type == 2"
                class="btn-error btn-sm"
                @click="followUser"
            >
              Follow
            </button>
            <router-link
                v-if="info.follow_type == 1"
                :to="{
                name: 'public-profile',
                params: { username: info.status.user.username },
              }"
                class="btn-secondary btn-sm"
            >View Profile
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div
        class="collapse w-full border rounded-box border-base-300 collapse-arrow"
    >
      <input type="checkbox"/>
      <div class="collapse-title text-xl font-medium">Descriptions</div>
      <div class="collapse-content">
        <p v-if="info.status.description" class="ml-2" style="white-space: pre">
          {{ info.status.description }}
        </p>
      </div>
    </div>

    <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
      <div class="ml-1 text-xl font-medium">Comments</div>

      <template v-if="info.status.allow_comments === 0">
        <div class="card shadow compact justify-center items-center pb-0 mb-1">
          <div class="text-lg py-2"> Comments has been turned off !</div>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-row items-center mx-1 mt-2 mb-1 rounded">
          <div class="flex-grow">
          <textarea
              v-model="commentText"
              class="textarea h-12 w-full textarea-bordered textarea-accent"
              placeholder="Write a comment..."
          ></textarea>
            <small v-if="errors.comment" class="text-red-600">{{
                errors.comment[0]
              }}</small>
          </div>
          <div class="ml-2">
            <button
                :disabled="isSubmitting"
                class="btn btn-primary btn-sm py-2"
                type="submit"
                @click="addComment"
            >
              <svg-loading
                  v-if="isSubmitting"
                  class="mr-1"
                  height="16px"
                  width="16px"
              />
              Comment
            </button>
          </div>
        </div>

        <div v-for="(comment, index) in comments" :key="index">
          <div class="card shadow-lg compact side bg-base-100 pb-0 mb-1">
            <div class="flex flex-row items-center space-x-4 card-body pt-1 pb-0">
              <div class="flex flex-row items-center">
                <div class="avatar">
                  <div
                      class="rounded-full w-10 h-10 shadow clickable"
                      @click="viewUser(comment.user.username)"
                  >
                    <img
                        v-if="comment.user.image"
                        :alt="comment.user.name"
                        :src="url + '/' + comment.user.image"
                    />
                    <img
                        v-else
                        :alt="comment.user.name"
                        :src="url + '/user/no-image.png'"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex flex-row items-center">
                  <div
                      class="card-title text-sm clickable"
                      @click="viewUser(comment.user.username)"
                  >
                    {{ comment.user.name }}
                  </div>
                  <div v-if="comment.user.verified" class="ml-1">
                    <verification-svg height="13px" width="13px"/>
                  </div>
                  <div class="text-xs font-thin text-opacity-30 ml-2">
                    {{ comment.created_at | fromNow }}
                  </div>
                </div>
                <p class="text-base-content text-opacity-95">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <infinite-loading spinner="waveDots" @infinite="loadComments">
          <div slot="no-more">
            <div
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
      </template>

    </div>

    <modal
        :if-close="true"
        :showing="showModal"
        @update:modal="showModal = $event"
    >
      <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
        <div class="divider">Report Status</div>
        <div>
          <div class="form-control mt-1 mb-5">
            <label class="label">
              <span class="label-text font-bold">Report Message :</span>
            </label>
            <textarea
                v-model="reportText"
                class="textarea h-24 textarea-bordered textarea-accent"
                placeholder="Write about your issue."
            ></textarea>
          </div>
          <div
              :class="isReporting ? 'disabledArea' : ''"
              class="form-control mt-5 mb-3"
          >
            <button
                class="btn btn-primary"
                type="submit"
                @click.prevent="reportStatus"
            >
              <svg-loading
                  v-if="isReporting"
                  class="mr-1"
                  height="16px"
                  width="16px"
              />
              Report
            </button>
          </div>
        </div>
      </div>
    </modal>
  </main>
</template>

<script>
import axios from "axios";
import modal from "../../components/modal";
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {InfiniteLoading, modal},
  beforeCreate() {
    document.title = this.$route.meta.title + ' | ' + this.$sitename;
  },
  mounted() {
    this.getStatusInfo();
    this.$Progress.finish();
    this.showAd = true;
  },
  data() {
    return {
      url: this.$config.FILE_URL,
      info: {
        status: {
          title: null,
          allow_comments: null,
          media: {
            id: null,
            url: null,
            ext: null,
          },
        },
        liked: false,
        favourite: false,
        follow_type: 0,
      },
      comments: [],
      commentText: null,
      errors: {},
      infoLoading: false,
      isSubmitting: false,
      fullImage: false,
      showCommentModal: false,
      currentPage: 1,
      showModal: false,
      reportText: "",
      isReporting: false,
      showAd: false,
    };
  },
  methods: {
    getStatusInfo() {
      this.infoLoading = true;
      let code = this.$route.params.code;
      axios
          .get("/status", {params: {code: code}})
          .then(({data}) => {
            this.info = data;
            this.infoLoading = false;
            if (data.limit_type == 0) {
              this.$noti("warning", "View Limit Over");
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              this.$router.replace({name: "notFound"});
            }
            this.infoLoading = false;
          });
    },
    getComments() {
      let code = this.$route.params.code;
      axios
          .get("/comments", {params: {code: code, page: this.currentPage}})
          .then(({data}) => {
            this.comments = data.data;
          });
    },
    loadComments($state) {
      let code = this.$route.params.code;
      axios
          .get("/comments", {params: {code: code, page: this.currentPage}})
          .then(({data}) => {
            if (data.data.length) {
              if (this.comments.length) {
                this.comments.push(...data.data);
              } else {
                this.comments = data.data;
              }
              $state.loaded();
              this.currentPage += 1;
            } else {
              $state.complete();
            }
          });
    },
    addComment() {
      this.isSubmitting = true;
      let code = this.$route.params.code;
      axios
          .post("/comment", {code: code, comment: this.commentText})
          .then(() => {
            this.isSubmitting = false;
            this.commentText = null;
            this.currentPage = 1;
            this.getComments();
            this.$noti("success", "Comment Successful");
          })
          .catch((error) => {
            this.isSubmitting = false;
            this.errors = error.response.data.error;
            if (error.response.status === 400) {
              this.$noti("warning", "Comment Limit Over");
            } else {
              this.$noti("error", "Something went wrong");
            }
          });
    },
    followUser() {
      axios
          .post("/follow", {username: this.info.status.user.username})
          .then(({data}) => {
            if (data === 1) {
              this.info.follow_type = 1;
            }
          })
          .catch(() => {
            this.$noti("success", "Something went wrong");
          });
    },
    addLike() {
      let code = this.$route.params.code;
      axios
          .post("/like", {code: code, comment: this.commentText})
          .then(() => {
            this.info.liked = true;
          })
          .catch((error) => {
            if (error.response.status === 400) {
              this.$noti("warning", "Like Limit Over");
            } else {
              this.$noti("error", "Something went wrong");
            }
          });
    },
    toggleFavourite() {
      let code = this.$route.params.code;
      axios
          .post("/favourite", {code: code})
          .then(({data}) => {
            if (data === 1) {
              this.info.favourite = true;
            } else if (data === 2) {
              this.info.favourite = false;
            }
          })
          .catch(() => {
            this.$noti("success", "Something went wrong");
          });
    },
    viewUser(username) {
      let self = this.$store.getters.userInfo.username;
      if (self == username) {
        this.$router.push({name: "profile"});
      } else {
        this.$router.push({
          name: "public-profile",
          params: {username: username},
        });
      }
    },
    downloadFile() {
      let status = this.info.status;
      axios
          .get("/download?id=" + status.media.id, {responseType: "blob"})
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", status.title + "." + status.media.ext);
            document.body.appendChild(link);
            link.click();
          })
          .catch((error) => {
            this.$noti("success", "Something went wrong");
          });
    },
    reportStatus() {
      this.isReporting = true;
      axios
          .post("/report", {
            code: this.$route.params.code,
            text: this.reportText,
          })
          .then(() => {
            this.isReporting = false;
            this.$noti("warning", "Status Reported");
            this.showModal = false;
          })
          .catch(() => {
            this.isReporting = false;
            this.$noti("error", "Something went wrong");
          });
    },
    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    toggleHeight() {
      this.fullImage = !this.fullImage;
    },
  },
};
</script>

<style scoped></style>
