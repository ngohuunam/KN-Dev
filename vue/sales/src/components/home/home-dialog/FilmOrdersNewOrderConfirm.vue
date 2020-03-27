<template>
  <DataTable :value="value" dataKey="_id">
    <Column field="name" header="Field"> </Column>
    <Column field="value" header="Detail"> </Column>
    <template #empty><div class="text-center">No records found.</div></template>
  </DataTable>
</template>

<script>
export default {
  name: 'FilmOrdersNewOrderConfirm',
  components: {},
  data: () => ({}),
  methods: {
    confirm() {
      this.$store.dispatch('filmOrdersList/newOrder')
    },
  },
  computed: {
    value() {
      return this.$store.getters['filmOrdersList/newOrderConfirmTableProperties']
    },
    newOrderLabels() {
      return this.$store.state.filmOrdersList.newOrderLabels
    },
  },
  mounted: function() {},
  beforeDestroy: function() {
    this.$store.commit('filmOrdersList/setState', { state: 'newOrderConverted', value: null })
  },
}
</script>

<style scoped></style>
