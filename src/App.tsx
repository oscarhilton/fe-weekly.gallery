import React from 'react';
import './App.css';
import './fonts/devices/flaticon.css';
import './fonts/emoji/emoji.css';
import SocketProvider from './components/providers/Socket.provider';
import ConnectionChecker from './components/organisms/ConnectionChecker.organism';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <SocketProvider>
        <ConnectionChecker />
      </SocketProvider>
    </Router>
  );
}

export default App;

declare global {
  interface Window {
      YT: any;
      onYTReady: any;
  }
}
