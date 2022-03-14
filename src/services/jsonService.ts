import { Layout } from "../models/layout";
import { Pane } from "../models/pane";
import { Tab } from "../models/tab";
import type { PaneService } from "./paneService";

export class JSONService {
    public constructor(private readonly _paneService: PaneService) { }

    public layoutsToJSON(layouts: Layout[]): string {
        if (!layouts || !layouts.length) return null;

        const layoutsForConversion = layouts.map(l => {
            const layoutForConversion = new Layout();

            layoutForConversion.title = l.title;

            layoutForConversion.tabs = l.tabs.map(t => {
                const tab = new Tab(null);

                tab.title = t.title;

                const rootPane = this._paneService.getRootNode(t);

                tab.panes = [this.mapPaneForSaving(rootPane)];

                return tab;
            });

            return layoutForConversion;
        });

        return JSON.stringify(layoutsForConversion);
    }

    public jsonToLayouts(json: string): Layout[] {
        if (!json) return [];

        const layouts = JSON.parse(json) as Layout[];

        layouts.forEach(l => l.tabs.forEach(t => {
            t.layout = l;

            this.hydratePane(t.panes[0], null);
            t.panes = this.collectPanes(t.panes[0]);
            t.panes.forEach(p => p.tab = t);
        }));

        return layouts;
    }

    public hydratePane(pane: Pane, parentPane: Pane) {
        pane.parent = parentPane;

        pane.children.forEach(p => this.hydratePane(p, pane));
    }

    public collectPanes(searchPane: Pane): Pane[] {
        return [searchPane, ...[].concat.apply([], searchPane.children.map(p => this.collectPanes(p)))];
    }

    private mapPaneForSaving(pane: Pane): Pane {
        const newPane = new Pane(null);

        newPane.title = pane.title;
        newPane.tabColour = pane.tabColour;
        newPane.colourScheme = pane.colourScheme;
        newPane.content = pane.content;
        newPane.directory = pane.directory;
        newPane.parentSplit = pane.parentSplit;
        newPane.size = pane.size ?? 50;

        newPane.children = pane.children.map(p => this.mapPaneForSaving(p));

        return newPane;
    }
}