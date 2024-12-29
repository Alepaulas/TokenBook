import { create } from "ipfs-http-client";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const ipfs = create({
  host: process.env.IPFS_HOST || "localhost",
  port: process.env.IPFS_PORT || "5001",
  protocol: process.env.IPFS_PROTOCOL || "http",
});

export default ipfs;
