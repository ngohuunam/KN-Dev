<template>
  <DataTable :value="jobs" :filters="filters" :paginator="true" :rows="10" :rowHover="true">
    <template #header>
      <div style="text-align: left">
        <InputText v-model="filters['global']" placeholder="Global Search" size="50" />
      </div>
    </template>
    <Column field="shortTitle" header="Short Title" filterMatchMode="contains">
      <template #filter>
        <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <Column field="month" header="Month" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['month']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <Column field="day" header="Day" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['day']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <Column field="product" header="Product" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['product']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <Column field="job" header="Job" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['product']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <Column field="createdAt" header="Created At" filterMatchMode="contains" :sortable="true">
      <template #body="slotProps">
        <span>{{ new Date(slotProps.data.createdAt).toLocaleDateString('vi') }}</span>
      </template>
    </Column>
    <Column field="startAt" header="Start At" filterMatchMode="contains" :sortable="true">
      <template #body="slotProps">
        <span>{{ new Date(slotProps.data.startAt).toLocaleDateString('vi') }}</span>
      </template>
    </Column>
    <Column field="doneAt" header="Done At" filterMatchMode="contains" :sortable="true">
      <template #body="slotProps">
        <span>{{ new Date(slotProps.data.doneAt).toLocaleDateString('vi') }}</span>
      </template>
    </Column>
    <Column field="endAt" header="End At" filterMatchMode="contains" :sortable="true">
      <template #body="slotProps">
        <span>{{ new Date(slotProps.data.endAt).toLocaleDateString('vi') }}</span>
      </template>
    </Column>
    <Column field="mainStaff" header="Main Staff" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['mainStaff']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <Column field="backupStaff" header="Backup Staff" filterMatchMode="contains" :sortable="true">
      <template #filter>
        <InputText type="text" v-model="filters['backupStaff']" class="p-column-filter" placeholder="Contains" />
      </template>
    </Column>
    <template #empty>No records found.</template>
  </DataTable>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Jobs',
  props: {},
  data: () => ({
    filters: {},
  }),
  methods: {},
  computed: mapState(['jobs']),
  mounted: function() {
    this.$socket.client.emit('all', 'jobs')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
