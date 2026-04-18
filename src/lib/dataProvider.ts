import { RpcApiClient } from "./api";
import { RPCDataProvider } from "./ra/RPCDataProvider";

export const dataProvider = new RPCDataProvider("/api/models", {
  idMap: {
    tripUser: "userId",
  },
  queryHandlers: {
    user: (q) => ({ name: { contains: q } }),
  },
});

export const apiClient = new RpcApiClient("/api/models");
