import {
  createContext,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { RodelarClient, type RodelarClientArgs } from "../core";

export const RodelarContext = createContext<RodelarClient | null>(null);

export type RodelarProviderProps = { children: ReactNode } & RodelarClientArgs;

export function RodelarProvider(props: RodelarProviderProps) {
  const clientRef = useRef<RodelarClient | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Ensure the client is created once on initial render
    if (!clientRef.current) {
      clientRef.current = new RodelarClient({ url: props.url });
      setIsClientReady(true); // Mark the client as ready
    }

    // Cleanup on component unmount to close the WebSocket connection
    // return () => {
    //   if (clientRef.current) {
    //     clientRef.current.close();
    //     clientRef.current = null;
    //   }
    // };
  }, [props.url]);

  if (!isClientReady) {
    return <p>loading ...</p>;
  }

  return (
    <RodelarContext.Provider value={clientRef.current}>
      {props.children}
    </RodelarContext.Provider>
  );
}
