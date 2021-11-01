import type { Layout } from "../models/layout";
import { Tab } from "../models/tab";

export class TabService {
    public add(layout: Layout): void {
        layout.tabs.push(new Tab(layout));
    }

    public remove(tab: Tab): void {
        if (tab.layout.tabs.length === 1 && tab.layout.tabs[0] === tab) throw new Error('Cannot remove final tab in store');

        tab.layout.tabs.splice(tab.layout.tabs.indexOf(tab), 1);
    }
}