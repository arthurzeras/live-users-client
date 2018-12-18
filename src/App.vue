<template>
  <div id="app">
    <div style="text-align: center">
      <h1 style="font-size: 30pt; margin: 0;">Kintegra live users</h1>
      <p style="font-size: 15pt; margin-top: 0">Usuários online no Kintegra neste momento</p>
    </div>
    <logged-users-count />
  </div>
</template>

<script>
import LoggedUsersCount from './components/LoggedUsersCount'

export default {
  name: 'app',
  components: {
    LoggedUsersCount
  }
}
</script>
