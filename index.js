import 'babel-polyfill'
import IPFS from 'ipfs'

document.addEventListener('DOMContentLoaded', async () => {
  let ipfsEmptyConfig = {
    repo: 'repo-' + Math.random().toString(36).substring(7),
    config: {
      Addresses: {
        Swarm: ["/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star"],
        API: '',
        Gateway: ''
      },
      EXPERIMENTAL: {
        pubsub: true
      }
    }
  }

  // Create our IPFS node
  const node = await IPFS.create(ipfsEmptyConfig)

  // UI elements
  const status = document.getElementById('status')
  const output = document.getElementById('output')

  output.textContent = ''

  function log (txt) {
    output.textContent += `${txt.trim()}\n`
  }

  // Listen for new peers
  node.libp2p.on('peer:discovery', (peerId) => {
    log(`Found peer ${peerId.toB58String()}`)
  })

  // Listen for new connections to peers
  node.libp2p.connectionManager.on('peer:connect', (connection) => {
    log(`Connected to ${connection.remotePeer.toB58String()}`)
  })

  // Listen for peers disconnecting
  node.libp2p.connectionManager.on('peer:disconnect', (connection) => {
    log(`Disconnected from ${connection.remotePeer.toB58String()}`)
  })

  await node.start()
  status.innerText = 'libp2p started!'
  log(`libp2p id is ${node.libp2p.peerId.toB58String()}`)

  // Export libp2p to the window so you can play with the API
  window.ipfs = node

  const topic = 'lounge-----7b22637276223a22502d353231222c22657874223a747275652c226b65795f6f7073223a5b22766572696679225d2c226b7479223a224543222c2278223a224141327378696b6e42323076444b735f53764b527961656438556f545a4a4846333161595f495164386a3544306f4b2d716a7654707a5f38474a51715f4a7355387a5f30455f5972546274624a757a5562533143366f6576222c2279223a22416539357373547a537933424f76736a4471545473316c586f4b4a33347451324d4147466c7075534b4e467834446d73723343325952706937777256615f504679736565573331783152475965656b706976644d6f4f6363227d-----30820222300d06092a864886f70d01010105000382020f003082020a0282020100bd0465a51c61fc4cf67d008da33758ee48c46ff059b6eedc010d8100fcb92abf2c2b2ebeaaac034b06ffb6637a65859c247f73c0dad6bdaacb2d3a31bad577e368686d7c94862472367dfdccc59d80582fccb361eb7e6292f7413cc3c4ca95b576ccb5d5b5a88dfe55e7e2d39b0553c59ff1af7ede07f58286f0c6ab37fd4a6218511a8fe550d6da59fbe6e597ca51392c8c92a9dffdc05a657165a4b765cc6fa7d230a70683244edde1405ab87ad0940a79775e13b5cc8aec75694a2bec25b0a25161dbf734d1ebaa17350062230485d964a51dcbba0d7317875056e96d2120167f68a36224471318e1c15cf243f216184a5ab5d93d734f79de6967ca9f63fc85aa723db42467dc7bf6c4d24ca75577b83cbdd83145f376e3ac7f5c45851d7d37b2c9dcaa09aa91c359ad87c304105fc5277fb1f920d1e5f90ea27cdf973b57d175bf24628f4bb39fb8077c5dbffc8b7d72e9b7c4a99233bb3b227146cb003ee29c361fff0ecd06bdb4a686ac09b8756084b96100c89eac86f05e2ec43bd9d7b5b01af544b2f711bd188392724fe2401b171eebb8812ca7ad514e142651e6778ca024c8778ceb915006ccd8685ae696894d67368f7c04ef804019258a1bbe73014c5003edbc4e05e8f8ba8d1a61083f250d612558adb5bede3d38999d752b0fbeb0ba6598562ee15cb594f6409b4272351f7d1f41e92ef647bb67983fe4279f0203010001-----rep'
  // Subscribe to topic
  node.pubsub.subscribe(topic, console.log)

  // Publish random each 5s
  setInterval(() => {
    node.pubsub.publish(topic, 'data-' + Math.random().toString(36).substring(7))
  }, 5000)

  // Get peers for topic each 10s
  setInterval(() => {
    const peers = node.pubsub.peers(topic)

    console.log('peers', peers)
  }, 5000)
})
