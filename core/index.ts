import {
  Action,
  type IMessageResponse,
  type IPublishArgs,
  type ISubscribeArgs,
} from "./types";

export * from "./types";

export interface RodelarClientArgs {
  url: string;
  apiKeyId?: string;
  apiKey?: string;
}

export class RodelarClient {
  private ws: WebSocket;
  private eventHandlers: Record<string, (ev: MessageEvent) => void>;

  constructor(args: RodelarClientArgs) {
    this.ws = new WebSocket(args.url);
    this.eventHandlers = {};

    this.mountEventMapper();
  }

  private mountEventMapper() {
    this.ws.onmessage = (ev) => {
      this.eventHandlers[JSON.parse(ev.data)?.queue]?.(ev);
    };
  }

  publish(args: IPublishArgs) {
    let messageId: null | string = null;

    this.ws.send(
      JSON.stringify({
        action: Action.PUBLISH,
        event: args.queue,
        payload: args.payload,
      })
    );

    this.ws.onmessage = (ev) => {
      if (args.queue == ev.data?.queue && ev.data?.action == Action.PUBLISH) {
        messageId = ev.data?.message?.messageId;
      }
    };

    this.mountEventMapper();

    return messageId;
  }

  subscribe<T = IMessageResponse>(args: ISubscribeArgs<T>) {
    this.ws.send(
      JSON.stringify({
        action: Action.SUBSCRIBE,
        event: args.queue,
      })
    );

    this.eventHandlers[args.queue] = (ev: MessageEvent) =>
      args.callback(JSON.parse(ev.data));
  }

  unsubscribe(args: Pick<ISubscribeArgs, "queue">) {
    delete this.eventHandlers[args.queue];
  }

  close() {
    this.ws.close();
  }
}
