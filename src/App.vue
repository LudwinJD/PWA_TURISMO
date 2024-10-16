<template>
  <div class="page-container">
    <div id="app">
      <home-page :places="places"></home-page>
    </div>
  </div>
</template>

<script>
import HomePage from "./components/HomePage.vue";

export default {
  name: 'App',
  components: {
    HomePage,
  },
  // Importa y configura el enrutador
  mounted() {
    this.$router.push('/');
  },
};
</script>

<style>
.page-container {
  height: 100vh; /* Establece la altura al 100% de la ventana */
  overflow-y: auto; /* Agrega una barra de desplazamiento vertical cuando sea necesario */
  max-width: auto; /* Ajusta el ancho máximo según tus necesidades */
  margin: 0 auto; /* Centra horizontalmente el contenedor */
  background-color: #212529;
  
}
.tit_prin{
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 0;
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    border-radius: 15px;
    color: #000000;
    letter-spacing: 0.3em;
    text-shadow: -2px 2px 5px #37FF8B;
    background-color: transparent;
    transition: 100ms;
    filter: drop-shadow(0 0 23px#37FF8B)
  }
</style>