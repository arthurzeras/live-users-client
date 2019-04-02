<template>
  <div class="home">
    <div style="text-align: center">
      <h1 class="title">Kintegra live users</h1>
      <p class="subtitle">Usuários online no Kintegra neste momento</p>
    </div>

    <logged-users-count @total="total = $event" />
    <rocket :count="total"/>
  </div>
</template>

<script>
import Rocket from '../components/Rocket'
import LoggedUsersCount from '../components/LoggedUsersCount'

export default {
  name: 'Home',
  components: {
    Rocket,
    LoggedUsersCount
  },
  data: () => ({
    total: 0,
    collections: [
      406202, // https://unsplash.com/collections/406202/galaxy-af
      789734 // https://unsplash.com/collections/789734/abstract
    //   1752784, // https://unsplash.com/collections/1752784/nerd
    //   1891993, // https://unsplash.com/collections/1891993/flatlay-tech-edition
    //   590961, // https://unsplash.com/collections/590961/coding-programming
    //   2411320 // https://unsplash.com/collections/2411320/trend-extreme-neon
    ]
  }),
  mounted () {
    this.alterarBackground()
    setInterval(() => this.alterarBackground(), 20000)
  },
  methods: {
    alterarBackground () {
      const collectionID = this.collections[Math.floor(Math.random() * this.collections.length)]
      const BG_URL = `https://source.unsplash.com/collection/${collectionID}`

      this.$http.get(BG_URL, { responseType: 'blob' })
        .then(res => {
          const reader = new FileReader()
          reader.readAsDataURL(res.data)
          reader.onloadend = () => {
            const background = `#121c28 url(${reader.result}) no-repeat center/cover`
            document.querySelector('#app').style.background = background
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 71px);
  background-color: rgba(0, 0, 0, .6);
  .title {
    margin: 0;
    font-size: 45pt;
    margin-bottom: 5px;
  }

  .subtitle {
    margin-top: 0;
    font-size: 20pt;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 25pt;
  }

  .subtitle {
    font-size: 15pt;
  }
}

@media (min-width: 1920px) {
  .title {
    font-size: 60pt;
  }

  .subtitle {
    font-size: 30pt;
  }
}
</style>
