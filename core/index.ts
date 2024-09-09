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
        event: args.event,
        message: args.message,
      })
    );

    this.ws.onmessage = (ev) => {
      if (args.event == ev.data?.queue && ev.data?.action == Action.PUBLISH) {
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
        event: args.event,
      })
    );

    this.eventHandlers[args.event] = (ev: MessageEvent) =>
      args.callback(JSON.parse(ev.data));
  }

  unsubscribe(args: Pick<ISubscribeArgs, "event">) {
    delete this.eventHandlers[args.event];
  }

  close() {
    this.ws.close();
  }
}
