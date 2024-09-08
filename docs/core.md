```ts
import { sleep } from "bun";
import { RodelarClient } from "./core";

const client = new RodelarClient("ws://localhost:3000/ws/");
await sleep(1000);

client.publish({
  queue: "test",
  payload: "try again",
});

client.subscribe({
  queue: "test",
  callback(data) {
    console.log("data: ", data.message);
  },
});
```
