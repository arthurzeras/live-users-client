<template>
  <div id="chart-top10">
    <canvas ref="top10"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { chartOptions } from './utils'

export default {
  props: {
    data: { type: Object, required: true }
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
  methods: {
    mountChart () {
      if (!this.$refs.top10) {
        setTimeout(() => {
          this.mountChart()
        }, 500)
      } else {
        if (window.charts.top10) {
          window.charts.top10.data.labels = this.data.labels
          window.charts.top10.data.datasets[0].data = this.data.data
          window.charts.top10.update()
        } else {
          const config = {
            data: {
              labels: this.data.labels,
              datasets: [
                {
                  data: this.data.data,
                  backgroundColor: '#06f'
                }
              ]
            },
            type: 'horizontalBar',
            options: chartOptions
          }

          const ctx = this.$refs.top10.getContext('2d')

          window.charts.top10 = new Chart(ctx, config)
        }
      }
    }
  }
}
</script>

<style scoped>
  #chart-top10 {
    height: 280px;
    position: relative;
  }
</style>
