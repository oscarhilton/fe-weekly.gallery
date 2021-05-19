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

export const SocketContext = React.createContext({
  serverBoottime: 0,
  identity: IDENTITY,
  populousCursors: [],
  handleSendToSocket: (event: string, payload: any) => {},
  ready: false,
  mobileConnected: false,
  desktopConnected: false,
  ping: 0,
  serverTime: 0,
});

const
MasterSocket = new Socket("192.168.100.54", 4001);

export default function SocketProvider({ children }: { children: any }) {
  const [desktopConnected, setDesktopConnected] = React.useState<boolean>(isMobile);
  const [mobileConnected, setMobileConnected] = React.useState<boolean>(false);
  const [populousCursors, setPopulousCursors] = React.useState([]);
  const [serverTime, setServerTime] = React.useState(0);
  const [serverBoottime, setServerBoottime] = React.useState(0)
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
    MasterSocket.on("mousePositionsChange", ({ users, currentTime, boottime }: { users: any, currentTime: number, boottime: number }) => {
      if (!users || !currentTime) return;
      if (serverBoottime === 0) {
        setServerBoottime(boottime);
      }
      setServerTime(currentTime);
      setPopulousCursors(Object.values(users));
    })
  }, [setServerBoottime, setServerTime, setPopulousCursors, serverBoottime]);

  const handleSendToSocket = (event: string, payload: any) => {
    MasterSocket.emit(event, payload, identity);
  }

  return (
    <SocketContext.Provider value={{ serverBoottime, identity, populousCursors, handleSendToSocket, ready, mobileConnected, desktopConnected, ping: 0, serverTime }}>
      {children}
    </SocketContext.Provider>
  )
}
