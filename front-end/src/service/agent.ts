import logger from "../logging";
import { promisify } from "util";
import { ConversationV1 as WatsonClient } from "watson-developer-cloud";

export interface Agent {
    sendMessage(context: any, input: any): Promise<string>;
}

export class WatsonAgent implements Agent {

    public sendMessage(context: any, input: any): Promise<any> {
        const workspace = process.env.WORKSPACE_ID || "<workspace-id>";
        if (!workspace || workspace === "<workspace-id>") {
            logger.error("Environment variable WORKSPACE_ID has not been set.");
            return new Promise<any>(() => {
                return {
                    output: {
                        text: "The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. " +
                            "Please refer to the " +
                            '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' +
                            "Once a workspace has been defined the intents may be imported from " +
                            '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
                    }
                };
            });
        }

        const payload = {
            workspace_id: workspace,
            context: context || {},
            input: input || {}
        };

        const watson = this.getWatson();
        const sendMessageAsync = promisify(watson.message);

        logger.trace("Sending message to IBM Watson");
        return sendMessageAsync.call(watson, payload).then((data: any) => {
            logger.debug("IBM Watson call succesfull.");
            return data;
        }).catch((err: any) => {
            logger.error(`IBM Watson returned an error: ${err}.`);
            return err;
        });
    }

    private getWatson(): WatsonClient {
        logger.trace("Initializing IBM Watson client");

        const watson = new WatsonClient({
            username: process.env.CONVERSATION_USERNAME,
            password: process.env.CONVERSATION_PASSWORD,
            version_date: WatsonClient.VERSION_DATE_2017_05_26
        });

        return watson;
    }
}
