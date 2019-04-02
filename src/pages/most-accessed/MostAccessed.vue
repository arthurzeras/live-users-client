<template>
  <div class="most-accessed">
    <card-box
      height="350px"
      title="TOP 10 Páginas mais acessadas"
    >
      <top-10 :data="charts.top10"/>
    </card-box>
  </div>
</template>

<script>
import CardBox from './CardBox'
import Top10 from './charts/Top10'
import countBy from 'lodash.countby'
import orderBy from 'lodash.orderby'
import { firebaseApp2 as Firebase } from '@/firebase'

export default {
  name: 'MostAccessed',
  components: {
    Top10,
    CardBox
  },
  data: () => ({
    items: []
  }),
  created () {
    window.charts = {}
    this.getData()
  },
  computed: {
    pagesMostAccessed () {
      let counts = countBy(this.items, i => i.pagina)
      counts = Object.keys(counts)
        .filter(i => i !== '/.')
        .map(i => ({ page: i, total: counts[i] }))

      return orderBy(counts, i => i.total, 'desc')
    },
    charts () {
      return {
        top10: {
          data: this.pagesMostAccessed.map(i => i.total).splice(0, 10),
          labels: this.pagesMostAccessed.map(i => i.page).splice(0, 10)
        }
      }
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
  padding: 15px;
  height: calc(100vh - 30px);
  background-color: #E7E7E7;
}
</style>
