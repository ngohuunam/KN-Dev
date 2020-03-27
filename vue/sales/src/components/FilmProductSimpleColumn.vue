<template>
  <div v-if="prodList.length > 0">
    <DataTable :value="prodList" data-key="_id" :selection.sync="prodListSelected" :filters="filters" :rowHover="true" :loading="loading" loadingIcon="">
      <template #header>
        <div class="table-header-container">
          <div style="text-align: left">
            <InputText v-model="filters['global']" placeholder="Search" :style="enlarge ? 'width: 30%;' : 'width: 100%;'" />
          </div>
        </div>
      </template>
      <template #loading>
        <div class="text-center">Loading records...</div>
        <ProgressBar mode="indeterminate" />
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3em" :sortable="true" sortField="selected"></Column>
      <!-- <Column v-if="enlarge" :expander="true" headerStyle="width: 3em" /> -->
      <Column field="_id" header="ID" :headerStyle="enlarge ? 'width: 12%' : ''" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['_id']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <span>{{ slotProps.data._id.replace('.', ' - ').toProperCase() }}</span>
        </template>
      </Column>
      <Column v-if="enlarge" field="premiereDate" header="NKC" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['premiereDate']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <span>{{ slotProps.data.premiereDate ? timestampToString(slotProps.data.premiereDate, false) : '.....' }}</span>
        </template>
      </Column>
      <Column v-if="enlarge" field="status" header="Status" filterMatchMode="in" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['status']" class="p-column-filter" />
          <!-- <MultiSelect v-model="filters['status']" :options="orders" optionLabel="status" optionValue="status" placeholder="All" class="p-column-filter"></MultiSelect> -->
        </template>
      </Column>
      <Column v-if="enlarge" field="createdAt" header="Create" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['createdAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <span>{{ timestampToString(slotProps.data.createdAt, true) }}</span>
        </template>
      </Column>
      <Column v-if="enlarge" field="endAt" header="End" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['endAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <span>{{ slotProps.data.endAt ? timestampToString(slotProps.data.endAt, true) : '.....' }}</span>
        </template>
      </Column>
      <Column v-if="enlarge" field="finishAt" header="Finish" headerStyle="width: 10%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['finishAt']" class="p-column-filter" />
        </template>
        <template #body="slotProps">
          <span>{{ slotProps.data.finishAt ? timestampToString(slotProps.data.finishAt, true) : '.....' }}</span>
        </template>
      </Column>
      <Column v-if="enlarge" field="foreignTitle" header="Foreign Title" headerStyle="width: 20%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['foreignTitle']" class="p-column-filter" />
        </template>
      </Column>
      <Column v-if="enlarge" field="vietnameseTitle" header="Vietnamese Title" headerStyle="width: 20%" filterMatchMode="contains" :sortable="true">
        <template #filter>
          <InputText type="text" v-model="filters['vietnameseTitle']" class="p-column-filter" />
        </template>
      </Column>
      <template #footer>
        <div style="text-align:left">
          <Button :label="enlarge ? 'Create New Order' : ''" icon="pi pi-plus" @click="addNewOrder" class="margin-right" />
          <Button :label="enlarge ? 'Load Details' : ''" icon="pi pi-download" @click="loadOrderDetail" :disabled="prodListSelected.length === 0" class="margin-right" />
          <Button :label="enlarge ? 'Delete Orders' : ''" icon="pi pi-minus" @click="delOrder" class="p-button-danger margin-right" />
          <ToggleButton v-model="enlarge" @change="onToggleEnlarge" onIcon="pi pi-angle-left" offIcon="pi pi-angle-right" />
        </div>
      </template>
      <template #empty><div class="text-center">No records found.</div></template>
    </DataTable>

    <!-- <ProgressSpinner v-if="filmOrdersListLoading" /> -->
    <Dialog
      :visible.sync="openDialog"
      :style="{ width: '360px' }"
      @keydown-enter="onDialogSave"
      @keydown-escape="onDialogCancel"
      :header="wantDelOrder ? 'DELETE ORDERS - THIS ACTION IS UNDONE' : 'Create New Film Order'"
      :closable="false"
      :modal="true"
      :contentStyle="{ overflow: 'visible' }"
    >
      <BlockUI :blocked="loading" fullScreen>
        <div v-if="createNewOrder">
          <div class="p-grid p-fluid" v-for="item in newOrderLabels" :key="item.label">
            <div class="p-col-4" style="margin: auto;">
              <label>{{ item.label }}</label>
            </div>
            <div class="p-col-8">
              <InputText v-if="item.inputType === 'text'" v-model="newOrder[item.key]" />
              <Calendar v-else-if="item.inputType === 'calendar-full'" v-model="newOrder[item.key]" dateFormat="dd/mm/yy" />
              <Calendar v-else-if="item.inputType === 'calendar'" :showTime="true" v-model="newOrder[item.key]" dateFormat="dd/mm/y" />
              <Dropdown v-else-if="item.inputType === 'dropdown'" v-model="newOrder[item.key]" :options="item.options" />
            </div>
          </div>
        </div>
        <div v-else-if="wantDelOrder">
          <DataTable :value="prodListSelected" data-key="_id" :selection.sync="filmOrdersListWillDelete" :rowHover="true">
            <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
            <Column field="shortTitle" header="Short Title"> </Column>
            <Column field="premiereDate" header="NKC">
              <template #body="slotProps">
                <span>{{ slotProps.data.premiereDate ? timestampToString(slotProps.data.premiereDate, false) : '.....' }}</span>
              </template>
            </Column>
            <template #empty><div class="text-center">No records found.</div></template>
          </DataTable>
        </div>
        <Message v-if="message.text" @close-message="closeMessage" :severity="message.severity">{{ message.text }}</Message>
      </BlockUI>

      <template #footer>
        <Button :label="wantDelOrder ? 'Delete All' : 'Save'" :icon="buttonIcon" @click="onDialogSave" class="p-button-success" />
        <Button label="Cancel" icon="pi pi-times" @click="onDialogCancel" class="p-button-danger" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import defaultState from '@/assets/defaultState'
const defaultNewOrder = JSON.stringify(defaultState.newOrder)

export default {
  name: 'FilmProductSimpleColumn',
  components: {},
  data: () => ({
    filters: {},
    filmOrdersListWillDelete: [],
    enlarge: true,
    newOrderLabels: [
      { label: 'Short Title:', inputType: 'text', key: 'shortTitle' },
      { label: 'Team:', inputType: 'dropdown', key: 'team', options: ['CJHK', 'Disney', 'Local', 'UIP', 'WB'] },
      { label: 'Foreign Title:', inputType: 'text', key: 'foreignTitle' },
      { label: 'Vietnamese Title:', inputType: 'text', key: 'vietnameseTitle' },
      { label: 'Premiere Date:', inputType: 'calendar-full', key: 'premiereDate' },
      { label: 'End Date:', inputType: 'calendar', key: 'endAt' },
    ],
  }),
  methods: {
    loadOrderDetail() {
      // this.$store.dispatch('filmOrdersList/getOrderDetail')
    },
    closeMessage() {
      this.message = { text: '', severity: '' }
    },
    onToggleEnlarge() {
      this.$emit('toggle-enlarge')
    },
    addNewOrder() {
      this.createNewOrder = true
    },
    delOrder() {
      this.wantDelOrder = true
    },
    timestampToString(timestamp, addTime) {
      const _newDate = new Date(timestamp)
      const _opt = { day: '2-digit', month: '2-digit', year: '2-digit' }
      const _optAddTime = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit' }
      return _newDate.toLocaleDateString('vi', addTime ? _optAddTime : _opt)
    },
    onDialogSave() {
      if (this.wantDelOrder) this.deleteAllOrdersSelected()
      else if (this.createNewOrder) this.saveNewOrder()
    },
    onDialogCancel() {
      if (this.wantDelOrder) {
        this.wantDelOrder = false
        this.filmOrdersListWillDelete = []
      } else if (this.createNewOrder) this.cancelNewOrder()
      this.message = { text: '', severity: '' }
    },
    deleteAllOrdersSelected() {
      if (this.filmOrdersListWillDelete.length === this.prodListSelected.length) {
        this.wantDelOrder = false
        this.prodListSelected = []
        const _delList = this.filmOrdersListWillDelete.map(fo => fo._id)
        this.filmOrdersListWillDelete = []
        this.$store.commit('filmOrdersList/filterSome', { state: 'list', _ids: _delList })
      } else this.message = { text: 'Select All to Confirm', severity: 'esrror' }
    },
    saveNewOrder() {
      let _validateMess = ''
      if (!this.newOrder.shortTitle) _validateMess = 'Short Title'
      if (!this.newOrder.team) _validateMess += _validateMess ? ' + Team ' : 'Team'
      if (!this.newOrder.foreignTitle) _validateMess += _validateMess ? ' + Foreign Title' : 'Foreign Title'
      if (_validateMess) {
        const _mess = `${_validateMess} ${_validateMess.indexOf('+') > -1 ? 'ARE' : 'IS'} REQUIRED`
        this.message = { text: _mess, severity: 'error' }
      } else this.$store.dispatch('filmOrdersList/newOrder')
    },
    cancelNewOrder() {
      this.newOrder = JSON.parse(defaultNewOrder)
      this.createNewOrder = false
    },
  },
  computed: {
    prodListSelected: {
      get() {
        return this.$store.state.filmOrdersList.prodListSelected
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'prodListSelected', value: value })
      },
    },
    openDialog: {
      get() {
        return this.$store.getters['filmOrdersList/openDialog']
      },
      set(value) {
        this.$store.commit('filmOrdersList/setStates', { states: ['createNewOrder', 'wantDelOrder'], values: [value, value] })
      },
    },
    buttonIcon() {
      return this.loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'
    },
    wantDelOrder: {
      get() {
        return this.$store.state.filmOrdersList.wantDelOrder
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'wantDelOrder', value: value })
      },
    },
    createNewOrder: {
      get() {
        return this.$store.state.filmOrdersList.createNewOrder
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'createNewOrder', value: value })
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
    message: {
      get() {
        return this.$store.state.filmOrdersList.message
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'message', value: value })
      },
    },
    ...mapState({
      prodList: state => state.filmOrdersList.prodList,
      loading: state => state.filmOrdersList.loading,
    }),
  },
  created: function() {
    // this.$store.dispatch('filmOrdersList/getList')
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
.margin-right {
  margin-right: 4px;
}
</style>
