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
        const lastChild = node.children[node.children.length - 1];
        const indexInParent = node.parent ? node.parent.children.indexOf(node) : -1;

        if (lastChild) {
            if (indexInParent >= 0) {
                node.parent.children[indexInParent] = lastChild;
            }

            lastChild.children = [...node.children.filter(c => c !== lastChild), ...lastChild.children];
        }

        if (indexInParent >= 0) {
            node.parent.children.splice(indexInParent, 1);
        }
    }
}