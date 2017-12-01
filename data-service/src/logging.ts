import { createLogger, stdSerializers, LogLevel, levelFromName } from "bunyan";

export class Logging {

    public defaultLogger = (level: LogLevel) => {
        const logger = createLogger({
            name: "CollegeFinder.Frontend.Logger",
            serializers: {
                err: stdSerializers.err,
                req: stdSerializers.req
            },
            streams: [
                {
                    level,
                    stream: process.stdout
                }
            ]
        });

        logger.info(`Logger created with level: ${level}!`);

        return logger;
    }
}

const logLevel = process.env.LOG_LEVEL as LogLevel || "debug";
export default new Logging().defaultLogger(logLevel);
