enum SplitType {
    Horizontal,
    Vertical
}

class TreeNode {
    constructor() {}
    public content?: string;
    public split?: SplitType;

    public child1?: TreeNode;
    public child2?: TreeNode;
    public parent?: TreeNode;

    public get rightDepth(): number {
        if (!this.parent) return 0;

        return this.parent.rightDepth + (this.parent.split === SplitType.Vertical && this === this.parent.child2 ?  1 : 0);
    }

    public get downDepth(): number {
        if (!this.parent) return 0;

        return this.parent.downDepth + (this.parent.split === SplitType.Horizontal && this === this.parent.child2 ?  1 : 0);
    }
}

function split(node: TreeNode, split: SplitType): [TreeNode, TreeNode] {
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

function remove(node: TreeNode): TreeNode {
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

const endNodes: TreeNode[] = [];
const root = new TreeNode();

const rootChildren = split(root, SplitType.Horizontal);

endNodes.push(rootChildren[0]);

const bottomChildChildren = split(rootChildren[1], SplitType.Vertical);

endNodes.push(...bottomChildChildren);

endNodes.forEach(n => console.log(`${n.rightDepth} right, ${n.downDepth} down`));

console.log(`Max right: ${endNodes.sort((a,b) => b.rightDepth - a.rightDepth)[0].rightDepth}`);
console.log(`Max down: ${endNodes.sort((a,b) => b.downDepth - a.downDepth)[0].downDepth}`);