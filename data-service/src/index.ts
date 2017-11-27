import app from "./App";
import logger from "./logging";

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        return logger.error(err);
    }

    return logger.info(`server is listening on ${port}`);
});
