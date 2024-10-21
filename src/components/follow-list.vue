<template>
  <modal :showing="showModal" :if-close="true" @update:modal="showModal = $event">
    <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
      <div v-if="listType === 1" class="card-title">Follower List</div>
      <div v-if="listType === 2" class="card-title">Following List</div>
      <div class="card-body">
        <div v-if="listLoading">
          <content-placeholders :rounded="true" :centered="true">
            <content-placeholders-img/>
            <content-placeholders-heading/>
            <content-placeholders-heading/>
          </content-placeholders>
        </div>
        <div v-else>
          <div v-if="listType === 1">
            <div v-for="(u,index) in followerData" :key="index">
              <user-list :user="u"/>
            </div>

            <infinite-loading v-if="followerData.length" :identifier="listType" spinner="waveDots"
                              @infinite="loadMoreFollower">
              <div slot="no-more">
                <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2">
                  <h2 class="font-bold text-lg">No More Found
                  </h2>
                </div>
              </div>
              <div slot="no-results">
                <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2">
                  <h2 class="font-bold text-lg">No Results Found </h2>
                </div>
              </div>
            </infinite-loading>

          </div>

          <div v-if="listType === 2">
            <div v-for="(u,index) in followingData" :key="index">
              <user-list :user="u"/>
            </div>

            <infinite-loading v-if="followingData.length" :identifier="listType + 1" spinner="waveDots"
                              @infinite="loadMoreFollowing">
              <div slot="no-more">
                <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2">
                  <h2 class="font-bold text-lg">No More Result </h2>
                </div>
              </div>
              <div slot="no-results">
                <div class="card p-2 shadow-lg compact text-center bg-base-100 mx-1 mt-3 mb-2">
                  <h2 class="font-bold text-lg">No More Result </h2>
                </div>
              </div>
            </infinite-loading>

          </div>
        </div>

      </div>
    </div>
  </modal>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import modal from "./modal";
import userList from "./user-list";
import axios from "axios";

export default {
  props: {username: {type: String}},
  components: {InfiniteLoading, modal, userList},
  data() {
    return {
      followerData: {},
      followingData: {},
      showModal: false,
      listLoading: false,
      listType: 0,
      followerCP: 1,
      followingCP: 1,
      followerLP: 1,
      followingLP: 1,
    }
  },
  methods: {
    openModal(type) {
      try {
        if (type === 1) {
          this.listType = 1;
          this.followerCP = 1;
          this.followerLP = 1;
          this.followerData = {};
        } else if (type === 2) {
          this.listType = 2;
          this.followingCP = 1;
          this.followingLP = 1;
          this.followingData = {};
        }
      } finally {
        this.showModal = true;
        this.getListData();
      }
    },
    getListData() {
      let type = this.listType;
      this.listLoading = true;
      if (type === 1) {
        this.listLoading = true;
        let page = this.followerCP;
        axios.get('/follower-list', {params: {page: page, username: this.username}})
            .then(({data}) => {
              if (this.followerData.length) {
                this.followerData.push(...data.data)
              } else {
                this.followerData = data.data;
              }
              this.followerLP = data.last_page;
              if (data.data.length) {
                this.followerCP += 1;
              }
              this.listLoading = false;
            }).catch(() => {
          this.showModal = false;
          this.listLoading = false;
          this.$noti('error', 'Something went wrong')
        })
      } else if (type === 2) {
        this.listLoading = true;
        let page = this.followingCP;
        axios.get('/following-list', {params: {page: page, username: this.username}})
            .then(({data}) => {
              if (this.followingData.length) {
                this.followingData.push(...data.data)
              } else {
                this.followingData = data.data;
              }
              this.followingLP = data.last_page;
              if (data.data.length) {
                this.followingCP += 1;
              }
              this.listLoading = false;
            }).catch((error) => {
          this.showModal = false;
          this.listLoading = false;
          this.$noti('error', 'Something went wrong')
        })
      }
    },
    loadMoreFollower($state) {
      if (this.followerCP > this.followerLP) {
        $state.complete();
      } else {
        if (this.followerCP === 1) {
          this.followerCP += 1;
        }
        axios.get('/follower-list', {params: {page: this.followerCP, username: this.username}})
            .then(({data}) => {
              if (data.data.length) {
                this.followerData.push(...data.data);
                this.followerLP = data.last_page;
                this.followerCP += 1;
                $state.loaded();
              } else {
                $state.complete();
              }
            });
      }
    },
    loadMoreFollowing($state) {
      if (this.followingCP > this.followingLP) {
        $state.complete();
      } else {
        if (this.followingCP === 1) {
          this.followingCP += 1;
        }
        axios.get('/following-list', {params: {page: this.followingCP, username: this.username}})
            .then(({data}) => {
              if (data.data.length) {
                this.followingData.push(...data.data);
                this.followingLP = data.last_page;
                this.followingCP += 1;
                $state.loaded();
              } else {
                $state.complete();
              }
            });
      }
    },
  },
}
</script>

<style scoped>

</style>