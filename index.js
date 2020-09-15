import 'babel-polyfill'
import IPFS from 'ipfs'

document.addEventListener('DOMContentLoaded', async () => {
  let ipfsEmptyConfig = {
    // repo: 'repo-' + Math.random().toString(36).substring(7),
    // config: {
    //   Addresses: {
    //     // Swarm: ["/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star"],
    //     API: '',
    //     Gateway: ''
    //   },
    //   EXPERIMENTAL: {
    //     pubsub: true
    //   }
    // }
  }

  // Create our IPFS node
  const ipfs = await IPFS.create(ipfsEmptyConfig)

  // UI elements
  const status = document.getElementById('status')
  const output = document.getElementById('output')

  output.textContent = ''

  function log (txt) {
    output.textContent += `${txt.trim()}\n`
  }

  // Listen for new peers
  ipfs.libp2p.on('peer:discovery', (peerId) => {
    log(`Found peer ${peerId.toB58String()}`)
  })

  // Listen for new connections to peers
  ipfs.libp2p.connectionManager.on('peer:connect', (connection) => {
    log(`Connected to ${connection.remotePeer.toB58String()}`)
  })

  // Listen for peers disconnecting
  ipfs.libp2p.connectionManager.on('peer:disconnect', (connection) => {
    log(`Disconnected from ${connection.remotePeer.toB58String()}`)
  })

  await ipfs.start()
  status.innerText = 'libp2p started!'
  log(`libp2p id is ${ipfs.libp2p.peerId.toB58String()}`)

  // Export libp2p to the window so you can play with the API
  window.ipfs = ipfs

  const topic = 'topic'
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  // Subscribe to topic
  await ipfs.pubsub.subscribe(topic, (message) => {
    console.log('message: ', decoder.decode(message.data))
  })

  // Publish random each 5s
  // setInterval(() => {
  //   ipfs.pubsub.publish(topic, encoder.encode(`hi bro`))
  // }, 5000)
  await ipfs.pubsub.publish(topic, encoder.encode(`hi bro`))

  // Get peers for topic each 10s
  // setInterval(() => {
  //   const peers = ipfs.pubsub.peers(topic)

  //   console.log('peers', peers)
  // }, 5000)
})
