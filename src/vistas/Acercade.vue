

<template>
  <div id="app">
    <nav>
      <router-link to="/">Inicio</router-link> |
      <router-link to="/about">Acerca de</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AcercaDe'
}
</script>

<style>
nav {
  margin-bottom: 20px;
}
</style>
