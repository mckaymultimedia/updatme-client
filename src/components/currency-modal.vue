<template>
  <div class="card p-2 shadow-lg compact bg-base-100 mx-1 mt-1">
    <div class="divider">Choose Currency</div>
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
          <span class="label-text font-bold">Currencies :</span>
        </label>
        <div class="grid grid-cols-1 mx-2">
          <select class="select select-accent" v-model="currency">
            <option value="" disabled="disabled" selected="selected">Choose Currency</option>
            <option :value="currency.name" v-for="currency in currencies">{{
                currency.name
              }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-control mt-5 mb-3" :class="isUpdating ? 'disabledArea' : ''">
        <button type="submit" class="btn btn-primary" @click.prevent="updateCurrencies">
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
    this.getCurrencies();
  },
  data() {
    return {
      infoLoading: false,
      currencies: [],
      currency: '',
      isUpdating: false,
    }
  },
  methods: {
    getCurrencies() {
      this.infoLoading = true;
      axios.get('/currencies')
          .then(({data}) => {
            this.currencies = data.list;
            let c = data.currency;
            if (c) {
              this.currency = c;
            }
            this.infoLoading = false;
          })
          .catch(() => {
            this.infoLoading = false;
          })
    },
    updateCurrencies() {
      this.isUpdating = true;
      axios.post('/currency', {currency: this.currency})
          .then(() => {
            this.isUpdating = false;
            this.$noti('success', 'Currency updated');
            this.close();
          })
          .catch(() => {
            this.isUpdating = false;
            this.$noti('error', 'Something went wrong')
          })
    },
    close() {
      this.$emit('update:currency', false)
    }
  },
}
</script>

<style scoped></style>