<template>
  <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
    <div class="divider">Choose Languages</div>
    <div v-if="infoLoading">
      <content-placeholders :rounded="true" :centered="true">
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
        <content-placeholders-heading/>
      </content-placeholders>
    </div>
    <div v-else>
      <div class="form-control mt-1 mb-5">
        <label class="label">
          <span class="label-text font-bold">Languages :</span>
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div class="mx-1" v-for="language in languagesData" :key="language.id">
            <div class="flex flex-row space-x-1.5 items-start">
              <div>
                <input type="checkbox" checked="checked" class="checkbox checkbox-accent" :value="language.id"
                        v-model="languages">
              </div>
              <div class="label-text ml-1 md:ml-2">{{ language.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-control mt-5 mb-3" :class="isUpdating ? 'disabledArea' : ''">
        <button type="submit" class="btn btn-primary" @click.prevent="updateLanguages">
          <svg-loading height="16px" width="16px" class="mr-1" v-if="isUpdating"/>
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.getLanguages();
  },
  data() {
    return {
      infoLoading: false,
      languagesData:[],
      languages:[],
      isUpdating: false,
    }
  },
  methods: {
    getLanguages() {
      this.infoLoading = true;
      axios.get('/languages')
          .then(({data}) => {
            this.languagesData = data.lang;
            this.languages = data.u_lang;
            this.infoLoading = false;
          })
          .catch(()=>{
            this.infoLoading = false;
          })
    },
    updateLanguages(){
      this.isUpdating = true;
      axios.post('/languages',{languages: this.languages})
          .then(()=>{
            this.isUpdating = false;
            this.$noti('success','Language updated');
            this.close();
          })
          .catch(()=>{
            this.isUpdating = false;
            this.$noti('error','Something went wrong')
          })
    },
    close() {
        this.$emit('update:status', false)
    }
  },
}
</script>

<style scoped></style>