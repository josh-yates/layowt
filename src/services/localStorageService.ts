import { Layout } from "../models/layout";
import { Pane } from "../models/pane";
import { Tab } from "../models/tab";
import type { PaneService } from "./paneService";

export class LocalStorageService {
    public constructor(private readonly _paneService: PaneService) { }

    public saveLayouts(layouts: Layout[]): void {
        if (!layouts || !layouts.length) return;

        const layoutsToSave = layouts.map(l => {
            const layoutToSave = new Layout();

            layoutToSave.title = l.title;

            layoutToSave.tabs = l.tabs.map(t => {
                const tab = new Tab(null);

                tab.title = t.title;

                const rootPane = this._paneService.getRootNode(t);

                tab.panes = [this.mapPaneForSaving(rootPane)];

                return tab;
            });

            return layoutToSave;
        });

        window.localStorage.setItem('layouts', JSON.stringify(layoutsToSave));
    }

    public retrieveLayouts(): Layout[] {
        let layouts = [new Layout()];

        const layoutsJSON = window.localStorage.getItem('layouts');

        if (layoutsJSON) {
            layouts = JSON.parse(layoutsJSON) as Layout[];

            layouts.forEach(l => l.tabs.forEach(t => {
                t.layout = l;

                this.hydratePane(t.panes[0], null);
                t.panes = this.collectPanes(t.panes[0]);
                t.panes.forEach(p => p.tab = t);
            }));
        }

        // Legacy support - move old 'single layout' to new multi layout
        const legacyLayoutJSON = window.localStorage.getItem('layout');

        if (legacyLayoutJSON) {
            const legacyLayout = JSON.parse(legacyLayoutJSON) as Layout;

            legacyLayout.tabs.forEach(t => {
                t.layout = legacyLayout;

                this.hydratePane(t.panes[0], null);
                t.panes = this.collectPanes(t.panes[0]);
                t.panes.forEach(p => p.tab = t);
            });

            layouts = [legacyLayout, ...layouts];

            localStorage.removeItem('layout');
        }

        return layouts;
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