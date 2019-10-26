<template>
  <div class="mt-3 table-data">
    <table class="table table-striped">
      <thead>
      <tr>
        <th scope="col">Ağ Adı</th>
        <th scope="col">Host Sayısı</th>
        <th scope="col">Ağ Adresi</th>
        <th scope="col">Başlangıc</th>
        <th scope="col">Bitiş</th>
        <th scope="col">Yayın</th>
        <th scope="col">Alt Ağ Adresi</th>
      </tr>
      </thead>
      <tbody>
      <tr class="satır" v-for="(network,index) in newNetworksList">
        <td>{{network.agIsmi}}</td>
        <td>{{network.hostSayisi}}</td>
        <td>{{network.agAdresi}}</td>
        <td>{{network.ipBaslangıc}}</td>
        <td>{{network.ipBitis}}</td>
        <td>{{network.yayın}}</td>
        <td>{{network.decMask}}</td>

      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
    export default {
        props: ["newNetworksList"]
    }
</script>

<style scoped>
  .table-data {
    height: 350px;
    overflow-y: auto;
  }

  .satır:hover {
    background-color: #60C4A9;
    color: white;
    cursor: pointer;
  }
</style>
