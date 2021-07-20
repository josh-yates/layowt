import { SplitType } from "../models/splitType";
import { TreeNode } from "../models/treeNode";

export namespace TreeNodeService {
    export function split(node: TreeNode, split: SplitType): [TreeNode, TreeNode] {
        const valid = (node.split === null || node.split === undefined) &&
            !node.child1 &&
            !node.child2;

        if (!valid) throw 'Invalid node';

        const child1 = new TreeNode();
        const child2 = new TreeNode();

        child1.parent = node;
        child1.content = node.content;
        child2.parent = node;

        node.content = undefined;
        node.split = split;
        node.child1 = child1;
        node.child2 = child2;

        return [child1, child2];
    }

    export function remove(node: TreeNode): TreeNode {
        const valid = (node.split === null || node.split === undefined) &&
            !node.child1 &&
            !node.child2
        node.parent &&
            ((node === node.parent.child1 && node.parent.child2) ||
                (node === node.parent.child2 && node.parent.child1));

        if (!valid || !node.parent) throw 'Invalid node';

        if (node === node.parent.child1) {
            node.parent.split = undefined;
            node.parent.child1 = undefined;
            node.parent.content = node.parent.child2?.content;
            node.parent.child2 = undefined;
        } else if (node === node.parent.child2) {
            node.parent.split = undefined;
            node.parent.child2 = undefined;
            node.parent.content = node.parent.child1?.content;
            node.parent.child1 = undefined;
        }

        return node.parent;
    }

    export function getIndex(maxSize: number, node: TreeNode, split: SplitType): number {
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

        return (maxSize / Math.pow(2, steps)) * summation;
    }
}