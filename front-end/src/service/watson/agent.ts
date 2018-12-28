import { Agent } from "../agent";
import * as Logger from "bunyan";
import { ConversationV1 as WatsonClient } from "watson-developer-cloud";
import { MessageParams, InputData } from "watson-developer-cloud/conversation/v1-generated";
import { promisifyAll } from "bluebird";

declare module "watson-developer-cloud" {
    export interface ConversationV1 {
        messageAsync(...args: any[]): Promise<any>;
    }
}

export class WatsonAgent implements Agent {

    private log: Logger;
    private watson: WatsonClient;

    constructor(log: Logger) {
        this.log = log;
        this.watson = this.buildWatsonClient();
    }

    public async sendMessage(body: { context: {}, input: InputData }): Promise<{}> {
        // this code originates from https://github.com/watson-developer-cloud/conversation-simple
        // the code has since been modified, but the principles are the same.
        const workspace = process.env.WORKSPACE_ID || "<workspace-id>";
        if (!workspace || workspace === "<workspace-id>") {
            this.log.error("Environment variable WORKSPACE_ID has not been set.");
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

        const payload: MessageParams = {
            workspace_id: workspace,
            context: body.context || {},
            input: body.input || undefined
        };


        this.log.trace("Sending message to IBM Watson");

        try {
            const data = await this.watson.messageAsync(payload);

            this.log.debug("IBM Watson call succesfull.");

            return data;
        }
        catch (err) {
            this.log.error(`IBM Watson returned an error: ${err}.`);
            return err;
        }
    }

    private buildWatsonClient(): WatsonClient {
        this.log.trace("Initializing IBM Watson client");

        const watson = new WatsonClient({
            username: process.env.CONVERSATION_USERNAME,
            password: process.env.CONVERSATION_PASSWORD,
            version_date: WatsonClient.VERSION_DATE_2017_05_26
        });

        return promisifyAll(watson);
    }
}
