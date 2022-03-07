import { Layout } from "../../src/models/layout";
import { SplitType } from "../../src/models/splitType";
import { CloningService } from "../../src/services/cloningService";
import { PaneService } from "../../src/services/paneService";
import { PercentageLayoutService } from '../../src/services/percentageLayoutService';

let sut: PercentageLayoutService;
let paneService: PaneService;
let cloningService: CloningService;

beforeEach(() => {
    sut = new PercentageLayoutService();
    cloningService = new CloningService();
    paneService = new PaneService(cloningService);
});

describe('PercentageLayoutService', () => {
    describe('getGlobalSizePercentage', () => {
        it('Returns the correct global percentage size', () => {
            const sizeTestLayout = new Layout();

            const sizeTestTab = sizeTestLayout.tabs[0];

            const paneA = sizeTestTab.panes[0];

            paneService.split(paneA, SplitType.Vertical);

            const paneB = paneA.children[0];

            paneB.sizeV = 40;

            paneService.split(paneA, SplitType.Vertical);

            const paneC = paneA.children[1];

            paneC.sizeV = 70;

            expect(sut.getGlobalSizePercentage(paneA, SplitType.Vertical)).toBeCloseTo(18);
            expect(sut.getGlobalSizePercentage(paneB, SplitType.Vertical)).toBeCloseTo(40);
            expect(sut.getGlobalSizePercentage(paneC, SplitType.Vertical)).toBeCloseTo(42);
        });
    });

    describe('getGlobalPositionPercentage', () => {
        it('Returns the correct global percentage position', () => {
            const sizeTestLayout = new Layout();

            const sizeTestTab = sizeTestLayout.tabs[0];

            const paneA = sizeTestTab.panes[0];

            paneService.split(paneA, SplitType.Vertical);

            const paneB = paneA.children[0];

            paneB.sizeV = 40;

            paneService.split(paneA, SplitType.Vertical);

            const paneC = paneA.children[1];

            paneC.sizeV = 70;

            expect(sut.getGlobalPositionPercentage(paneA, SplitType.Vertical)).toBeCloseTo(0);
            expect(sut.getGlobalPositionPercentage(paneB, SplitType.Vertical)).toBeCloseTo(60);
            expect(sut.getGlobalPositionPercentage(paneC, SplitType.Vertical)).toBeCloseTo(18);
        });
    })
})