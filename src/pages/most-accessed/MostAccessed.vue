<template>
  <div class="most-accessed">
    <card-box
      height="350px"
      title="TOP 10 Páginas mais acessadas"
    >
      <top-10 :data="charts.top10"/>
    </card-box>

    <div class="row">
      <div class="col-6">
        <card-box
          title="Frequência de uso (Horário)"
          :subtitle="frequencies.schedule.highest"
        >
          <schedule :data="frequencies.schedule.totals"/>
        </card-box>
      </div>
    </div>

  </div>
</template>

<script>
import CardBox from './CardBox'
import Top10 from './charts/Top10'
import countBy from 'lodash.countby'
import orderBy from 'lodash.orderby'
import Schedule from './charts/Schedule'
import { firebaseApp2 as Firebase } from '@/firebase'

export default {
  name: 'MostAccessed',
  components: {
    Top10,
    CardBox,
    Schedule
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
        .map(i => ({ page: i, total: counts[i] }))

      return orderBy(counts, i => i.total, 'desc')
    },
    frequencies () {
      const payload = {
        schedule: {
          totals: [],
          highest: ''
        }
      }

      if (this.items.length) {
        const counts = countBy(this.items, i => new Date(i.createdAt).getHours())
        payload.schedule.totals = Array.from({ length: 24 }, (a, hour) => counts[hour] || 0)

        const highest = orderBy(counts, i => i, 'desc')[0]
        payload.schedule.highest =
          'A maior frequência foi entre ' +
          `${payload.schedule.totals.indexOf(highest)}:00 e ` +
          `${payload.schedule.totals.indexOf(highest) + 1}:00 ` +
          `com um total de ${highest} acessos.`
      }

      return payload
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

<style lang="scss" scoped>
.most-accessed {
  padding: 15px;
  overflow: hidden auto;
  height: calc(100vh - 30px);
  background-color: #E7E7E7;
  .row {
    display: flex;
    .col-6 {
      width: 50%;
      flex: 0 0 50%;
    }
  }
}
</style>
