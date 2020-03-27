<template>
  <DataTable
    rowGroupMode="subheader"
    groupRowsBy="prodId"
    :expandableRowGroups="true"
    :expandedRowGroups.sync="expandedRowGroups"
    @row-select="onRowSelect"
    @row-unselect="onRowUnselect"
    :value="jobsFilter"
    data-key="_id"
    :selection.sync="selectedJobs"
    :filters="filters"
    :rowHover="true"
  >
    <template #header>
      <div class="table-header-container">
        <div style="text-align: left">
          <InputText v-model="filters['global']" placeholder="Search" />
        </div>
      </div>
    </template>
    <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
    <!-- <Column :expander="true" headerStyle="width: 3em" /> -->
    <Column field="prodId" header="Product" filterMatchMode="contains">
      <template #body="slotProps">
        <span>{{ slotProps.data.shortTitle + ' - ' + slotProps.data.product }}</span>
      </template>
      <!-- <template #filter>
        <InputText type="text" v-model="filters['prodId']" class="p-column-filter" />
      </template> -->
    </Column>
    <Column field="job" header="Job" filterMatchMode="in">
      <template #filter>
        <MultiSelect v-model="filters['job']" :options="jobsFilter" optionLabel="job" optionValue="job" placeholder="All" class="p-column-filter"></MultiSelect>
      </template>
    </Column>
    <Column field="mainStaff" header="Staff" filterMatchMode="contains">
      <template #filter>
        <InputText type="text" v-model="filters['mainStaff']" class="p-column-filter" />
      </template>
    </Column>
    <Column field="doneAt" header="Deadline" filterMatchMode="contains">
      <template #filter>
        <InputText type="text" v-model="filters['doneAt']" class="p-column-filter" />
      </template>
      <template #body="slotProps">
        <span>{{ new Date(slotProps.data.doneAt).toLocaleDateString('vi', { year: '2-digit' }) }}</span>
      </template>
    </Column>
    <template #groupheader="slotProps">
      <span style="text-align: left">{{ slotProps.data.shortTitle + ' - ' + slotProps.data.product }}</span>
    </template>
    <template #footer>
      <div style="text-align:left">
        <Button label="Add" icon="pi pi-plus" @click="addNewJob" />
        <ToggleButton v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-check" offIcon="pi pi-times" />
      </div>
    </template>
    <template #empty>No records found.</template>
  </DataTable>
</template>

<script>
export default {
  name: 'JobColumn',
  components: {},
  data: () => ({
    filters: {},
    expandedRowGroups: [],
    enlarge: true,
  }),
  methods: {
    onToggleEnlarge() {
      this.$emit('toggle-enlarge')
    },
    addNewJob(e) {
      console.log(e)
    },
    onRowSelect(e) {
      this.$store.commit('JOB_SELECT', e.data._id)
    },
    onRowUnselect(e) {
      this.$store.commit('JOB_UNSELECT', e.data._id)
    },
  },
  computed: {
    selectedJobs: {
      get() {
        return this.$store.state.jobs_selected
      },
      set(value) {
        this.$store.commit('JOB_SELECTED', value)
      },
    },
    jobs() {
      return this.$store.state.jobs
    },
    jobsFilter() {
      return this.$store.state.jobs_filter
    },
  },
  mounted: function() {
    if (this.jobs.length == 0) {
      this.$socket.client.emit('all', 'jobs')
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
