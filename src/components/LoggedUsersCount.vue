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
  data: () => ({ list: [], lastAdded: null }),
  created () {
    this.getData()
  },
  computed: {
    totalClientesLogged () {
      return this.getLength('cliente')
    },
    totalContabilidadesLogged () {
      return this.getLength('contador')
    }
  },
  methods: {
    getData () {
      const database = this.$firebase.database().ref()

      database.on('child_added', snapshot => {
        this.lastAdded = snapshot.val()
      })

      database.on('value', snapshot => {
        this.list = snapshot.val() || []
        this.startTimeoutToDelete()
        this.$emit('total', this.totalClientesLogged + this.totalContabilidadesLogged)
      })
    },
    getLength (type) {
      return Object.keys(this.list).filter(i => i.includes(type) && i.includes('prod')).length
    },
    startTimeoutToDelete () {
      if (this.lastAdded) {
        const idLastLogged = Object.keys(this.list)
          .filter(k => this.list[k].createdAt === this.lastAdded.createdAt)

        setTimeout(() => {
          if (idLastLogged.length) {
            this.$firebase.database().ref(idLastLogged[0]).remove()
          }

          this.lastAdded = null
        }, 7.2e+6)
      }
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
