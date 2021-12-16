import { Layout } from "../models/layout";
import { Pane } from "../models/pane";
import { Tab } from "../models/tab";

export class CloningService {
    public cloneLayout(layout: Layout): Layout {
        const newLayout = new Layout();

        newLayout.title = layout.title + ' (clone)';

        newLayout.tabs = layout.tabs.map(t => {
            const newTab = this.cloneTab(t);

            newTab.layout = newLayout;

            return newTab;
        });

        return newLayout;
    }

    public cloneTab(tab: Tab): Tab {
        const newTab = new Tab(tab.layout);

        newTab.title = tab.title;

        newTab.panes = tab.panes.map(p => {
            const newPane = this.clonePane(p);

            newPane.tab = newTab;
            newPane.parentSplit = p.parentSplit;

            return newPane;
        });

        newTab.panes.forEach((p, i) => {
            const oldPane = tab.panes[i];

            p.parent = oldPane.parent ? newTab.panes[tab.panes.indexOf(oldPane.parent)] : null;

            p.children = oldPane
                .children
                .map(c => tab.panes.indexOf(c))
                .map(i => newTab.panes[i]);
        });

        return newTab;
    }

    public clonePane(pane: Pane): Pane {
        const newPane = new Pane(pane.tab);

        newPane.cloneOnSplit = pane.cloneOnSplit;
        newPane.colourScheme = pane.colourScheme;
        newPane.content = pane.content;
        newPane.directory = pane.directory;
        newPane.persistTitle = pane.persistTitle;
        newPane.title = pane.title;

        return newPane;
    }
}