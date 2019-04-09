<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.theme {
  background: linear-gradient(
    to right,
    rgba(225, 56, 89, 1) 0%,
    rgba(195, 43, 127, 1) 35%,
    rgba(146, 49, 140, 1) 65%,
    rgba(78, 56, 130, 1) 100%
  ) !important;
  color: white !important;
}
#app *:not(i) {
  font-size: 18px;
  font-family: 'Courier New', Courier, monospace, 'Microsoft JhengHei';
}
.v-text-field__details {
    overflow: visible !important;
}
.min-width-380 {
  min-width: 380px;
}
.min-width-160 {
  min-width: 160px;
}
.min-width-120 {
  min-width: 120px;
}
.min-width-100 {
  min-width: 100px;
}
</style>
