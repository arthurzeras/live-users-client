<template>
  <div class="most-accessed">
    <div class="row info-header">
      <div class="header-title col-12 col-lg-6">
        <h2>Cliente</h2>
      </div>
      <div class="header-title col-12 col-lg-6">
        <h2>Contabilidade</h2>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-lg-6">
        <card-box title="TOP 10 Páginas mais acessadas">
          <top-10 type="CLI" :data="chartTop10.CLI"/>
        </card-box>
      </div>
      <div class="col-12 col-lg-6">
        <card-box title="TOP 10 Páginas mais acessadas">
          <top-10 type="CON" :data="chartTop10.CON"/>
        </card-box>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-lg-6">
        <card-box
          title="Frequência de uso (Horário)"
          :subtitle="frequencies.CLI.highest"
        >
          <schedule
            type="CLI"
            :data="frequencies.CLI.totals || []"
          />
        </card-box>
      </div>
      <div class="col-12 col-lg-6">
        <card-box
          title="Frequência de uso (Horário)"
          :subtitle="frequencies.CON.highest"
        >
          <schedule
            type="CON"
            :data="frequencies.CON.totals || []"
          />
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
  name: 'Stats',
  components: {
    Top10,
    CardBox,
    Schedule
  },
  data: () => ({
    chartTop10: {
      CON: {},
      CLI: {}
    },
    frequencies: {
      CON: {},
      CLI: {}
    }
  }),
  created () {
    window.charts = {}
    this.getData()
  },
  methods: {
    getData () {
      Firebase.database().ref().on('value', data => {
        let items = data.val()
        items = Object
          .keys(items)
          .map(item => items[item])
          .filter(item => item.env === 'prod')

        this.chartTop10.CLI = this.createTop10(items, 'cliente')
        this.chartTop10.CON = this.createTop10(items, 'contabilidade')

        this.frequencies.CLI = this.createFrequency(items, 'cliente')
        this.frequencies.CON = this.createFrequency(items, 'contabilidade')
      })
    },
    createTop10 (items = [], type) {
      const ignored = ['/logout', '/painel/contador']

      const data = items.filter(i => i.tipo === type)
      let counts = countBy(data, i => i.pagina)
      counts = Object.keys(counts)
        .filter(i => !ignored.includes(i))
        .map(i => ({ page: i, total: counts[i] }))

      const pagesMostAccessed = orderBy(counts, i => i.total, 'desc')

      const filterItems = param => (
        pagesMostAccessed.map(i => i[param]).splice(0, 10)
      )

      return {
        data: filterItems('total'),
        labels: filterItems('page')
      }
    },
    createFrequency (items = [], type) {
      const data = items.filter(i => i.tipo === type)
      const counts = countBy(data, i => new Date(i.createdAt).getHours())
      const totals = Array.from({ length: 24 }, (a, hour) => counts[hour] || 0)
      let highest = orderBy(counts, i => i, 'desc')[0]

      highest =
        'A maior frequência é entre ' +
        `${totals.indexOf(highest)}:00 e ` +
        `${totals.indexOf(highest) + 1}:00 ` +
        `com um total de ${highest} acessos.`

      return { totals, highest }
    }
  }
}
</script>

<style lang="scss" scoped>
.most-accessed {
  padding: 15px;
  overflow: hidden auto;
  height: calc(100vh - 71px);
  background-color: #E7E7E7;
  .info-header {
    text-align: center;
    .header-title:first-child { color: #0066FE }
    .header-title:last-child { color: #D72232 }
  }
}

@media (max-width: 768px) {
  .info-header {
    display: none;
  }
}
</style>
