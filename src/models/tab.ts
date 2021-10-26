import { Pane } from './pane';

export class Tab {
    constructor() { }

    public panes: Pane[] = [new Pane(this)];
    public title?: string = 'New tab';
}