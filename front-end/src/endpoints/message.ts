import { NextFunction, Request, Response, Router } from "express";
import logger from "../logging";
import * as bodyParser from "body-parser"; // parser for post requests
import { ConversationV1 as Conversation } from "watson-developer-cloud"; // watson sdk
import { promisify } from "util";

class MessageService {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public static sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const workspace = process.env.WORKSPACE_ID || "<workspace-id>";
        if (!workspace || workspace === "<workspace-id>") {
            logger.error("Environment variable WORKSPACE_ID has not been set.");
            return new Promise<Response>(() => res.json({
                output: {
                    text: "The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. " +
                        "Please refer to the " +
                        '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' +
                        "Once a workspace has been defined the intents may be imported from " +
                        '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
                }
            }));
        }
        const payload = {
            workspace_id: workspace,
            context: req.body.context || {},
            input: req.body.input || {}
        };

        logger.debug(`Sending message to IBM Watson`);

        const watson = MessageService.getWatson();
        const sendMessageAsync = promisify(watson.message);

        return sendMessageAsync.call(watson, payload).then((data: any) => {
            logger.error("IBM Watson returned data succesfully.");
            return res.json(MessageService.updateMessage(payload, data));
        }).catch((err: any) => {
            logger.error(`IBM Watson returned an error: ${err}.`);
            return res.status(err.code || 500).json(err);
        });
    }

    public init(): void {
        logger.debug("Mapping routes for MessageService");

        this.router.post("/", MessageService.sendMessage);
    }

    private static getWatson(): Conversation {
        logger.debug(`Initializing IBM Watson client`);

        const watson = new Conversation({
            // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
            // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
            username: process.env.CONVERSATION_USERNAME,
            password: process.env.CONVERSATION_PASSWORD,
            version_date: Conversation.VERSION_DATE_2017_05_26
        });

        return watson;
    }

    private static updateMessage(input: any, response: any): any {
        logger.debug(`Watson responsed with ${JSON.stringify(response)}`);

        if (response.intents && response.intents[0]) {
            const intent = response.intents[0];

            logger.debug(`IBM Watson has a confidence level of ${intent.confidence} for intent ${intent.intent}`);
        }

        if (response.context && response.context.system && response.context.system.branch_exited) {
            logger.debug(`IBM Watson has gathered all required information`);

            if (response.context.state) {
                const state = response.context.state;
                logger.debug(`IBM Watson concluded that the user is looking in state ${state}`);
            }
        }

        let responseText = null;
        if (!response.output) {
            response.output = {};
        } else {
            return response;
        }

        if (response.intents && response.intents[0]) {
            const intent = response.intents[0];

            logger.debug(`IBM Watson has a confidence level of ${intent.confidence} for intent ${intent.intent}`);

            // Depending on the confidence of the response the app can return different messages.
            // The confidence will vary depending on how well the system is trained. The service will always try to assign
            // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
            // user's intent . In these cases it is usually best to return a disambiguation message
            // ('I did not understand your intent, please rephrase your question', etc..)
            if (intent.confidence >= 0.75) {
                responseText = `I understood your intent was ${intent.intent}`;
            } else if (intent.confidence >= 0.5) {
                responseText = `I think your intent was ${intent.intent}`;
            } else {
                responseText = `I did not understand your intent`;
            }
        }
        response.output.text = responseText;
        return response;
    }
}

export default new MessageService().router;
