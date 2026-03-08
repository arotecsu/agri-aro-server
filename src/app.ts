import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";

import { envService } from "./config/env";
import { socketService } from "./services/socket";
import { loadRoutes } from "./routes";
import { connectDatabase } from "./database/db";
import { initJob } from "./services/jobs";

const NODE_ENV = envService.get("NODE_ENV");
const PORT = parseInt(envService.get("PORT"));

connectDatabase();

const corsConfig = {
  origin: NODE_ENV == "development" ? "*" : ["https://agriaro.arotec.ao"],
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsConfig));

app.use(express.static("public"));

loadRoutes(app);

const server = createServer(app);

socketService.start(server, corsConfig);

initJob();

server.listen(PORT, async () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
