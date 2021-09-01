import { SplitType } from '../../src/models/splitType';
import { TreeNodeStore } from '../../src/services/treeNodeStore';

let sut: TreeNodeStore;

beforeEach(() => sut = new TreeNodeStore());

describe('TreeNodeStore', () => {
    describe('constructor', () => {
        it('Creates a single node', () => expect(sut.nodes.length).toBe(1))
    });
    describe('split', () => {
        it('Creates a new node in the store', () => {
            sut.split(sut.nodes[0], SplitType.Horizontal);

            expect(sut.nodes.length).toBe(2);
        });
        it('Adds the new node to the original node\'s children', () => {
            const originalNode = sut.nodes[0];
            sut.split(originalNode, SplitType.Horizontal);

            const newNode = sut.nodes[1];

            expect(originalNode.children).toContain(newNode);
        });
        it('Adds the original node as the new node\'s parent', () => {
            const originalNode = sut.nodes[0];
            sut.split(originalNode, SplitType.Horizontal);

            const newNode = sut.nodes[1];

            expect(newNode.parent).toBe(originalNode);
        });
        it('Sets the split type on the new node', () => {
            sut.split(sut.nodes[0], SplitType.Vertical);

            const newNode = sut.nodes[1];

            expect(newNode.parentSplit).toBe(SplitType.Vertical);
        });
    });
})