<template>
  <div class="home container">
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
            <div class="media-left">
              <figure class="image is-110x110">
                <a :href="'#/address/' + $route.params.address">
                  <v-gravatar :email="$route.params.address" />
                </a>
              </figure>
            </div>
              <div class="media-content">
                <p class="title is-4" style="margin:0">{{ $route.params.address }}</p>
                <p class="title is-5">{{ sidechain.name }}</p>
                <p class="subtitle is-6" style="margin-bottom:0"><b style="color:#000">{{ sidechain.address }}</b></p>
                <div style="position:absolute; top:8px; right:0 ;height:80px; padding:30px; text-align:right"><b style="color:#000">Balance</b><br>{{ balance }} {{ sidechain.symbol }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!showDetails">
          <b-table
            v-if="transactions.unconfirmed.length > 0"
            :data="transactions.unconfirmed"
            :paginated="false"
            :per-page="perPage"
            :current-page.sync="currentPage"
            :pagination-simple="isPaginationSimple"
            :pagination-position="paginationPosition"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page">

              <b-table-column style="font-size:11px; padding-top:12px" field="from" label="From" v-slot="props">
                <v-gravatar :email="props.row.from" style="float:left; height:20px; margin-top:-3px; width:20px; margin-right: 5px" /> 
                <a :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.from">{{ props.row.from }}</a>
              </b-table-column>

              <b-table-column style="font-size:11px; padding-top:12px" field="to" label="To" v-slot="props">
                <v-gravatar :email="props.row.to" style="float:left; height:20px; margin-top:-3px; width:20px; margin-right: 5px" />
                <a :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.to">{{ props.row.to }}</a>
              </b-table-column>

              <b-table-column style="font-size:11px; padding-top:12px; text-align:center" field="sxid" label="SXID" v-slot="props">
                  {{ props.row.sxid.substr(0,12) }}...{{ props.row.sxid.substr(-12) }}
              </b-table-column>

              <b-table-column label="Datetime" style="text-align:center" v-slot="props">
                  {{ props.row.time }}
              </b-table-column>
          </b-table>
          <b-table
            v-if="transactions.confirmed.length > 0"
            :data="transactions.confirmed"
            :paginated="isPaginated"
            :per-page="perPage"
            :current-page.sync="currentPage"
            :pagination-simple="isPaginationSimple"
            :pagination-position="paginationPosition"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page">

              <b-table-column style="font-size:11px; padding-top:12px" field="from" label="From" v-slot="props">
                <v-gravatar :email="props.row.from" style="float:left; height:20px; margin-top:-3px; width:20px; margin-right: 5px" /> 
                <a :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.from">{{ props.row.from }}</a>
              </b-table-column>

              <b-table-column style="font-size:11px; padding-top:12px" field="to" label="To" v-slot="props">
                <v-gravatar :email="props.row.to" style="float:left; height:20px; margin-top:-3px; width:20px; margin-right: 5px" />
                <a :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.to">{{ props.row.to }}</a>
              </b-table-column>

              <b-table-column label="Amount" v-slot="props">
                  {{ props.row.value }}
              </b-table-column>

              <b-table-column style="font-size:11px; padding-top:12px; text-align:center" field="sxid" label="SXID" v-slot="props">
                  {{ props.row.sxid.substr(0,12) }}...{{ props.row.sxid.substr(-12) }}
              </b-table-column>

              <b-table-column label="Datetime" style="text-align:center" v-slot="props">
                  {{ props.row.time }}
              </b-table-column>

              <b-table-column label="Block" style="text-align:center" v-slot="props">
                  {{ props.row.block }}
              </b-table-column>

              <b-table-column label="Details" style="text-align:center" v-slot="props">
                <a :href="'/#/transaction/' + $route.params.sidechain + '/' + props.row.sxid"><b-button type="is-primary" size="is-small"> > </b-button></a>
              </b-table-column>
          </b-table>
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
        balance: 0,
        transactions: {
          confirmed: [],
          unconfirmed: []
        },
        compacted: {
          confirmed: [],
          unconfirmed: []
        },
        sidechain: [],
        burned: 0,
        cap: 0,
        options: {
          labels: []
        },
        series: [],
        showShares: false,
        showDetails: false,
        isLoading: true,
        isPaginated: true,
        isPaginationSimple: false,
        paginationPosition: 'bottom',
        defaultSortDirection: 'asc',
        sortIcon: 'arrow-up',
        sortIconSize: 'is-small',
        currentPage: 1,
        perPage: 15,
        fields: [
          "sxid",
          "value",
          "from",
          "to",
          "block",
          "time",
          "details"
        ]
      };
    },
    mounted: async function() {
      const app = this;
    app.bdcash.staticnodes = true;
      app.fetchSidechain();
      setInterval(function(){
        app.fetchSidechain()
      },10000)
    },
    methods: {
      toggleShares(){
        const app = this
        if(app.showShares === false){
          app.showShares = true
        }else{
          app.showShares = false
        }
      },
      toggleDetails(){
        const app = this
        if(app.showDetails === false){
          app.showDetails = true
        }else{
          app.showDetails = false
        }
      },
      fetchSidechain() {
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
              app.bdcash.post("/sidechain/shares", {
                sidechain_address: app.$route.params.sidechain
              })
              .then(response => {
                let shares = response.shares
                app.series = []
                app.options = {
                  labels: []
                }
                for(let x in shares){
                  app.series.push(shares[x].shares)
                  app.options.labels.push(x + ' ' + shares[x].balance + ' ' + app.sidechain.symbol)
                }
                app.cap = response.cap
                if(shares[app.$route.params.sidechain] !== undefined){
                  app.cap = app.cap - shares[app.$route.params.sidechain].balance
                  app.burned = shares[app.$route.params.sidechain].balance
                }
                app.cap = app.cap.toFixed(app.sidechain.decimals)
              })
              app.bdcash.post("/sidechain/scan", {
                sidechain_address: app.$route.params.sidechain
              })
              .then(response => {
                let transactions = { confirmed: [], unconfirmed: [] };
                let compacted = { confirmed: [], unconfirmed: [] };
                for (let x in response.data) {
                  let value = 0;
                  let to = "";
                  for (let y in response.data[x].transaction.outputs) {
                    if (y != response.data[x]["address"]) {
                      value += response.data[x].transaction.outputs[y];
                      to = y;
                    }
                  }
                  if(to === ""){
                    for (let y in response.data[x].transaction.outputs) {
                      value += response.data[x].transaction.outputs[y];
                      to = y;
                    }
                  }
                  let from = "";
                  if (response.data[x].transaction["inputs"][0]['vout'] === 'genesis') {
                    from = 'GENESIS'
                  }else if(response.data[x].transaction["inputs"][0]['vout'] === 'reissue') {
                    from = 'REISSUE'
                  }else{
                    from = response.data[x]["address"]
                  }
                  if(from !== undefined){
                    let Block
                    if(response.data[x].block > 0){
                      Block = response.data[x].block
                    }else{
                      Block = 'unconfirmed'
                    }
                    let date = new Date(response.data[x].transaction.time)
                    let year = date.getFullYear()
                    let month = date.getMonth() + 1
                    let day = date.getDate()
                    let hours = date.getHours()
                    let minutes = "0" + date.getMinutes()
                    let formattedTime = day + '/' + month + '/' + year +' at ' + hours + ':' + minutes.substr(-2)

                    let transaction = {
                      sxid: response.data[x].sxid,
                      value: value + " " + app.sidechain.symbol,
                      from: from,
                      to: to,
                      block: Block,
                      time: formattedTime
                    };
                    if(from === app.$route.params.address || to === app.$route.params.address){
                      if(response.data[x].block > 0){
                        transactions.confirmed.push(transaction);
                      }else{
                        transactions.unconfirmed.push(transaction);
                      }
                    }
                  }
                }
                app.transactions = transactions;
                app.compacted = compacted;
                
                app.bdcash.post('/sidechain/scan/address', { dapp_address: app.$route.params.address }).then(async response => {
                  for(let x in response.data){
                    let sidechain = response.data[x]
                    if(app.$route.params.sidechain == sidechain.sidechain){
                      app.balance = sidechain.balance
                    }
                  }
                  app.isLoading = false
                })
              });
            }
          }
        });
      }
    }
  };
</script>