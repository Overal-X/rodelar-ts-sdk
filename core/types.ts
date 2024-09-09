export interface IPublishArgs {
  event: string;
  message: Record<string, string> | string | number;
}

export interface ISubscribeArgs<T = unknown> {
  event: string;
  callback: (data: T) => void;
}

export enum Action {
  SUBSCRIBE = "SUBSCRIBE",
  PUBLISH = "PUBLISH",
}

export interface IMessageResponse {
  queue: string;
  action: Action;
  message?: any;
}
