<template>
  <div class="most-accessed">
    <header class="header-filter">
      <label class="mb-0 pb-0">Filtrar:</label>
      <select
        v-model="filter"
        @change="getData()"
        class="form-control form-control-sm"
      >
        <option value="H">Hoje</option>
        <option value="S">Essa Semana</option>
        <option value="M">Esse Mês</option>
        <option value="G">Geral</option>
      </select>
    </header>
    <div class="text-right text-secondary" style="font-size: 10pt">
      <span>* Os dados começaram a ser contabilizados no dia 01/04/2019</span>
    </div>
    <hr>
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
import moment from 'moment'
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
    filter: 'H',
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
          .filter(item => this.filterPeriod(item))

        this.chartTop10.CLI = this.createTop10(items, 'cliente')
        this.chartTop10.CON = this.createTop10(items, 'contabilidade')

        this.frequencies.CLI = this.createFrequency(items, 'cliente')
        this.frequencies.CON = this.createFrequency(items, 'contabilidade')

        items = null
      })
    },
    filterPeriod ({ createdAt }) {
      const itemDate = moment(createdAt)

      switch (this.filter) {
        case 'H':
          return itemDate.isSame(moment(), 'day')
        case 'S':
          return itemDate.isSame(moment(), 'week')
        case 'M':
          return itemDate.isSame(moment(), 'month')
        case 'G':
          return itemDate
      }
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
  .header-filter {
    color: #333;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    select {
      width: auto;
    }
  }
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
