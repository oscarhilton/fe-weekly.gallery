import React from 'react';
import {
  BrowserView,
  MobileView,
  isMobile,
  isDesktop,
} from "react-device-detect";
import { AwesomeQRCode } from "@awesomeqr/react";
import styled from 'styled-components';
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../providers/Socket.provider";

const GID = "gid";

export default function LandingPage({ ready, identity }: { ready: boolean, identity: string }) {
  let location = useLocation();
  const queries = queryString.parse(location.search);
  const gid = queries[GID];

  const { handleSendToSocket, desktopConnected, mobileConnected } = React.useContext(SocketContext);

  React.useEffect(() => {
    if (isMobile) {
      if (!gid || mobileConnected) return;
      handleSendToSocket("roomConnection", { origin: "mobile", gid });
    } else if (isDesktop) {
      if (desktopConnected) return;
      handleSendToSocket("roomConnection", { origin: "desktop", gid: identity });
    }
  }, [gid, handleSendToSocket, desktopConnected, mobileConnected]);

  return (
    <React.Fragment>
      <BrowserView>
        <Page>
          <Instructions ready={ready}>
            <QRCodeContainer>
              <AwesomeQRCode
                options={{
                  text: `192.168.100.54:3000/?${GID}=${identity}`,
                }}
                onStateChange={(state) => {
                }}
              />
            </QRCodeContainer>
          </Instructions>
          <IndicatorContainer ready={ready}>
            <AbsoluteContainer ready={ready}>
              <Row>
                <LargeIcon className="flaticon-smartphone-9"></LargeIcon>
                <Indicator ready={ready} active={mobileConnected} />
                <Status>{mobileConnected ? "Paired" : "Unpaired"}</Status>
              </Row>
              <Row>
                <LargeIcon className="flaticon-monitor"></LargeIcon>
                <Indicator ready={ready} active={desktopConnected} />
                <Status>{desktopConnected ? "Paired" : "Unpaired"}</Status>
              </Row>
            </AbsoluteContainer>
            <Row absolute>
              <button>Start</button>
            </Row>
          </IndicatorContainer>
        </Page>
      </BrowserView>
      <MobileView>
          <Row>
            <SmallIcon className="flaticon-monitor"></SmallIcon>
            <Indicator ready={ready} active={desktopConnected} />
            <Status>{desktopConnected ? "Paired" : "Unpaired"}</Status>
          </Row>
          <Row>
            <SmallIcon className="flaticon-smartphone-9"></SmallIcon>
            <Indicator ready={ready} active={mobileConnected} />
            <Status>{mobileConnected ? "Paired" : "Unpaired"}</Status>
          </Row>
      </MobileView>
    </React.Fragment>
  )
}

const Status = styled.span`
  width: 100px;
  display: block;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  position: ${({ absolute }: { absolute?: boolean }) => absolute ? "absolute" : "relative"};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  z-index: ${({ absolute }: { absolute?: boolean }) => absolute ? "1" : "2"};
  background: white;
  border-radius: 25px;
  text-align: left;
`;

const AbsoluteContainer = styled.div`
  width: 400px;
  height: 330px;
  background: #ffffff;
  padding: 30px 80px 30px 50px;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  transform: ${({ ready }: { ready?: boolean }) => ready && "translateX(calc(-100% - 15px))"};
  border: solid thin ${({ ready }: { ready: boolean }) => ready ? "#72ec72" : "transparent"};
  transition: transform 0.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const Instructions = styled.div`
  background-color: ${({ ready }: { ready?: boolean }) => ready ? '#72ec72' : 'orange'};
  transition: background-color 0.5s;
  width: 400px;
  height: 330px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  margin: 20px;
`;

const Indicator = styled.div`
  width: 30px;
  height: 30px;
  display: block;
  border: solid 2px;
  border-color: ${({ active }: { active?: boolean, ready?: boolean }) => active ? '#72ec72' : 'orange'};
  transition: border-color 0.5s;
  border-radius: 50%;
  margin: 0px 50px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: #72ec72;
    margin: auto;
    opacity: ${({ ready }) => ready ? 0.4 : 0};
    transition: opacity 0.5s;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0px;
    left: -5px;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background: transparent;
    opacity: 0.3;
    margin: auto;
    border-radius: 50%;
    // box-shadow: 0 1px 3px black;
  }
`;

const IndicatorContainer = styled.div`
  display: block;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
  // border: solid thin ${({ ready }: { ready: boolean }) => ready ? "#72ec72" : "orange"};
  background-color: ${({ ready }: { ready: boolean }) => ready ? "#ffffff" : "#f5f5f5"};
  transform: scale(${({ ready }: { ready: boolean }) => ready ? 1 : 0.8};);
  transition: background-color 0.5s 0.5s transform 0.5s 0.5s;
  border-radius: 25px;
  position: relative;
`;

const LargeIcon = styled.i`
  &::before {
    font-size: 70px;
    color: #212121;
  }
`

const SmallIcon = styled.i`
  &::before {
    font-size: 60px;
    color: #212121;
  }
`

const Page = styled.main`
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  min-height: 100vh;
  background-color: #fffdfd;
`;

const QRCodeContainer = styled.div`
  width: 150px;
  height: 150px;
  display: block;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.06);
`;

