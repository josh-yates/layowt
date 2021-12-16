import type { Layout } from "../models/layout";
import { Pane } from "../models/pane";
import type { Tab } from "../models/tab";

export class CloningService {
    public cloneTab(tab: Tab): Tab {
        return null;
    }

    public cloneLayout(layout: Layout): Layout {
        return null;
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