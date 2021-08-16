import { SplitType } from "../models/splitType";
import { TreeNode } from "../models/treeNode";

export class TreeNodeService {
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

    public getIndex(maxSize: number, node: TreeNode, split: SplitType): number {
        let summation = 0;
        let steps = 0;

        switch (split) {
            case SplitType.Horizontal:
                steps = node.downDepth;
                break;
            case SplitType.Vertical:
                steps = node.rightDepth;
                break;
            default:
                break;
        }

        for (let i = 1; i <= steps; i++) {
            summation += Math.pow(2, i);
        }

        return 1 + ((maxSize / Math.pow(2, steps)) * summation);
    }
}