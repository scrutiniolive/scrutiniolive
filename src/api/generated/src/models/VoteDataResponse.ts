/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Dati di voto per un singolo quesito
 * @export
 * @interface VoteDataResponse
 */
export interface VoteDataResponse {
    /**
     * ID del quesito
     * @type {number}
     * @memberof VoteDataResponse
     */
    id?: number;
    /**
     * Testo del quesito
     * @type {string}
     * @memberof VoteDataResponse
     */
    quesito?: string;
    /**
     * Numero di voti SI
     * @type {number}
     * @memberof VoteDataResponse
     */
    si?: number;
    /**
     * Numero di voti NO
     * @type {number}
     * @memberof VoteDataResponse
     */
    no?: number;
    /**
     * Numero di voti BIANCHI
     * @type {number}
     * @memberof VoteDataResponse
     */
    blank?: number;
}

/**
 * Check if a given object implements the VoteDataResponse interface.
 */
export function instanceOfVoteDataResponse(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function VoteDataResponseFromJSON(json: any): VoteDataResponse {
    return VoteDataResponseFromJSONTyped(json, false);
}

export function VoteDataResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): VoteDataResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'quesito': !exists(json, 'quesito') ? undefined : json['quesito'],
        'si': !exists(json, 'si') ? undefined : json['si'],
        'no': !exists(json, 'no') ? undefined : json['no'],
        'blank': !exists(json, 'blank') ? undefined : json['blank'],
    };
}

export function VoteDataResponseToJSON(value?: VoteDataResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'quesito': value.quesito,
        'si': value.si,
        'no': value.no,
        'blank': value.blank,
    };
}

