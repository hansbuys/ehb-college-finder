import app from "./App";

const debug = require("debug")("collegefinder");

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        return debug(err);
    }

    return debug(`server is listening on ${port}`);
});
