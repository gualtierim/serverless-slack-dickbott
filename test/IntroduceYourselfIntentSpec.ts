import "reflect-metadata";
import { IMock, Mock } from "typemoq";
import { Intent, IIntentRegistry } from "dickbott";
import { Test1Intent, Test2Intent } from "./fixtures/IntentTestName";
import { IntroduceYourselfIntent } from "../scripts/IntroduceYourselfIntent";
import expect = require("expect.js");
import { SlackMessage } from "../scripts/SlackMessage.type";


describe("Given an Introduce Yourself intent from the User", () => {
    let intent: Intent<void, SlackMessage>,
    intentRegistry: IMock<IIntentRegistry>;

    beforeEach(() => {
        intentRegistry = Mock.ofType<IIntentRegistry>();
        intentRegistry.setup(i => i.getAll()).returns(() => [new Test1Intent(), new Test2Intent()]);

        intent = new IntroduceYourselfIntent(intentRegistry.object);
    });

    context("when executed", () => {
        it("should return a slack message with all Intents", async () => {
            let slackMessage = await intent.execute("");
            expect(slackMessage).to.be.eql(
                require("./fixtures/IntroduceYourselfIntent.response.json")
            );
        });
    });
});