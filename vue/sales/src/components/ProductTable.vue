<template>
  <div>
    <DataTable
      :value="order.products"
      :filters="filters"
      :expandedRows.sync="expandedRows"
      @row-expand="onRowExpand"
      @row-collapse="onRowCollapse"
      :rowHover="true"
      :lazy="true"
      data-key="_id"
      :loading="ordersDetailsLoading"
    >
      <!-- <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <InputText v-model="filters['global']" placeholder="Global Search" size="50" />
          </div>
        </div>
      </template>-->
      <Column :expander="true" headerStyle="width: 3em" />
      <Column field="name" header="Name" filterMatchMode="contains" sortable>
        <!-- <template #filter>
          <InputText type="text" v-model="filters['name']" class="p-column-filter" placeholder="Contains" />
        </template>-->
      </Column>
      <Column field="createdAt" header="Created At" filterMatchMode="contains" sortable>
        <!-- <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" placeholder="Contains" />
        </template>-->
      </Column>
      <Column field="endAt" header="End At" filterMatchMode="contains" sortable>
        <!-- <template #filter>
          <InputText type="text" v-model="filters['endAt']" class="p-column-filter" placeholder="Contains" />
        </template>-->
      </Column>
      <Column field="finishAt" header="Finish At" filterMatchMode="contains" sortable>
        <!-- <template #filter>
          <InputText type="text" v-model="filters['finishAt']" class="p-column-filter" placeholder="Contains" />
        </template>-->
      </Column>

      <template #expansion="slotProps">
        {{ slotProps.data }}
        <!-- <DataTable :value="products.filter(_prod => _prod.orderId === slotProps.data._id)" editMode="cell">
          <Column field="product" header="Product"></Column>
          <Column field="createdAt" header="Created At" filterMatchMode="contains" :sortable="true">
            <template #body="slotProps">
              <span>{{ slotProps.data.createdAt ? new Date(slotProps.data.createdAt).toLocaleDateString('vi') : '---' }}</span>
            </template>
          </Column>
          <Column field="startAt" header="Start At" filterMatchMode="contains" :sortable="true">
            <template #body="slotProps">
              <span v-if="slotProps.data[slotProps.column.field] > 0">{{ new Date(slotProps.data.startAt).toLocaleString('vi') }}</span>
            </template>
            <template #editor="slotProps">
              <Calendar v-model="slotProps.data[slotProps.column.field]" :showTime="true" :showButtonBar="true" dateFormat="dd.mm.yy" />
            </template>
          </Column>
          <Column field="doneAt" header="Done At" filterMatchMode="contains" :sortable="true">
            <template #body="slotProps">
              <span>{{ slotProps.data.doneAt ? new Date(slotProps.data.doneAt).toLocaleDateString('vi') : '---' }}</span>
            </template>
          </Column>
          <Column field="endAt" header="End At" filterMatchMode="contains" :sortable="true">
            <template #body="slotProps">
              <span>{{ slotProps.data.endAt ? new Date(slotProps.data.endAt).toLocaleDateString('vi') : '---' }}</span>
            </template>
          </Column>
          <template #footer>
            <div style="text-align:left">
              <Button abel="Add" icon="pi pi-plus" @click="addNewProd(slotProps.data)" />
            </div>
          </template>
        </DataTable>-->
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
export default {
  name: 'ProductTable',
  props: {
    _id: String,
  },
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
      console.log('id', event.data._id)
      // this.$store.dispatch('FETCH_GET_DOC', 'orders/detail/' + event.data._id)
    },
    onRowCollapse(event) {
      console.log(event)
    },
    expandAll() {},
    collapseAll() {},
    addNewProd(data) {
      console.log(data)
    },
    deleteNewProd() {},
    saveNewProd() {},
  },
  computed: {
    order: function() {
      return this.$store.getters.GET_ORDER_DETAIL(this._id)
    },
    ordersDetailsLoading: function() {
      return this.$store.state.ordersDetailsLoading
    },
  },
  mounted: function() {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
