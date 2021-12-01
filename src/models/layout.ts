import { Tab } from "./tab";

export class Layout {
    public title?: string;
    public tabs: Tab[] = [new Tab(this)];
}