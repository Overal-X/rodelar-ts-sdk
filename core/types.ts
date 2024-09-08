export interface IPublishArgs {
  queue: string;
  payload: Record<string, string> | string | number;
}

export interface ISubscribeArgs<T = unknown> {
  queue: string;
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
