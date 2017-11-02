// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

/**
 * Formatter for the Output channel.
 */

// BEGIN MODIFIED BY PELMERS
import {OutputChannel} from "vscode";
// END MODIFIED BY PELMERS
import { ILogger, LogLevel, LogHelper } from "./LogHelper";
import { logger } from "vscode-chrome-debug-core";

const channels: { [channelName: string]: OutputChannelLogger } = {};

// BEGIN MODIFIED BY PELMERS
const ConsoleChannel: OutputChannel = {
    name: "console",
    append(value: string): void {
        logger.log(value.trim());
    },
    appendLine(value: string): void {
        logger.log(value.trim());
    },
    clear(): void {
    },
    show(_column?: any, _preserveFocus?: boolean): void {
    },
    hide(): void {
    },
    dispose(): void {
    },
};
// END MODIFIED BY PELMERS

export class OutputChannelLogger implements ILogger {
    public static MAIN_CHANNEL_NAME: string = "React Native";
    private outputChannel: OutputChannel;

    public static disposeChannel(channelName: string): void {
        if (channels[channelName]) {
            channels[channelName].getOutputChannel().dispose();
            delete channels[channelName];
        }
    }

    public static getMainChannel(): OutputChannelLogger {
        return this.getChannel(this.MAIN_CHANNEL_NAME, true);
    }

    public static getChannel(channelName: string, lazy?: boolean, preserveFocus?: boolean): OutputChannelLogger {
        if (!channels[channelName]) {
            channels[channelName] = new OutputChannelLogger(channelName, lazy, preserveFocus);
        }

        return channels[channelName];
    }

    constructor(public readonly channelName: string, lazy: boolean = false, private preserveFocus: boolean = false) {
        if (!lazy) {
            // BEGIN MODIFIED BY PELMERS
            this.channel = ConsoleChannel;
            // END MODIFIED BY PELMERS
            this.channel.show(this.preserveFocus);
        }
    }

    public log(message: string, level: LogLevel): void {
        if (LogHelper.LOG_LEVEL === LogLevel.None) {
            return;
        }

        if (level >= LogHelper.LOG_LEVEL) {
            message = OutputChannelLogger.getFormattedMessage(message, level);
            this.channel.appendLine(message);
        }
    }

    public info(message: string): void {
        this.log(message, LogLevel.Info);
    }

    public warning(message: string | Error, logStack = false): void {
        this.log(message.toString(), LogLevel.Warning);
    }

    public error(errorMessage: string, error?: Error, logStack: boolean = true): void {
        this.channel.appendLine(OutputChannelLogger.getFormattedMessage(errorMessage, LogLevel.Error));

        // Print the error stack if necessary
        if (logStack && error && (<Error>error).stack) {
            this.channel.appendLine(`Stack: ${(<Error>error).stack}`);
        }
    }

    public debug(message: string): void {
        this.log(message, LogLevel.Debug);
    }

    public logStream(data: Buffer | string) {
        this.channel.append(data.toString());
    }

    public setFocusOnLogChannel(): void {
        this.channel.show(false);
    }

    protected static getFormattedMessage(message: string, level: LogLevel): string {
        return `[${LogLevel[level]}] ${message}\n`;
    }

    public getOutputChannel(): OutputChannel {
        return this.channel;
    }

    public clear(): void {
        this.channel.clear();
    }

    private get channel(): OutputChannel {
        if (this.outputChannel) {
            return this.outputChannel;
        } else {
            // BEGIN MODIFIED BY PELMERS
            this.outputChannel = ConsoleChannel;
            // END MODIFIED BY PELMERS
            this.outputChannel.show(this.preserveFocus);
            return this.outputChannel;
        }
    }

    private set channel(channel: OutputChannel) {
        this.outputChannel = channel;
    }
}
