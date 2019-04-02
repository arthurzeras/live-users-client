<template>
  <div id="app">
    <header
      class="header"
      :class="$route.name === 'home' ? 'dark' : 'light'"
    >
      <router-link
        :key="route.name"
        class="header-link"
        :to="{ name: route.name }"
        exact-active-class="active"
        v-for="route in $router.options.routes"
      >
        <i class="icon" :class="route.meta.icon"></i>
        <span class="label">{{ route.meta.title }}</span>
      </router-link>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    &.light {
      background-color: #FFF;
      .header-link {
        color: #555;
        &:hover {
          text-decoration: none;
          background-color: #F2F2F2;
        }
      }
    }
    &.dark {
      background-color: rgba(0, 0, 0, .5);
      .header-link {
        color: #FFF;
        &:hover {
          text-decoration: none;
          background-color: rgba(0, 0, 0, .5);
        }
      }
    }

    .header-link {
      display: flex;
      transition: .4s;
      padding: 15px 25px;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      border-bottom: 4px solid transparent;
      .label {
        font-size: .9rem;
      }

      &.active {
        border-color: #DDD;
      }
    }
  }
</style>
