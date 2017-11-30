import { createLogger, stdSerializers } from "bunyan";

export class Logging {
    public defaultLogger = createLogger({
        name: "CollegeFinder.Frontend.Logger",
        serializers: {
            err: stdSerializers.err,
            req: stdSerializers.req
        },
        streams: [
            {
                level: "debug",
                stream: process.stdout
            }
        ]
    });
}

export default new Logging().defaultLogger;
