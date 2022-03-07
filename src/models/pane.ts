import { SplitType } from './splitType';
import type { Tab } from './tab';

export class Pane {
    constructor(public tab: Tab) { }

    private _size: number = 50;

    public content?: string;
    public directory?: string;
    public tabColour?: string;
    public colourScheme?: string;
    public title?: string;
    public persistTitle?: boolean = true;
    public cloneOnSplit?: boolean = false;

    public get size(): number {
        return this._size;
    }
    public set size(value: number) {
        this.validateSize(value);

        this._size = value;
    }

    public parentSplit?: SplitType;
    public children?: Pane[] = [];
    public parent?: Pane;

    // May need to reintroduce horizontal and vertical splits by looking at whether any children have that desired split type
    public get rightDepth(): number {
        if (!this.parent) return 0;

        return this.parent.rightDepth + (this.parentSplit === SplitType.Vertical ? 1 : 0);
    }

    public get downDepth(): number {
        if (!this.parent) return 0;

        return this.parent.downDepth + (this.parentSplit === SplitType.Horizontal ? 1 : 0);
    }

    private validateSize(value: number): void {
        if (value < 5) throw new Error('Size cannot be less than 5');
        if (value > 95) throw new Error('Size cannot be more than 95');
        if (value % 5) throw new Error('Size must be multiple of 5');
    }
}