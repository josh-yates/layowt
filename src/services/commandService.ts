import type { TreeNodeStore } from "./treeNodeStore";

export class CommandService {
    constructor(private readonly _treeNodeStore: TreeNodeStore) { }

    public getCommand(): string {
        return '';
    }
}