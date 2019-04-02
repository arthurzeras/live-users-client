<template>
  <div id="chart-schedule">
    <canvas ref="schedule"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { chartOptions } from './utils'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  props: {
    data: { type: Array, required: true }
  },
  mounted () {
    Chart.plugins.unregister(ChartDataLabels)
  },
  watch: {
    data: {
      immediate: true,
      handler (nv) {
        if (nv.length) {
          this.mountChart()
        }
      }
    }
  },
  methods: {
    mountChart () {
      if (!this.$refs.schedule) {
        setTimeout(() => {
          this.mountChart()
        }, 500)
      } else {
        const labels = Array.from({ length: 24 }, (a, i) => i)

        if (window.charts.schedule) {
          window.charts.schedule.data.labels = labels
          window.charts.schedule.data.datasets[0].data = this.data
          window.charts.schedule.update()
        } else {
          const config = {
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  data: this.data,
                  borderColor: '#D72232',
                  backgroundColor: '#D7223212'
                }
              ]
            },
            options: {
              ...chartOptions,
              tooltips: {
                callbacks: {
                  title: item => `${item[0].label} hrs`,
                  label: item => `${item.value} acessos`
                }
              }
            }
          }

          const ctx = this.$refs.schedule.getContext('2d')
          window.charts.schedule = new Chart(ctx, config)
        }
      }
    }
  }
}
</script>

<style>
#chart-schedule {
  position: relative;
}
</style>
