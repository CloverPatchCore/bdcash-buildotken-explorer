<template>
  <div class="home container">
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-128x128">
                  <v-gravatar :email="sidechain.address" />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4" style="margin:15px 0 0 0">{{ sidechain.name }}</p>
                <p class="title is-5">{{ totalSupply }} {{ sidechain.symbol }}</p>
                <p class="subtitle is-6" style="margin-bottom:0">
                  issued by
                  <b style="color:#000">{{ sidechain.owner }}</b>
                </p>
                <p
                  class="subtitle is-6"
                  style="margin-bottom:0"
                >CAP: {{ cap }} {{ sidechain.symbol }} - BURNED: {{ burned }} {{ sidechain.symbol }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="columns" style="margin-top:20px">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title">{{ totalusers }}</p>
                <p class="subtitle">Total users</p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title">{{ totaltransactions }}</p>
                <p class="subtitle">Total transactions</p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title">{{ averageperday }}</p>
                <p class="subtitle">Average txs/day</p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <p class="title">{{ averagetransactions }}</p>
                <p class="subtitle">Average txs/user</p>
              </div>
            </div>
          </div>
        </div>
        <b-tabs v-model="activeTab" :animated="false">
          <b-tab-item label="Transactions">
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
              aria-current-label="Current page"
            >
              <b-table-column
                style="font-size:11px; padding-top:12px"
                field="from"
                label="From"
                v-slot="props"
              >
                <v-gravatar
                  :email="props.row.from"
                  style="float:left; height:20px; margin-top:0px; width:20px; margin-right: 5px"
                />
                <a
                  :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.from"
                >{{ props.row.from }}</a>
              </b-table-column>

              <b-table-column
                style="font-size:11px; padding-top:12px"
                field="to"
                label="To"
                v-slot="props"
              >
                <v-gravatar
                  :email="props.row.to"
                  style="float:left; height:20px; margin-top:0px; width:20px; margin-right: 5px"
                />
                <a
                  :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.to"
                >{{ props.row.to }}</a>
              </b-table-column>

              <b-table-column label="Amount"  v-slot="props">{{ props.row.value }}</b-table-column>

              <b-table-column
                style="font-size:11px; padding-top:12px; text-align:center"
                field="sxid"
                label="SXID"
                v-slot="props"
              >{{ props.row.sxid.substr(0,12) }}...{{ props.row.sxid.substr(-12) }}</b-table-column>

              <b-table-column
                label="Datetime"
                style="text-align:center"
                v-slot="props"
              >{{ props.row.time }}</b-table-column>
            </b-table>
            <b-table
              v-if="confirmed.length > 0"
              :data="confirmed"
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
              aria-current-label="Current page"
            >
                <b-table-column style="font-size:11px; padding-top:12px" field="from" label="From"
                v-slot="props">
                  <v-gravatar
                    :email="props.row.from"
                    style="float:left; height:20px; margin-top:0px; width:20px; margin-right: 5px"
                  />
                  <a
                    :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.from"
                  >{{ props.row.from }}</a>
                </b-table-column>

                <b-table-column style="font-size:11px; padding-top:12px" field="to" label="To" v-slot="props">
                  <v-gravatar
                    :email="props.row.to"
                    style="float:left; height:20px; margin-top:0px; width:20px; margin-right: 5px"
                  />
                  <a
                    :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.to"
                  >{{ props.row.to }}</a>
                </b-table-column>

                <b-table-column label="Amount" v-slot="props">{{ props.row.value }}</b-table-column>

                <b-table-column
                  style="font-size:11px; padding-top:12px; text-align:center"
                  field="sxid"
                  label="SXID"
                  v-slot="props"
                >{{ props.row.sxid.substr(0,12) }}...{{ props.row.sxid.substr(-12) }}</b-table-column>

                <b-table-column label="Datetime" style="text-align:center" v-slot="props">{{ props.row.time }}</b-table-column>

                <b-table-column label="Block" style="text-align:center" v-slot="props">{{ props.row.block }}</b-table-column>

                <b-table-column label="Details" style="text-align:center" v-slot="props">
                  <a :href="'/#/transaction/' + $route.params.sidechain + '/' + props.row.sxid">
                    <b-button type="is-primary" size="is-small">></b-button>
                  </a>
                </b-table-column>
            </b-table>
          </b-tab-item>

          <b-tab-item label="Locked transactions">
            <b-table
              v-if="delayed.length > 0"
              :data="delayed"
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
              aria-current-label="Current page"
            >
              <b-table-column
                style="font-size:11px; padding-top:12px"
                field="from"
                label="From"
                v-slot="props"
              >
                <v-gravatar
                  :email="props.row.from"
                  style="float:left; height:20px; margin-top:0px; width:20px; margin-right: 5px"
                />
                <a
                  :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.from"
                >{{ props.row.from }}</a>
              </b-table-column>

              <b-table-column
                style="font-size:11px; padding-top:12px"
                field="to"
                label="To"
                v-slot="props"
              >
                <v-gravatar
                  :email="props.row.to"
                  style="float:left; height:20px; margin-top:0px; width:20px; margin-right: 5px"
                />
                <a
                  :href="'/#/sidechain/' + $route.params.sidechain + '/' + props.row.to"
                >{{ props.row.to }}</a>
              </b-table-column>

              <b-table-column label="Amount"  v-slot="props">{{ props.row.value }}</b-table-column>

              <b-table-column
                style="font-size:11px; padding-top:12px; text-align:center"
                field="sxid"
                label="SXID"
                v-slot="props"
              >{{ props.row.sxid.substr(0,12) }}...{{ props.row.sxid.substr(-12) }}</b-table-column>

              <b-table-column
                label="Datetime"
                style="text-align:center"
                v-slot="props"
              >{{ props.row.time }}</b-table-column>
            </b-table>
            <div v-if="delayed.length === 0" style="padding:30px 0">
              No transactions locked.
            </div>
          </b-tab-item>
          <b-tab-item label="Shares list">
            <div
              v-for="address in shares"
              v-bind:key="address.address"
              style="width:50%; display:inline-block; float:left;"
            >
              <a :href="'/#/sidechain/' + $route.params.sidechain + '/' + address.address">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-32x32">
                          <v-gravatar :email="address.address" />
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-6" style="margin:0">{{ address.address }}</p>
                        <p>{{ address.balance }} ({{ address.shares }}%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </b-tab-item>

          <b-tab-item label="Txs by day" style="text-align:center">
            <apexchart
              v-if="!isLoading"
              width="100%"
              height="350px"
              type="bar"
              :options="txOptions"
              :series="txSeries"
            ></apexchart>
          </b-tab-item>

          <b-tab-item label="Txs by user" style="text-align:center">
            <apexchart
              v-if="!isLoading"
              width="100%"
              height="350px"
              type="bar"
              :options="txuserOptions"
              :series="txuserSeries"
            ></apexchart>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
let BDCashCore = require("@bdcash-prptocol/core");
export default {
  name: "home",
  data() {
    return {
      bdcash: new BDCashCore(true),
      transactions: {
        confirmed: [],
        unconfirmed: [],
      },
      confirmed: [],
      delayed: [],
      sidechain: [],
      shares: [],
      burned: 0,
      cap: 0,
      averagetransactions: 0,
      averageperday: 0,
      totalusers: 0,
      totaltransactions: 0,
      txOptions: {
        chart: {
          id: "chart-transactions",
        },
        xaxis: {
          categories: [],
        },
      },
      txSeries: [
        {
          name: "Total transactions",
          data: [],
        },
      ],
      txuserOptions: {
        chart: {
          id: "chart-users",
        },
        xaxis: {
          categories: [],
        },
      },
      txuserSeries: [
        {
          name: "Total transactions",
          data: [],
        },
      ],
      totalSupply: "-",
      showShares: false,
      showDetails: false,
      isLoading: true,
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: "bottom",
      defaultSortDirection: "asc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      currentPage: 1,
      perPage: 15,
      fields: ["sxid", "value", "from", "to", "block", "time", "details"],
      sharesColumns: ["address", "balance", "shares"],
      activeTab: 0,
    };
  },
  mounted: async function () {
    const app = this;
    app.bdcash.staticnodes = true;
    app.fetchSidechain();
    setInterval(function () {
      app.fetchSidechain();
    }, 10000);
  },
  methods: {
    toggleShares() {
      const app = this;
      if (app.showShares === false) {
        app.showShares = true;
      } else {
        app.showShares = false;
      }
    },
    toggleDetails() {
      const app = this;
      if (app.showDetails === false) {
        app.showDetails = true;
      } else {
        app.showDetails = false;
      }
    },
    fetchSidechain() {
      const app = this;
      app.bdcash.get("/sidechain/list").then((response) => {
        for (let x in response.data) {
          let sidechain = response.data[x];
          if (sidechain.address === app.$route.params.sidechain) {
            let parsed = {
              name:
                sidechain.genesis.name + " (" + sidechain.genesis.symbol + ")",
                address: sidechain.address,
                supply: sidechain.genesis.supply + " " + sidechain.genesis.symbol,
                symbol: sidechain.genesis.symbol,
                owner: sidechain.genesis.owner,
                decimals: sidechain.genesis.decimals,
              };
            app.sidechain = parsed;
            app.bdcash.usePlanum(app.$route.params.sidechain)
            app.bdcash.verifyPlanum()
            app.bdcash.post("/sidechain/shares", {
                sidechain_address: app.$route.params.sidechain,
              })
              .then((response) => {
                let shares = response.shares;
                app.shares = [];
                app.totalSupply = response.cap;
                for (let x in shares) {
                  let details = {
                    address: x,
                    balance: shares[x].balance + " " + app.sidechain.symbol,
                    shares: shares[x].shares,
                  };
                  if (app.shares.indexOf(details) === -1) {
                    app.shares.push(details);
                  }
                }
                app.cap = response.cap;
                if (shares[app.$route.params.sidechain] !== undefined) {
                  app.cap =
                    app.cap - shares[app.$route.params.sidechain].balance;
                  app.burned = shares[app.$route.params.sidechain].balance;
                }
                app.cap = app.cap.toFixed(app.sidechain.decimals);
              });
            app.bdcash
              .post("/sidechain/scan", {
                sidechain_address: app.$route.params.sidechain,
              })
              .then((response) => {
                let transactions = { confirmed: [], unconfirmed: [] };
                let confirmed = []
                let delayed = []
                app.txOptions.xaxis.categories = [];
                app.txSeries.data = [];
                app.txuserOptions.xaxis.categories = [];
                app.txuserSeries.data = [];
                let statsbyday = {};
                let statsbyuser = {};
                let totaltransactions = 0;
                let totalusers = 0;
                let totaldays = 0;
                let now = new Date().getTime()

                for (let x in response.data) {
                  let value = 0;
                  let to = "";
                  for (let y in response.data[x].transaction.outputs) {
                    if (y != response.data[x]["address"]) {
                      value += response.data[x].transaction.outputs[y];
                      to = y;
                    }
                  }
                  if (to === "") {
                    for (let y in response.data[x].transaction.outputs) {
                      value += response.data[x].transaction.outputs[y];
                      to = y;
                    }
                  }
                  let from = "";
                  if (
                    response.data[x].transaction["inputs"][0]["vout"] ===
                    "genesis"
                  ) {
                    from = "GENESIS";
                  } else if (
                    response.data[x].transaction["inputs"][0]["vout"] ===
                    "reissue"
                  ) {
                    from = "REISSUE";
                  } else {
                    from = response.data[x]["address"];
                  }
                  if (from !== undefined) {
                    let Block;
                    if (response.data[x].block > 0) {
                      Block = response.data[x].block;
                    } else {
                      Block = "unconfirmed";
                    }
                    let date = new Date(response.data[x].transaction.time);
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hours = date.getHours();
                    let minutes = "0" + date.getMinutes();
                    let formattedTime =
                      day +
                      "/" +
                      month +
                      "/" +
                      year +
                      " at " +
                      hours +
                      ":" +
                      minutes.substr(-2);

                    if (
                      statsbyday[day + "/" + month + "/" + year] === undefined
                    ) {
                      statsbyday[day + "/" + month + "/" + year] = 0;
                      totaldays++;
                    }

                    statsbyday[day + "/" + month + "/" + year]++;

                    let fromcompact = from.substr(0, 3) + "-" + from.substr(-3);
                    if (statsbyuser[fromcompact] === undefined) {
                      statsbyuser[fromcompact] = 0;
                      totalusers++;
                    }
                    let tocompact = to.substr(0, 3) + "-" + to.substr(-3);
                    if (statsbyuser[tocompact] === undefined) {
                      statsbyuser[tocompact] = 0;
                      totalusers++;
                    }
                    statsbyuser[fromcompact]++;
                    totaltransactions++;

                    let transaction = {
                      sxid: response.data[x].sxid,
                      value: value + " " + app.sidechain.symbol,
                      from: from,
                      to: to,
                      block: Block,
                      time: formattedTime,
                    };
                    if (response.data[x].block > 0) {
                      if(response.data[x].transaction.time > now){
                        delayed.push(transaction);
                      }else{
                        confirmed.push(transaction);
                      }
                    } else {
                      transactions.unconfirmed.push(transaction);
                    }
                  }
                }
                let xy = 0;
                for (let x in statsbyday) {
                  app.txOptions.xaxis.categories.push(x);
                  app.txSeries[0].data[xy] = statsbyday[x];
                  xy++;
                }
                let yy = 0;
                for (let x in statsbyuser) {
                  app.txuserOptions.xaxis.categories.push(x);
                  app.txuserSeries[0].data[yy] = statsbyuser[x];
                  yy++;
                }
                app.transactions = transactions;
                app.delayed = delayed;
                app.confirmed = confirmed;
                app.averagetransactions = (
                  totaltransactions / totalusers
                ).toFixed(2);
                app.averageperday = (totaltransactions / totaldays).toFixed(2);
                app.totalusers = totalusers;
                app.totaltransactions = totaltransactions;
                app.isLoading = false;
              });
          }
        }
      });
    },
  },
};
</script>