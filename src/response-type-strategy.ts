import {Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {normalizeMediaType} from "./normalize";

export abstract class ResponseTypeStrategy {

    abstract extractType(response: Response): string;
}

@Injectable()
export class ContentTypeStrategy implements ResponseTypeStrategy {

    extractType(response: Response): string {
        let contentType = response.headers.get('content-type');
        return contentType ? normalizeMediaType(contentType) : null;
    }
}
