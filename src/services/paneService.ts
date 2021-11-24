import type { SplitType } from "../models/splitType";
import type { Tab } from "../models/tab";
import { Pane } from "../models/pane";

export class PaneService {
    public split(node: Pane, split: SplitType): void {
        const newChild = new Pane(node.tab);
        newChild.parentSplit = split;
        newChild.parent = node;
        node.children.push(newChild);

        node.tab.panes.push(newChild);
    }

    public remove(node: Pane): void {
        if (node.tab.panes.length === 1 && node.tab.panes[0] === node) throw new Error('Cannot remove final node in store');

        const lastChild = node.children[node.children.length - 1];
        const indexInParent = node.parent ? node.parent.children.indexOf(node) : -1;

        if (lastChild) {
            if (indexInParent >= 0) {
                node.parent.children[indexInParent] = lastChild;
            }

            lastChild.parent = node.parent;
            lastChild.parentSplit = node.parentSplit;

            lastChild.children = [...node.children.filter(c => c !== lastChild), ...lastChild.children];
            lastChild.children.forEach(c => c.parent = lastChild);
        } else if (indexInParent >= 0) {
            node.parent.children.splice(indexInParent, 1);
        }

        node.tab.panes.splice(node.tab.panes.indexOf(node), 1);
    }

    public getStepsTo(node: Pane, split: SplitType): number {
        if (!node.parent) return 0;

        return this.getStepsTo(node.parent, split) +
            (node.parent.children.filter(n => n.parentSplit === split || n === node).indexOf(node)) +
            (node.parentSplit === split ? 1 : 0);
    }

    public getPriorSiblings(node: Pane, split: SplitType): Pane[] {
        return node?.parent?.children?.slice(0, node?.parent?.children?.indexOf(node)).filter(n => n.parentSplit === split) ?? [];
    }

    public getRootNode(tab: Tab): Pane {
        return tab.panes.filter(n => !n.parent)[0];
    }
}