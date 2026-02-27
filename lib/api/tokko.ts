import axios from "axios";

const TOKKO_BASE_URL =
  process.env.TOKKO_BASE_URL || "https://www.tokkobroker.com/api";
const TOKKO_API_KEY = process.env.TOKKO_API_KEY;

export const tokkoClient = axios.create({
  baseURL: TOKKO_BASE_URL,
  params: TOKKO_API_KEY ? { key: TOKKO_API_KEY } : undefined,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
