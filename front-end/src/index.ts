import logger from "./logging";
import { config as dotenvConfig } from "dotenv";

logger.debug("Loading environment variables from .env file");
dotenvConfig();

import app from "./App";

const port = process.env.PORT || 3001;

app.listen(port, (err: any) => {
    if (err) {
        return logger.error(err);
    }

    return logger.info(`server is listening on ${port}`);
});
