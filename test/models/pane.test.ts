import { Layout } from "../../src/models/layout";
import { Pane } from "../../src/models/pane";
import { Tab } from "../../src/models/tab";

let sut: Pane;
let tab: Tab;
let layout: Layout;

beforeEach(() => {
    layout = new Layout();
    tab = new Tab(layout);
    sut = new Pane(tab);
});

describe('Pane', () => {
    describe('constructor', () => {
        it('sets the sizes to 50', () => {
            expect(sut.sizeV).toBe(50);
            expect(sut.sizeH).toBe(50);
        });
    });

    describe('sizeV/H', () => {
        it('can be used to set and retrieve the sizes', () => {
            sut.sizeV = 65;
            sut.sizeH = 5;

            expect(sut.sizeV).toBe(65);
            expect(sut.sizeH).toBe(5)
        });
        it('throws for invalid sizes', () => {
            expect(() => sut.sizeV = 0).toThrow();
            expect(() => sut.sizeV = 100).toThrow();
            expect(() => sut.sizeV = 63).toThrow();

            expect(() => sut.sizeH = 0).toThrow();
            expect(() => sut.sizeH = 100).toThrow();
            expect(() => sut.sizeH = 63).toThrow();
        });
    })
});