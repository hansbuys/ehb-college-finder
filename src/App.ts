import * as express from "express";

const debug = require("debug")("collegefinder");
debug("Bootstrapping CollegeFinder application");

import stateFinder from "./route/stateFinder";

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();

        debug("Mapping all routes");

        this.express.use("/", router);
        this.express.use("/find/by-state", stateFinder);
    }
}

export default new App().express;
