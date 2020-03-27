<template>
  <DataTable :value="value" data-key="_id">
    <Column field="name" header="Field"> </Column>
    <Column field="value" header="Detail"> </Column>
    <template #empty><div class="text-center">No records found.</div></template>
  </DataTable>
</template>

<script>
export default {
  name: 'FilmOrdersNewProdConfirm',
  components: {},
  data: () => ({}),
  methods: {
    confirm() {
      this.$store.dispatch('filmOrdersList/newProdSave')
    },
  },
  computed: {
    value() {
      return this.$store.getters['filmOrdersList/newProdConfirmTableProperties']
    },
    newProdLabels() {
      return this.$store.state.filmOrdersList.newProdLabels
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.$store.commit('filmOrdersList/setState', { state: 'newProdConverted', value: null })
  },
}
</script>

<style scoped></style>
