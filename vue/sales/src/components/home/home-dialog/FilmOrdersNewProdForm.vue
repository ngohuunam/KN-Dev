<template>
  <div>
    <div class="p-grid p-fluid" v-for="item in newProdLabels" :key="item.label">
      <div class="p-col-4" style="margin: auto;">
        <label>{{ item.label }}</label>
      </div>
      <div class="p-col-8">
        <InputText v-if="item.inputType === 'text'" v-model="newProd[item.key]" :disabled="disabled" />
        <Calendar v-else-if="item.inputType === 'calendar'" :showTime="item.showTime" v-model="newProd[item.key]" :dateFormat="item.dateFormat" :disabled="disabled" />
        <Dropdown v-else-if="item.inputType === 'dropdown'" v-model="newProd[item.key]" :options="item.options" :disabled="disabled" />
      </div>
    </div>
    <NewEditor v-model="newProd.details" NewEditorStyle="height: 60px" :readOnly="disabled">
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
    </NewEditor>
    <!-- <Textarea v-model="log" :autoResize="true" rows="2" cols="30" /> -->
    <!-- </div> -->
    <div class="margin-top">
      <FileUpload mode="advanced" name="demo[]" url="./upload" :disabled="disabled" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import defaultState from '@/assets/defaultState'

export default {
  name: 'FilmOrdersNewProdForm',
  components: {},
  props: {
    cp: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    log: '',
  }),
  methods: {
    confirm() {
      let _newId = 'abc'
      let _requiredMess = ''
      let _idExistedMess = ''
      let _validateMess = ''
      if (this.newProd.name) {
        _newId = this.cp._id + '.' + this.newProd.name.toProperCase().replace(/\s/g, '')
        if (this.cp.products.some(fp => fp === _newId)) _idExistedMess = _newId + ' EXISTED'
      } else _requiredMess = 'Product Name'
      if (!this.newProd.type) _requiredMess += _requiredMess ? ' + Type ' : 'Type'
      if (_requiredMess) _requiredMess = `${_requiredMess} ${_requiredMess.indexOf('+') > -1 ? 'ARE' : 'IS'} REQUIRED`
      if (_idExistedMess && !_requiredMess) _validateMess = _idExistedMess
      else if (!_idExistedMess && _requiredMess) _validateMess = _requiredMess
      else if (_idExistedMess && _requiredMess) _validateMess = `${_idExistedMess} - ${_requiredMess}`
      if (_validateMess) this.dialogMess = { text: _validateMess, severity: 'error' }
      else {
        this.$store.commit('filmOrdersList/createNewProd', { _id: _newId, user: this.$store.state.user, orderId: this.cp._id, orderRev: this.cp._rev, log: this.log })
        this.$emit('switch-comp', 'newProdConfirm', 'Save', 'Save new product confirm')
        if (this.dialogMess.text) this.dialogMess = { text: '', severity: '' }
      }
    },
  },
  computed: {
    newProdLabels() {
      return this.$store.state.filmOrdersList.newProdLabels
    },
    dialogMess: {
      get() {
        return this.$store.state.dialog.message
      },
      set(value) {
        this.$store.commit('dialog/setMess', value)
      },
    },
    newProd: {
      get() {
        return this.$store.state.filmOrdersList.newProd
      },
      set(value) {
        this.$store.commit('filmOrdersList/setState', { state: 'newProd', value: value })
      },
    },
  },
  created: function() {
    this.newProd = defaultState.newProd
  },
  beforeDestroy: function() {},
}
</script>

<style scoped></style>
