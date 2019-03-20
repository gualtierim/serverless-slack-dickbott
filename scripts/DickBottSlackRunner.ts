import "reflect-metadata";
const Slack = require('serverless-slack');
import { Callback, Context } from 'aws-lambda';
import { DickBottEngine, IIntentRegistry, Intent, IntentMetadataExtractor, IntentDispatcher } from 'dickbott';
import { SlackModule } from "./SlackDickbottModule";
import { IntentMetadata } from "aws-sdk/clients/lexmodelbuildingservice";
import { SlackMessage, InteractiveComponentActions } from "./SlackMessage.type";

export class DickBottSlackRunner {
    constructor(public engine: DickBottEngine = new DickBottEngine(), private slackClient: any = new Slack()){
        this.engine.registerModule(new SlackModule());
    }

    public handler(event: any, context: Context, cb: Callback) {
        this.subscribeAll();
        this.slackClient.handler(event, context, cb);
    }

    private subscribeAll() {
        const dispatcher: IntentDispatcher = this.engine.getService<IntentDispatcher>("IntentDispatcher");
        this.engine.getService<IIntentRegistry>("IIntentRegistry").getAll().forEach((intent: Intent) => {
            const metadata: IntentMetadata = IntentMetadataExtractor.extract(intent.constructor);
            if(!metadata["slack"]){
                return;
            }

            (metadata["slack"] as string[]).forEach((slackEvent) => {
                this.slackClient.on(slackEvent, async(msg: any, bot: any) => {
                    let replyMessage: SlackMessage;
                    if(msg["original_message"]){ //interactive message
                        replyMessage = await dispatcher.complete<InteractiveComponentActions, SlackMessage>(msg);
                    } else {
                        replyMessage = await dispatcher.dispatch<SlackMessage, SlackMessage>(metadata.name, msg);
                    }
                    bot.reply(replyMessage);
                });
            })
        });
    }
}
