import { SplitType } from "../models/splitType";
import type { Pane } from "../models/pane";
import type { PaneService } from "./paneService";
import type { Layout } from "../models/layout";

export class CommandService {
    constructor(
        private readonly _paneService: PaneService) { }

    public getCommand(layout: Layout): string {
        return 'wt ' +
            layout.tabs.map(tab => this.printNode(this._paneService.getRootNode(tab)).trim()).join(' `; new-tab ') +
            (layout.tabs.length > 1 ? ' `; ft -t 0' : '');
    }

    private printNode(node: Pane): string {
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

        const hasSize = node.parent !== null &&
            node.size !== undefined &&
            node.size !== null &&
            node.size !== 50;

        const sizeParam = hasSize ? `-s ${node.size / 100} ` : '';

        const hasContent = node.content !== null &&
            node.content !== undefined &&
            node.content.trim().length;

        const mainCommand = hasContent ? `powershell -NoExit "${node.content}" ` : '';

        const childrenCommands = node.children.map(c => this.printNode(c));

        return splitCommand
            + sizeParam
            + directoryParam
            + titleParam
            + persistTitleParam
            + colourSchemeParam
            + tabColourParam
            + mainCommand
            + (childrenCommands.length ? '`; ' + childrenCommands.join('`; ') : '') + returnCommand;
    }
}