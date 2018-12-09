<template>
  <div id="counter">
    <div class="sides">
      <div class="number">{{ totalClientesLogged }}</div>
      <div class="label">Cliente</div>
    </div>
    <div class="total">
      {{ usersLogged.length }}
    </div>
    <div class="sides">
      <div class="number">{{ totalContabilidadesLogged }}</div>
      <div class="label">Contabilidade</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    usersLogged: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalClientesLogged () {
      return this.usersLogged.filter(u => u.level === 'CLI').length
    },
    totalContabilidadesLogged () {
      return this.usersLogged.filter(u => u.level === 'CON').length
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
