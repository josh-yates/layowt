import { Tab } from "./tab";

export class Layout {
    public id?: number;
    public title?: string;
    public tabs: Tab[] = [new Tab(this)];
}