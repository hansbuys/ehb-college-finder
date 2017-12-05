import logger from "./logging";
import * as express from "express";
import * as bodyParser from "body-parser";

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

        this.express.use((req, res, next) => {
            const start = process.hrtime();
            const reqUrl = req.url;
            logger.debug(`Starting request ${reqUrl}.`);

            res.on("finish", () => {
                const elapsed = process.hrtime(start);
                const elapsedInMs = (elapsed[0] * 1000) + (elapsed[1] / 1000000);
                const message = `Handled ${reqUrl} in ${elapsedInMs.toFixed(3)}ms.`;
                if (elapsedInMs < 3000) {
                    logger.info(message);
                } else {
                    logger.warn(message);
                }
            });

            res.on("error", (err) => {
                logger.error(`Request ${reqUrl} errored: ${err.message}`);
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
