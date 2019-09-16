<template>
  <div id="counter">
    <div class="sides">
      <div class="number" v-html="totalCliente"/>
      <div class="label">Cliente</div>
    </div>
    <div class="total" v-html="total"/>
    <div class="sides">
      <div class="number" v-html="totalContador"/>
      <div class="label">Contabilidade</div>
    </div>
  </div>
</template>

<script>
import { state, mutations } from '@/store'

export default {
  name: 'LoggedUsersCount',
  data: () => ({ items: {} }),
  created () {
    this.getData()
  },
  computed: {
    total () {
      return state.total
    },
    totalCliente () {
      return this.getLength('cliente')
    },
    totalContador () {
      return this.getLength('contador')
    }
  },
  methods: {
    getData () {
      const database = this.$firebase.database().ref('liveusers')
      database.on('value', snapshot => {
        this.items = snapshot.val().prod || {}
        mutations.setTotal(this.totalCliente + this.totalContador)
      })
    },
    getLength (type) {
      return Object.keys(this.items[type] || {}).length
    }
  }
}
</script>

<style scoped lang="scss">
#counter {
  width: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly;
  .sides {
    flex: 1;
    align-items: center;
    .number {
      font-size: 50pt;
    }
    .label {
      font-size: 20pt;
    }
  }
  .total {
    flex: 1;
    font-size: 75pt;
    font-weight: bold;
  }
}

@media (max-width: 768px) {
  .sides {
    .number {
      font-size: 35pt !important;
    }
    .label {
      font-size: 12pt !important;
    }
  }
  .total {
    font-size: 45pt !important;
  }
}

@media (min-width: 1920px) {
  .sides {
    .number {
      font-size: 70pt !important;
    }
    .label {
      font-size: 30pt !important;
    }
  }
  .total {
    font-size: 85pt !important;
  }
}
</style>
