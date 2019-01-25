import { ApiServer } from "./server";

const server = new ApiServer();
server.start(+process.env.PORT || 8080);