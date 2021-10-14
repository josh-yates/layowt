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

        const hasDirectory = node.directory !== null &&
            node.directory !== undefined &&
            node.directory.trim().length;

        const directoryParam = hasDirectory ? `-d "${node.directory}" ` : '';

        const hasTitle = node.title !== null &&
            node.title !== undefined &&
            node.title.trim().length;

        const titleParam = hasTitle ? `--title "${node.title}" ` : '';

        const persistTitleParam = hasTitle ?
            (!!node.persistTitle ? '--suppressApplicationTitle ' : '--useApplicationTitle') :
            '';

        const hasTabColour = node.tabColour !== null &&
            node.tabColour !== undefined &&
            node.tabColour.trim().length;

        const tabColourParam = hasTabColour ? `--tabColor ${node.tabColour} ` : '';

        const hasColourScheme = node.colourScheme !== null &&
            node.colourScheme !== undefined &&
            node.colourScheme.trim().length;

        const colourSchemeParam = hasColourScheme ? `--colorScheme "${node.colourScheme}" ` : '';

        const hasContent = node.content !== null &&
            node.content !== undefined &&
            node.content.trim().length;

        const mainCommand = hasContent ? `powershell -NoExit "${node.content}" ` : '';

        const childrenCommands = node.children.map(c => this.printNode(c));

        return splitCommand
            + directoryParam
            + titleParam
            + persistTitleParam
            + colourSchemeParam
            + tabColourParam
            + mainCommand
            + (childrenCommands.length ? '`; ' + childrenCommands.join('`; ') : '') + returnCommand;
    }
}