<template>
  <div class="home">
    <!-- <div class="center"><img alt="Vue logo" src="../assets/logoKN.png" /></div> -->

    <div class="p-grid">
      <div :class="orderColumnClass">
        <FilmOrdersListColumn @toggle-enlarge="toggleOrderColumnEnlarge" @open-dialog="openDialog" />
      </div>
      <!-- <div :class="productSimpleColumnClass">
        <FilmProductSimpleColumn @toggle-enlarge="toggleProductSimpleColumnEnlarge" />
      </div> -->
    </div>
    <NewDialog
      v-if="dialogComponent"
      :header="dialogHeader"
      :visible.sync="isOpenDialog"
      :style="{ width: dialogWidth }"
      @keyup-enter="dialogConfirm"
      @keyup-escape="closeDialog"
      :modal="true"
      :contentStyle="{ overflow: 'visible' }"
      :closable="false"
      :disableKeyTab="disableKeyTab"
    >
      <BlockUI :blocked="loading" fullScreen @unblock="unblock">
        <component :key="confirmBtnLabel" :is="dialogComponent" :ref="compRef" @switch-comp="openDialog" :cp="compProps" />
        <NewMessage v-if="dialogMess.text" @close-message="closeMessage" :severity="dialogMess.severity">{{ dialogMess.text }}</NewMessage>
      </BlockUI>

      <template #footer>
        <Button v-if="confirmBtnLabel === 'Save'" label="Back" icon="pi pi-angle-double-left" @click="backDialog" />
        <Button :label="confirmBtnLabel" :icon="buttonIcon" @click="dialogConfirm" class="p-button-success" />
        <Button label="Cancel" icon="pi pi-times" @click="closeDialog" class="p-button-danger" />
      </template>
    </NewDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import FilmOrdersListColumn from '@/components/home/home-columns/FilmOrdersListColumn.vue'
import FilmProductSimpleColumn from '@/components/FilmProductSimpleColumn.vue'
import FilmOrdersDeleteConfirm from '@/components/home/home-dialog/FilmOrdersDeleteConfirm.vue'
import FilmOrdersNewOrderForm from '@/components/home/home-dialog/FilmOrdersNewOrderForm.vue'
import FilmOrdersNewOrderConfirm from '@/components/home/home-dialog/FilmOrdersNewOrderConfirm.vue'
import FilmOrdersNewOrdersForm from '@/components/home/home-dialog/FilmOrdersNewOrdersForm.vue'
import FilmOrdersNewProdForm from '@/components/home/home-dialog/FilmOrdersNewProdForm.vue'
import FilmOrdersNewProdConfirm from '@/components/home/home-dialog/FilmOrdersNewProdConfirm.vue'

export default {
  name: 'Home',
  components: {
    FilmOrdersListColumn,
    FilmProductSimpleColumn,
    deleteConfirm: FilmOrdersDeleteConfirm,
    newOrderForm: FilmOrdersNewOrderForm,
    newOrderConfirm: FilmOrdersNewOrderConfirm,
    newOrdersForm: FilmOrdersNewOrdersForm,
    newProdForm: FilmOrdersNewProdForm,
    newProdConfirm: FilmOrdersNewProdConfirm,
  },
  data: () => ({
    dialogComponent: null,
    orderColumnEnlarge: true,
    productSimpleColumnEnlarge: true,
    jobColumnEnlarge: true,
    confirmBtnLabel: '',
    dialogHeader: '',
    compRef: '',
    compProps: null,
    dialogWidth: '400px',
    disableKeyTab: false,
  }),
  mounted: function() {
    this.$store.dispatch('auth')
  },
  methods: {
    unblock(e) {
      console.log(e)
    },
    closeMessage() {
      this.dialogMess = { text: '', severity: '' }
    },
    backDialog() {
      if (this.compRef.indexOf('SimpleProd') > -1) this.openDialog('newProdForm', 'Create', 'Add new Product', this.compProps)
      else this.openDialog('newOrderForm', 'Create', 'Add new film')
    },
    openDialog(comp, label, header, props, width, disableKeyTab) {
      this.compProps = props
      this.disableKeyTab = disableKeyTab
      this.dialogWidth = width || '400px'
      this.compRef = comp
      this.confirmBtnLabel = label
      this.dialogHeader = header
      this.dialogComponent = this.$options.components[comp]
      this.isOpenDialog = true
    },
    closeDialog() {
      // setTimeout(() => {
      //   this.dialogComponent = null
      // }, 500)
      this.isOpenDialog = false
      this.dialogMess = { text: '', severity: '' }
    },
    dialogConfirm(e) {
      // console.log(e)
      if (e.target.type !== 'textarea' && e.target.className !== 'ql-editor') this.$refs[this.compRef].confirm()
    },
    toggleOrderColumnEnlarge() {
      this.orderColumnEnlarge = !this.orderColumnEnlarge
    },
    toggleProductSimpleColumnEnlarge() {
      this.productSimpleColumnEnlarge = !this.productSimpleColumnEnlarge
    },
    toggleJobColumnEnlarge() {
      this.jobColumnEnlarge = !this.jobColumnEnlarge
    },
  },
  watch: {
    isOpenDialog: function(value) {
      if (value === false) {
        setTimeout(() => {
          this.dialogComponent = ''
        }, 500)
      }
    },
  },
  computed: {
    isOpenDialog: {
      get() {
        return this.$store.state.dialog.isOpen
      },
      set(value) {
        this.$store.commit('dialog/setState', { state: 'isOpen', value: value })
      },
    },
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('dialog/setMess', value)
      },
    },
    newOrder: {
      get() {
        return this.$store.state.filmOrdersList.newOrder
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'newOrder', value: value })
      },
    },
    buttonIcon() {
      return this.loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'
    },
    loading() {
      return this.$store.state.dialog.loading
    },
    orderColumnClass: function() {
      return this.orderColumnEnlarge ? 'p-col-12' : 'p-col-2'
    },
    productSimpleColumnClass: function() {
      return this.productSimpleColumnEnlarge ? (this.orderColumnEnlarge ? 'p-col-12' : 'p-col-10') : 'p-col-2'
    },
    jobColumnClass: function() {
      return this.jobColumnEnlarge ? 'p-col-3' : 'p-col-1'
    },
  },
}
</script>

<style>
.center {
  width: 100%;
  text-align: center;
  padding: 0 0 24px 0;
}
</style>
