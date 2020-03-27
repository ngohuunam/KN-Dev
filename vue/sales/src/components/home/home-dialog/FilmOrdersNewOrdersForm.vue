<template>
  <div>
    <DataTable :value="orders" dataKey="_id" editMode="cell">
      <!-------------------- < Column Remove Order > --------------------->
      <Column headerStyle="width: 2.6em; text-align: center" bodyStyle="text-align: center; overflow: visible; padding: 4px 0">
        <template #body="slotProps">
          <Button type="button" icon="pi pi-minus" class="p-button-danger margin-right" @click="remove(slotProps.data)"></Button>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column field="foreignTitle" header="Foreign Title">
        <template #editor="slotProps">
          <InputText v-model="slotProps.data.foreignTitle" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> MUST FILL </span>
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column field="team" header="Team">
        <template #editor="slotProps">
          <Dropdown v-model="slotProps.data.team" :options="options" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> MUST FILL </span>
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column field="premiereDate" header="NKC">
        <template #editor="slotProps">
          <!-- <Calendar v-model="slotProps.data.premiereDate" dateFormat="dd/mm/yy" style="width: 100%" /> -->
          <InputMask v-model="slotProps.data[slotProps.column.field]" mask="99/99/2020" slotChar="dd/mm/yyyy" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> WRONG FORMAT </span>
          <span v-else> {{ $tToString(parseDateTime(slotProps, false), false, 'INVALID', 'numeric') }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column field="endAt" header="End Date">
        <template #editor="slotProps">
          <!-- <Calendar v-model="slotProps.data.endAt" dateFormat="dd/mm/yy" style="width: 100%" showTime /> -->
          <InputMask v-model="slotProps.data[slotProps.column.field]" mask="99/99/2020 99:99" slotChar="dd/mm/yyyy hh:mm" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field] && !errors[slotProps.index][slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else-if="!slotProps.data[slotProps.column.field] && errors[slotProps.index][slotProps.column.field]" style="color: orange;"> WRONG FORMAT </span>
          <span v-else> {{ $tToString(parseDateTime(slotProps, true), true, 'INVALID', 'numeric') }} </span>
        </template>
      </Column>
      <!-------------------- < Column > --------------------->
      <Column field="vietnameseTitle" header="Vietnamese Title">
        <template #editor="slotProps">
          <InputText v-model="slotProps.data.vietnameseTitle" />
        </template>
        <template #body="slotProps">
          <span v-if="!slotProps.data[slotProps.column.field]" style="color: gray;"> - EDIT - </span>
          <span v-else> {{ slotProps.data[slotProps.column.field] }} </span>
        </template>
      </Column>
      <!-------------------- < Footer > --------------------->
      <template #footer> <Button label="Add one more" icon="pi pi-plus" @click="add" /> </template>
    </DataTable>
    <!-- <NewEditor v-model="newProd.details" NewEditorStyle="height: 60px" :readOnly="disabled">
      <template slot="toolbar">
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          <button class="ql-code-block"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </template>
    </NewEditor> -->
    <!-- <Textarea v-model="log" :autoResize="true" rows="2" cols="30" /> -->
    <!-- </div> -->
    <!-- <div class="margin-top">
      <FileUpload mode="advanced" name="demo[]" url="./upload" :disabled="disabled" />
    </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import defaultState from '@/assets/defaultState'
import tools from '@/tools'

const randomOrderId = () => Date.now() + Math.floor(Math.random() * 100 + 1)
const randomNewOrder = () => ({ ...defaultState.newOrder, ...{ _id: randomOrderId() } })

export default {
  name: 'FilmOrdersNewOrdersForm',
  components: {},
  props: {
    // cp: {
    //   type: Object,
    //   required: true,
    // },
    // disabled: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
  },
  data: () => ({
    options: ['CJHK', 'Disney', 'Local', 'UIP', 'WB'],
    log: '',
    orders: [],
    errors: [],
  }),
  methods: {
    parseDateTime(slotProps, hasTime) {
      const _field = slotProps.column.field
      const _str = slotProps.data[_field]
      const _unix = tools.dateToUnix(_str, hasTime)
      if (isNaN(_unix)) this.errors[slotProps.index][_field] = true
      else return _unix
    },
    add() {
      const _newRow = randomNewOrder()
      this.orders.push(_newRow)
      this.errors.push({ _id: false, rowId: _newRow._id, team: false, foreginTitle: false })
    },
    remove(data) {
      this.orders = this.orders.filter(v => v._id !== data._id)
      this.errors = this.errors.filter(v => v.rowId !== data._id)
    },
    confirm() {
      let _requiredErr = false
      let _existedIds = []
      this.orders.map((v, i) => {
        if (!v.foreignTitle) {
          this.errors[i].foreignTitle = true
          _requiredErr = true
        } else {
          v._id = v.foreignTitle.toDataId()
          this.errors[i].rowId = v._id
          if (this.$store.getters['filmOrdersList/isExisted'](v._id)) {
            this.errors[i]._id = true
            _existedIds.push(v._id)
          }
        }
        if (!v.foreignTitle) {
          this.errors[i].foreignTitle = true
          _requiredErr = true
        }
        if (!v.team) {
          this.errors[i].team = true
          _requiredErr = true
        }
      })
      let _mess = ''
      if (_requiredErr && !_existedIds.length) _mess = 'Orange Field Required'
      else if (!_requiredErr && _existedIds.length) _mess = _existedIds.join(', ') + ' Existed'
      else if (_requiredErr && _existedIds.length) _mess = _existedIds.join(', ') + ' Existed && Orange Field Required'

      if (_mess) this.dialogMess = { text: _mess, severity: 'error' }
      else this.$store.dispatch('filmOrdersList/newOrders', this.orders)
    },
  },
  computed: {
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('dialog/setMess', value)
      },
    },
  },
  created: function() {
    this.add()
  },
  beforeDestroy: function() {},
}
</script>

<style scoped></style>
