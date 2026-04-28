export interface ISocketClient {
  connected: boolean;
  connect: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: "sync", handler: (payload: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off: (event: "sync", handler: (payload: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit: (event: string, ...args: any[]) => unknown;
}
