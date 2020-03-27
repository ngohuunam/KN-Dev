<template>
  <DataTable
    @row-select-all="onRowSelectAll"
    @row-unselect-all="onRowUnselectAll"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
    :value="productsFilter"
    data-key="_id"
    :selection.sync="selectedProds"
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
    <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
    <Column field="_id" header="Product" filterMatchMode="contains">
      <template #filter>
        <InputText type="text" v-model="filters['_id']" class="p-column-filter" />
      </template>
    </Column>
    <!-- <Column field="job" header="Job" filterMatchMode="in" :sortable="true"> -->
    <Column v-if="enlarge" field="job" header="Status" filterMatchMode="contains">
      <template #filter>
        <!-- <MultiSelect v-model="filters['job']" :options="filters['jobs']" optionLabel="product" optionValue="product" placeholder="All" class="p-column-filter"></MultiSelect> -->
        <InputText type="text" v-model="filters['job']" class="p-column-filter" />
      </template>
    </Column>
    <Column v-if="enlarge" field="staff" header="Staff" filterMatchMode="contains">
      <template #filter>
        <InputText type="text" v-model="filters['job']" class="p-column-filter" />
      </template>
    </Column>
    <Column v-if="enlarge" field="doneAt" header="Deadline" filterMatchMode="contains">
      <template #filter>
        <InputText type="text" v-model="filters['doneAt']" class="p-column-filter" />
      </template>
      <template #body="slotProps">
        <span>{{ new Date(slotProps.data.doneAt).toLocaleDateString('vi', { day: 'numeric', month: 'numeric', year: '2-digit' }) }}</span>
      </template>
    </Column>
    <!-- <template #groupheader="slotProps">
      <span style="text-align: left">{{ slotProps.data.shortTitle }}</span>
    </template> -->
    <template #footer>
      <div style="text-align:left">
        <Button label="Add" icon="pi pi-plus" @click="addNewProd" />
        <ToggleButton v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-check" offIcon="pi pi-times" />
      </div>
    </template>
    <template #empty>No records found.</template>
  </DataTable>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  name: 'ProductColumn',
  components: {},
  data: () => ({
    expandedRowGroups: [],
    filters: {},
    enlarge: true,
  }),
  methods: {
    onToggleEnlarge() {
      // this.enlarge = !this.enlarge
      this.$emit('toggle-enlarge')
    },
    addNewProd(e) {
      console.log(e)
    },
    onRowSelect(e) {
      this.$store.commit('PROD_SELECT', e.data._id)
    },
    onRowUnselect(e) {
      this.$store.commit('PROD_UNSELECT', e.data._id)
    },
    onRowSelectAll(e) {
      this.$store.commit('PROD_SELECT_ALL', e.data)
    },
    onRowUnselectAll() {
      this.$store.commit('PROD_UNSELECT_ALL')
    },
  },
  computed: {
    selectedProds: {
      get() {
        return this.$store.state.products_selected
      },
      set(value) {
        this.$store.commit('PROD_SELECTED', value)
      },
    },
    products() {
      return this.$store.state.products
    },
    productsFilter() {
      return this.$store.state.products_filter
    },
  },
  mounted: function() {
    if (this.products.length == 0) {
      this.$socket.client.emit('all', 'products')
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
