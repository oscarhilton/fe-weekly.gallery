import React from 'react';

interface context {
	updateDatabase: (key: string, payload: any) => void;
}

interface clientUser {
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

export const IPFSContext = React.createContext<context>({ updateDatabase: () => {} });

export default function IPFSProvider({ children }: { children: any }) {
  const [loaded, setLoaded] = React.useState<number>(0);
  const [userData, setUserData] = React.useState<clientUser>();
  const [currentHash, setCurrentHash] = React.useState<string>("");
  const [ipfsConntected, setIpfsConnected] = React.useState<boolean>(false);
  const [orbitDbConntected, setOrbitDbConnected] = React.useState<boolean>(false);
  const [activeUsers, setActiveUsers] = React.useState<number>(0);

  React.useEffect(() => {
    (async () => {
      const ipfs = await window.Ipfs.create({
				repo: "/weekly.gallery.ipfs",
				...IPFS_CONFIG
			});
      setIpfsConnected(!!ipfs);
      const orbitdb = await window.OrbitDB.createInstance(ipfs);

      const options = {
        maxHistory: 1,
        accessController: {
          write: ["*"]
        },
        onLoad: () => setOrbitDbConnected(orbitdb.id),
      };

      // ACTIVE USERS DB
      const activeUsersCounter = await orbitdb.counter(
				MAIN_DB_NAME + "users.total",
				options
			);

      activeUsersCounter.events.on("ready", async () => {
        await activeUsersCounter.inc(2000);
        updateActiveUsersUI(activeUsersCounter.value);
      });
      activeUsersCounter.events.on("replicated", () => updateActiveUsersUI(activeUsersCounter.value));
      activeUsersCounter.events.on("write", () => updateActiveUsersUI(activeUsersCounter.value));
      activeUsersCounter.events.on('load.progress', (address: any, hash: any, entry: any, progress: any, total: any) =>  {
        setCurrentHash(hash);
        setLoaded(progress / total)
      });
			activeUsersCounter.load();

      // USERS DB


    })();
  }, []);

  const updateActiveUsersUI = (value: number) => setActiveUsers(value);

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
			<input />
			{/* {children} */}
		</IPFSContext.Provider>
	);
}