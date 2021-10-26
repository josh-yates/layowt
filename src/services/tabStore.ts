import { Tab } from "../models/tab";

export class TabStore {
    public tabs: Tab[] = [new Tab()]

    public add(): void {
        this.tabs.push(new Tab());
    }

    public remove(tab: Tab): void {
        if (this.tabs.length === 1 && this.tabs[0] === tab) throw new Error('Cannot remove final tab in store');

        this.tabs.splice(this.tabs.indexOf(tab), 1);
    }
}