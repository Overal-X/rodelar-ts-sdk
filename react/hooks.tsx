import { useCallback, useEffect, useRef } from "react";

import {
  RodelarClient,
  type IMessageResponse,
  type IPublishArgs,
  type ISubscribeArgs,
  type RodelarClientArgs,
} from "../core";

export function useRodelarClient(args: RodelarClientArgs) {
  const clientRef = useRef<RodelarClient | null>(null);

  useEffect(() => {
    // Initialize the client
    const client = new RodelarClient(args);
    clientRef.current = client;

    // Clean up by closing the client on component unmount
    return () => {
      client.close();
    };
  }, [args.url, args.apiKeyId, args.apiKey]);

  return clientRef;
}

export function usePublish(args: RodelarClientArgs) {
  const clientRef = useRodelarClient(args);

  const publish = useCallback(
    (publishArgs: IPublishArgs) => {
      setTimeout(() => {
        if (clientRef.current) {
          clientRef.current.publish(publishArgs);
        }
      }, 1000);
    },
    [clientRef]
  );

  return { publish };
}

export function useSubscribe<T = IMessageResponse>(
  clientArgs: RodelarClientArgs,
  subscribeArgs: ISubscribeArgs<T>
) {
  const clientRef = useRef<RodelarClient | null>(null);

  useEffect(() => {
    // Ensure the connection happens only once
    if (!clientRef.current) {
      const client = new RodelarClient(clientArgs);
      clientRef.current = client;

      setTimeout(() => {
        // Subscribe to the WebSocket queue
        client.subscribe(subscribeArgs);
      }, 1000);
    }

    // Cleanup when component unmounts to close the WebSocket connection
    return () => {
      // setTimeout(() => {
      //   if (clientRef.current) {
      //     clientRef.current.close();
      //     clientRef.current = null;
      //   }
      // }, 1000);
    };
  }, [clientArgs.url, subscribeArgs.event, subscribeArgs.callback]); // Dependency array ensures hook behavior based on changes to arguments
}
