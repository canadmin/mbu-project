<template>
  <div class="mt-5 text-center">
    <div class="">
        <h1>Alt Ağ Hesaplama</h1>
    </div>
    <div class="subnett">
      Alt Ağ Adresi : <input class="input-design  pl-3" type="text" placeholder="Host Sayısını giriniz" v-model="ipAddress">
      <br>
      <button class="mt-3 ml-5 save-button" @click="hesapla">asdasd</button>
      <br>
      Subnet Mask :
      <input class="input-design  mt-3 pl-3" disabled type="text" placeholder="" v-model="sonuc">
    </div>
  </div>
</template>

<script>
    import {commonFunctions} from "../formulas/common";
    export default {
        data(){
            return{
                ipAddress:0,
                sonuc :0

            }
        },
        methods : {
            hesapla(){
                var ip = this.ipAddress.split("/");
                var address = ip[0];
                var subnetMask = ip[1];
                this.sonuc = commonFunctions.convertToBinary(32-parseInt(subnetMask))
            }
        }
    }
</script>

<style scoped>
  .subnett {
    margin-top: 50px;
  }
  .save-button {
    margin-left: 25px;
    border: 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
    background-color: white;
    width: 100px;
    height: 35px;
    color: #283e4a;
  }
  .input-design {
    border: 0;
    width: 250px;
    height: 35px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
  }
</style>
