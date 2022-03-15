import { SplitType } from "../models/splitType";
import type { Tab } from "../models/tab";
import type { Pane } from "../models/pane";
import type { CommandService } from "./commandService";
import type { GridService } from "./gridService";
import type { Layout } from "../models/layout";
import type { PercentageLayoutService } from "./percentageLayoutService";

export class UIService {
    constructor(
        private readonly _gridService: GridService,
        private readonly _percentageLayoutService: PercentageLayoutService,
        private readonly _commandService: CommandService) { }

    public getContainerGridStyles(tab: Tab, update: any): string {
        return `grid-template-columns: repeat(${this._gridService.getGridColumns(tab)}, 1fr); ` +
            `grid-template-rows: repeat(${this._gridService.getGridRows(tab)}, 1fr);`;
    }

    public getPaneGridStyles(pane: Pane, update: any): string {
        return `grid-column: ${this._gridService.getIndex(pane, SplitType.Vertical) + 1} / span ${this._gridService.getSpan(pane, SplitType.Vertical)}; ` +
            `grid-row: ${this._gridService.getIndex(pane, SplitType.Horizontal) + 1} / span ${this._gridService.getSpan(pane, SplitType.Horizontal)};`;
    }

    public getPanePositionStyles(pane: Pane, update: any): string {
        return 'position: absolute; ' +
            `top: ${this._percentageLayoutService.getGlobalPositionPercentage(pane, SplitType.Horizontal)}%; ` +
            `left: ${this._percentageLayoutService.getGlobalPositionPercentage(pane, SplitType.Vertical)}%; ` +
            `height: ${this._percentageLayoutService.getGlobalSizePercentage(pane, SplitType.Horizontal)}%; ` +
            `width: ${this._percentageLayoutService.getGlobalSizePercentage(pane, SplitType.Vertical)}%;`;
    }

    public getPaneHasRightBorder(pane: Pane, update: any): boolean {
        return Math.abs(100 - (this._percentageLayoutService.getGlobalPositionPercentage(pane, SplitType.Vertical) + this._percentageLayoutService.getGlobalSizePercentage(pane, SplitType.Vertical))) > 1;
    }

    public getPaneHasBottomBorder(pane: Pane, update: any): boolean {
        return Math.abs(100 - (this._percentageLayoutService.getGlobalPositionPercentage(pane, SplitType.Horizontal) + this._percentageLayoutService.getGlobalSizePercentage(pane, SplitType.Horizontal))) > 1;
    }

    public getPaneEffectiveWidth(pane: Pane, update: any): number {
        return this._percentageLayoutService.getGlobalSizePercentage(pane, SplitType.Vertical);
    }

    public getPaneEffectiveHeight(pane: Pane, update: any): number {
        return this._percentageLayoutService.getGlobalSizePercentage(pane, SplitType.Horizontal);
    }

    public getCommandText(layout: Layout, update: any): string {
        return this._commandService.getCommand(layout);
    }
}