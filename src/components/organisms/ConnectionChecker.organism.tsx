import React from 'react';
import { SocketContext } from "../providers/Socket.provider";
import MainGame from "./MainGame.organism";
import LandingPage from './LandingPage.organism';
import Swiper from '../molecules/Swiper.molecule';

export default function ConnectionChecker() {
  const { ready, identity } = React.useContext(SocketContext);
  return (
    <Swiper>
      <MainGame />
      {/* <LandingPage ready={ready} identity={IDENTITY} /> */}
    </Swiper>
  );
}