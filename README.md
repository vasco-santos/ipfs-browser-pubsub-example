# IPFS pubsub example in the browser

This example leverages the [Parcel.js bundler](https://parceljs.org/) to compile and serve the IPFS code in the browser. Parcel uses [Babel](https://babeljs.io/) to handle transpilation of the code. You can use other bundlers such as Webpack or Browserify, but we will not be covering them here.

## Setup

In order to run the example, first install the dependencies:

```
npm install
```

## Running the examples

Start by running the Parcel server:

```
npm start
```

The output should look something like this:

```log
$ npm start

> parcel index.html

Server running at http://localhost:1234
✨  Built in 1000ms.
```

This will compile the code and start a server listening on port [http://localhost:1234](http://localhost:1234). Now open your browser to `http://localhost:1234`. You should see a log of your node's Peer ID, the discovered peers from the Bootstrap module, and connections to those peers as they are created.

Now, if you open a second browser tab to `http://localhost:1234`, you should discover your node from the previous tab. This is due to the fact that the `libp2p-webrtc-star` transport also acts as a Peer Discovery interface. Your node will be notified of any peer that connects to the same signaling server you are connected to. Once libp2p discovers this new peer, it will attempt to establish a direct WebRTC connection.

A common topic will be subscribed and random messages will be exchanged between the peers over time.
