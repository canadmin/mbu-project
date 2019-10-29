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
    <button class="save-button" @click="exportPdf">Export PDF</button>
  </div>
</template>

<script>
    import jsPDF from 'jspdf'
    import 'jspdf-autotable';
    export default {
        data(){
          return{
          }
        },
        props: ["newNetworksList"],
        methods : {
            exportPdf(){
                var columns = [
                    {title:"Ag Adi",dataKey :"agIsmi"},
                    {title:"Host Sayisi",dataKey :"hostSayisi"},
                    {title:"Ag Adresi",dataKey :"agAdresi"},
                    {title:"Baslangic",dataKey :"ipBaslangıc"},
                    {title:"Bitis",dataKey :"ipBitis"},
                    {title:"Yayin",dataKey :"yayın"},
                    {title:"Alt Ag Adresi",dataKey :"decMask"},
                ];
                var doc = new jsPDF('p','pt');
                doc.autoTable(columns,this.newNetworksList);
                doc.save("table.pdf")
            }
        },

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
  .save-button {
    margin-left: 15px;
    border: 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
    background-color: white;
    width: 100px;
    color: #283e4a;
  }

  .save-button:hover{
    background-color: #60C4A9;
    color: white;
  }
</style>
