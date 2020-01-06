export const commonFunctions = {
  convertToBinary(bitCount) {
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
    var dec = [];
    for (var i = 0; i < bitsList.length - 1; i++) {
      dec.push(parseInt(bitsList[i], 2));
    }
    return dec[0] + "." + dec[1] + "." + dec[2] + "." + dec[3];
  },

  ipAddressMerger(liste) {
    var stringIp = liste[0].toString() + '.' + liste[1].toString() + '.' + liste[2].toString() + '.' + liste[3].toString();
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
  ipIncrease(eklenecekHost, gelenIp) {//gelen ip array olarak geliyor üstüne host ekleyelim
    if (eklenecekHost < 0) {
      gelenIp[3] -= parseInt(eklenecekHost);
    } else {
      gelenIp[3] += parseInt(eklenecekHost);

    }
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
            if (desc === 1) {
              ipAdressList[3] = 255;
            } else {
              ipAdressList[3] = 255 - 1;
            }
          ipAdressList[2] = 255;
          if (ipAdressList[1] === 0) {
            ipAdressList[1] = 255;
            ipAdressList[0] -= 1;
          } else {
            ipAdressList[1] -= 1;
          }
      }
    } else {
      ipAdressList[3] = ipAdressList[3] - desc;
    }
    return ipAdressList;
  },
  networkListSort(networkList) {
    for (var i = 0; i < networkList.length; i++) {
      for (var j = i; j < networkList.length; j++) {
        if (parseInt(networkList[i].hostCount) < parseInt(networkList[j].hostCount)) {
          var tempNetwork = networkList[i];
          networkList[i] = networkList[j];
          networkList[j] = tempNetwork;
        }
      }
    }
    return networkList;
  }
};

