import { SplitType } from './splitType';

export class TreeNode {
    constructor() { }
    public content?: string;
    public split?: SplitType;

    public child1?: TreeNode;
    public child2?: TreeNode;
    public parent?: TreeNode;

    public get rightDepth(): number {
        if (!this.parent) return 0;

        return this.parent.rightDepth + (this.parent.split === SplitType.Vertical && this === this.parent.child2 ? 1 : 0);
    }

    public get downDepth(): number {
        if (!this.parent) return 0;

        return this.parent.downDepth + (this.parent.split === SplitType.Horizontal && this === this.parent.child2 ? 1 : 0);
    }

    public get verticalSplits(): number {
        if (!this.parent) return 0;

        return this.parent.verticalSplits + (this.parent.split === SplitType.Vertical ? 1 : 0);
    }

    public get horizontalSplits(): number {
        if (!this.parent) return 0;

        return this.parent.horizontalSplits + (this.parent.split === SplitType.Horizontal ? 1 : 0);
    }
}