<template>
  <div class="home">
    <div class="text-center">
      <h1 class="title">Kintegra Live Users</h1>
      <p class="subtitle">Usuários online no Kintegra neste momento</p>
    </div>

    <logged-users-count/>
    <rocket/>
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
    window.backgroundInterval = setInterval(
      () => this.alterarBackground(),
      20000
    )
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
  },
  beforeDestroy () {
    document.querySelector('#app').style.background = ''
    clearInterval(window.backgroundInterval)
  }
}
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
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
  .home {
    .title { font-size: 25pt }
    .subtitle { font-size: 15pt }
  }
}

@media (min-width: 1920px) {
  .home {
    .title { font-size: 60pt }
    .subtitle { font-size: 30pt }
  }
}
</style>
