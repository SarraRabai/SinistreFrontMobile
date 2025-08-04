import client from "./client";

const login = (cin, password) => client.post("/auth", { cin, password });

export default {
  login,
};
