<template>
  <div>
    <DataTable
      :value="list"
      dataKey="_id"
      :selection.sync="selected"
      :filters="filters"
      :rowHover="true"
      :loading="loading"
      loadingIcon=""
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @row-unselect-all="onRowUnselectAll"
      :rowClass="rowClass"
      stateStorage="local"
      stateKey="dt-state-demo-local"
    >
      <!-------------------- < Header > --------------------->
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <Button :label="enlarge ? 'Create New Order' : ''" icon="pi pi-plus" @click="addNewOrder" class="margin-right" />
            <Button :label="enlarge ? 'Create Some New Order' : ''" icon="pi pi-plus" @click="addNewOrders" class="margin-right" />
            <Button v-if="selected.length" :label="loadBtnProp.label" :icon="loadBtnProp.icon" @click="loadOrderDetail" :disabled="loadBtnProp.disabled" class="margin-right" />
            <Button v-if="selected.length" :label="enlarge ? 'Delete Orders' : ''" icon="pi pi-minus" @click="confirmDelOrder" class="p-button-danger margin-right" />
            <!-- <ToggleButton v-if="!enlarge" v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" /> -->
            <InputText v-if="enlarge" v-model="filters['global']" placeholder="Search" style="width: 20%" class="margin-right" />
            <Button v-if="hasOrderChanged" :label="enlarge ? 'Sth Changed' : ''" icon="pi pi-star" @click="allChangedAccept" class="margin-right" />
            <Button v-if="hasNewOrder" :label="enlarge ? 'New Order' : ''" icon="pi pi-file-o" @click="allNewOrderAccept" class="margin-right" />
            <ToggleButton :onLabel="enlarge ? 'Collapse' : ''" offLabel=" " v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" />
            <InputText v-if="!enlarge" v-model="filters['global']" placeholder="Search" style="width: 100%" class="margin-top" />
          </div>
        </div>
      </template>
      <!-------------------- < Loading > --------------------->
      <template #loading>
        <div class="text-center">Loading records...</div>
        <ProgressBar mode="indeterminate" />
      </template>
      <!-------------------- < Column Add Prod > --------------------->
      <Column headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" icon="pi pi-plus" @click="addSimpleProd(slotProps.data)"></Button>
        </template>
      </Column>
      <!-------------------- < Column Edit Order > --------------------->
      <Column headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" icon="pi pi-pencil" @click="editOrder(slotProps.data._id)"></Button>
        </template>
      </Column>
      <!-------------------- < Column Selection > --------------------->
      <Column selectionMode="multiple" bodyStyle="padding: 0" headerStyle="width: 2.5em" :sortable="true" sortField="selected"></Column>
      <!-------------------- < Column > --------------------->
      <Column field="foreignTitle" header="Foreign Title" bodyStyle="padding: 0 8px" :headerStyle="enlarge ? 'width: 18%' : ''" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button v-if="cellHasChanged(slotProps, 'foreignTitle')" :label="slotProps.data.foreignTitle" @click="changedAccept($event, slotProps.data._id, 'foreignTitle')" />
          <span v-else> {{ slotProps.data.foreignTitle }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column v-if="enlarge" field="premiereDate" header="NKC" bodyStyle="padding: 0 8px" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['premiereDate']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellHasChanged(slotProps, 'premiereDate')"
            :label="$tToString(slotProps.data.premiereDate, false, '')"
            @click="changedAccept($event, slotProps.data._id, 'premiereDate')"
          />
          <span v-else> {{ $tToString(slotProps.data.premiereDate, false, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column v-if="enlarge" field="status" header="Status" bodyStyle="padding: 0 8px" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['status']" class="p-column-filter" />
          <!-- <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect> -->
        </template>
        <template #body="slotProps">
          <Button v-if="cellHasChanged(slotProps, 'status')" :label="slotProps.data.status" @click="changedAccept($event, slotProps.data._id, 'status')" />
          <span v-else> {{ slotProps.data.status }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column v-if="enlarge" field="productNames" header="Products" bodyStyle="padding: 0 8px" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['productNames']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button v-if="cellHasChanged(slotProps, 'productNames')" :label="slotProps.data.productNames" @click="changedAccept($event, slotProps.data._id, 'productNames')" />
          <span v-else> {{ slotProps.data.productNames }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column v-if="enlarge" field="createdAt" header="Create" bodyStyle="padding: 0 8px" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellHasChanged(slotProps, 'createdAt')"
            :label="$tToString(slotProps.data.createdAt, true, '')"
            @click="changedAccept($event, slotProps.data._id, 'createdAt')"
          />
          <span v-else> {{ $tToString(slotProps.data.createdAt, true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column v-if="enlarge" field="endAt" header="End" bodyStyle="padding: 0 8px" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['endAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button v-if="cellHasChanged(slotProps, 'endAt')" :label="$tToString(slotProps.data.endAt, true, '')" @click="changedAccept($event, slotProps.data._id, 'endAt')" />
          <span v-else> {{ $tToString(slotProps.data.endAt, true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column v-if="enlarge" field="finishAt" header="Finish" bodyStyle="padding: 0 8px" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['finishAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellHasChanged(slotProps, 'finishAt')"
            :label="$tToString(slotProps.data.finishAt, true, '')"
            @click="changedAccept($event, slotProps.data._id, 'finishAt')"
          />
          <span v-else> {{ $tToString(slotProps.data.finishAt, true, '') }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column v-if="enlarge" field="vietnameseTitle" header="Vietnamese Title" bodyStyle="padding: 0 8px" headerStyle="width: 18%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['vietnameseTitle']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <Button
            v-if="cellHasChanged(slotProps, 'vietnameseTitle')"
            :label="slotProps.data.vietnameseTitle"
            @click="changedAccept($event, slotProps.data._id, 'vietnameseTitle')"
          />
          <span v-else> {{ slotProps.data.vietnameseTitle }} </span>
        </template>
      </Column>
      <!-------------------- < Footer > --------------------->
      <template v-if="message.text" #footer>
        <Message @close-message="closeMessage" :severity="message.severity">{{ message.text }}</Message>
      </template>
      <template #empty><div class="text-center">No records found.</div></template>
    </DataTable>
    <!-- <ProgressSpinner v-if="filmOrdersListLoading" /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OrderColumn',
  components: {},
  data: () => ({
    filters: {},
    sectedOrdersHasProd: false,
    enlarge: true,
  }),
  methods: {
    addSimpleProd(order) {
      console.log(order._id)
      this.$emit('open-dialog', 'newProdForm', 'Create', 'Add new Product', order)
    },
    editOrder(_id) {
      console.log(_id)
    },
    allNewOrderAccept() {
      this.$store.commit('filmOrdersList/allNewOrderAccept')
    },
    allChangedAccept() {
      this.$store.commit('filmOrdersList/allChangedAccept')
    },
    changedAccept(e, _id, key) {
      e.preventDefault()
      this.$store.commit('filmOrdersList/changedAccept', { _id: _id, key: key })
    },
    cellHasChanged(slotProps, key) {
      return slotProps.data.keyHasChanged.indexOf(key) > -1
    },
    addProduct(order) {
      console.log(order)
    },
    deleteThisOrder(order) {
      console.log(order)
    },
    loadOrderDetail() {
      // this.$store.dispatch('filmOrdersList/getOrderDetail')
      let _prodList = []
      this.selected.map(fo => {
        _prodList = [..._prodList, ...fo.products]
      })
      this.$store.commit('filmOrdersList/setState', { state: 'prodList', value: _prodList })
    },
    closeMessage() {
      this.message = { text: '', severity: '' }
    },
    onToggleEnlarge() {
      this.$emit('toggle-enlarge')
    },
    addNewOrder() {
      this.$emit('open-dialog', 'newOrderForm', 'Create', 'Add new film')
    },
    addNewOrders() {
      this.$emit('open-dialog', 'newOrdersForm', 'Create', 'Add some new films', null, '100%', true)
    },
    confirmDelOrder() {
      this.$emit('open-dialog', 'deleteConfirm', this.selected.length > 1 ? 'Delete All' : 'Delete', 'Confirm Delete - This action is undone')
    },
    onRowSelect() {},
    onRowUnselect(e) {
      if (this.prodList.length) this.$store.commit('filmOrdersList/filterSomeByIndexOf', { state: 'prodList', _id: e.data._id })
    },
    onRowUnselectAll() {
      if (this.prodList.length) this.$store.commit('filmOrdersList/setState', { state: 'prodList', value: [] })
    },
    rowClass(data) {
      return data.new ? 'p-info' : ''
    },
  },
  computed: {
    loadBtnProp() {
      let prop = { label: 'Load', icon: 'pi pi-download', disabled: false }
      if (!this.selected.length && !this.prodList.length) prop = { label: 'No Select', icon: 'pi pi-download', disabled: true }
      else if (this.selected.length && !this.sectedOrdersHasProd) prop = { label: 'No Prod', icon: 'pi pi-ban', disabled: true }
      else if (!this.selected.length && this.prodList.length) prop = { label: 'Clear', icon: 'pi pi-upload', disabled: false }
      if (!this.enlarge) prop.label = ''
      return prop
    },
    selected: {
      get() {
        return this.$store.state.filmOrdersList.selected
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'selected', value: value })
        this.sectedOrdersHasProd = value.some(v => v.products.length > 0)
      },
    },
    hasNewOrder() {
      return this.$store.getters['filmOrdersList/hasNewOrder']
    },
    hasOrderChanged() {
      return this.$store.getters['filmOrdersList/hasOrderChanged']
    },
    message: {
      get() {
        return this.$store.state.filmOrdersList.message
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'message', value: value })
      },
    },
    ...mapState({
      list: state => state.filmOrdersList.list,
      loading: state => state.filmOrdersList.loading,
      prodList: state => state.filmOrdersList.prodList,
    }),
  },
  created: function() {
    this.$store.dispatch('filmOrdersList/getList')
  },
  mounted: function() {},
}
</script>

<style scoped>
.p-column-filter {
  display: block;
}
.p-column-filter input {
  width: 100%;
}
.text-center {
  width: 100%;
  padding: 0 0 4px 0;
  text-align: center;
  font-size: 20pt;
}
.has-changed {
  font-weight: 700;
  color: #41b783;
}
.margin-right {
  margin-right: 4px;
}
.margin-bot {
  margin-bottom: 4px;
}
.margin-left {
  margin-left: 4px;
}
.margin-top {
  margin-top: 4px;
}
</style>
