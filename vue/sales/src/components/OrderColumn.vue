<template>
  <DataTable
    @row-select-all="onRowSelectAll"
    @row-unselect-all="onRowUnselectAll"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
    :value="orderList"
    data-key="_id"
    :selection.sync="selectedOrders"
    :filters="filters"
    :rowHover="true"
    :lazy="true"
    :loading="ordersListLoading"
  >
    <template #header>
      <div class="table-header-container">
        <div style="text-align: left">
          <InputText v-model="filters['global']" placeholder="Search" style="width: 100%;" />
        </div>
      </div>
    </template>
    <Column selectionMode="multiple" headerStyle="width: 3em" :sortable="true" sortField="selected"></Column>
    <!-- <Column :expander="true" headerStyle="width: 3em" /> -->
    <Column field="shortTitle" header="Short Title" :headerStyle="enlarge ? 'width: 50%' : ''" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['shortTitle']" class="p-column-filter" />
      </template>
    </Column>
    <!-- <Column v-if="enlarge" field="status" header="Status" filterMatchMode="in" :sortable="true">
      <template #filter>
        <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect>
      </template>
    </Column> -->
    <Column field="premiereDate" header="Premiere Date" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['premiereDate']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <template #footer>
      <div style="text-align:left">
        <Button label="Add" icon="pi pi-plus" @click="addNewOrder" />
        <ToggleButton v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-check" offIcon="pi pi-times" />
      </div>
    </template>
    <template #empty>No records found.</template>
  </DataTable>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OrderColumn',
  components: {},
  data: () => ({
    filters: {},
    selectedOrders: [],
    enlarge: true,
  }),
  methods: {
    onToggleEnlarge() {
      this.$emit('toggle-enlarge')
    },
    addNewOrder() {},
    onRowSelect(e) {
      this.$store.dispatch('FETCH_GET_DOC', { route: 'orders/detail/' + e.data._id, loading: 'ordersDetailsLoading' })
    },
    onRowUnselect(e) {
      this.$store.commit('SPLICE', { state: 'orderDetails', _id: e.data._id })
    },
    onRowSelectAll() {},
    onRowUnselectAll() {},
  },
  computed: mapState(['orderList', 'ordersListLoading']),
  mounted: function() {
    const _updateSeq = this.orderListUpdateSeq || '1'
    this.$store.dispatch('FETCH_GET_ALL', { route: 'orders/all/list/' + _updateSeq, loading: 'ordersListLoading' })
  },
}
</script>

<style scoped>
.p-column-filter {
  display: block;
}
.p-column-filter input {
  width: 100%;
}
</style>
