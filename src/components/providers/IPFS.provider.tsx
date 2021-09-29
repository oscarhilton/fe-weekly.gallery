import React from 'react';

interface context {
  data: string
}

const MAIN_DB_NAME = "weekly.gallery_";

export const IPFSContext = React.createContext<context>({ data: 'data' });

export default function IPFSProvider({ children }: { children: any }) {
  const [loaded, setLoaded] = React.useState<number>(0);
  const [currentHash, setCurrentHash] = React.useState<string>("");
  const [ipfsConntected, setIpfsConnected] = React.useState<boolean>(false);
  const [orbitDbConntected, setOrbitDbConnected] = React.useState<boolean>(false);
  const [activeUsers, setActiveUsers] = React.useState<number>(0);

  React.useEffect(() => {
    (async () => {
			const ipfs = await window.Ipfs.create({
				repo: "/weekly.gallery.ipfs",
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
			});
			setIpfsConnected(!!ipfs);
			const orbitdb = await window.OrbitDB.createInstance(ipfs);

			const options = {
				// Give write access to everyone
				accessController: {
					write: ["*"]
				}
			};

			// ACTIVE USERS DB
			// const activeUsersCounter = await orbitdb.counter(MAIN_DB_NAME + "users.total", options);

			// setOrbitDbConnected(orbitdb.id);
			// activeUsersCounter.events.on("ready", async () => {
			//   await activeUsersCounter.inc();
			//   updateActiveUsersUI(activeUsersCounter.value);
			// });
			// activeUsersCounter.events.on("replicated", () => updateActiveUsersUI(activeUsersCounter.value));
			// activeUsersCounter.events.on("write", () => updateActiveUsersUI(activeUsersCounter.value));
			// activeUsersCounter.events.on('load.progress', (address: any, hash: any, entry: any, progress: any, total: any) =>  {
			//   setCurrentHash(hash);
			//   setLoaded(progress / total)
			// });
			// activeUsersCounter.load();

			// USERS DB
			const test = await orbitdb.docs("test", { indexBy: "id" });
			const hash = await test.put({
				id: "123"
			});
      console.log(hash);
			test.events.on("ready", async () => {
        setOrbitDbConnected(true);
			});
		})();
  }, []);

  const updateActiveUsersUI = (value: number) => setActiveUsers(value);

  return (
		<IPFSContext.Provider
			value={{
				data: "data2"
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