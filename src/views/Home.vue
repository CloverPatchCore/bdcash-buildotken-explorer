<template>
  <div class="home container">
    <div class="columns">
      <div class="column">
        <b-input v-model="searcher" placeholder="Search for a sidechain.." style="margin-bottom:15px"></b-input>
        <div v-for="sidechain in filteredList" v-bind:key="sidechain.address" style="margin-bottom:15px">
          <a :href="'/#/sidechain/' + sidechain.address" v-if="sidechain.address !== '6TZMkQRiFu3frTDeXpapYNMhQggKgp755b'">
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
                    <p class="title is-5">{{ sidechain.last_24 }} txs in the last 24h</p>
                    <p class="subtitle is-6" style="margin-bottom:0">issued by <b style="color:#000">{{ sidechain.owner }}</b></p>
                    <b-icon
                        style="position:absolute; top:45px; right:30px"
                        pack="fas"
                        icon="arrow-right"
                        size="is-medium">
                    </b-icon>
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
    } else {
      app.isLogging = false;
    }
    app.fetchSidechains()
  },
  methods: {
    fetchSidechains(){
      const app = this
      app.bdcash.get('/sidechain/list').then(response => {
        let sidechains = []
        for(let x in response.data){
          let sidechain = response.data[x]
          let parsed = {
            name: sidechain.genesis.name + ' (' + sidechain.genesis.symbol + ')',
            address: sidechain.address,
            supply: sidechain.genesis.supply + ' ' + sidechain.genesis.symbol,
            owner: sidechain.genesis.owner,
            last_24: sidechain.last_24
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