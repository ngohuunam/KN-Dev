<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logoKN.png" />
    <div class="p-grid">
      <div class="p-col">
        <Orders />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Orders from '@/components/Orders.vue'

export default {
  name: 'Homev2',
  components: {
    Orders,
  },
  data: () => ({}),
  methods: {},
  computed: {},
}
</script>

<style></style>
