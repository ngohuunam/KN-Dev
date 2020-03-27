<template>
  <div>
    <DataTable
      data-key="_id"
      :value="orderList"
      :filters="filters"
      :expandedRows.sync="expandedRows"
      @row-expand="onRowExpand"
      @row-collapse="onRowCollapse"
      :paginator="true"
      :rows="10"
      :rowHover="true"
      :lazy="true"
      :loading="ordersListLoading"
    >
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <InputText v-model="filters['global']" placeholder="Global Search" size="50" />
          </div>
        </div>
      </template>
      <Column :expander="true" headerStyle="width: 3em" />
      <Column field="team" header="Team" filterMatchMode="contains">
        <template #filter>
          <InputText type="text" v-model="filters['team']" class="p-column-filter" placeholder="Contains" />
        </template>
      </Column>
      <Column field="foreignTitle" header="Foreign Title" filterMatchMode="contains">
        <template #filter>
          <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" placeholder="Contains" />
        </template>
      </Column>
      <Column field="vietnameseTitle" header="Vietnamese Title" filterMatchMode="contains">
        <template #filter>
          <InputText type="text" v-model="filters['vietnameseTitle']" class="p-column-filter" placeholder="Contains" />
        </template>
      </Column>
      <Column field="shortTitle" header="Short Title" filterMatchMode="contains">
        <template #filter>
          <InputText type="text" v-model="filters['shortTitle']" class="p-column-filter" placeholder="Contains" />
        </template>
      </Column>
      <Column field="premiereDate" header="Premiere Date" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['premiereDate']" class="p-column-filter" placeholder="Contains" />
        </template>
      </Column>
      <!-- <Column field="nkc" header="NKC" filterMatchMode="contains" :sortable="true">
        <template #body="slotProps">
          <span>{{ new Date(slotProps.data.nkc).toLocaleDateString('vi', { day: 'numeric', month: 'numeric', year: '2-digit' }) }}</span>
        </template>
      </Column>-->

      <template #expansion="slotProps">
        <ProductTable :_id="slotProps.data._id" />
      </template>
      <template #footer>
        <div style="text-align:left">
          <Button abel="Add" icon="pi pi-plus" @click="addNewProd(slotProps.data)" />
        </div>
      </template>
      <template #empty>No records found.</template>
    </DataTable>

    <Dialog :visible.sync="dialogVisible" :style="{ width: '400px' }" header="Product Details" :modal="true">
      <div class="p-cardialog-content">
        <div class="p-grid p-fluid" v-if="newProd">
          <div class="p-col-4">
            <label for="prod">Product</label>
          </div>
          <div class="p-col-8">
            <InputText id="prod" v-model="newProd.product" :disabled="false" autocomplete="off" focus />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Save" icon="pi pi-check" @click="saveNewProd" class="p-button-success" />
        <Button label="Delete" icon="pi pi-times" @click="deleteNewProd" class="p-button-danger" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import ProductTable from '@/components/ProductTable.vue'

import { mapState } from 'vuex'
export default {
  name: 'Orders',
  components: {
    ProductTable,
  },
  props: {},
  data: () => ({
    expandedRows: [],
    customers: null,
    selectedCustomers: null,
    newProd: null,
    filters: {},
    dialogVisible: false,
  }),
  methods: {
    onRowExpand(event) {
      this.$store.dispatch('FETCH_GET_DOC', { route: 'orders/detail/' + event.data._id, loading: 'ordersDetailsLoading' })
    },
    onRowCollapse(event) {
      console.log('id', event.data._id)
      // this.$store.commit('SPLICE', { state: 'orderDetails', _id: event.data._id })
    },
    expandAll() {},
    collapseAll() {},
    addNewProd(data) {
      console.log(data)
    },
    deleteNewProd() {},
    saveNewProd() {},
  },
  computed: mapState(['orderList', 'ordersListLoading']),
  mounted: function() {
    const _updateSeq = this.orderListUpdateSeq || '1'
    this.$store.dispatch('FETCH_GET_ALL', { route: 'orders/all/list/' + _updateSeq, loading: 'ordersListLoading' })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
