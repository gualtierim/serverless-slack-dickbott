import { IModule, IIntentRegistry } from "dickbott";
import { IntroduceYourselfIntent } from "./IntroduceYourselfIntent";

export class SlackModule implements IModule {
    register(intentRegistry: IIntentRegistry): void {
        intentRegistry.add(IntroduceYourselfIntent);
    }
}