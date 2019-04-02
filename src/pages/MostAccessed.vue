<template>
  <div class="most-accessed">
    paginas mais acessadas
  </div>
</template>

<script>
import countBy from 'lodash.countby'
import orderBy from 'lodash.orderby'
import { firebaseApp2 as Firebase } from '@/firebase'

export default {
  name: 'MostAccessed',
  data: () => ({
    items: []
  }),
  created () {
    this.getData()
  },
  computed: {
    pagesMostAccessed () {
      let counts = countBy(this.items, i => i.pagina)
      counts = Object.keys(counts)
        .filter(i => i !== '/.')
        .map(i => ({ page: i, total: counts[i] }))

      return orderBy(counts, i => i.total, 'desc')
    }
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
