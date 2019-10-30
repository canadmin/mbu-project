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
      <tr class="satır" v-for="(network,index) in newNetworksList" @click="showDetails(index)">
        <td >{{network.agIsmi}}</td>
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
    <div v-if="showModal" @close="showModal = false">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <h3 slot="header">{{newNetworksList[selectedIndex].agIsmi}}</h3>
              <hr>
              <div>
                <p><b>Host Sayisi :</b> {{newNetworksList[selectedIndex].hostSayisi}}</p>
                <p><b>Ağ Adresi :</b> {{newNetworksList[selectedIndex].agAdresi}}</p>
                <p><b>Başlangıc :</b> {{newNetworksList[selectedIndex].ipBaslangıc}}</p>
                <p><b>bitiş :</b> {{newNetworksList[selectedIndex].ipBitis}}</p>
                <p><b>yayın :</b> {{newNetworksList[selectedIndex].yayın}}</p>
                <p><b>Alt Ağ adresi :</b> {{newNetworksList[selectedIndex].decMask}}</p>

              </div>
              <div class="modal-footer">
                  <button class="save-button" @click="showModal=false">
                    Kapat
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>  </div>
</template>

<script>
    import jsPDF from 'jspdf'
    import 'jspdf-autotable';
    export default {
        data(){
          return{
              showModal : false,
              selectedIndex : 0,
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
            },
            showDetails(index){
                this.showModal = true;
                this.selectedIndex = index;
                console.log(index)
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


  /* modal */
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }


  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
