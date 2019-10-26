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
    import _ from 'lodash';
    import calculatedVlsm from "./calculatedVlsm";

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
                // this.networkList = _.orderBy(this.networkList, "hostCount", "desc");
                this.networkList = this.networkList.sort(function (a, b) {
                    return b - a
                });
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
                //   this.updateAfterCalculate(ipAddress);
            },
            showIpRange(ipExps, ipParams, networks) {
                var totalNetworkCount = 0;
                for (var ipExp of ipExps) {
                    totalNetworkCount += ipExp;
                }
                var ipAddressList = this.ipAddressParser(ipParams);

                if (totalNetworkCount < 255) {
                    for (var i = 0; i < ipExps.length; i++) {
                        ipAddressList[ipAddressList.length - 1] += ipExps[i];
                        this.agAdresleri.push(ipAddressList[0] + "." + ipAddressList[1] + "." + ipAddressList[2] + "." + ipAddressList[3]);

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
                            console.log(ipAddressList[0] + "." + ipAddressList[1] + "." + ipAddressList[2] + "." + ipAddressList[3]);
                            this.agAdresleri.push(ipAddressList[0] + "." + ipAddressList[1] + "." + ipAddressList[2] + "." + ipAddressList[3]);

                        } else {
                            ipAddressList[ipAddressList.length - 1] += ipExps[i];
                            console.log(ipAddressList[0] + "." + ipAddressList[1] + "." + ipAddressList[2] + "." + ipAddressList[3]);
                            this.agAdresleri.push(ipAddressList[0] + "." + ipAddressList[1] + "." + ipAddressList[2] + "." + ipAddressList[3]);
                        }
                    }
                }
                console.log(this.agAdresleri)
                this.vlsmCalculate(ipParams, ipExps);

            },
            ipAddressMerger(liste) {
                var stringIp = liste[0].toString() + '.' + liste[1].toString() + '.' + liste[2].toString() + '.' + liste[3].toString();
                console.log(stringIp);
                return stringIp;
            },
            ipAddressParser(stringIp) {
                var ipAddressList = [];
                stringIp.split(".").forEach(param => {
                    if (param === '0') {
                        ipAddressList.push(0);
                    } else {
                        ipAddressList.push(parseInt(param))
                    }
                });
                return ipAddressList;
            },
            vlsmCalculate(startIpAddress, ipExps) {
                console.log("ip exps  : " + ipExps)
                for (var i = 0; i < this.agAdresleri.length; i++) { // ilk olarak girilen ağ adreslerine bakıcaz ve ip adresini alıcaz
                    if (i === 0) {
                        var network = {
                            agIsmi: this.networkList[i].netWorkName,
                            hostSayisi: this.networkList[i].hostCount,
                            agAdresi: startIpAddress,
                            ipBaslangıc: this.ipAddressMerger(this.ipIncrease(1, this.ipAddressParser(startIpAddress))),
                            ipBitis: this.ipAddressMerger(this.addressDesc(this.ipAddressParser(this.agAdresleri[i]), 2)),//
                            maxAralık: ipExps[i],
                            yayın: this.ipAddressMerger(this.addressDesc(this.ipAddressParser(this.agAdresleri[i]), 1)),
                            decMask: this.convertToBinary(this.maskBit[i])
                        };
                        this.calculatedNetworkList.push(network);
                    } else {
                        var network = {
                            agIsmi: this.networkList[i].netWorkName,
                            hostSayisi: this.networkList[i].hostCount,
                            agAdresi: this.agAdresleri[i - 1],
                            ipBaslangıc: this.ipAddressMerger(this.ipIncrease(1, this.ipAddressParser(this.agAdresleri[i - 1]))),
                            ipBitis: this.ipAddressMerger(this.addressDesc(this.ipAddressParser(this.agAdresleri[i]), 2)),
                            maxAralık: ipExps[i],
                            yayın: this.ipAddressMerger(this.addressDesc(this.ipAddressParser(this.agAdresleri[i]), 1)),
                            decMask: this.convertToBinary(this.maskBit[i])
                        };
                        this.calculatedNetworkList.push(network);


                    }
                }
                console.log(this.calculatedNetworkList)
                this.isCalculated = true;
            },
            ipIncrease(eklenecekHost, gelenIp) {//gelen ip array olarak geliyor üstüne host ekleyelim
                if (eklenecekHost < 0) {
                    gelenIp[3] -= parseInt(eklenecekHost);
                } else {
                    gelenIp[3] += parseInt(eklenecekHost);

                }
                console.log(gelenIp[0]);
                for (var i = gelenIp.length - 1; i >= 0; i--) {
                    if (i !== 0) {
                        if (gelenIp[i] > 255) {
                            var temp1 = Math.floor(gelenIp[i] / 255);
                            var temp2 = gelenIp[i] % 255;
                            gelenIp[i] = temp2;
                            gelenIp[i - 1] += temp1;
                            console.log(temp1)
                        }
                    }
                }
                return gelenIp;
            },
            addressDesc(ipAdressList, desc) {
                if (ipAdressList[3] === 0) { // 192 168 0 0 -> 0 255
                    if (ipAdressList[2] !== 0) {
                        ipAdressList[2] -= 1;
                        if (desc === 1) {
                            ipAdressList[3] = 255;
                        } else {
                            ipAdressList[3] = 255 - 1;

                        }
                    } else {
                        ipAdressList[3] = 255;
                        ipAdressList[2] = 255;
                        if (ipAdressList[1] === 0) {
                            ipAdressList[1] = 255;
                            ipAdressList[0] -= -1;
                        } else {
                            ipAdressList[1] -= 1;
                        }
                    }
                } else {
                    ipAdressList[3] = ipAdressList[3] - desc;
                }
                return ipAdressList;
            },
            convertToBinary(bitCount) {
                //192 168  0 0
                // 1111 1111 ,1111 1111, 1111 1000, 0000 0000
                // gelen bit sayısı eğer 8 ise
                console.log(this.maskBit + "adasda");
                var diff = 32 - bitCount;//24
                var bits = "";
                for (var i = 1; i <= 32; i++) {
                    if (i <= diff) {
                        bits += '1';

                        if (i !== 0 && i % 8 === 0) {
                            bits += "."
                        }
                    } else {
                        bits += '0';
                        if (i !== 0 && i % 8 === 0) {
                            bits += "."
                        }
                    }
                }
                bits += "0";
                var bitsList = bits.split(".");
                var dec = []
                for (var i = 0; i < bitsList.length - 1; i++) {
                    dec.push(parseInt(bitsList[i], 2));
                }
                return dec[0] + "." + dec[1] + "." + dec[2] + "." + dec[3];
            },
            networkStartIp(ip, slash) {
                slash = this.convertToBinary(32 - slash);// 255 255 liyi bulduk
                // 192.168.1.1
                var nslash = slash.split(".");
                var nip = ip.split(".");
                var newIp = [];
                for (var i = 0; i < 4; i++) {
                    newIp.push(this.logicalAnd(nslash[i], nip[i]));
                }
                return this.ipAddressMerger(newIp);
            },
            logicalAnd(octet1, octet2) {
                var result = octet1 & octet2;
                var stringResult = result.toString();
                return stringResult;
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
