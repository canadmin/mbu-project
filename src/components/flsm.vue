<template>
  <div>
    <div v-if="!isCalculated">
      <div>
        <div class="text-center mt-5">
          <h3>Sabit Uzunluklu Alt Ağlara bölme</h3>
        </div>
        <div class="mt-5">
          Ağ Adı:
          <input class="input-design pl-3" type="text" placeholder="Ağ adını giriniz" v-model="netWorkName">
          <span class="ml-3">Host Sayısı :</span>
          <input class="input-design  pl-3" type="text" placeholder="Host Sayısını giriniz" v-model="hostCount">
          <button class="save-button" @click="addNewNetWork">Kaydet</button>

        </div>

      </div>
      <app-table :networks="networkList"></app-table>
      <div>
        <div class="mt-5 float-right">
          <input class="input-design pl-3" type="text" placeholder="Ip Adresini giriniz" v-model="ipAddress">
          <button class="calculate-button" @click="calculate">Hesapla</button>
        </div>
      </div>
    </div>
    <div v-if="isCalculated">
      <app-calculated :newNetworksList="calculatedNetworkList"></app-calculated>
    </div>
  </div>
</template>

<script>

    import Table from "./Table";
    import calculatedVlsm from "./calculatedVlsm";
    import {commonFunctions} from "../formulas/common";
    export default {
        data() {
            return {
                ipAddress: "",
                netWorkName: "",
                hostCount: 0,
                networkList: [],
                calculatedNetworkList: [],
                agAdresleri: [],
                maskBit: [],
                isCalculated: false,
                genelAltAgAdresleri:0
            }
        },
        components: {
            appTable: Table,
            appCalculated: calculatedVlsm
        },
        methods : {
            addNewNetWork() {
                this.networkList = this.networkList.sort(function (a, b) {
                    return b - a
                });

                let network = {
                    netWorkName: this.netWorkName,
                    hostCount: this.hostCount
                };
                this.networkList.push(network);
                this.networkList = commonFunctions.networkListSort(this.networkList);
                console.log(this.networkList);
            },
            calculate() {
                var ip = this.ipAddress.split("/");
                var ipAddress = ip[0];//192.168.0.0
                var subnetMask = ip[1];//8 ise 192 0 0 0 dan başlayacak
                var networkIp = this.networkStartIp(ipAddress, subnetMask);
                console.log("network ıp : " + networkIp);
                var ipExps = [];
                let list = this.networkList;
                var largestDiff = 0;
                for (var network of list) {
                    let currentExp = 0;
                    for (var j = 0; j < 33; j++) {
                        currentExp = Math.pow(2, j);
                        if ((currentExp - 2) >= network.hostCount) {
                            ipExps.push(currentExp);
                            this.maskBit.push(j);
                            break;
                        }
                    }
                }
                for(var i =0; i<ipExps.length ; i++){
                    if(ipExps[i]>largestDiff){
                        largestDiff = ipExps[i];
                    }
                }
                var gerekliAgSayisi = 0;
                for (var j = 0; j < 33; j++) {
                    gerekliAgSayisi = Math.pow(2, j);
                    if (gerekliAgSayisi >= this.networkList.length) {
                        gerekliAgSayisi = j;

                        break;
                    }
                }
                console.log(gerekliAgSayisi);
                this.genelAltAgAdresleri=parseInt(subnetMask)+gerekliAgSayisi;
                var temp = this.genelAltAgAdresleri;
                this.genelAltAgAdresleri = 32-temp;
                console.log("genel Alt ağ adresi"+this.genelAltAgAdresleri);
                for(var i =0; i<ipExps.length ; i++){
                    ipExps[i] = largestDiff+2;
                    console.log(ipExps[i]);
                }
                this.showIpRange(ipExps, networkIp, this.networkList,subnetMask,gerekliAgSayisi);
            },
            networkStartIp(ip, slash) {
                slash = commonFunctions.convertToBinary(32 - slash);// 255 255 liyi bulduk
                // 192.168.1.1
                var nslash = slash.split(".");
                var nip = ip.split(".");
                var newIp = [];
                for (var i = 0; i < 4; i++) {
                    newIp.push(this.logicalAnd(nslash[i], nip[i]));
                }
                return commonFunctions.ipAddressMerger(newIp);
            },
            logicalAnd(octet1, octet2) {
                var result = octet1 & octet2;
                return result.toString();
            },
            showIpRange(ipExps, ipParams, networks,subnetmask,gerekliAgSayisi) {
             // ip exps 3 tane ise -> 2^2 tane ağ bizim ihtiyacımızı karşılar
                // ip adresi 192.168.0.0/24 ise
                // 192.168.0.0000 0000-> 192.168.0.0
                // 192.168.0.0100 0000 -> 192.168.0.64
                // 192.168.0.1000 0000 -> 128
                // 192.168.0.1100 0000 -> 192
                /*
                *  gelen ip params bizim başlangıç ip miz ilk önce gerekli mask biti buluyoruz
                * gerekli ağ sayısından büyük ilk 2 kuvvetini alıcaz.
                * sonrasında ipParamsın en sağından
                * */

                // /24 ise geriye 2^2 den 4 tane ağ olucak
                // 24 son 8 tane host sayısını belirler
                // 2^8 / 2^2 = 64
                //dolayısıyla artış 64er olucak

                // eğer /25 olsaydı 2^2 den 4 tane ağ olucak
                // 25 son 7 tane host biti olucak
                // 2^7 / 2^2 = 32
                // artıs 32 er tane olucak
                //subnet 32-subnet sayısı = 7 olsun
                //gerekli ağ sayısı 5 olsun
                //2^3 koşulu sağlar
                // 2^7 / 2^3 = 16 artış miktarı
                var bitDiff = 32-subnetmask;
                var incAmount = Math.pow(2,bitDiff) / Math.pow(2,gerekliAgSayisi);
                console.log("artış miktarı : "+incAmount);
              for (var x in ipExps){
                  ipExps[x] = incAmount;
              }
                var totalNetworkCount = 0;
                for (var ipExp of ipExps) {
                    totalNetworkCount += ipExp;
                }
                var ipAddressList = commonFunctions.ipAddressParser(ipParams);
                if (totalNetworkCount < 255) {
                    for (var i = 0; i < ipExps.length; i++) {
                        ipAddressList[ipAddressList.length - 1] += ipExps[i];
                        this.agAdresleri.push(commonFunctions.ipAddressMerger(ipAddressList))
                    }
                } else {
                    for (var i = 0; i < ipExps.length; i++) {
                        var total = ipAddressList[3] + ipExps[i];
                        if (parseInt(total) > 255) {
                            var sayac = 0;
                            while (total > 255) {
                                total = total - 256;
                                sayac += 1
                            }
                            var sayac2 = 0;
                            if (sayac > 255) {
                                while (sayac > 255) {
                                    sayac = sayac - 256;
                                    sayac2 += 1;
                                }
                            }
                            ipAddressList[1] += sayac2;
                            ipAddressList[2] += sayac;
                            ipAddressList[3] = total;
                            this.agAdresleri.push(commonFunctions.ipAddressMerger(ipAddressList))
                        } else {
                            ipAddressList[ipAddressList.length - 1] += ipExps[i];
                            this.agAdresleri.push(commonFunctions.ipAddressMerger(ipAddressList))
                        }
                    }
                }
             this.flsmCalculate(ipParams, ipExps);
            },
            flsmCalculate(startIpAddress, ipExps) {
                console.log("ip exps  : " + ipExps)
                for (var i = 0; i < this.agAdresleri.length; i++) { // ilk olarak girilen ağ adreslerine bakıcaz ve ip adresini alıcaz
                    if (i === 0) {
                        var network = {
                            agIsmi: this.networkList[i].netWorkName,
                            hostSayisi: this.networkList[i].hostCount,
                            agAdresi: startIpAddress,
                            ipBaslangıc: commonFunctions.ipAddressMerger(commonFunctions.ipIncrease(1, commonFunctions.ipAddressParser(startIpAddress))),
                            ipBitis: commonFunctions.ipAddressMerger(commonFunctions.addressDesc(commonFunctions.ipAddressParser(this.agAdresleri[i]), 2)),//
                            maxAralık: ipExps[i],
                            yayın: commonFunctions.ipAddressMerger(commonFunctions.addressDesc(commonFunctions.ipAddressParser(this.agAdresleri[i]), 1)),
                            decMask: commonFunctions.convertToBinary(this.genelAltAgAdresleri)
                        };
                        this.calculatedNetworkList.push(network);
                    } else {
                        var network = {
                            agIsmi: this.networkList[i].netWorkName,
                            hostSayisi: this.networkList[i].hostCount,
                            agAdresi: this.agAdresleri[i - 1],
                            ipBaslangıc: commonFunctions.ipAddressMerger(commonFunctions.ipIncrease(1, commonFunctions.ipAddressParser(this.agAdresleri[i - 1]))),
                            ipBitis: commonFunctions.ipAddressMerger(commonFunctions.addressDesc(commonFunctions.ipAddressParser(this.agAdresleri[i]), 2)),
                            maxAralık: ipExps[i],
                            yayın: commonFunctions.ipAddressMerger(commonFunctions.addressDesc(commonFunctions.ipAddressParser(this.agAdresleri[i]), 1)),
                            decMask: commonFunctions.convertToBinary(this.genelAltAgAdresleri)
                        };
                        this.calculatedNetworkList.push(network);
                    }
                }
                console.log(this.calculatedNetworkList);
                this.isCalculated = true;
            },
        }
    }
</script>

<style scoped>
  .input-design {
    border: 0;
    width: 250px;
    height: 35px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
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

  .calculate-button {
    border: 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
    background-color: white;
    height: 35px;
    width: 150px;
  }

  .calculate-button:hover {
    background-color: #60C4A9;
    color: white;

  }
</style>
