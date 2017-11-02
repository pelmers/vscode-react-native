// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import {Telemetry} from "./telemetry";
import {MobilePlatformDeps} from "../extension/generalMobilePlatform";
// BEGIN MODIFIED BY PELMERS
import {PlatformResolver} from "../extension/platformResolver";
import {TargetPlatformHelper} from "./targetPlatformHelper";
import {SettingsHelper} from "../extension/settingsHelper";
import {Packager} from "./packager";
import Uri from "vscode-uri";
import Q = require("q");

export interface ICommonApi {
    expose(methods: any): void;
}
export interface IExtensionApi extends ICommonApi {
    stopMonitoringLogcat(): Q.Promise<void>;
    sendTelemetry(extensionId: string, extensionVersion: string, appInsightsKey: string, eventName: string,
                  properties?: Telemetry.ITelemetryEventProperties, measures?: Telemetry.ITelemetryEventMeasures): Q.Promise<any>;
    openFileAtLocation(filename: string, lineNumber: number): Q.Promise<void>;
    getPackagerPort(program: string): Q.Promise<number>;
    showInformationMessage(infoMessage: string): Q.Promise<void>;
    launch(request: any): Q.Promise<any>;
    showDevMenu(deviceId?: string): Q.Promise<any>;
    reloadApp(deviceId?: string): Q.Promise<any>;
}

export interface IDebuggerApi extends ICommonApi {
    onShowDevMenu(handler: () => void): Q.Promise<any>;
    onReloadApp(handler: () => void): Q.Promise<any>;
    emitShowDevMenu(deviceId?: string): Q.Promise<any>;
    emitReloadApp(deviceId?: string): Q.Promise<any>;
}
export interface IRemoteExtension {
    Extension: IExtensionApi;
    Debugger: IDebuggerApi;
}

export class RemoteExtension {
    public static atProjectRootPath(projectRootPath: string, port: number) {
        const packager = new Packager(projectRootPath, projectRootPath, port);
        return new RemoteExtension(projectRootPath, packager);
    }

    constructor(private projectRootPath: string, private reactNativePackager: Packager) {}

    public getPackagerPort(program: string): Q.Promise<number> {
        return Q(this.reactNativePackager.packagerPort);
    }

    public showDevMenu(deviceId?: string): Q.Promise<any> {
        return Q(null);
    }

    public reloadApp(deviceId?: string): Q.Promise<any> {
        return Q(null);
    }

    public stopMonitoringLogcat(): Q.Promise<any> {
        return Q(null);
    }

    public openFileAtLocation(args: any): Q.Promise<any> {
        return Q(null);
    }

    public sendTelemetry(args: any): Q.Promise<any> {
        return Q(null);
    }

    public showInformationMessage(args: any): Q.Promise<any> {
        return Q(null);
    }

    // TODO(pelmers): mostly copied from extensionServer.launch
    public launch(request: any): Q.Promise<any> {
        let mobilePlatformOptions = this.requestSetup(request.arguments);

        // We add the parameter if it's defined (adapter crashes otherwise)
        if (!isNullOrUndefined(request.arguments.logCatArguments)) {
            mobilePlatformOptions.logCatArguments = [parseLogCatArguments(request.arguments.logCatArguments)];
    }

        if (!isNullOrUndefined(request.arguments.variant)) {
            mobilePlatformOptions.variant = request.arguments.variant;
    }

        if (!isNullOrUndefined(request.arguments.scheme)) {
            mobilePlatformOptions.scheme = request.arguments.scheme;
    }

        mobilePlatformOptions.packagerPort = this.reactNativePackager.packagerPort
        const platformDeps: MobilePlatformDeps = {
            packager: this.reactNativePackager,
        };
        const mobilePlatform = new PlatformResolver()
            .resolveMobilePlatform(request.arguments.platform, mobilePlatformOptions, platformDeps);
        return Q(new Promise((resolve, reject) => {
                TargetPlatformHelper.checkTargetPlatformSupport(mobilePlatformOptions.platform);
                return mobilePlatform.startPackager()
                    .then(() => {
                        // We've seen that if we don't prewarm the bundle cache, the app fails on the first attempt to connect to the debugger logic
                        // and the user needs to Reload JS manually. We prewarm it to prevent that issue
                        console.error("Prewarming bundle cache. This may take a while ...");
                        return mobilePlatform.prewarmBundleCache();
                    })
                    .then(() => {
                        console.error("Building and running application.");
                        return mobilePlatform.runApp();
                    })
                    .then(() => {
                        return mobilePlatform.enableJSDebuggingMode();
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch(error => {
                        console.error(error);
                        reject(error);
                    });
            }));
    }

    private requestSetup(args: any): any {
        const projectRootPath = this.projectRootPath;
        let mobilePlatformOptions: any = {
            projectRoot: projectRootPath,
            platform: args.platform,
            env: args.env,
            envFile: args.envFile,
            target: args.target || "simulator",
        };

        if (!args.runArguments) {
            let runArgs = SettingsHelper.getRunArgs(args.platform, args.target || "simulator", Uri.file(projectRootPath));
            mobilePlatformOptions.runArguments = runArgs;
        } else {
            mobilePlatformOptions.runArguments = args.runArguments;
        }

        return mobilePlatformOptions;
    }
}

function isNullOrUndefined(value: any): boolean {
    return typeof value === "undefined" || value === null;
}

/**
 * Parses log cat arguments to a string
 */
function parseLogCatArguments(userProvidedLogCatArguments: any): string {
    return Array.isArray(userProvidedLogCatArguments)
        ? userProvidedLogCatArguments.join(" ") // If it's an array, we join the arguments
        : userProvidedLogCatArguments; // If not, we leave it as-is
    }
// END MODIFIED BY PELMERS
