<template>
  <div class="home container">
    <div class="columns">
      <div v-if="!isLoading" class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
            <div class="media-left">
              <figure class="image is-128x128">
                <v-gravatar :email="transaction.address" />
              </figure>
            </div>
              <div class="media-content">
                <p class="title is-4" style="margin:0"><a :href="'/#/address/' + transaction.address">{{ transaction.address }}</a></p>
                <p class="title is-6" style="margin:0">in the sidechain <a :href="'/#/sidechain/' + sidechain.address">{{ sidechain.address }}</a></p>
                <hr style="margin:10px 0">
                <p class="title is-6" style="margin:0">Sent {{ amount }} {{ sidechain.symbol }}</p>
                <p class="title is-6" style="margin:0">To <a :href="'/#/address/' + to">{{ to }}</a></p>
                <p class="title is-6" style="margin:0">{{ transaction.transaction.time }} at block {{ transaction.block }}</p>
                <p class="title is-6" style="margin:0">SXID: {{ transaction.sxid }}</p>
              </div>
            </div>
          </div>
        </div><br><br>
        <div class="columns">
          <div class="column" style="text-align:left">
            <b>Inputs</b><br><br>
            <div v-for="input in transaction.transaction.inputs" v-bind:key="input.sxid">
              <a :href="'/#/transaction/' + sidechain.address + '/' + input.sxid" target="_blank">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                    <div class="media-left">
                      <figure class="image is-32x32">
                        <v-gravatar :email="transaction.address" style="margin-top:-6px" />
                      </figure>
                    </div>
                      <div class="media-content">
                        <p class="title is-6" style="margin:0">
                          {{ input.sxid.substr(0,6) }}...{{ input.sxid.substr(-6) }} > <b>{{ input.amount }} {{ sidechain.symbol }}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div class="column">
            <b>Outputs</b><br><br>
            <div v-for="(amount, address) in transaction.transaction.outputs" v-bind:key="address">
              <div class="card">
                <div class="card-content">
                  <div class="media">
                  <div class="media-left">
                    <figure class="image is-32x32">
                      <v-gravatar :email="address"  style="margin-top:-6px" />
                    </figure>
                  </div>
                    <div class="media-content">
                      <p class="title is-6" style="margin:0">
                        {{ address }} > <b>{{ amount }} {{ sidechain.symbol }}</b>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="transaction.transaction.memo" style="max-width:100%">
          <div class="columns">
            <div class="column" style="text-align:left">
              <div class="card">
                <div class="card-content">
                  <h1 class="title is-4">Memo field:</h1>
                  <pre>{{ transaction.transaction.memo }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
  let BDCashCore = require("@bdcash-protocol/core");

  export default {
    name: "home",
    data() {
      return {
        bdcash: new BDCashCore(true),
        transaction: {
          data: {
            transaction: {
              inputs: [],
              outputs: {}
            }
          }
        },
        sidechain: [],
        isLoading: true,
        to: '',
        amount: 0
      };
    },
    mounted: async function() {
      const app = this;
      app.bdcash.staticnodes = true;
      app.fetchTransaction()
    },
    methods: {
      fetchTransaction() {
        const app = this;
        app.bdcash.get("/sidechain/list").then(response => {
          for (let x in response.data) {
            let sidechain = response.data[x];
            if (sidechain.address === app.$route.params.sidechain) {
              let parsed = {
                name:
                  sidechain.genesis.name + " (" + sidechain.genesis.symbol + ")",
                  address: sidechain.address,
                  supply: sidechain.genesis.supply + " " + sidechain.genesis.symbol,
                  symbol: sidechain.genesis.symbol,
                  owner: sidechain.genesis.owner
              };
              app.sidechain = parsed;
              app.bdcash.usePlanum(app.$route.params.sidechain)
              app.bdcash.verifyPlanum()
              app.bdcash.post("/sidechain/transaction", {
                sidechain_address: app.$route.params.sidechain,
                sxid: app.$route.params.sxid
              })
              .then(async response => {
                app.transaction = response.transaction;
                app.transaction.address = await app.bdcash.getAddressFromPubKey(app.transaction.pubkey)
                
                for(let x in app.transaction.transaction.outputs){
                  if(x !== app.transaction.address){
                    app.to = x
                    app.amount = app.transaction.transaction.outputs[x]
                  }
                }
                if(app.to === ''){
                  for(let x in app.transaction.transaction.outputs){
                    app.to = x
                    app.amount = app.transaction.transaction.outputs[x]
                  }
                }
                let date = new Date(app.transaction.transaction.time)
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()
                let hours = date.getHours()
                let minutes = "0" + date.getMinutes()
                app.transaction.transaction.time = day + '/' + month + '/' + year +' at ' + hours + ':' + minutes.substr(-2)
                app.isLoading = false
              });
            }
          }
        })
      }
    }
  };
</script>