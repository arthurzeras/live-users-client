<template>
  <div class="chart-schedule">
    <canvas :ref="referenceName"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { chartOptions } from './utils'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  props: {
    data: { type: Array, required: true },
    type: { type: String, required: true }
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
  computed: {
    referenceName () {
      return this.type === 'CLI'
        ? 'schedule_CLI'
        : 'schedule_CON'
    }
  },
  methods: {
    mountChart () {
      if (!this.$refs[this.referenceName]) {
        setTimeout(() => {
          this.mountChart()
        }, 500)
      } else {
        const labels = Array.from({ length: 24 }, (a, i) => i)

        if (window.charts[this.referenceName]) {
          window.charts[this.referenceName].data.labels = labels
          window.charts[this.referenceName].data.datasets[0].data = this.data
          window.charts[this.referenceName].update()
        } else {
          const config = {
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  data: this.data,
                  borderColor: this.type === 'CLI'
                    ? '#0066FE'
                    : '#D72232',
                  backgroundColor: this.type === 'CLI'
                    ? '#0066FE12'
                    : '#D7223212'
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

          const ctx = this.$refs[this.referenceName].getContext('2d')
          window.charts[this.referenceName] = new Chart(ctx, config)
        }
      }
    }
  }
}
</script>

<style>
.chart-schedule {
  position: relative;
}
</style>
