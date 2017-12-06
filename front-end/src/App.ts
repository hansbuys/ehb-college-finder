import logger from "./logging";
import * as Logger from "bunyan";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as util from "util";
import { v1 as uuid } from "uuid";

logger.info("Bootstrapping CollegeFinder Frontend application");

import messageService from "./endpoints/message";

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.mountRoutes();
    }

    private middleware(): void {
        this.express.use(express.static("./public"));
        this.express.use(bodyParser.json());

        this.express.use((req: any, res, next) => {
            const requestId = uuid();
            res.header("X-Request-Id", requestId);
            const log = req.log = logger.child({ requestId });

            const start = process.hrtime();
            const reqUrl = req.url;
            log.debug(`Starting request ${reqUrl}.`);
            res.on("finish", () => {
                const elapsed = process.hrtime(start);
                const elapsedInMs = (elapsed[0] * 1000) + (elapsed[1] / 1000000);
                const message = `Handled ${reqUrl} in ${elapsedInMs.toFixed(3)}ms.`;
                if (elapsedInMs < 3000) {
                    log.info(message);
                } else {
                    log.warn(message);
                }
            });

            res.on("error", (err) => {
                log.error(`Request ${reqUrl} errored: ${err.message}`);
            });

            next();
        });
    }

    private mountRoutes(): void {
        const router = express.Router();

        logger.debug("Mapping all routes");

        this.express.use("/", router);
        this.express.use("/api/message", messageService);
    }
}

export default new App().express;
