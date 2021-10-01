import React from 'react';
import { useForm } from 'react-hook-form';
import Peer from 'simple-peer';

interface context {
	updateDatabase: (key: string, payload: any) => void;
}

interface clientUser {
	name: string;
	avatar: string;
  x: number;
  y: number;
}

const MAIN_DB_NAME = "weekly.gallery_";

const IPFS_CONFIG = {
	start: true,
	preload: {
		enabled: false
	},
	EXPERIMENTAL: {
		pubsub: true
	},
	config: {
		Addresses: {
			Swarm: [
				// Use IPFS dev webrtc signal server
				"/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
				"/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/"
			]
		}
	}
};

const SIMPLE_PEER_CONFIG = {
  channelConfig: {},
  channelName: 'testingthewater',
  config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] },
  offerOptions: {},
  answerOptions: {},
  sdpTransform: function (sdp: any) { return sdp },
  streams: [],
  trickle: true,
  allowHalfTrickle: false,
  // wrtc: {}, // RTCPeerConnection/RTCSessionDescription/RTCIceCandidate
}

export const IPFSContext = React.createContext<context>({ updateDatabase: () => {} });

export default function IPFSProvider({ children }: { children: any }) {
  const [loaded, setLoaded] = React.useState<number>(0);
  const [userData, setUserData] = React.useState([]);
  const [currentHash, setCurrentHash] = React.useState<string>("");
	const [userProfileInstance, setUserProfileInstance] = React.useState<any | null>(null);
  const [ipfsConntected, setIpfsConnected] = React.useState<boolean>(false);
  const [orbitDbConntected, setOrbitDbConnected] = React.useState<boolean>(false);
  const [activeUsers, setActiveUsers] = React.useState<number>(0);

	const { register, handleSubmit } = useForm(); 

  React.useEffect(() => {
    (async () => {
			const ipfs = await window.Ipfs.create({
				repo: "/weekly.gallery.ipfs",
				...IPFS_CONFIG
			});
			setIpfsConnected(!!ipfs);

			const orbitdb = await window.OrbitDB.createInstance(ipfs);

			console.log(orbitdb.identity.publicKey);

			const options = {
				maxHistory: 1,
				accessController: {
					write: ["*"]
				},
			};

			setOrbitDbConnected(orbitdb.id);

			// ACTIVE USERS DB
			const swarmDatabase = await orbitdb.docs(MAIN_DB_NAME + "swarm", options);

			swarmDatabase.load();

			swarmDatabase.events.on("replicated", async () => {
				const peer = new Peer({ ...SIMPLE_PEER_CONFIG, initiator: true }) as any;
				peer.on(
					"signal",
					async (signal: any) => {
						await swarmDatabase.put({
							_id: orbitdb.identity.publicKey,
							signal,
							peer: peer._id
						});
				})
				peer.on("connect", () => {
					// wait for 'connect' event before using the data channel
					peer.send("hey peer, how is it going?" + Math.random());
				});

				peer.on("data", (data: any) => {
					// got a data channel message
					console.log("got a message from peer: " + data);
				});
				const others = await swarmDatabase.query(
					(peer: any) => peer._id !== orbitdb.identity.publicKey
				);
				others.forEach((other: any) => {
					peer.signal(other.signal);
				})
			});

			// ACTIVE USERS DB
			const activeUsersCounter = await orbitdb.counter(
				MAIN_DB_NAME + "users.total",
				options
			);

			activeUsersCounter.load();

			// USER PROFILE
			const userProfileDatabase = await orbitdb.docs(MAIN_DB_NAME + "profile", {
				...options,
				maxHistory: 10
			});
			userProfileDatabase.events.on("ready", async () => {
				const data = await userProfileDatabase.get("");
				setUserData(data);
			});
			setUserProfileInstance(userProfileDatabase);
			await userProfileDatabase.load();
		})();
  }, []);

	const handleNewEntry = React.useCallback(async (data: any) => {
		if (!userProfileInstance) return;
		await userProfileInstance.put({ _id: new Date().getTime(), text: data.newEntry });
	}, [userProfileInstance]);

  return (
		<IPFSContext.Provider
			value={{
				updateDatabase: () => {}
			}}
		>
			<p>{Math.floor(loaded * 100)}/100 loaded</p>
			<div>{currentHash}</div>
			{activeUsers}
			<ul>
				<li>IPFS: {ipfsConntected.toString()}</li>
				<li>DATABASE: {orbitDbConntected.toString()}</li>
			</ul>
			<form onSubmit={handleSubmit(handleNewEntry)}>
				<input {...register("newEntry", { required: true })} />
				<button type='submit'>Submit</button>
			</form>
			{userData && userData.map(({ text, id }: { text: string, id: string }) => <div key={id}>{text}</div>)}
			{/* {children} */}
		</IPFSContext.Provider>
	);
}