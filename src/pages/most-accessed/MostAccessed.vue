<template>
  <div class="most-accessed">
    <div class="row info-header">
      <div class="col-6"><h2>Cliente</h2></div>
      <div class="col-6"><h2>Contabilidade</h2></div>
    </div>

    <div class="row">
      <div class="col-6">
        <card-box title="TOP 10 Páginas mais acessadas">
          <top-10 type="CLI" :data="chartTop10.CLI"/>
        </card-box>
      </div>
      <div class="col-6">
        <card-box title="TOP 10 Páginas mais acessadas">
          <top-10 type="CON" :data="chartTop10.CON"/>
        </card-box>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <card-box
          title="Frequência de uso (Horário)"
          :subtitle="frequencies.CLI.highest"
        >
          <schedule type="CLI" :data="frequencies.CLI.totals"/>
        </card-box>
      </div>
      <div class="col-6">
        <card-box
          title="Frequência de uso (Horário)"
          :subtitle="frequencies.CON.highest"
        >
          <schedule type="CON" :data="frequencies.CON.totals"/>
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
      const orderItems = type => {
        const items = this.items.filter(i => i.tipo === type)
        let counts = countBy(items, i => i.pagina)
        counts = Object.keys(counts)
          .map(i => ({ page: i, total: counts[i] }))

        return orderBy(counts, i => i.total, 'desc')
      }

      return {
        CLI: orderItems('cliente'),
        CON: orderItems('contabilidade')
      }
    },
    frequencies () {
      const createFrequency = type => {
        const items = this.items.filter(i => i.tipo === type)
        const counts = countBy(items, i => new Date(i.createdAt).getHours())
        const totals = Array.from({ length: 24 }, (a, hour) => counts[hour] || 0)
        let highest = orderBy(counts, i => i, 'desc')[0]

        highest =
          'A maior frequência foi entre ' +
          `${totals.indexOf(highest)}:00 e ` +
          `${totals.indexOf(highest) + 1}:00 ` +
          `com um total de ${highest} acessos.`

        return { totals, highest }
      }

      return {
        CLI: createFrequency('cliente'),
        CON: createFrequency('contabilidade')
      }
    },
    chartTop10 () {
      const filterItems = (type, param) => (
        this.pagesMostAccessed[type]
          .map(i => i[param])
          .splice(0, 10)
      )

      return {
        CLI: {
          data: filterItems('CLI', 'total'),
          labels: filterItems('CLI', 'page')
        },
        CON: {
          data: filterItems('CON', 'total'),
          labels: filterItems('CON', 'page')
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
  height: 100vh;
  overflow: hidden auto;
  background-color: #E7E7E7;
  .info-header {
    text-align: center;
    .col-6:first-child h2 { color: #0066FE }
    .col-6:last-child h2 { color: #D72232 }
  }
}
</style>
