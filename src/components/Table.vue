<template>
  <div class="mt-3 table-data">
    <table class="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Ağın Adı</th>
        <th scope="col">Host sayısı</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(network,index) in allNetWorks">
        <th scope="row">{{index +1}}</th>
        <td>{{network.netWorkName}}</td>
        <td>{{network.hostCount}}</td>
        <td><button class="sil-butonu" @click="deleteNetwork(index)">Sil</button></td>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                allNetWorks: [],
            }
        },
        props: ["networks"],
        watch: {
            networks: function (nevValue) {
                this.allNetWorks = nevValue;
                console.log(this.allNetWorks)
            }
        },
        methods:{
            deleteNetwork(index){
                console.log(index)
                this.allNetWorks.splice(index, 1);

            }
        }
    }
</script>

<style scoped>
  .table-data {
    height: 350px;
    overflow-y: auto;
  }
  .sil-butonu{
    background-color: #ffffff;
    color: red;
    border: 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
  }
  .sil-butonu:hover{
    background-color: red;
    color: white;
  }
</style>
