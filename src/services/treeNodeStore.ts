import type { SplitType } from "../models/splitType";
import { TreeNode } from "../models/treeNode";

export class TreeNodeStore {
    public readonly nodes: TreeNode[] = [new TreeNode()]

    public split(node: TreeNode, split: SplitType): void {
        const newChild = new TreeNode();
        newChild.parentSplit = split;
        newChild.parent = node;
        node.children.push(newChild);

        this.nodes.push(newChild);
    }

    public remove(node: TreeNode): void {
        if (this.nodes.length === 1 && this.nodes[0] === node) throw new Error('Cannot remove final node in store');

        const lastChild = node.children[node.children.length - 1];
        const indexInParent = node.parent ? node.parent.children.indexOf(node) : -1;

        if (lastChild) {
            if (indexInParent >= 0) {
                node.parent.children[indexInParent] = lastChild;
            }

            lastChild.parent = node.parent;

            lastChild.children = [...node.children.filter(c => c !== lastChild), ...lastChild.children];
            lastChild.children.forEach(c => c.parent = lastChild);
        }

        if (indexInParent >= 0) {
            node.parent.children.splice(indexInParent, 1);
        }

        this.nodes.splice(this.nodes.indexOf(node), 1);
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

    public getRootNode(): TreeNode {
        return this.nodes.filter(n => !n.parent)[0];
    }
}