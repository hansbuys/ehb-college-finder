import { createLogger, stdSerializers } from "bunyan";

export class Logging {
    public defaultLogger = createLogger({
        name: "CollegeFinderLogger",
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
