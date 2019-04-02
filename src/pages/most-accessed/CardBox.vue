<template>
  <div class="card-box" :style="{height}">
    <div class="card-box-title">
      <h1>{{ title }}</h1>
    </div>
    <div class="card-box-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: { type: String },
    title: { type: String, required: true }
  }
}
</script>

<style scoped lang="scss">
.card-box {
  color: #555;
  padding: 15px;
  border-radius: .5rem;
  background-color: #FFF;
  .card-box-title {
    padding: 5px 0 25px 0;
    h1 {
      margin: 0;
      padding: 0;
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
  .card-box-body {
    height: 100%;
    position: relative;
  }
}
</style>
