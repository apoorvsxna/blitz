export function decodePeers(peersArray) {
    const peers = [];
  
    for (let i = 0; i < peersArray.length; i += 6) {
      const ip = `${peersArray[i]}.${peersArray[i + 1]}.${peersArray[i + 2]}.${peersArray[i + 3]}`;
      const port = (peersArray[i + 4] << 8) + peersArray[i + 5];
      
      peers.push({ ip, port });
    }
  
    return peers;
  }
  