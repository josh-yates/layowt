import { SplitType } from './splitType';

export class TreeNode {
    constructor() { }
    public content?: string;
    public directory?: string;
    public colour?: string;
    public title?: string;
    public persistTitle?: boolean = true;

    public parentSplit?: SplitType;
    public children?: TreeNode[] = [];
    public parent?: TreeNode;

    // May need to reintroduce horizontal and vertical splits by looking at whether any children have that desired split type
    public get rightDepth(): number {
        if (!this.parent) return 0;

        return this.parent.rightDepth + (this.parentSplit === SplitType.Vertical ? 1 : 0);
    }

    public get downDepth(): number {
        if (!this.parent) return 0;

        return this.parent.downDepth + (this.parentSplit === SplitType.Horizontal ? 1 : 0);
    }
}