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
        it('sets the size to 50', () => {
            expect(sut.size).toBe(50);
        });
    });

    // describe('size', () => {
    //     it('can be used to set and retrieve the sizes', () => {
    //         sut.size = 65;

    //         expect(sut.size).toBe(65);
    //     });
    //     it('throws for invalid sizes', () => {
    //         expect(() => sut.size = 0).toThrow();
    //         expect(() => sut.size = 100).toThrow();
    //     });
    // })
});