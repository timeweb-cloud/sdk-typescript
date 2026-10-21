/* tslint:disable */
/* eslint-disable */
/**
 * Timeweb Cloud API
 * # Введение API Timeweb Cloud позволяет вам управлять ресурсами в облаке программным способом с использованием обычных HTTP-запросов.  Множество функций, которые доступны в панели управления Timeweb Cloud, также доступны через API, что позволяет вам автоматизировать ваши собственные сценарии.  В этой документации сперва будет описан общий дизайн и принципы работы API, а после этого конкретные конечные точки. Также будут приведены примеры запросов к ним.   ## Запросы Запросы должны выполняться по протоколу `HTTPS`, чтобы гарантировать шифрование транзакций. Поддерживаются следующие методы запроса: |Метод|Применение| |--- |--- | |GET|Извлекает данные о коллекциях и отдельных ресурсах.| |POST|Для коллекций создает новый ресурс этого типа. Также используется для выполнения действий с конкретным ресурсом.| |PUT|Обновляет существующий ресурс.| |PATCH|Некоторые ресурсы поддерживают частичное обновление, то есть обновление только части атрибутов ресурса, в этом случае вместо метода PUT будет использован PATCH.| |DELETE|Удаляет ресурс.|  Методы `POST`, `PUT` и `PATCH` могут включать объект в тело запроса с типом содержимого `application/json`.  ### Параметры в запросах Некоторые коллекции поддерживают пагинацию, поиск или сортировку в запросах. В параметрах запроса требуется передать: - `limit` — обозначает количество записей, которое необходимо вернуть  - `offset` — указывает на смещение, относительно начала списка  - `search` — позволяет указать набор символов для поиска  - `sort` — можно задать правило сортировки коллекции  ## Ответы Запросы вернут один из следующих кодов состояния ответа HTTP:  |Статус|Описание| |--- |--- | |200 OK|Действие с ресурсом было выполнено успешно.| |201 Created|Ресурс был успешно создан. При этом ресурс может быть как уже готовым к использованию, так и находиться в процессе запуска.| |204 No Content|Действие с ресурсом было выполнено успешно, и ответ не содержит дополнительной информации в теле.| |400 Bad Request|Был отправлен неверный запрос, например, в нем отсутствуют обязательные параметры и т. д. Тело ответа будет содержать дополнительную информацию об ошибке.| |401 Unauthorized|Ошибка аутентификации.| |403 Forbidden|Аутентификация прошла успешно, но недостаточно прав для выполнения действия.| |404 Not Found|Запрашиваемый ресурс не найден.| |409 Conflict|Запрос конфликтует с текущим состоянием.| |423 Locked|Ресурс из запроса заблокирован от применения к нему указанного метода.| |429 Too Many Requests|Был достигнут лимит по количеству запросов в единицу времени.| |500 Internal Server Error|При выполнении запроса произошла какая-то внутренняя ошибка. Чтобы решить эту проблему, лучше всего создать тикет в панели управления.|  ### Структура успешного ответа Все конечные точки будут возвращать данные в формате `JSON`. Ответы на `GET`-запросы будут иметь на верхнем уровне следующую структуру атрибутов:  |Название поля|Тип|Описание| |--- |--- |--- | |[entity_name]|object, object[], string[], number[], boolean|Динамическое поле, которое будет меняться в зависимости от запрашиваемого ресурса и будет содержать все атрибуты, необходимые для описания этого ресурса. Например, при запросе списка баз данных будет возвращаться поле `dbs`, а при запросе конкретного облачного сервера `server`. Для некоторых конечных точек в ответе может возвращаться сразу несколько ресурсов.| |meta|object|Опционально. Объект, который содержит вспомогательную информацию о ресурсе. Чаще всего будет встречаться при запросе коллекций и содержать поле `total`, которое будет указывать на количество элементов в коллекции.| |response_id|string|Опционально. В большинстве случаев в ответе будет содержаться ID ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот ID— так мы сможем найти ответ на него намного быстрее. Также вы можете использовать этот ID, чтобы убедиться, что это новый ответ на запрос и результат не был получен из кэша.|  Пример запроса на получение списка SSH-ключей: ```     HTTP/2.0 200 OK     {       \"ssh_keys\":[           {             \"body\":\"ssh-rsa AAAAB3NzaC1sdfghjkOAsBwWhs= example@device.local\",             \"created_at\":\"2021-09-15T19:52:27Z\",             \"expired_at\":null,             \"id\":5297,             \"is_default\":false,             \"name\":\"example@device.local\",             \"used_at\":null,             \"used_by\":[]           }       ],       \"meta\":{           \"total\":1       },       \"response_id\":\"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ### Структура ответа с ошибкой |Название поля|Тип|Описание| |--- |--- |--- | |status_code|number|Короткий числовой идентификатор ошибки.| |error_code|string|Короткий текстовый идентификатор ошибки, который уточняет числовой идентификатор и удобен для программной обработки. Самый простой пример — это код `not_found` для ошибки 404.| |message|string, string[]|Опционально. В большинстве случаев в ответе будет содержаться человекочитаемое подробное описание ошибки или ошибок, которые помогут понять, что нужно исправить.| |response_id|string|Опционально. В большинстве случае в ответе будет содержаться ID ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот ID — так мы сможем найти ответ на него намного быстрее.|  Пример: ```     HTTP/2.0 403 Forbidden     {       \"status_code\": 403,       \"error_code\":  \"forbidden\",       \"message\":     \"You do not have access for the attempted action\",       \"response_id\": \"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ## Статусы ресурсов Важно учесть, что при создании большинства ресурсов внутри платформы вам будет сразу возвращен ответ от сервера со статусом `200 OK` или `201 Created` и ID созданного ресурса в теле ответа, но при этом этот ресурс может быть ещё в *состоянии запуска*.  Для того чтобы понять, в каком состоянии сейчас находится ваш ресурс, мы добавили поле `status` в ответ на получение информации о ресурсе.  Список статусов будет отличаться в зависимости от типа ресурса. Увидеть поддерживаемый список статусов вы сможете в описании каждого конкретного ресурса.     ## Ограничение скорости запросов (Rate Limiting) Чтобы обеспечить стабильность для всех пользователей, Timeweb Cloud защищает API от всплесков входящего трафика, анализируя количество запросов c каждого аккаунта к каждой конечной точке.  Если ваше приложение отправляет более 20 запросов в секунду на одну конечную точку, то для этого запроса API может вернуть код состояния HTTP `429 Too Many Requests`.   ## Аутентификация Доступ к API осуществляется с помощью JWT-токена. Токенами можно управлять внутри панели управления Timeweb Cloud в разделе *API и Terraform*.  Токен необходимо передавать в заголовке каждого запроса в формате: ```   Authorization: Bearer $TIMEWEB_CLOUD_TOKEN ```  ## Формат примеров API Примеры в этой документации описаны с помощью `curl`, HTTP-клиента командной строки. На компьютерах `Linux` и `macOS` обычно по умолчанию установлен `curl`, и он доступен для загрузки на всех популярных платформах, включая `Windows`.  Каждый пример разделен на несколько строк символом `\\`, который совместим с `bash`. Типичный пример выглядит так: ```   curl -X PATCH      -H \"Content-Type: application/json\"      -H \"Authorization: Bearer $TIMEWEB_CLOUD_TOKEN\"      -d \'{\"name\":\"Cute Corvus\",\"comment\":\"Development Server\"}\'      \"https://api.timeweb.cloud/api/v1/dedicated/1051\" ``` - Параметр `-X` задает метод запроса. Для согласованности метод будет указан во всех примерах, даже если он явно не требуется для методов `GET`. - Строки `-H` задают требуемые HTTP-заголовки. - Примеры, для которых требуется объект JSON в теле запроса, передают требуемые данные через параметр `-d`.  Чтобы использовать приведенные примеры, не подставляя каждый раз в них свой токен, вы можете добавить токен один раз в переменные окружения в вашей консоли. Например, на `Linux` это можно сделать с помощью команды:  ``` TIMEWEB_CLOUD_TOKEN=\"token\" ```  После этого токен будет автоматически подставляться в ваши запросы.  Обратите внимание, что все значения в этой документации являются примерами. Не полагайтесь на IDы операционных систем, тарифов и т.д., используемые в примерах. Используйте соответствующую конечную точку для получения значений перед созданием ресурсов.   ## Версионирование API построено согласно принципам [семантического версионирования](https://semver.org/lang/ru). Это значит, что мы гарантируем обратную совместимость всех изменений в пределах одной мажорной версии.  Мажорная версия каждой конечной точки обозначается в пути запроса, например, запрос `/api/v1/servers` указывает, что этот метод имеет версию 1.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: info@timeweb.cloud
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { AiGatewayBatchRequestCounts } from './AiGatewayBatchRequestCounts';
import {
    AiGatewayBatchRequestCountsFromJSON,
    AiGatewayBatchRequestCountsFromJSONTyped,
    AiGatewayBatchRequestCountsToJSON,
} from './AiGatewayBatchRequestCounts';

/**
 * Батч
 * @export
 * @interface AiGatewayBatch
 */
export interface AiGatewayBatch {
    [key: string]: any | any;
    /**
     * ID батча
     * @type {string}
     * @memberof AiGatewayBatch
     */
    id?: string;
    /**
     * Тип объекта
     * @type {string}
     * @memberof AiGatewayBatch
     */
    object?: AiGatewayBatchObjectEnum;
    /**
     * Эндпоинт запросов батча
     * @type {string}
     * @memberof AiGatewayBatch
     */
    endpoint?: string;
    /**
     * Модель батча. На этапе `validating` может быть `null`
     * @type {string}
     * @memberof AiGatewayBatch
     */
    model?: string | null;
    /**
     * ID входного файла
     * @type {string}
     * @memberof AiGatewayBatch
     */
    inputFileId?: string;
    /**
     * ID файла результатов — когда батч выполнен
     * @type {string}
     * @memberof AiGatewayBatch
     */
    outputFileId?: string | null;
    /**
     * ID файла с ошибками отдельных запросов, если они были
     * @type {string}
     * @memberof AiGatewayBatch
     */
    errorFileId?: string | null;
    /**
     * Срок выполнения
     * @type {string}
     * @memberof AiGatewayBatch
     */
    completionWindow?: string;
    /**
     * Статус батча. `cancelling` — отмена выполняется, может занять несколько минут
     * @type {string}
     * @memberof AiGatewayBatch
     */
    status?: AiGatewayBatchStatusEnum;
    /**
     * Время создания, Unix-время в секундах
     * @type {number}
     * @memberof AiGatewayBatch
     */
    createdAt?: number;
    /**
     * Время завершения, Unix-время в секундах
     * @type {number}
     * @memberof AiGatewayBatch
     */
    completedAt?: number | null;
    /**
     * Крайний срок выполнения, Unix-время в секундах
     * @type {number}
     * @memberof AiGatewayBatch
     */
    expiresAt?: number | null;
    /**
     * 
     * @type {AiGatewayBatchRequestCounts}
     * @memberof AiGatewayBatch
     */
    requestCounts?: AiGatewayBatchRequestCounts;
    /**
     * Метки батча из запроса
     * @type {{ [key: string]: any; }}
     * @memberof AiGatewayBatch
     */
    metadata?: { [key: string]: any; } | null;
    /**
     * Расход токенов батча
     * @type {{ [key: string]: any; }}
     * @memberof AiGatewayBatch
     */
    usage?: { [key: string]: any; } | null;
}


/**
 * @export
 */
export const AiGatewayBatchObjectEnum = {
    Batch: 'batch'
} as const;
export type AiGatewayBatchObjectEnum = typeof AiGatewayBatchObjectEnum[keyof typeof AiGatewayBatchObjectEnum];

/**
 * @export
 */
export const AiGatewayBatchStatusEnum = {
    Validating: 'validating',
    Failed: 'failed',
    InProgress: 'in_progress',
    Finalizing: 'finalizing',
    Completed: 'completed',
    Expired: 'expired',
    Cancelling: 'cancelling',
    Cancelled: 'cancelled'
} as const;
export type AiGatewayBatchStatusEnum = typeof AiGatewayBatchStatusEnum[keyof typeof AiGatewayBatchStatusEnum];


/**
 * Check if a given object implements the AiGatewayBatch interface.
 */
export function instanceOfAiGatewayBatch(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function AiGatewayBatchFromJSON(json: any): AiGatewayBatch {
    return AiGatewayBatchFromJSONTyped(json, false);
}

export function AiGatewayBatchFromJSONTyped(json: any, ignoreDiscriminator: boolean): AiGatewayBatch {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
            ...json,
        'id': !exists(json, 'id') ? undefined : json['id'],
        'object': !exists(json, 'object') ? undefined : json['object'],
        'endpoint': !exists(json, 'endpoint') ? undefined : json['endpoint'],
        'model': !exists(json, 'model') ? undefined : json['model'],
        'inputFileId': !exists(json, 'input_file_id') ? undefined : json['input_file_id'],
        'outputFileId': !exists(json, 'output_file_id') ? undefined : json['output_file_id'],
        'errorFileId': !exists(json, 'error_file_id') ? undefined : json['error_file_id'],
        'completionWindow': !exists(json, 'completion_window') ? undefined : json['completion_window'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'createdAt': !exists(json, 'created_at') ? undefined : json['created_at'],
        'completedAt': !exists(json, 'completed_at') ? undefined : json['completed_at'],
        'expiresAt': !exists(json, 'expires_at') ? undefined : json['expires_at'],
        'requestCounts': !exists(json, 'request_counts') ? undefined : AiGatewayBatchRequestCountsFromJSON(json['request_counts']),
        'metadata': !exists(json, 'metadata') ? undefined : json['metadata'],
        'usage': !exists(json, 'usage') ? undefined : json['usage'],
    };
}

export function AiGatewayBatchToJSON(value?: AiGatewayBatch | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
            ...value,
        'id': value.id,
        'object': value.object,
        'endpoint': value.endpoint,
        'model': value.model,
        'input_file_id': value.inputFileId,
        'output_file_id': value.outputFileId,
        'error_file_id': value.errorFileId,
        'completion_window': value.completionWindow,
        'status': value.status,
        'created_at': value.createdAt,
        'completed_at': value.completedAt,
        'expires_at': value.expiresAt,
        'request_counts': AiGatewayBatchRequestCountsToJSON(value.requestCounts),
        'metadata': value.metadata,
        'usage': value.usage,
    };
}

