import React from 'react';
import Socket from '../../classes/Socket.class';
import { isMobile } from "react-device-detect";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

interface Person {
  x: number;
  y: number;
  stageWidth: number;
  stageHeight: number;
}

const IDENTITY: string = uniqueNamesGenerator({
  dictionaries: [colors, animals],
  separator: '-',
  length: 2,
  style: 'capital'
});

export const SocketContext = React.createContext({ identity: IDENTITY, populousCursors: [], handleSendToSocket: (event: string, payload: any) => {}, ready: false, mobileConnected: false, desktopConnected: false });

const MasterSocket = new Socket("192.168.100.54", 4001);

export default function SocketProvider({ children }: { children: any }) {
  const [desktopConnected, setDesktopConnected] = React.useState<boolean>(isMobile);
  const [mobileConnected, setMobileConnected] = React.useState<boolean>(false);
  const [populousCursors, setPopulousCursors] = React.useState([]);
  const [identity] = React.useState(IDENTITY);

  const ready = React.useMemo(() => desktopConnected && mobileConnected, [desktopConnected, mobileConnected]);
  
  React.useEffect(() => {
    MasterSocket.on("relayConnection", data => {
      console.log(data);
      if (data === "desktop") {
        setDesktopConnected(true);
      }
      if (data === "mobile") {
        setMobileConnected(true);
      }
    });
  }, [setMobileConnected, setDesktopConnected]);

  React.useEffect(() => {
    MasterSocket.on("mousePositionsChange", data => {
      setPopulousCursors(Object.values(data));
    })
  }, []);

  const handleSendToSocket = (event: string, payload: any) => {
    MasterSocket.emit(event, payload, identity);
  }

  return (
    <SocketContext.Provider value={{ identity, populousCursors, handleSendToSocket, ready, mobileConnected, desktopConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
