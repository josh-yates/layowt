import type { Layout } from "../models/layout";
import type { JSONService } from "./jsonService";

export class ImportService {
    private readonly _fileReader: FileReader;

    constructor(
        private readonly onSuccess: (layouts: Layout[]) => void,
        private readonly onError: (message: string) => void,
        private readonly jsonService: JSONService) {
        this._fileReader = new FileReader();
        this._fileReader.onloadend = (ev) => this.onFileRead();
        this._fileReader.onerror = (ev) => this.onError('Something went wrong while reading the file.');
    }

    public import(file: File): void {
        this._fileReader.readAsText(file);
    }

    private onFileRead(): void {
        try {
            const fileContent = this._fileReader.result as string;
            const parsedLayouts = this.jsonService.jsonToLayouts(fileContent);

            this.onSuccess(parsedLayouts);
        } catch {
            this.onError('Something went wrong while parsing the file.');
        }
    }
}