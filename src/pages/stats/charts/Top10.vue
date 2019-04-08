<template>
  <div class="chart-top10">
    <canvas :ref="referenceName"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { chartOptions } from './utils'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  props: {
    data: { type: Object, required: true },
    type: { type: String, required: true }
  },
  watch: {
    data: {
      immediate: true,
      handler (nv) {
        if (Object.keys(nv).length) {
          this.mountChart()
        }
      }
    }
  },
  computed: {
    referenceName () {
      return this.type === 'CLI'
        ? 'top10_CLI'
        : 'top10_CON'
    }
  },
  methods: {
    mountChart () {
      if (!this.$refs[this.referenceName]) {
        setTimeout(() => {
          this.mountChart()
        }, 500)
      } else {
        if (window.charts[this.referenceName]) {
          window.charts[this.referenceName].data.labels = this.data.labels
          window.charts[this.referenceName].data.datasets[0].data = this.data.data
          window.charts[this.referenceName].update()
        } else {
          const config = {
            type: 'horizontalBar',
            data: {
              labels: this.data.labels,
              datasets: [
                {
                  data: this.data.data,
                  backgroundColor: this.type === 'CLI'
                    ? '#0066FE'
                    : '#D72232'
                }
              ]
            },
            plugins: [ChartDataLabels],
            options: {
              ...chartOptions,
              layout: {
                padding: {
                  right: 40
                }
              },
              scales: {
                ...chartOptions.scales,
                xAxes: [{ display: false }]
              },
              plugins: {
                datalabels: {
                  align: 'end',
                  anchor: 'end',
                  color: '#333'
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

<style scoped>
  .chart-top10 {
    height: 280px;
    position: relative;
  }
</style>
