import type { Pane } from "../models/pane";
import type { SplitType } from "../models/splitType";

export class PercentageLayoutService {
    public getGlobalSizePercentage(pane: Pane, split: SplitType): number {
        return this.getGlobalSizePercentageInternal(pane, null, false, split);
    }

    public getGlobalPositionPercentage(pane: Pane, split: SplitType): number {
        const parentPosition = pane.parent ? this.getGlobalPositionPercentage(pane.parent, split) : 0;
        const parentWidth = pane.parent ? this.getGlobalSizePercentageInternal(pane.parent, pane, true, split) : 0;

        return parentPosition + (pane.parentSplit === split ? parentWidth : 0);
    }

    private getGlobalSizePercentageInternal(pane: Pane, upTo: Pane, includeUpTo: boolean, split: SplitType): number {
        const parentPercentage = pane.parent ? this.getGlobalSizePercentageInternal(pane.parent, pane, includeUpTo, split) : 100;

        let returnPercentage = parentPercentage;

        if (includeUpTo) returnPercentage = 100 - returnPercentage;

        if (pane.parent && pane.parentSplit === split && !includeUpTo) {
            returnPercentage = (pane.size / 100) * parentPercentage;
        }

        const indexOfUpTo = upTo ? pane.children.indexOf(upTo) : pane.children.length;

        for (let i = 0; i < indexOfUpTo + Number(includeUpTo); i++) {
            const child = pane.children[i];

            const splitFactor = child.parentSplit === split ? ((100 - child.size) / 100) : 1;
            returnPercentage = splitFactor * returnPercentage;
        }

        return returnPercentage;
    }
}