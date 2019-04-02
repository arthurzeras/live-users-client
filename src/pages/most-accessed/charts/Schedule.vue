<template>
  <div id="chart-schedule">
    <canvas ref="schedule"/>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: {
    data: { type: Array, required: true }
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
      if (window.charts.schedule) {
        window.charts.schedule.destroy()
      }

      if (!this.$refs.schedule) {
        setTimeout(() => {
          this.mountChart()
        }, 500)
      } else {
        const config = {
          type: 'line',
          data: {
            labels: Array.from({ length: 24 }, (a, i) => i),
            datasets: [
              {
                data: this.data,
                borderColor: '#D72232',
                backgroundColor: '#D7223212'
              }
            ]
          },
          options: {
            legend: false,
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
            },
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
</script>

<style>
#chart-schedule {
  position: relative;
}
</style>
