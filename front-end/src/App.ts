import logger from "./logging";
import * as bodyParser from "body-parser";
import * as express from "express";
import { v1 as uuid } from "uuid";
import { NextFunction, Response, Application, Request } from "express";

logger.info("Bootstrapping CollegeFinder Frontend application.");

import messageService from "./endpoints/message";

class App {
    public express: Application;

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

    private mountRoutes(): void {
        const router = express.Router();

        logger.debug("Mapping all routes");

        this.express.use("/", router);
        this.express.use("/api/message", messageService);
        this.express.get("/get-env", App.getEnvironment);
    }

    private addLogging(req: Request, res: Response, next: NextFunction) {
        logger.trace("Adding per request logging available as 'req.log'.");
        req.log = logger;

        next();
    }

    private addRequestId(req: Request, res: Response, next: NextFunction) {
        logger.trace("Adding a unique request ID to the HTTP headers.");
        const requestId = uuid();

        res.header("X-Request-Id", requestId);
        req.log = logger.child({ requestId });

        next();
    }

    private measureTiming(req: Request, res: Response, next: NextFunction) {
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

    private logErrors(req: Request, res: Response, next: NextFunction) {
        const log = req.log;

        res.on("error", (err: any) => {
            log.error(`Request ${req.url} errored: ${err.message}`);
        });

        next();
    }

    private static async getEnvironment(req: Request, res: Response): Promise<Response> {
        const env = process.env.NODE_ENV;

        req.log.debug(`Returning environment: ${env}`);
        return res.json(env);
    }
}

export default new App().express;
