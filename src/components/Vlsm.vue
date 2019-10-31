<template>
  <div>
    <div v-if="!isCalculated">
      <div>
        <div class="text-center mt-5">
          <h3>Değişken Uzunluklu Alt Ağlara bölme</h3>
        </div>
        <div class="mt-5">
          <input class="input-design pl-3" type="text" placeholder="Ağ adını giriniz" v-model="netWorkName">
          <input class="input-design ml-5 pl-3" type="text" placeholder="Host Sayısını giriniz" v-model="hostCount">
        </div>
        <div class="mt-5  mr-5">
          <div>
            <button class="save-button" @click="addNewNetWork">Kaydet</button>
          </div>
        </div>
      </div>
      <app-table :networks="networkList"></app-table>
      <div>
        <div class="mt-5">
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
                isCalculated: false
            }
        },
        components: {
            appTable: Table,
            appCalculated: calculatedVlsm
        },
        methods: {

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
                this.showIpRange(ipExps, networkIp, this.networkList);
            },
            showIpRange(ipExps, ipParams, networks) {
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
                this.vlsmCalculate(ipParams, ipExps);
            },
            vlsmCalculate(startIpAddress, ipExps) {
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
                            decMask: commonFunctions.convertToBinary(this.maskBit[i])
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
                            decMask: commonFunctions.convertToBinary(this.maskBit[i])
                        };
                        this.calculatedNetworkList.push(network);
                    }
                }
                console.log(this.calculatedNetworkList)
                this.isCalculated = true;
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
            }
        },
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
    margin-left: 453px;
    border: 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 2px 3px rgba(0, 0, 0, .2);
    background-color: white;
    width: 100px;
    color: #283e4a;
  }

  .calculate-button {
    margin-left: 300px;
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
