import { httpGet, controller } from "inversify-express-utils";
import { Request, Response } from "express-serve-static-core";

@controller("/")
export class Index {

    @httpGet("/get-env")
    public async getEnvironment(req: Request, res: Response): Promise<Response> {
        const env = process.env.NODE_ENV;

        req.log.debug(`Returning environment: ${env}`);
        return res.json(env);
    }
}