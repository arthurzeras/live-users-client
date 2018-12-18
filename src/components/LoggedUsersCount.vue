<template>
  <div id="counter">
    <div class="sides">
      <div class="number">{{ totalClientesLogged }}</div>
      <div class="label">Cliente</div>
    </div>
    <div class="total">
      {{ totalClientesLogged + totalContabilidadesLogged }}
    </div>
    <div class="sides">
      <div class="number">{{ totalContabilidadesLogged }}</div>
      <div class="label">Contabilidade</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoggedUsersCount',
  data: () => ({ list: [] }),
  created () {
    this.getData()
  },
  computed: {
    totalClientesLogged () {
      return Object.keys(this.list).filter(i => i.includes('cliente')).length
    },
    totalContabilidadesLogged () {
      return Object.keys(this.list).filter(i => i.includes('contador')).length
    }
  },
  methods: {
    getData () {
      const database = this.$firebase.database().ref()
      database.on('value', snapshot => {
        this.list = snapshot.val() || []
      })
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
</style>
