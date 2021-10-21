import type { SplitType } from "../models/splitType";
import type { Tab } from "../models/tab";
import { TreeNode } from "../models/treeNode";

export class TreeNodeService {
    public split(node: TreeNode, split: SplitType): void {
        const newChild = new TreeNode(node.tab);
        newChild.parentSplit = split;
        newChild.parent = node;
        node.children.push(newChild);

        node.tab.panes.push(newChild);
    }

    public remove(node: TreeNode): void {
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
        }

        if (indexInParent >= 0) {
            node.parent.children.splice(indexInParent, 1);
        }

        node.tab.panes.splice(node.tab.panes.indexOf(node), 1);
    }

    public getStepsTo(node: TreeNode, split: SplitType): number {
        if (!node.parent) return 0;

        return this.getStepsTo(node.parent, split) +
            (node.parent.children.filter(n => n.parentSplit === split || n === node).indexOf(node)) +
            (node.parentSplit === split ? 1 : 0);
    }

    public getPriorSiblings(node: TreeNode, split: SplitType): TreeNode[] {
        return node?.parent?.children?.slice(0, node?.parent?.children?.indexOf(node)).filter(n => n.parentSplit === split) ?? [];
    }

    public getRootNode(tab: Tab): TreeNode {
        return tab.panes.filter(n => !n.parent)[0];
    }
}