<template>
  <div class="home container">
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <v-gravatar :email="address" />
              </figure>
            </div>
              <div class="media-content">
                <p class="title is-4" style="margin:0 0 0 0">Assets you can manage</p>
                <p class="title is-6" style="margin:15px 0 0 0">{{ address }}</p>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div v-for="sidechain in sidechains" v-bind:key="sidechain.address" style="margin-bottom:15px">
          <a :href="'/#/manage/' + sidechain.address">
            <div class="card">
              <div class="card-content">
                <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <v-gravatar :email="sidechain.address" />
                  </figure>
                </div>
                  <div class="media-content">
                    <p class="title is-4" style="margin:0">{{ sidechain.name }}</p>
                    <p class="title is-5">{{ sidechain.supply }}</p>
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
      app.bdcash.get('/sidechain/list').then(async response => {
        let sidechains = []
        for(let x in response.data){
          let sidechain = response.data[x]
          if(sidechain.genesis.owner === app.address || (sidechain.validators !== undefined && sidechain.validators.indexOf(app.address) !== -1)){
            let parsed = {
              name: sidechain.genesis.name + ' (' + sidechain.genesis.symbol + ')',
              address: sidechain.address,
              symbol: sidechain.genesis.symbol,
              supply: sidechain.genesis.supply + ' ' + sidechain.genesis.symbol,
              owner: sidechain.genesis.owner
            }
            sidechains.push(parsed)
          }
        }
        app.sidechains = sidechains
        app.isLoading = false
      })
    }
  }
}
</script>