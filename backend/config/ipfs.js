import { create } from "ipfs-http-client";
import dotenv from "dotenv";

dotenv.config();

const ipfs = create({
  host: "127.0.0.1",
  port: "5001",
  protocol: "http",
});

export default ipfs;