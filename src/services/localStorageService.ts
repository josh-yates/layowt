import { Layout } from "../models/layout";
import { Pane } from "../models/pane";
import { Tab } from "../models/tab";
import type { PaneService } from "./paneService";

export class LocalStorageService {
    public constructor(private readonly _paneService: PaneService) { }

    public saveLayout(layout: Layout): void {
        if (!layout) return;

        const layoutToSave = new Layout();

        layoutToSave.tabs = layout.tabs.map(t => {
            const tab = new Tab(null);

            tab.title = t.title;

            const rootPane = this._paneService.getRootNode(t);

            tab.panes = [this.mapPaneForSaving(rootPane)];

            return tab;
        });

        window.localStorage.setItem('layout', JSON.stringify(layoutToSave));
    }

    public retrieveLayout(): Layout {
        const layoutJSON = window.localStorage.getItem('layout');

        if (!layoutJSON) return null;

        const layout = JSON.parse(layoutJSON) as Layout;

        layout.tabs.forEach(t => {
            t.layout = layout;

            this.hydratePane(t.panes[0], null);
            t.panes = this.collectPanes(t.panes[0]);
            t.panes.forEach(p => p.tab = t);
        });

        return layout;
    }

    private hydratePane(pane: Pane, parentPane: Pane) {
        pane.parent = parentPane;

        pane.children.forEach(p => this.hydratePane(p, pane));
    }

    private collectPanes(searchPane: Pane): Pane[] {
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

        newPane.children = pane.children.map(p => this.mapPaneForSaving(p));

        return newPane;
    }
}