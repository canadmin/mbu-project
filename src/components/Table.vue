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
        }
    }
</script>

<style scoped>
  .table-data {
    height: 350px;
    overflow-y: auto;
  }
</style>
