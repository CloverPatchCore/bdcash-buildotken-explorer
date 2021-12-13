<template>
  <div class="home container">
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <v-gravatar :email="$route.params.address" />
              </figure>
            </div>
              <div class="media-content">
                <p class="title is-4" style="margin:0 0 0 0">Assets owned by</p>
                <p class="title is-6" style="margin:15px 0 0 0">{{ $route.params.address }}</p>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div v-for="sidechain in sidechains" v-bind:key="sidechain.address" style="margin-bottom:15px">
          <a :href="'/#/sidechain/' + sidechain.address + '/' + $route.params.address">
            <div class="card">
              <div class="card-content">
                <div class="media">
                <div class="media-left">
                  <figure class="image is-65x65">
                    <v-gravatar :email="sidechain.address" />
                  </figure>
                </div>
                  <div class="media-content">
                    <p class="title is-4" style="margin:0">{{ sidechain.name }}</p>
                    <p class="title is-5">{{ sidechain.address }}</p>
                    <p class="subtitle is-6" style="margin-bottom:0">issued by <b style="color:#000">{{ sidechain.owner }}</b></p>
                    <div style="position:absolute; top:8px; right:0 ;height:80px; padding:30px; text-align:right"><b style="color:#000">Balance</b><br>{{ sidechain.balance }} {{ sidechain.symbol }}</div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
let BDCashCore = require("@bdcash-protocol/core");

export default {
  name: 'Explorer',
  data() {
    return {
      bdcash: new BDCashCore(true),
      address: "",
      wallet: "",
      sidechains: [],
      isLogging: true,
      isLoading: true,
      searcher: ""
    };
  },
  computed: {
    filteredList() {
      return this.sidechains.filter(sidechains => {
        return sidechains.name.toLowerCase().includes(this.searcher.toLowerCase()) ||
          sidechains.address.toLowerCase().includes(this.searcher.toLowerCase())
      })
    }
  },
  async mounted() {
    const app = this;
    app.bdcash.staticnodes = true;
    app.wallet = await app.bdcash.importBrowserSID();
    app.wallet = await app.bdcash.returnDefaultIdentity();
    if (app.wallet.length > 0) {
      let SIDS = app.wallet.split(":");
      app.address = SIDS[0];
      let identity = await app.bdcash.returnIdentity(app.address);
      app.wallet = identity;
      app.isLogging = false;
      app.fetchSidechains()
    } else {
      app.isLogging = false;
    }
  },
  methods: {
    fetchSidechains(){
      const app = this
      app.bdcash.post('/sidechain/scan/address', { dapp_address: app.$route.params.address }).then(async response => {
        let sidechains = []
        for(let x in response.data){
          let sidechain = response.data[x]
          let details = await app.bdcash.post('/sidechain/get', {sidechain_address: sidechain.sidechain })
          let parsed = {
            name: details.sidechain[0].data.genesis.name + ' (' + details.sidechain[0].data.genesis.symbol + ')',
            address: details.sidechain[0].address,
            symbol: details.sidechain[0].data.genesis.symbol,
            supply: details.sidechain[0].data.genesis.supply + ' ' + details.sidechain[0].data.genesis.symbol,
            owner: details.sidechain[0].data.genesis.owner,
            balance: sidechain.balance
          }
          sidechains.push(parsed)
        }
        app.sidechains = sidechains
        app.isLoading = false
      })
    }
  }
}
</script>