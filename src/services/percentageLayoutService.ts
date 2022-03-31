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

    public adjustSize(pane: Pane, split: SplitType, increase: boolean): void {
        if (increase && this.getGlobalSizePercentage(pane, split) >= 99) return;
        if (!increase && this.getGlobalSizePercentage(pane, split) <= 1) return;

        /*
        Effective search order:
        Any direct children with the split type?
            Yes: do opposite of 'increase' to their size by 1
            No: Continue
        Does the pane have the split type?
            Yes: do 'increase' to its size by 1
            No: Continue
        Working up the parent chain, any parent with split type?
            Yes: do 'increase' to its size by 1
            No: exit, there's nothing to do
        */

        const childWithSplitType = pane.children.filter(c => c.parentSplit === split)[0];

        if (childWithSplitType) {
            childWithSplitType.size += (increase ? -1 : 1);
            return;
        }

        if (pane.parentSplit === split) {
            pane.size += (increase ? 1 : -1);
            return;
        }

        let currentSearchParent = pane.parent;

        while (currentSearchParent) {
            if (currentSearchParent.parentSplit === split) {
                currentSearchParent.size += (increase ? 1 : -1);
                return;
            }

            currentSearchParent = currentSearchParent.parent;
        }
    }

    private getGlobalSizePercentageInternal(pane: Pane, upTo: Pane, includeUpTo: boolean, split: SplitType): number {
        const parentPercentage = pane.parent ? this.getGlobalSizePercentageInternal(pane.parent, pane, includeUpTo, split) : 100;

        let returnPercentage = parentPercentage;

        if (pane.parent && pane.parentSplit === split && !includeUpTo) {
            returnPercentage = (pane.size / 100) * parentPercentage;
        }

        if (pane.parent && pane.parentSplit === split && includeUpTo) {
            returnPercentage = pane.size;
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