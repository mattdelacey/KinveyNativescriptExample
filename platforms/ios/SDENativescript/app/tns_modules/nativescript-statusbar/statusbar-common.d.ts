import * as definition from "statusbar";
import { View, Property } from "ui/core/view";
export declare class StatusBar extends View implements definition.StatusBar {
    constructor(options?: definition.Options);
    updateBarStyle(value: string): void;
    updateBarColor(value: string): void;
}
export declare const barStyleProperty: Property<StatusBar, string>;
export declare const barColorProperty: Property<StatusBar, string>;
