import logger from "./logging";
import * as Logger from "bunyan";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as util from "util";
import { v1 as uuid } from "uuid";
import { NextFunction, Request, Response, Router } from "express";

logger.info("Bootstrapping CollegeFinder Frontend application.");

import messageService from "./endpoints/message";

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.mountRoutes();
    }

    private middleware(): void {
        logger.trace("Setup middleware.");

        this.express.use(express.static("./public"));
        this.express.use(bodyParser.json());

        this.express.use(this.addLogging);
        this.express.use(this.addRequestId);
        this.express.use(this.measureTiming);
        this.express.use(this.logErrors);
    }

    private addLogging(req: any, res: any, next: any) {
        logger.trace("Adding per request logging available as 'req.log'.");
        req.log = logger;

        next();
    }

    private addRequestId(req: any, res: any, next: any) {
        logger.trace("Adding a unique request ID to the HTTP headers.");
        const requestId = uuid();

        res.header("X-Request-Id", requestId);
        req.log = logger.child({ requestId });

        next();
    }

    private measureTiming(req: any, res: any, next: any) {
        const log = req.log;
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

        next();
    }

    private logErrors(req: any, res: any, next: any) {
        const log = req.log;

        res.on("error", (err: any) => {
            log.error(`Request ${req.url} errored: ${err.message}`);
        });

        next();
    }

    private mountRoutes(): void {
        const router = express.Router();

        logger.debug("Mapping all routes");

        this.express.use("/", router);
        this.express.use("/api/message", messageService);
        this.express.get("/get-env", App.getEnvironment);
    }

    private static async getEnvironment(req: any, res: Response, next: NextFunction): Promise<Response> {
        const env = process.env.NODE_ENV;

        req.log.debug(`Returning environment: ${env}`);
        return res.json(env);
    }
}

export default new App().express;
