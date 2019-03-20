import { inject } from "inversify";
import { Intent, IntentDefinition, IntentMetadataExtractor, IIntentRegistry } from 'dickbott';
import * as _ from "lodash";
import { SlackMessage } from "./SlackMessage.type";

@IntentDefinition({
    name: "IntroduceYourselfIntent",
    description: "",
    examples: {
        Simple: "Introduce yourself",
        Elegant: "Please, can you introduce yourself?"
    },
    docs_url: "https://bitbucket.tierratelematics.com",
    slack: ["/introduce"]
})
export class IntroduceYourselfIntent implements Intent<void, SlackMessage> {
    constructor(@inject("IIntentRegistry") private intentRegistry: IIntentRegistry) {
    }

    async execute(executionId: string): Promise<SlackMessage> {
        let attachments = _(this.intentRegistry.getAll())
            .map(intent => IntentMetadataExtractor.extract(intent.constructor))
            .map(intentMetadata => {
                return ({
                attachment_type: "default",
                title: intentMetadata.name,
                title_link: intentMetadata.docs_url,
                text: intentMetadata.description,
                fields: _.map(intentMetadata.examples, (value, key) => ({
                    short: true,
                    title: key,
                    value: `"${value}"`
                })),
                color: "#d2dde1",
                mrkdwn_in: [
                    "text",
                    "pretext",
                    "fields"
                ]
            })})
            .value();

        return {
            text: "I am a chatbot designed to help you with your infrastructure duties.\n\nThis is the list of what I'm capable of doing today for you.",
            attachments: attachments
        };
    }
}