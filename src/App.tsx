import React from 'react';
import './App.css';
import './fonts/devices/flaticon.css';
import './fonts/emoji/emoji.css';
import IPFSProvider from './components/providers/IPFS.provider';
import SocketProvider from './components/providers/Socket.provider';
import ConnectionChecker from './components/organisms/ConnectionChecker.organism';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <IPFSProvider>
        {/* <SocketProvider>
          <ConnectionChecker />
        </SocketProvider> */}
      </IPFSProvider>
    </Router>
  );
}

export default App;

declare global {
  interface Window {
      YT: any;
      onYTReady: any;
      Ipfs: any;
      OrbitDB: any;
  }
}
