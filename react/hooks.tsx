import { useCallback, useContext, useRef } from "react";

import _ from "lodash";
import {
  type IMessageResponse,
  type IPublishArgs,
  type ISubscribeArgs,
} from "../core";
import { RodelarContext } from "./provider";

export function useRodelar() {
  const client = useContext(RodelarContext);

  const hasSubscribed = useRef(false);
  const hasUnsubscribed = useRef(false);
  const hasPublished = useRef(false);

  const subscribe = useCallback(
    (args: ISubscribeArgs<IMessageResponse>) => {
      _.delay(() => {
        if (client && hasSubscribed.current == false) {
          client.subscribe(args);
          hasSubscribed.current = true;
        }
      }, 1_000);
    },
    [client]
  );

  const unsubscribe = useCallback(
    (args: Pick<ISubscribeArgs, "event">) => {
      if (client && hasUnsubscribed.current == false) {
        client.unsubscribe({ event: args.event });
        hasUnsubscribed.current = true;
      }
    },
    [client]
  );

  const publish = useCallback(
    (args: IPublishArgs) => {
      if (client && hasPublished.current == false) {
        client.publish(args);
        hasPublished.current = true;
      }
    },
    [client]
  );

  return { subscribe, unsubscribe, publish };
}
