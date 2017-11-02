// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import {ConfigurationReader} from "../common/configurationReader";
import {Packager} from "../common/packager";
import {LogLevel} from "./log/LogHelper";
// BEGIN MODIFIED BY PELMERS
import {Uri} from "vscode";
const vscode: any = {workspace: {rootPath: ""}};
// END MODIFIED BY PELMERS

export class SettingsHelper {
    /**
     * We get the packager port configured by the user
     */
    public static getPackagerPort(fsPath: string): number {
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
    public static getReactNativeProjectRoot(fsPath: string): string {
        // BEGIN MODIFIED BY PELMERS
        // END MODIFIED BY PELMERS
        return vscode.workspace.rootPath;
    }

    /**
     * Get command line run arguments from settings.json
     */
    // BEGIN MODIFIED BY PELMERS
    public static getRunArgs(platform: string, target: "device" | "simulator", uri: Uri): string[] {
        // END MODIFIED BY PELMERS
        return [];
    }

    // BEGIN MODIFIED BY PELMERS
    public static getEnvArgs(platform: string, target: "device" | "simulator", uri: Uri): any {
        // END MODIFIED BY PELMERS
        return {};
    }

    // BEGIN MODIFIED BY PELMERS
    public static getEnvFile(platform: string, target: "device" | "simulator", uri: Uri): string {
        // END MODIFIED BY PELMERS
        return "";
    }
}
