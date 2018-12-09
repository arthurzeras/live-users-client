<template>
  <div id="app">
    <div style="text-align: center">
      <h1 style="font-size: 30pt; margin: 0;">Kintegra live users</h1>
      <p style="font-size: 15pt; margin-top: 0">Usuários online no Kintegra neste momento</p>
    </div>
    <logged-users-count :users-logged="usersLogged"/>
  </div>
</template>

<script>
import io from 'socket.io-client'
import LoggedUsersCount from './components/LoggedUsersCount'

const socket = io(process.env.VUE_APP_SOCKET_SERVER_URL)

export default {
  name: 'app',
  components: {
    LoggedUsersCount
  },
  data () {
    return {
      usersLogged: []
    }
  },
  created () {
    this.connectOnSocket()
  },
  methods: {
    connectOnSocket () {
      socket.on('Logados', data => {
        this.usersLogged = data
      })
    }
  }
}
</script>
