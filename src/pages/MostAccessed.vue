<template>
  <div class="most-accessed">
    paginas mais acessadas
  </div>
</template>

<script>
import { firebaseApp2 as Firebase } from '@/firebase'

export default {
  name: 'MostAccessed',
  data: () => ({
    items: []
  }),
  created () {
    this.getData()
  },
  methods: {
    getData () {
      Firebase.database().ref().on('value', data => {
        const items = data.val()
        this.items = Object
          .keys(items)
          .map(item => items[item])
          .filter(item => item.env === 'prod')
      })
    }
  }
}
</script>

<style style="scss" scoped>
.most-accessed {
  height: 100vh;
  background-color: #333;
}
</style>
