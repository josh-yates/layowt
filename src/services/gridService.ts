import { SplitType } from '../models/splitType';
import type { Tab } from '../models/tab';
import type { Pane } from '../models/pane';
import type { PaneService } from './paneService';

export class GridService {
    constructor(
        private readonly _paneService: PaneService) { }

    public getGridColumns(tab: Tab): number {
        const mostVerticalSteps = Math.max(...tab.panes.map(n => this._paneService.getStepsTo(n, SplitType.Vertical)));
        return Math.pow(2, mostVerticalSteps);
    }

    public getGridRows(tab: Tab): number {
        const mostHorizontalSteps = Math.max(...tab.panes.map(n => this._paneService.getStepsTo(n, SplitType.Horizontal)));
        return Math.pow(2, mostHorizontalSteps);
    }

    public getIndex(node: Pane, splitType: SplitType): number {
        if (!node.parent) return 0;

        const parentIndex = this.getIndex(node.parent, splitType);

        return node.parentSplit === splitType ? parentIndex + this.getSpanInternal(node.parent, node, splitType) : parentIndex;
    }

    public getSpan(node: Pane, splitType: SplitType): number {
        return this.getSpanInternal(node, null, splitType);
    }

    private getSpanInternal(node: Pane, checkUpToChild: Pane, splitType: SplitType): number {
        const parentSpan = node.parent ? this.getSpanInternal(node.parent, node, splitType) :
            (splitType === SplitType.Horizontal ? this.getGridRows(node.tab) : this.getGridColumns(node.tab));

        const childrenToCheck = checkUpToChild ? node.children.slice(0, node.children.indexOf(checkUpToChild) + 1) : node.children;

        const childrenWithSplit = childrenToCheck.filter(n => n.parentSplit === splitType);

        return parentSpan / Math.pow(2, childrenWithSplit.length);
    }
}