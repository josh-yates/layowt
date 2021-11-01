import type { Layout } from './layout';
import { Pane } from './pane';

export class Tab {
    constructor(public layout: Layout) { }

    public panes: Pane[] = [new Pane(this)];
    public title?: string = 'New tab';
}