<template>
  <div id="app">
    <div class="container">
      <div style="text-align: center">
        <h1 class="title">Kintegra live users</h1>
        <p style="font-size: 15pt; margin-top: 0">Usuários online no Kintegra neste momento</p>
      </div>
      <logged-users-count />
    </div>
  </div>
</template>

<script>
import LoggedUsersCount from './components/LoggedUsersCount'

export default {
  name: 'app',
  components: {
    LoggedUsersCount
  },
  mounted () {
    this.alterarBackground()
    setInterval(() => this.alterarBackground(), 20000)
  },
  methods: {
    alterarBackground () {
      this.$http.get('https://source.unsplash.com/collection/406202/1920x1080', { responseType: 'blob' })
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

<style lang="scss" scoped>
.title {
  margin: 0;
  font-size: 30pt;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .title {
    font-size: 25pt;
  }
}
</style>
