<template>
  <img
    id="rocket"
    ref="rocket"
    alt="Rocket"
    v-if="showRocket"
    src="https://media.giphy.com/media/3pB3a5842soMe2RbBL/giphy.gif"
  >
</template>

<script>
import { state } from '@/store'

export default {
  data: () => ({ lastTen: 0, showRocket: false }),
  watch: {
    count () {
      if (this.count % 10 === 0 && this.count > this.lastTen) {
        this.showRocket = true
        this.lastTen = this.count
      }
    },
    showRocket (nv) {
      if (nv) {
        setTimeout(() => { this.showRocket = false }, 9000)
      }
    }
  },
  computed: {
    count () {
      return state.total
    }
  }
}
</script>

<style scoped lang="scss">
#rocket {
  bottom: 0;
  left: -15%;
  width: 200px;
  position: absolute;
  animation: animate-rocket 9s infinite;
}

@keyframes animate-rocket {
  from {
    bottom: 0;
    left: -15%;
  }

  75% {
    bottom: 0;
    left: calc(50% - 100px);
    transform: rotate(-45deg);
  }

  to {
    bottom: 100%;
    left: calc(50% - 100px);
    transform: rotate(-45deg);
  }
}
</style>
