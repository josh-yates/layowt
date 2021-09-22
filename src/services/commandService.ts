import { SplitType } from "../models/splitType";
import type { TreeNode } from "../models/treeNode";
import type { TreeNodeStore } from "./treeNodeStore";

export class CommandService {
    constructor(private readonly _treeNodeStore: TreeNodeStore) { }

    public getCommand(): string {
        return 'wt ' + this.printNode(this._treeNodeStore.getRootNode()).trim();
    }

    private printNode(node: TreeNode): string {
        let splitCommand = '';
        let returnCommand = '';

        switch (node.parentSplit) {
            case SplitType.Horizontal:
                splitCommand = 'sp -H ';
                returnCommand = '`; mf up ';
                break;
            case SplitType.Vertical:
                splitCommand = 'sp -V ';
                returnCommand = '`; mf left ';
                break;
            default:
                break;
        }

        const hasContent = node.content !== null &&
            node.content !== undefined &&
            node.content.trim().length;

        const mainCommand = hasContent ? `powershell -NoExit "${node.content}" ` : '';

        const childrenCommands = node.children.map(c => this.printNode(c));

        return splitCommand + mainCommand + (childrenCommands.length ? '`; ' + childrenCommands.join('`; ') : '') + returnCommand;
    }
}