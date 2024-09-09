import { sleep } from "bun";
import { RodelarClient } from "./core";

const client = new RodelarClient({ url: "ws://localhost:3000/ws/" });
await sleep(1000);

client.publish({
  event: "test",
  message: "try again",
});

client.subscribe({
  event: "test",
  callback(data) {
    console.log("data: ", data.message);
  },
});
