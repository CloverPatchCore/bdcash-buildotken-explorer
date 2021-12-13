<template>
  <div class="home container">
    <b-modal :active.sync="openValidator" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <div class="modal-card" style="text-align:center">
        <header class="modal-card-head">
            <p class="modal-card-title">Create validator</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Validator address">
            <b-input v-model="validator"></b-input>
          </b-field>
          <b-button v-if="!isUploading" v-on:click="createValidator" type="is-primary" size="is-large">CREATE</b-button>
          <div v-if="isUploading">Creating validator, please wait...</div>
        </section>
      </div>
    </b-modal>
    <b-modal :active.sync="openUser" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <div class="modal-card" style="text-align:center">
        <header class="modal-card-head">
            <p class="modal-card-title">Create user</p>
        </header>
        <section class="modal-card-body">
          <b-field label="User address">
            <b-input v-model="user"></b-input>
          </b-field>
          <b-button v-if="!isUploading" v-on:click="createUser" type="is-primary" size="is-large">CREATE</b-button>
          <div v-if="isUploading">Creating user, please wait...</div>
        </section>
      </div>
    </b-modal>
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
            <div class="media-left">
              <figure class="image is-92x92">
                <v-gravatar :email="$route.params.sidechain" />
              </figure>
            </div>
              <div class="media-content" style="position:relative">
                <p class="title is-4" style="margin:0 0 0 0">Manage {{ sidechain.sidechain[0].data.genesis.name }} - {{ sidechain.sidechain[0].data.genesis.symbol }}</p>
                <p class="title is-6" style="margin:15px 0 0 0"><b>{{ $route.params.sidechain }}</b><br>issued by <b>{{ sidechain.sidechain[0].data.genesis.owner }}</b></p>
                <a :href="'/#/sidechain/' + $route.params.sidechain" target="_blank">
                  <b-icon
                      style="position:absolute; top:15px; right:15px"
                      pack="fas"
                      icon="arrow-right"
                      size="is-medium">
                  </b-icon>
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content" style="text-align:left">
                <h3 class="title is-4">Details</h3>
                <b>Name</b>
                : {{ asset.name }}
                <br />
                <b>Symbol</b>
                : {{ asset.symbol }}
                <br />
                <b>Supply</b>
                : {{ asset.supply }} {{ asset.symbol }}
                <br />
                <b>Decimals</b>
                : {{ asset.decimals }}
                <br />
                <b>Reissuable</b>
                : {{ asset.reissuable }}
                <br />
                <b>Burnable</b>
                : {{ asset.burnable }}
                <br />
                <b>Permissioned</b>
                : {{ asset.permissioned }}
              </div>
            </div>
          </div>
          <div class="column" v-if="asset.reissuable">
            <div class="card">
              <div class="card-content" style="text-align:left">
                <h3 class="title is-4">Reissue Sidechain</h3>
                <b-field label="Amount to reissue" style="padding-top:13px">
                  <b-input v-model="supplyReissue"></b-input>
                </b-field>
                <b-button v-on:click="reissueSidechain" style="margin-top:10px;" type="is-primary" size="is-large">REISSUE</b-button>
              </div>
            </div>
          </div>
        </div>

        <div class="columns" v-if = "asset.permissioned">
          <div class="column">
            <div class="card">
              <div class="card-content" style="text-align:left">
                <h3 class="title is-4">Validators</h3>
                <a href="#" v-on:click="openValidator = true">
                  <b-icon
                      v-if="address === sidechain.sidechain[0].data.genesis.owner"
                      style="position:absolute; z-index:19; top:15px; right:15px; color: #D8213B; cursor:pointer;"
                      pack="fas"
                      icon="plus"
                      size="is-medium">
                  </b-icon>
                </a>
                <div v-if="permissions.validators.length === 0">No validators, please add a new one first.</div>
                <div v-if="permissions.validators.length > 0">
                  <div class="card" v-for="authorizedaddress in permissions.validators" v-bind:key="authorizedaddress" style="position:relative">
                    <div class="card-content">
                      <div class="content">
                        <v-gravatar :email="authorizedaddress" style="width:25px; height:25px; float:left; margin-right:20px;" />
                        {{ authorizedaddress }}
                        <a href="#" v-on:click="deleteValidator(authorizedaddress)">
                        <b-icon
                          v-if="address === sidechain.sidechain[0].data.genesis.owner"
                          style="position:absolute; z-index:19; top:15px; right:15px; color: #D8213B; cursor:pointer;"
                          pack="fas"
                          icon="trash"
                          size="is-medium">
                        </b-icon>
                      </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content" style="text-align:left">
                <h3 class="title is-4">Users</h3>
                <a href="#" v-on:click="openUser = true">
                  <b-icon
                      v-if="address === sidechain.sidechain[0].data.genesis.owner || permissions.validators.indexOf(address) !== -1"
                      style="position:absolute; z-index:19; top:15px; right:15px; color: #D8213B; cursor:pointer;"
                      pack="fas"
                      icon="plus"
                      size="is-medium">
                  </b-icon>
                </a>
                <div v-if="permissions.users.length === 0">No validators, please add a new one first.</div>
                <div v-if="permissions.users.length > 0">
                  <div class="card" v-for="authorizedaddress in permissions.users" v-bind:key="authorizedaddress">
                    <div class="card-content">
                      <div class="content">
                        <v-gravatar :email="authorizedaddress" style="width:25px; height:25px; float:left; margin-right:20px;" />
                        {{ authorizedaddress }}
                        <a href="#" v-on:click="deleteUser(authorizedaddress)">
                          <b-icon
                              v-if="address === sidechain.sidechain[0].data.genesis.owner || permissions.validators.indexOf(address) !== -1"
                              style="position:absolute; z-index:19; top:15px; right:15px; color: #D8213B; cursor:pointer;"
                              pack="fas"
                              icon="trash"
                              size="is-medium">
                          </b-icon>
                        </a>
                      </div>
                    </div>
                  </div>
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
let math = require("mathjs")

export default {
  name: 'Explorer',
  watch: {
    supplyReissue: function () {
      const app = this
      setTimeout(function(){
        app.fixStep()
      },1000)
    }
  },
  data() {
    return {
      bdcash: new BDCashCore(true),
      math: math,
      address: "",
      wallet: "",
      supplyReissue: 0,
      sidechain: {
        sidechain: [{
          data: {
            genesis: {
              reissuable: true
            }
          }
        }]
      },
      asset: {},
      isUploading: false,
      openValidator: false,
      openUser: false,
      isLogging: true,
      validator: "",
      isLoading: true,
      searcher: "",
      user: "",
      permissions: {
        users: [],
        validators: []
      }
    };
  },
  async mounted() {
    const app = this;
    app.wallet = await app.bdcash.importBrowserSID();
    app.wallet = await app.bdcash.returnDefaultIdentity();
    app.bdcash.staticnodes = true
    if (app.wallet.length > 0) {
      let SIDS = app.wallet.split(":");
      app.address = SIDS[0];
      let identity = await app.bdcash.returnIdentity(app.address);
      app.wallet = identity;
      app.isLogging = false;
      app.fetchSidechain()
    } else {
      app.isLogging = false;
    }
  },
  methods: {
    fixStep(){
      const app = this
      let decimals = app.asset.decimals
      let supply = app.supplyReissue.toString()
      if(supply.indexOf(',') !== -1){
        supply = app.supplyReissue.replace(',','.')
      }
      supply = parseFloat(supply)
      app.supplyReissue = app.math.round(supply, decimals)
    },
    fetchSidechain(){
      const app = this
      app.bdcash.usePlanum(app.$route.params.sidechain)
      app.bdcash.verifyPlanum()
      app.bdcash.post('/sidechain/get', {sidechain_address: app.$route.params.sidechain}).then(async response => {
        app.sidechain = response
        app.asset = app.sidechain.sidechain[0].data.genesis
        app.permissions = app.sidechain.permissions
        if(app.asset.permissioned === undefined){
          app.asset.permissioned = false
        }
        app.isLoading = false
      })
    },
    reissueSidechain(){
      const app = this;
      if(app.supplyReissue > 0 && app.supplyReissue <= 1000000000000000){
        app.$buefy.dialog.prompt({
          message: `Enter wallet password`,
          inputAttrs: {
            type: "password"
          },
          trapFocus: true,
          onConfirm: async password => {
            let key = await app.bdcash.readKey(password, app.wallet.wallet);
            if (key !== false) {
              app.isUploading = true;
              let resIssue = await app.bdcash.post(
                "/sidechain/reissue",
                {
                  dapp_address: app.wallet.address,
                  private_key: key.prv,
                  pubkey: key.key,
                  supply: parseFloat(app.supplyReissue),
                  sidechain_address: app.$route.params.sidechain
                }
              );
              if (
                resIssue.reissue.sxid !== undefined
              ) {
                this.$buefy.toast.open({
                    message: 'Asset issued correctly!',
                    type: 'is-success'
                })
                setTimeout(function(){
                  location.reload()
                },500)
              }
            }
          }
        });
      }else if(app.supplyReissue >= 1000000000000000){
        this.$buefy.toast.open({
            message: 'Can\'t reissue more than 1Quadrillion at time!',
            type: 'is-danger'
        })
      }
    },
    createValidator(){
      const app = this
      if(app.validator !== '' && app.validator.length === 34){
        app.$buefy.dialog.prompt({
          message: `Enter wallet password`,
          inputAttrs: {
            type: "password"
          },
          trapFocus: true,
          onConfirm: async password => {
            let key = await app.bdcash.readKey(password, app.wallet.wallet);
            if (key !== false) {
              app.isUploading = true;
              let create = await app.bdcash.post(
                "/sidechain/allow",
                {
                  dapp_address: app.validator,
                  private_key: key.prv,
                  pubkey: key.key,
                  level: "validator",
                  sidechain_address: app.$route.params.sidechain
                }
              );
              if (
                create.txs !== undefined && create.txs[0].length === 64
              ) {
                this.$buefy.toast.open({
                    message: 'Validator created correctly!',
                    type: 'is-success'
                })
                app.validator = ""
                app.openValidator = false
                app.isUploading = false
                setTimeout(function(){
                  app.fetchSidechain()
                },1000)
              }else{
                this.$buefy.toast.open({
                    message: 'Can\'t create validator, retry!',
                    type: 'is-danger'
                })
                app.isUploading = false
              }
            }
          }
        });
      }else{
        this.$buefy.toast.open({
            message: 'Insert a valid bdcash address!',
            type: 'is-danger'
        })
      }
    },
    createUser(){
      const app = this
      if(app.user !== '' && app.user.length === 34){
        app.$buefy.dialog.prompt({
          message: `Enter wallet password`,
          inputAttrs: {
            type: "password"
          },
          trapFocus: true,
          onConfirm: async password => {
            let key = await app.bdcash.readKey(password, app.wallet.wallet);
            if (key !== false) {
              app.isUploading = true;
              let create = await app.bdcash.post(
                "/sidechain/allow",
                {
                  dapp_address: app.user,
                  private_key: key.prv,
                  pubkey: key.key,
                  level: "user",
                  sidechain_address: app.$route.params.sidechain
                }
              );
              if (
                create.txs !== undefined && create.txs[0].length === 64
              ) {
                this.$buefy.toast.open({
                    message: 'User created correctly!',
                    type: 'is-success'
                })
                app.user = ""
                app.openUser = false
                app.isUploading = false
                setTimeout(function(){
                  app.fetchSidechain()
                },1000)
              }else{
                this.$buefy.toast.open({
                    message: 'Can\'t create user, retry!',
                    type: 'is-danger'
                })
                app.isUploading = false
              }
            }
          }
        });
      }else{
        this.$buefy.toast.open({
            message: 'Insert a valid bdcash address!',
            type: 'is-danger'
        })
      }
    },
    deleteValidator(validator){
      const app = this
      if(validator !== '' && validator.length === 34){
        app.$buefy.dialog.prompt({
          message: `Enter wallet password to delete validator with address: <br><b>` + validator + `</b>.<br><span style="color:#f00; font-size:13px;">Attention: validator will not be able to operate in the sidechain.</span>`,
          inputAttrs: {
            type: "password"
          },
          trapFocus: true,
          onConfirm: async password => {
            let key = await app.bdcash.readKey(password, app.wallet.wallet);
            if (key !== false) {
              app.isUploading = true;
              let create = await app.bdcash.post(
                "/sidechain/deny",
                {
                  dapp_address: validator,
                  private_key: key.prv,
                  pubkey: key.key,
                  level: "validator",
                  sidechain_address: app.$route.params.sidechain
                }
              );
              if (
                create.txs !== undefined && create.txs[0].length === 64
              ) {
                this.$buefy.toast.open({
                    message: 'Validator deleted correctly!',
                    type: 'is-success'
                })
                app.validator = ""
                app.openValidator = false
                app.isUploading = false
                setTimeout(function(){
                  app.fetchSidechain()
                },1000)
              }else{
                this.$buefy.toast.open({
                    message: 'Can\'t delete validator, retry!',
                    type: 'is-danger'
                })
                app.isUploading = false
              }
            }
          }
        });
      }else{
        this.$buefy.toast.open({
            message: 'Insert a valid bdcash address!',
            type: 'is-danger'
        })
      }
    },
    deleteUser(user){
      const app = this
      if(user !== '' && user.length === 34){
        app.$buefy.dialog.prompt({
          message: `Enter wallet password to delete user with address: <br><b>` + user + `</b>.<br><span style="color:#f00; font-size:13px;">Attention: user will not be able to operate in the sidechain.</span>`,
          inputAttrs: {
            type: "password"
          },
          trapFocus: true,
          onConfirm: async password => {
            let key = await app.bdcash.readKey(password, app.wallet.wallet);
            if (key !== false) {
              app.isUploading = true;
              let create = await app.bdcash.post(
                "/sidechain/deny",
                {
                  dapp_address: user,
                  private_key: key.prv,
                  pubkey: key.key,
                  level: "user",
                  sidechain_address: app.$route.params.sidechain
                }
              );
              if (
                create.txs !== undefined && create.txs[0].length === 64
              ) {
                this.$buefy.toast.open({
                    message: 'User deleted correctly!',
                    type: 'is-success'
                })
                app.user = ""
                app.openUser = false
                app.isUploading = false
                setTimeout(function(){
                  app.fetchSidechain()
                },1000)
              }else{
                this.$buefy.toast.open({
                    message: 'Can\'t delete validator, retry!',
                    type: 'is-danger'
                })
                app.isUploading = false
              }
            }
          }
        });
      }else{
        this.$buefy.toast.open({
            message: 'Insert a valid bdcash address!',
            type: 'is-danger'
        })
      }
    },
  }
}
</script>