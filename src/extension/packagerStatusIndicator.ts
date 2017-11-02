// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

// BEGIN MODIFIED BY PELMERS
import {Disposable} from "vscode";
// END MODIFIED BY PELMERS

/**
 * Updates the Status bar with the status of React Native Packager.
 */

export enum PackagerStatus {
    PACKAGER_STARTED = 0,
    EXPONENT_PACKAGER_STARTED,
    PACKAGER_STOPPED,
}

export class PackagerStatusIndicator implements Disposable {
    private packagerStatusItem: any;
    private static PACKAGER_STARTED_STATUS_STR: string = "React Native Packager: Started";
    private static EXPONENT_PACKAGER_STARTED_STATUS_STR: string = "Exponent Packager: Started";
    private static PACKAGER_STOPPED_STATUS_STR: string = "React Native Packager: Stopped";

    public constructor() {
        // BEGIN MODIFIED BY PELMERS
        this.packagerStatusItem = {show: function() {}, dispose: function() {}};
        // END MODIFIED BY PELMERS
    }

    public dispose(): void {
        this.packagerStatusItem.dispose();
    }

    public updatePackagerStatus(status: PackagerStatus): void {
        switch (status) {
            case PackagerStatus.PACKAGER_STARTED:
                this.packagerStatusItem.text = `$(package) ${PackagerStatusIndicator.PACKAGER_STARTED_STATUS_STR}`;
                break;
            case PackagerStatus.EXPONENT_PACKAGER_STARTED:
                this.packagerStatusItem.text = `$(package) ${PackagerStatusIndicator.EXPONENT_PACKAGER_STARTED_STATUS_STR}`;
                break;
            case PackagerStatus.PACKAGER_STOPPED:
                this.packagerStatusItem.text = `$(package) ${PackagerStatusIndicator.PACKAGER_STOPPED_STATUS_STR}`;
                break;
            default:
                break;
        }
        this.packagerStatusItem.show();
    }
}
