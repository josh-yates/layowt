import { Layout } from "../models/layout";
import type { JSONService } from "./jsonService";

export class LocalStorageService {
    public constructor(private readonly _jsonService: JSONService) { }

    public saveLayouts(layouts: Layout[]): void {
        if (!layouts || !layouts.length) return;

        const jsonToSave = this._jsonService.layoutsToJSON(layouts);

        window.localStorage.setItem('layouts', jsonToSave);
    }

    public retrieveLayouts(): Layout[] {
        let layouts = [new Layout()];

        const layoutsJSON = window.localStorage.getItem('layouts');

        if (layoutsJSON) {
            layouts = this._jsonService.jsonToLayouts(layoutsJSON);
        }

        // Legacy support - move old 'single layout' to new multi layout
        const legacyLayoutJSON = window.localStorage.getItem('layout');

        if (legacyLayoutJSON) {
            const legacyLayout = JSON.parse(legacyLayoutJSON) as Layout;

            legacyLayout.tabs.forEach(t => {
                t.layout = legacyLayout;

                this._jsonService.hydratePane(t.panes[0], null);
                t.panes = this._jsonService.collectPanes(t.panes[0]);
                t.panes.forEach(p => p.tab = t);
            });

            layouts = [legacyLayout, ...layouts];

            localStorage.removeItem('layout');
        }

        return layouts;
    }
}