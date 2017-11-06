// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import {ConfigurationReader} from "../common/configurationReader";
import {Packager} from "../common/packager";
import {LogLevel} from "./log/LogHelper";
// BEGIN MODIFIED BY PELMERS
const vscode: any = {};
const path: any = {};
// END MODIFIED BY PELMERS

export class SettingsHelper {
    /**
     * Path to the workspace settings file
     */
    public static get settingsJsonPath(): string {
        return path.join(vscode.workspace.rootPath, ".vscode", "settings.json");
    }

    /**
     * Enable javascript intellisense via typescript.
     */
    public static notifyUserToAddTSDKInSettingsJson(tsdkPath: string): void {
        vscode.window.showInformationMessage(`Please make sure you have \"typescript.tsdk\": \"${tsdkPath}\" in .vscode/settings.json and restart VSCode afterwards.`);
    }

    /**
     * Removes javascript intellisense via typescript.
     */
    public static notifyUserToRemoveTSDKFromSettingsJson(tsdkPath: string): void {
        vscode.window.showInformationMessage(`Please remove \"typescript.tsdk\": \"${tsdkPath}\" from .vscode/settings.json and restart VSCode afterwards.`);
    }

    /**
     * Get the path of the Typescript TSDK as it is in the workspace configuration
     */
    public static getTypeScriptTsdk(): string | null {
        const workspaceConfiguration = vscode.workspace.getConfiguration();
        if (workspaceConfiguration.has("typescript.tsdk")) {
            const tsdk = workspaceConfiguration.get("typescript.tsdk");
            if (tsdk) {
                return ConfigurationReader.readString(tsdk);
            }
        }
        return null;
    }

    /**
     * We get the packager port configured by the user
     */
    public static getPackagerPort(): number {
        // BEGIN MODIFIED BY PELMERS
        // END MODIFIED BY PELMERS
        return Packager.DEFAULT_PORT;
    }

    /**
     * Get logLevel setting
     */
    public static getLogLevel(): LogLevel {
        // BEGIN MODIFIED BY PELMERS
        // END MODIFIED BY PELMERS
        return LogLevel.Info;
    }

    /**
     * Get the React Native project root path
     */
    public static getReactNativeProjectRoot(): string {
        // BEGIN MODIFIED BY PELMERS
        // END MODIFIED BY PELMERS
        return vscode.workspace.rootPath;
    }

    /**
     * Get command line run arguments from settings.json
     */
    public static getRunArgs(platform: string, target: "device" | "simulator"): string[] {
        // BEGIN MODIFIED BY PELMERS
        // END MODIFIED BY PELMERS
        return [];
    }
}
