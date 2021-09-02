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
    describe('remove', () => {
        it('Removes the node from the store', () => {
            sut.split(sut.nodes[0], SplitType.Horizontal);

            const nodeToRemove = sut.nodes[1];

            sut.remove(nodeToRemove);

            expect(sut.nodes.includes(nodeToRemove)).toBe(false);
        });
        it('Does not allow the last node to be removed', () => {
            expect(() => sut.remove(sut.nodes[0])).toThrow();
        });
        it('Removes the node from its parent\'s children', () => {
            const parentNode = sut.nodes[0];
            
            sut.split(sut.nodes[0], SplitType.Horizontal);

            const childNode = sut.nodes[0];

            sut.remove(childNode);

            expect(parentNode.children).not.toContain(childNode);
        });
        it('Replaces itself with last child when it has children (without parent)', () => {
            const nodeToRemove = sut.nodes[0];

            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);

            const firstChild = nodeToRemove.children[0];
            const secondChild = nodeToRemove.children[1];
            const thirdChild = nodeToRemove.children[2];

            sut.remove(nodeToRemove);

            expect(thirdChild.children[0]).toBe(firstChild);
            expect(thirdChild.children[1]).toBe(secondChild);
            expect(thirdChild.parent).toBeFalsy();
            expect(firstChild.parent).toBe(thirdChild);
            expect(secondChild.parent).toBe(thirdChild);
        });

        it('Replaces itself with last child when it has children (with parent)', () => {
            const topLevelParent = sut.nodes[0];
            
            sut.split(topLevelParent, SplitType.Horizontal);

            const nodeToRemove = sut.nodes[1];

            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);

            const firstChild = nodeToRemove.children[0];
            const secondChild = nodeToRemove.children[1];
            const thirdChild = nodeToRemove.children[2];

            sut.remove(nodeToRemove);

            expect(thirdChild.children[0]).toBe(firstChild);
            expect(thirdChild.children[1]).toBe(secondChild);
            expect(thirdChild.parent).toBe(topLevelParent);
            expect(firstChild.parent).toBe(thirdChild);
            expect(secondChild.parent).toBe(thirdChild);
        });
    });
})