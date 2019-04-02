<template>
  <div id="chart-top10">
    <canvas ref="top10"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'

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
      if (window.charts.top10) {
        window.charts.top10.destroy()
      }

      if (!this.$refs.top10) {
        setTimeout(() => {
          this.mountChart()
        }, 500)
      } else {
        const config = {
          type: 'horizontalBar',
          data: {
            labels: this.data.labels,
            datasets: [
              {
                data: this.data.data,
                backgroundColor: '#06f'
              }
            ]
          },
          options: {
            legend: false,
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false
                  }
                }
              ],
              yAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false
                  }
                }
              ]
            }
          }
        }

        const ctx = this.$refs.top10.getContext('2d')

        window.charts.top10 = new Chart(ctx, config)
      }
    }
  }
}
</script>

<style scoped>
  #chart-top10 {
    height: 300px;
    position: relative;
  }
</style>
