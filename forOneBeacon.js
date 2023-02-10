/*
DECODER ONE BEACON WITH SLOT iBEACON.
hex format. 
! 20 = beacon data payload is 32                                                                               index 0 up to 1
note:The header of the beacon data payload message. In each beacon payload reporting cycle, the beacon data payload header will start on 20.
20: the first packet beacon data.
21: the second packet beacon data and so on

! 01 = Total Beacon Quantities of this payload is                                                               index 2 up to 3
! 4a = The first Beacon Data Length is 74     
                                                                  index 4 up to 5
! 07e70202170000 = Timestamp of 1st beacon, it has been scanned      
07 *256 + E7 = YEAR
02 = MONTH
02 = DAY
17 00 00 = hour, min, seg

index 6 up to 19
! c3370bf03228 = The 1st MAC Address                                                                            index 20 up to 31
! c5 = 1st beacon RSSI is -67 dBm.                                                                              index 32 up to 33
! 0201061aff4c00021586fda33e7fe911eda1eb0242ac12000200640003ce02 = First beacon broadcast raw data.             index 34 up to 95

! 0a041a16abfe50ce64 = ?                                                                                        index 96 up to 113

! 86fda33e7fe911eda1eb0242ac120002 = uuid                                                                      index 114 up to 145
! 0064 = major                                                                                                 index 146 up to 149
! 0003 = minor                                                                                                 index 150 up to 154
*/

function decoderIbeacon(rawData, nodeDevEUI){
//!Turn the base64 payload into hex. 
const buffer = Buffer.from(rawData, 'base64');
const bufString = buffer.toString('hex');
const hexdata = `Hex Data = [${bufString}]`//DATA HEX

//!Slice the payload by Attributes.
//Method substr() -> First Parameter = start to extract, Second Parameter = # of chars to extract.
const beaconDataPayload = parseInt(bufString.substr(0,2),16) 
const totalBeacons = parseInt(bufString.substr(2,2),16) 
const firstBeaconDataLength = parseInt(bufString.substr(4,2),16) 

//!Gettin de TimeStamp
const year = parseInt(bufString.substr(6,2),16) *256 + parseInt(bufString.substr(8,2),16) ;
const mon = parseInt(bufString.substr(10,2),16);
const days = parseInt(bufString.substr(12,2),16);
const hour = parseInt(bufString.substr(14,2),16);
const minute = parseInt(bufString.substr(16,2),16);
const sec = parseInt(bufString.substr(18,2),16);
const dataUtc_time =  mon + "/" + days + "/" + year + " " + " " + hour + ":" + minute + ":" + sec;
                     //(hour<10) ? '0'+ hour + ":" : hour + ":" 
                    // + (minute<10) ? '0'+minute : minute+ ":" 
                    // + (sec<10) ? '0'+sec : sec;
				

const firstTimestamp = dataUtc_time
const firstMAC = bufString.substr(20,12) 
const firstRSSI = bufString.substr(32,2)
const firstBroadcastRawData = bufString.substr(34,62) 
const firstUUID = bufString.substr(114,32)  
const firstMajor = parseInt(bufString.substr(146,4),16) 
const firstMinor = parseInt(bufString.substr(150,4),16) 

//!Getting RSSI
//from hex to binary 
function hex2bin(hex){
        return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
    }
//from binary to signed 2's complement
function getSignedInteger(hex) {
        var bits = hex2bin(hex)
        let negative = (bits[0] === '1');
        if (negative) {
            let inverse = '';
            for (let i = 0; i < bits.length; i++) {
                inverse += (bits[i] === '0' ? '1' : '0');
            }
            return (parseInt(inverse, 2) + 1) * -1;
        } else {
            return parseInt(bits, 2);
        }
    }

//!Create JSON to return
payloadDecoded = {
'Node': nodeDevEUI = 'fab5c5ffff8cee7e' ? 'Node-EE7E (MAP) = fab5c5ffff8cee7e' 
        : nodeDevEUI = 'd8103bffff0c55b8' ? 'Node-55B8 (EAM) = d8103bffff0c55b8' 
        : nodeDevEUI = 'cd2193ffff0ce940' ? 'Node-E940 (Mid) = cd2193ffff0ce940' 
        : 'unknown node',
'totalBeaconsScanned':totalBeacons, 
'TypeBeacon': 'iBeacon',
'firstTimestamp':firstTimestamp,
'MAC': firstMAC,
'UUID':firstUUID,
'Major':firstMajor,
'Minor':firstMinor,
'RSSI': `${getSignedInteger(firstRSSI)} dBm`,
'BroadcastRawData':firstBroadcastRawData,
}
return [hexdata, payloadDecoded];

}

iBeacon7Payload1 = 'IAEsB+cCAwAOH+eOHe0etsgCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84='
iBeacon7Payload2 = 'IAEsB+cCAwAOGueOHe0etsgCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84='
iBeacon7Payload3 = 'IQJKB+cCAwAOEeeOHe0etsgCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAcsB+cCAwAOFOeOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84='
iBeacon7Payload4 = 'IANKB+cCAwAODOeOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAcsB+cCAwAODeeOHe0etsoCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB85KB+cCAwAOD+eOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAc='
iBeacon7Payload5 = 'IANKB+cCAwAOAeeOHe0etssCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAdKB+cCAwAOAueOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAdKB+cCAwAOA+eOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAc='
iBeacon7Payload6 = 'gFKB+cCAwAOAOeOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAc='
iBeacon7Payload7 = 'IQNKB+cCAwANNueOHe0etsUCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAdKB+cCAwANOOeOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAdKB+cCAwANO+eOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAc='
iBeacon7Payload8 = 'IANKB+cCAwANM+eOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAdKB+cCAwANNOeOHe0etsoCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84CCgQaFqv+UM4Kjnum8H/qEe2h6wJCrBIAAgBkAAcsB+cCAwANNeeOHe0etscCAQYa/0wAAhWOe6bwf+oR7aHrAkKsEgACAGQAB84='
iBeacon3Payload = 'IAFKB+cCAhcAAMM3C/AyKMUCAQYa/0wAAhWG/aM+f+kR7aHrAkKsEgACAGQAA84CCgQaFqv+UM5khv2jPn/pEe2h6wJCrBIAAgBkAAM='

unKnowPayload1 = 'IAJKB+cBChEoMtdd/Xvv+cMCAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4CCgQaFqv+UM4K8gO7bn/pEe2h6wJCrBIAAgBkAAVKB+cBChEoONdd/Xvv+cMCAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4CCgQaFqv+UM4K8gO7bn/pEe2h6wJCrBIAAgBkAAU='
unKnowPayload2 = 'IAIsB+cBEQ8EA9dd/Xvv+dACAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4sB+cBEQ8EBddd/Xvv+dECAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4=' 
unKnowPayload3 = 'IANKB+cBEQ8DKtdd/Xvv+dECAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4CCgQaFqv+UM4K8gO7bn/pEe2h6wJCrBIAAgBkAAUsB+cBEQ8DLNdd/Xvv+dECAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc5KB+cBEQ8DMNdd/Xvv+dECAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4CCgQaFqv+UM4K8gO7bn/pEe2h6wJCrBIAAgBkAAU=' 
unKnowPayload4 = 'IANKB+cBEQ8DINdd/Xvv+dICAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4CCgQaFqv+UM4K8gO7bn/pEe2h6wJCrBIAAgBkAAUsB+cBEQ8DIddd/Xvv+dACAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc5KB+cBEQ8DI9dd/Xvv+dICAQYa/0wAAhXyA7tuf+kR7aHrAkKsEgACAGQABc4CCgQaFqv+UM4K8gO7bn/pEe2h6wJCrBIAAgBkAAU='
//console.log(decoderIbeacon(iBeacon7Payload1, 'fab5c5ffff8cee7e')) //?February 02, 2023, 19:14:41 (UTC-0500)
//console.log(decoderIbeacon(iBeacon7Payload2, 'fab5c5ffff8cee7e'))//? February 02, 2023, 19:14:31 (UTC-0500)
//console.log(decoderIbeacon(iBeacon7Payload3, 'fab5c5ffff8cee7e')) //? February 02, 2023, 19:14:23 (UTC-0500)
//console.log(decoderIbeacon(iBeacon7Payload4, 'fab5c5ffff8cee7e'))
//console.log(decoderIbeacon(iBeacon7Payload5, 'fab5c5ffff8cee7e'))
//console.log(decoderIbeacon(iBeacon7Payload6, 'fab5c5ffff8cee7e'))
//console.log(decoderIbeacon(iBeacon7Payload7, 'fab5c5ffff8cee7e'))
//console.log(decoderIbeacon(iBeacon7Payload8, 'fab5c5ffff8cee7e'))
console.log(decoderIbeacon(iBeacon3Payload, 'fab5c5ffff8cee7e')) //?February 02, 2023, 18:00:01 (UTC-0500)
//console.log(decoderIbeacon(unKnowPayload1, 'fab5c5ffff8cee7e')) //Unknow
//console.log(decoderIbeacon(unKnowPayload2, 'fab5c5ffff8cee7e')) //?January 17, 2023, 11:04:14 (UTC-0400)
//console.log(decoderIbeacon(unKnowPayload3, 'fab5c5ffff8cee7e')) //?January 17, 2023, 11:03:54 (UTC-0400)
//console.log(decoderIbeacon(unKnowPayload4, 'fab5c5ffff8cee7e')) //?January 17, 2023, 11:03:44 (UTC-0400)



