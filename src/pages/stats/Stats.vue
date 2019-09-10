<template>
  <div id="stats">
    <div class="row charts">
      <div class="col">
        <h3 class="text-center text-primary">Cliente</h3>
        <canvas ref="chart-cliente"/>
      </div>
      <div class="col">
        <h3 class="text-center text-danger">Contador</h3>
        <canvas ref="chart-contador"/>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { chartOptions } from './charts/utils'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  data: () => ({
    datasets: {
      cliente: [],
      contador: []
    },
    charts: {
      cliente: null,
      contador: null
    }
  }),
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      try {
        const { data } = await this.$firebase.functions()
          .httpsCallable('findNavigations')({ filter: 'H' })

        this.datasets = data

        this.mountCharts('cliente')
        this.mountCharts('contador')
      } catch (error) {
        console.error(error)
      }
    },
    async mountCharts (type) {
      const config = {
        type: 'horizontalBar',
        data: {
          labels: this.datasets[type].map(i => i.page),
          datasets: [
            {
              data: this.datasets[type].map(i => i.total),
              backgroundColor: type === 'cliente' ? '#0066FE' : '#D72232'
            }
          ]
        },
        plugins: [ChartDataLabels],
        options: {
          ...chartOptions,
          layout: { padding: { right: 40 } },
          scales: {
            ...chartOptions.scales,
            xAxes: [{ display: false }]
          },
          plugins: {
            datalabels: {
              align: 'end',
              anchor: 'end',
              color: '#ddd'
            }
          }
        }
      }

      Chart.defaults.global.defaultFontColor = '#ddd'
      const ctx = this.$refs[`chart-${type}`].getContext('2d')
      this.charts[type] = new Chart(ctx, config)
    }
  }
}
</script>

<style lang="scss" scoped>
#stats {
  height: 100vh;
  display: flex;
  background: #111;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 71px);

  .charts {
    position: relative;
    height: 50%;
    width: 100%;
  }
}
</style>
