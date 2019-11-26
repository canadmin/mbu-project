<template>
  <div class="container bg-white main">
    <div class="row mt-5">
      <div class="col-3 left-side">
        <div class="text-center mt-5">
          <span class="title">Alt Ağlara Bölme</span>
          <div class="mt-5">
            <button class="standart-button" @click="activeComponent='appVlsm'">Değişken Alt Ağlara Bölme</button>
          </div>
          <div class="mt-5">
            <button class="standart-button" @click="activeComponent='appFlsm'">Sabit Alt Ağlara Bölme</button>
          </div>
          <div class="mt-5 ">
            <button class="standart-button">Alt Ağ Hesaplama</button>
          </div>
        </div>

      </div>
      <div class="col-9 right-side">
        <component :is="activeComponent">

        </component>
      </div>
    </div>
  </div>
</template>

<script>
    import Vlsm from "./components/Vlsm";
    import flsm from "./components/flsm";
    export default {
        data() {
            return {
                activeComponent: "appVlsm",
            }
        },
        components: {
            appVlsm: Vlsm,
            appFlsm : flsm
        }
    }
</script>

<style>
  .left-side {
    background-color: #283e4a;
    height: 80vh;
  }

  .right-side {
    background-color: #f5f5f5;
  }

  .main {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
  }

  .title {
    color: white;
    font-size: 28px;
  }

  .standart-button {
    width: 250px;
    border: 0;
    color: #f5f5f5;
    height: 40px;
    background-color: #60C4A9;
  }

</style>
