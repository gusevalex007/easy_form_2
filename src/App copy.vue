<script setup>
// import SimpleForm from './components/SimpleForm.vue'
// import EventPage from './components/EventPage.vue';
import ProductList from './components/ProductList.vue';
// import PhotoCapture from './components/PhotoCapture.vue'

</script>

<template>

  <!-- <div>
    <SimpleForm/>
  </div> -->

  <!-- <div>
    <EventPage/>
  </div> -->

  <div>
    <ProductList />
  </div>



</template>

<style scoped>
.div {
  min-width: 100%;
  min-height: 100%;
  position: relative;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
