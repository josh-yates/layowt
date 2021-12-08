import { Tab } from "./tab";

export class Layout {
    public title?: string;
    public selected?: boolean;
    public tabs: Tab[] = [new Tab(this)];
}