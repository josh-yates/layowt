import type { PaneService } from "./paneService";

export class CommandService {
    constructor(private readonly _paneService: PaneService) { }

    public getCommandText(update: any): string{
        return this._paneService.panes.map(p => p.content).join(',');
    }
}