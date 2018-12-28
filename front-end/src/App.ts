import logger from "./logging";
import { json } from "body-parser";
import * as express from "express";
import { v1 as uuid } from "uuid";
import { NextFunction, Response, Application, Request } from "express";
import { InversifyExpressServer, httpGet } from 'inversify-express-utils';
import { Container } from 'inversify';

logger.info("Bootstrapping CollegeFinder Frontend application.");

export class App {

    public static setup() {
        let container = new Container();

        let server = new InversifyExpressServer(container);

        server.setConfig((app) => {
            logger.trace("Setup middleware.");
    
            app.use(express.static("./public"));
            app.use(json());

            app.use(App.addLogging);
            app.use(App.addRequestId);
            app.use(App.measureTiming);
            app.use(App.logErrors);
        });

        return server.build();
    }

    private static addLogging(req: Request, res: Response, next: NextFunction) {
        logger.trace("Adding per request logging available as 'req.log'.");
        req.log = logger;

        next();
    }

    private static addRequestId(req: Request, res: Response, next: NextFunction) {
        logger.trace("Adding a unique request ID to the HTTP headers.");
        const requestId = uuid();

        res.header("X-Request-Id", requestId);
        req.log = logger.child({ requestId });

        next();
    }

    private static measureTiming(req: Request, res: Response, next: NextFunction) {
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

    private static logErrors(req: Request, res: Response, next: NextFunction) {
        const log = req.log;

        res.on("error", (err: any) => {
            log.error(`Request ${req.url} errored: ${err.message}`);
        });

        next();
    }
}

export default App.setup();
