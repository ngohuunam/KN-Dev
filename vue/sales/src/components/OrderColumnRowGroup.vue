<template>
  <DataTable
    rowGroupMode="subheader"
    groupRowsBy="shortTitle"
    :expandableRowGroups="true"
    :expandedRowGroups.sync="expandedRowGroups"
    @row-select-all="onRowSelectAll"
    @row-unselect-all="onRowUnselectAll"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
    :value="orders"
    data-key="_id"
    :selection.sync="selectedOrders"
    :filters="filters"
    :rowHover="true"
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
    <Column field="shortTitle" header="Short Title" headerStyle="width: 50%" filterMatchMode="contains" :sortable="true">
      <!-- <template #filter>
        <InputText type="text" v-model="filters['shortTitle']" class="p-column-filter" />
      </template> -->
    </Column>
    <Column field="status" header="Status" filterMatchMode="in" :sortable="true">
      <template #filter>
        <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect>
      </template>
    </Column>
    <template #groupheader="slotProps">
      <span>{{ slotProps.data.shortTitle }}</span>
    </template>
    <template #footer>
      <div style="text-align:left">
        <Button label="Add" icon="pi pi-plus" @click="addNewOrder" />
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
    expandedRowGroups: [],
    selectedOrders: [],
  }),
  methods: {
    addNewOrder(e) {
      console.log(e)
    },
    onRowSelect(e) {
      //   console.log(e)
      this.$store.commit('ORDER_SELECT', e.data._id)
    },
    onRowUnselect(e) {
      this.$store.commit('ORDER_UNSELECT', e.data._id)
    },
    onRowSelectAll(e) {
      this.$store.commit('ORDER_SELECT_ALL', e.data)
    },
    onRowUnselectAll() {
      this.$store.commit('ORDER_UNSELECT_ALL')
    },
  },
  computed: mapState(['orders']),
  mounted: function() {
    if (this.orders.length == 0) {
      this.$socket.client.emit('all', 'orders')
    }
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
