import * as common from "./statusbar-common";
import * as definition from "statusbar";
export declare class StatusBar extends common.StatusBar {
    private getStatusBarView();
    updateBarStyle(value: string): void;
    updateBarColor(value: string): void;
    constructor(options?: definition.Options);
}
