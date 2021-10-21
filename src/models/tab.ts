import { TreeNode } from "./treeNode";

export class Tab {
    constructor() { }

    public panes: TreeNode[] = [new TreeNode(this)];
    public title?: string;
}