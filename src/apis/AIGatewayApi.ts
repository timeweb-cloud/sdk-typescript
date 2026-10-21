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


import * as runtime from '../runtime';
import type {
  CreateAiKey,
  CreateAiKey201Response,
  CreateAiKeyLimit,
  CreateAiKeyLimit201Response,
  GetAccountStatus403Response,
  GetAiKeyCallsStatistic200Response,
  GetAiKeyLimits200Response,
  GetAiKeyModelsStatistic200Response,
  GetAiKeyTokenUsageStatistic200Response,
  GetAiKeys200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  SyncAiKeyLimits,
  UpdateAiKey,
  UpdateAiKey200Response,
  UpdateAiKeyLimit,
  UpdateDatabaseInstance409Response,
} from '../models/index';
import {
    CreateAiKeyFromJSON,
    CreateAiKeyToJSON,
    CreateAiKey201ResponseFromJSON,
    CreateAiKey201ResponseToJSON,
    CreateAiKeyLimitFromJSON,
    CreateAiKeyLimitToJSON,
    CreateAiKeyLimit201ResponseFromJSON,
    CreateAiKeyLimit201ResponseToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAiKeyCallsStatistic200ResponseFromJSON,
    GetAiKeyCallsStatistic200ResponseToJSON,
    GetAiKeyLimits200ResponseFromJSON,
    GetAiKeyLimits200ResponseToJSON,
    GetAiKeyModelsStatistic200ResponseFromJSON,
    GetAiKeyModelsStatistic200ResponseToJSON,
    GetAiKeyTokenUsageStatistic200ResponseFromJSON,
    GetAiKeyTokenUsageStatistic200ResponseToJSON,
    GetAiKeys200ResponseFromJSON,
    GetAiKeys200ResponseToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    GetImage404ResponseFromJSON,
    GetImage404ResponseToJSON,
    SyncAiKeyLimitsFromJSON,
    SyncAiKeyLimitsToJSON,
    UpdateAiKeyFromJSON,
    UpdateAiKeyToJSON,
    UpdateAiKey200ResponseFromJSON,
    UpdateAiKey200ResponseToJSON,
    UpdateAiKeyLimitFromJSON,
    UpdateAiKeyLimitToJSON,
    UpdateDatabaseInstance409ResponseFromJSON,
    UpdateDatabaseInstance409ResponseToJSON,
} from '../models/index';

export interface CreateAiKeyRequest {
    createAiKey: CreateAiKey;
}

export interface CreateAiKeyLimitRequest {
    keyId: string;
    createAiKeyLimit: CreateAiKeyLimit;
}

export interface DeleteAiKeyRequest {
    keyId: string;
}

export interface DeleteAiKeyLimitRequest {
    keyId: string;
    limitId: string;
}

export interface GetAiKeyCallsStatisticRequest {
    entityId: string;
    entityType: GetAiKeyCallsStatisticEntityTypeEnum;
    modelName?: string;
    startTime?: Date;
    endTime?: Date;
    interval?: number;
}

export interface GetAiKeyLimitRequest {
    keyId: string;
    limitId: string;
}

export interface GetAiKeyLimitsRequest {
    keyId: string;
    entityType?: string;
    limitType?: GetAiKeyLimitsLimitTypeEnum;
}

export interface GetAiKeyModelsStatisticRequest {
    entityId: string;
    entityType: GetAiKeyModelsStatisticEntityTypeEnum;
    modelName?: string;
    startTime?: Date;
    endTime?: Date;
}

export interface GetAiKeyTokenUsageStatisticRequest {
    entityId: string;
    entityType: GetAiKeyTokenUsageStatisticEntityTypeEnum;
    modelName?: string;
    startTime?: Date;
    endTime?: Date;
    interval?: number;
}

export interface RegenerateAiKeyRequest {
    keyId: string;
}

export interface SyncAiKeyLimitsRequest {
    keyId: string;
    syncAiKeyLimits: SyncAiKeyLimits;
}

export interface UpdateAiKeyRequest {
    keyId: string;
    updateAiKey: UpdateAiKey;
}

export interface UpdateAiKeyLimitRequest {
    keyId: string;
    limitId: string;
    updateAiKeyLimit: UpdateAiKeyLimit;
}

/**
 * 
 */
export class AIGatewayApi extends runtime.BaseAPI {

    /**
     * Чтобы создать ключ AI Gateway, отправьте POST-запрос на `/api/v1/cloud-ai/ai-keys`.  Значение ключа (`sk-...`) возвращается в поле `key` только в ответе на этот запрос — сохраните его. Если значение утеряно, перевыпустите ключ.  Если список `fallback_models` некорректен, вернётся 400 с `error_code` `fallback_chain_invalid` (больше двух моделей или повторы, правило — в `details.reason`) или `fallback_model_not_found` (модели нет среди действующих текстовых моделей, список — в `details.model_names`).
     * Создание ключа AI Gateway
     */
    async createAiKeyRaw(requestParameters: CreateAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiKey201Response>> {
        if (requestParameters.createAiKey === null || requestParameters.createAiKey === undefined) {
            throw new runtime.RequiredError('createAiKey','Required parameter requestParameters.createAiKey was null or undefined when calling createAiKey.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAiKeyToJSON(requestParameters.createAiKey),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiKey201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать ключ AI Gateway, отправьте POST-запрос на `/api/v1/cloud-ai/ai-keys`.  Значение ключа (`sk-...`) возвращается в поле `key` только в ответе на этот запрос — сохраните его. Если значение утеряно, перевыпустите ключ.  Если список `fallback_models` некорректен, вернётся 400 с `error_code` `fallback_chain_invalid` (больше двух моделей или повторы, правило — в `details.reason`) или `fallback_model_not_found` (модели нет среди действующих текстовых моделей, список — в `details.model_names`).
     * Создание ключа AI Gateway
     */
    async createAiKey(requestParameters: CreateAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiKey201Response> {
        const response = await this.createAiKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы ограничить расход ключа AI Gateway, отправьте POST-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits`.  Лимит задаётся в токенах (`limit`) или в деньгах (`money_limit`, приоритетнее) на период `limit_type` — для всех моделей или для одной (`model_id`). Когда лимит исчерпан, запросы ключа к AI Gateway API завершаются ошибкой 422 до начала следующего периода. Если от лимита осталась часть, максимальный размер ответа текстового запроса уменьшается так, чтобы уложиться в остаток.  На один период и одну модель (или на все модели) можно завести только один лимит — повторный вернёт 409 с `error_code` `entity_keys_limit_already_exists`. Если не передан ни `limit`, ни `money_limit`, вернётся 400 с `error_code` `entity_keys_limit_value_required`.
     * Создание лимита ключа AI Gateway
     */
    async createAiKeyLimitRaw(requestParameters: CreateAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiKeyLimit201Response>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling createAiKeyLimit.');
        }

        if (requestParameters.createAiKeyLimit === null || requestParameters.createAiKeyLimit === undefined) {
            throw new runtime.RequiredError('createAiKeyLimit','Required parameter requestParameters.createAiKeyLimit was null or undefined when calling createAiKeyLimit.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAiKeyLimitToJSON(requestParameters.createAiKeyLimit),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiKeyLimit201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы ограничить расход ключа AI Gateway, отправьте POST-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits`.  Лимит задаётся в токенах (`limit`) или в деньгах (`money_limit`, приоритетнее) на период `limit_type` — для всех моделей или для одной (`model_id`). Когда лимит исчерпан, запросы ключа к AI Gateway API завершаются ошибкой 422 до начала следующего периода. Если от лимита осталась часть, максимальный размер ответа текстового запроса уменьшается так, чтобы уложиться в остаток.  На один период и одну модель (или на все модели) можно завести только один лимит — повторный вернёт 409 с `error_code` `entity_keys_limit_already_exists`. Если не передан ни `limit`, ни `money_limit`, вернётся 400 с `error_code` `entity_keys_limit_value_required`.
     * Создание лимита ключа AI Gateway
     */
    async createAiKeyLimit(requestParameters: CreateAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiKeyLimit201Response> {
        const response = await this.createAiKeyLimitRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить ключ AI Gateway, отправьте DELETE-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}`.  После удаления запросы с этим ключом перестают приниматься. Ключи, которыми управляет платформа (`is_readonly: true`), удалить нельзя: вернётся 403 с `error_code` `ai_key_is_readonly`.
     * Удаление ключа AI Gateway
     */
    async deleteAiKeyRaw(requestParameters: DeleteAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling deleteAiKey.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить ключ AI Gateway, отправьте DELETE-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}`.  После удаления запросы с этим ключом перестают приниматься. Ключи, которыми управляет платформа (`is_readonly: true`), удалить нельзя: вернётся 403 с `error_code` `ai_key_is_readonly`.
     * Удаление ключа AI Gateway
     */
    async deleteAiKey(requestParameters: DeleteAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAiKeyRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить лимит ключа AI Gateway, отправьте DELETE-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.  Если лимит относится к другому ключу, вернётся 403.
     * Удаление лимита ключа AI Gateway
     */
    async deleteAiKeyLimitRaw(requestParameters: DeleteAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling deleteAiKeyLimit.');
        }

        if (requestParameters.limitId === null || requestParameters.limitId === undefined) {
            throw new runtime.RequiredError('limitId','Required parameter requestParameters.limitId was null or undefined when calling deleteAiKeyLimit.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))).replace(`{${"limit_id"}}`, encodeURIComponent(String(requestParameters.limitId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить лимит ключа AI Gateway, отправьте DELETE-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.  Если лимит относится к другому ключу, вернётся 403.
     * Удаление лимита ключа AI Gateway
     */
    async deleteAiKeyLimit(requestParameters: DeleteAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAiKeyLimitRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить количество запросов ключа по интервалам времени, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/statistic/calls`.  Ключ задаётся параметрами `entity_id` (ID ключа) и `entity_type` (тип ключа). Если ключ не найден, вернётся 404. Период по умолчанию — последние 24 часа. Точки возвращаются для каждого интервала периода, включая интервалы без запросов.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_calls_statistics` и `meta`.
     * Получение статистики запросов ключа AI Gateway
     */
    async getAiKeyCallsStatisticRaw(requestParameters: GetAiKeyCallsStatisticRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiKeyCallsStatistic200Response>> {
        if (requestParameters.entityId === null || requestParameters.entityId === undefined) {
            throw new runtime.RequiredError('entityId','Required parameter requestParameters.entityId was null or undefined when calling getAiKeyCallsStatistic.');
        }

        if (requestParameters.entityType === null || requestParameters.entityType === undefined) {
            throw new runtime.RequiredError('entityType','Required parameter requestParameters.entityType was null or undefined when calling getAiKeyCallsStatistic.');
        }

        const queryParameters: any = {};

        if (requestParameters.entityId !== undefined) {
            queryParameters['entity_id'] = requestParameters.entityId;
        }

        if (requestParameters.entityType !== undefined) {
            queryParameters['entity_type'] = requestParameters.entityType;
        }

        if (requestParameters.modelName !== undefined) {
            queryParameters['model_name'] = requestParameters.modelName;
        }

        if (requestParameters.startTime !== undefined) {
            queryParameters['start_time'] = (requestParameters.startTime as any).toISOString();
        }

        if (requestParameters.endTime !== undefined) {
            queryParameters['end_time'] = (requestParameters.endTime as any).toISOString();
        }

        if (requestParameters.interval !== undefined) {
            queryParameters['interval'] = requestParameters.interval;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/statistic/calls`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiKeyCallsStatistic200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить количество запросов ключа по интервалам времени, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/statistic/calls`.  Ключ задаётся параметрами `entity_id` (ID ключа) и `entity_type` (тип ключа). Если ключ не найден, вернётся 404. Период по умолчанию — последние 24 часа. Точки возвращаются для каждого интервала периода, включая интервалы без запросов.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_calls_statistics` и `meta`.
     * Получение статистики запросов ключа AI Gateway
     */
    async getAiKeyCallsStatistic(requestParameters: GetAiKeyCallsStatisticRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiKeyCallsStatistic200Response> {
        const response = await this.getAiKeyCallsStatisticRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить лимит ключа AI Gateway, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.  Если лимит относится к другому ключу, вернётся 403 с `error_code` `entity_keys_limit_forbidden`.
     * Получение лимита ключа AI Gateway
     */
    async getAiKeyLimitRaw(requestParameters: GetAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiKeyLimit201Response>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling getAiKeyLimit.');
        }

        if (requestParameters.limitId === null || requestParameters.limitId === undefined) {
            throw new runtime.RequiredError('limitId','Required parameter requestParameters.limitId was null or undefined when calling getAiKeyLimit.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))).replace(`{${"limit_id"}}`, encodeURIComponent(String(requestParameters.limitId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiKeyLimit201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить лимит ключа AI Gateway, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.  Если лимит относится к другому ключу, вернётся 403 с `error_code` `entity_keys_limit_forbidden`.
     * Получение лимита ключа AI Gateway
     */
    async getAiKeyLimit(requestParameters: GetAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiKeyLimit201Response> {
        const response = await this.getAiKeyLimitRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить лимиты расхода ключа AI Gateway, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits`.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_entity_limits` и `meta`.
     * Получение списка лимитов ключа AI Gateway
     */
    async getAiKeyLimitsRaw(requestParameters: GetAiKeyLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiKeyLimits200Response>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling getAiKeyLimits.');
        }

        const queryParameters: any = {};

        if (requestParameters.entityType !== undefined) {
            queryParameters['entity_type'] = requestParameters.entityType;
        }

        if (requestParameters.limitType !== undefined) {
            queryParameters['limit_type'] = requestParameters.limitType;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiKeyLimits200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить лимиты расхода ключа AI Gateway, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits`.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_entity_limits` и `meta`.
     * Получение списка лимитов ключа AI Gateway
     */
    async getAiKeyLimits(requestParameters: GetAiKeyLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiKeyLimits200Response> {
        const response = await this.getAiKeyLimitsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список моделей, к которым обращался ключ за период, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/statistic/models`.  Ключ задаётся параметрами `entity_id` (ID ключа) и `entity_type` (тип ключа). Если ключ не найден, вернётся 404. Период по умолчанию — последние 24 часа. Модели отсортированы по алфавиту.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_models_statistics` и `meta`.
     * Получение списка моделей, использованных ключом AI Gateway
     */
    async getAiKeyModelsStatisticRaw(requestParameters: GetAiKeyModelsStatisticRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiKeyModelsStatistic200Response>> {
        if (requestParameters.entityId === null || requestParameters.entityId === undefined) {
            throw new runtime.RequiredError('entityId','Required parameter requestParameters.entityId was null or undefined when calling getAiKeyModelsStatistic.');
        }

        if (requestParameters.entityType === null || requestParameters.entityType === undefined) {
            throw new runtime.RequiredError('entityType','Required parameter requestParameters.entityType was null or undefined when calling getAiKeyModelsStatistic.');
        }

        const queryParameters: any = {};

        if (requestParameters.entityId !== undefined) {
            queryParameters['entity_id'] = requestParameters.entityId;
        }

        if (requestParameters.entityType !== undefined) {
            queryParameters['entity_type'] = requestParameters.entityType;
        }

        if (requestParameters.modelName !== undefined) {
            queryParameters['model_name'] = requestParameters.modelName;
        }

        if (requestParameters.startTime !== undefined) {
            queryParameters['start_time'] = (requestParameters.startTime as any).toISOString();
        }

        if (requestParameters.endTime !== undefined) {
            queryParameters['end_time'] = (requestParameters.endTime as any).toISOString();
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/statistic/models`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiKeyModelsStatistic200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список моделей, к которым обращался ключ за период, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/statistic/models`.  Ключ задаётся параметрами `entity_id` (ID ключа) и `entity_type` (тип ключа). Если ключ не найден, вернётся 404. Период по умолчанию — последние 24 часа. Модели отсортированы по алфавиту.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_models_statistics` и `meta`.
     * Получение списка моделей, использованных ключом AI Gateway
     */
    async getAiKeyModelsStatistic(requestParameters: GetAiKeyModelsStatisticRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiKeyModelsStatistic200Response> {
        const response = await this.getAiKeyModelsStatisticRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить расход токенов и стоимость запросов ключа по интервалам времени, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/statistic/token-usage`.  Ключ задаётся параметрами `entity_id` (ID ключа) и `entity_type` (тип ключа). Если ключ не найден, вернётся 404. Период по умолчанию — последние 24 часа. Точки возвращаются для каждого интервала периода, включая интервалы без запросов.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_token_statistics` и `meta`.
     * Получение статистики расхода токенов ключа AI Gateway
     */
    async getAiKeyTokenUsageStatisticRaw(requestParameters: GetAiKeyTokenUsageStatisticRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiKeyTokenUsageStatistic200Response>> {
        if (requestParameters.entityId === null || requestParameters.entityId === undefined) {
            throw new runtime.RequiredError('entityId','Required parameter requestParameters.entityId was null or undefined when calling getAiKeyTokenUsageStatistic.');
        }

        if (requestParameters.entityType === null || requestParameters.entityType === undefined) {
            throw new runtime.RequiredError('entityType','Required parameter requestParameters.entityType was null or undefined when calling getAiKeyTokenUsageStatistic.');
        }

        const queryParameters: any = {};

        if (requestParameters.entityId !== undefined) {
            queryParameters['entity_id'] = requestParameters.entityId;
        }

        if (requestParameters.entityType !== undefined) {
            queryParameters['entity_type'] = requestParameters.entityType;
        }

        if (requestParameters.modelName !== undefined) {
            queryParameters['model_name'] = requestParameters.modelName;
        }

        if (requestParameters.startTime !== undefined) {
            queryParameters['start_time'] = (requestParameters.startTime as any).toISOString();
        }

        if (requestParameters.endTime !== undefined) {
            queryParameters['end_time'] = (requestParameters.endTime as any).toISOString();
        }

        if (requestParameters.interval !== undefined) {
            queryParameters['interval'] = requestParameters.interval;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/statistic/token-usage`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiKeyTokenUsageStatistic200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить расход токенов и стоимость запросов ключа по интервалам времени, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys/statistic/token-usage`.  Ключ задаётся параметрами `entity_id` (ID ключа) и `entity_type` (тип ключа). Если ключ не найден, вернётся 404. Период по умолчанию — последние 24 часа. Точки возвращаются для каждого интервала периода, включая интервалы без запросов.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_token_statistics` и `meta`.
     * Получение статистики расхода токенов ключа AI Gateway
     */
    async getAiKeyTokenUsageStatistic(requestParameters: GetAiKeyTokenUsageStatisticRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiKeyTokenUsageStatistic200Response> {
        const response = await this.getAiKeyTokenUsageStatisticRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список ключей AI Gateway, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys`.  В списке — ключи, созданные пользователем, и ключи кластеров Kubernetes, выпущенные платформой. Значения ключей (`sk-...`) не возвращаются.  Тело ответа будет представлять собой объект JSON с ключами `ai_keys` и `meta`.
     * Получение списка ключей AI Gateway
     */
    async getAiKeysRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiKeys200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiKeys200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список ключей AI Gateway, отправьте GET-запрос на `/api/v1/cloud-ai/ai-keys`.  В списке — ключи, созданные пользователем, и ключи кластеров Kubernetes, выпущенные платформой. Значения ключей (`sk-...`) не возвращаются.  Тело ответа будет представлять собой объект JSON с ключами `ai_keys` и `meta`.
     * Получение списка ключей AI Gateway
     */
    async getAiKeys(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiKeys200Response> {
        const response = await this.getAiKeysRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы перевыпустить ключ AI Gateway, отправьте PUT-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/regenerate`.  Ключ получает новое значение, старое перестаёт действовать сразу. Название, лимиты, запасные модели и статистика сохраняются. Новое значение (`sk-...`) возвращается в поле `key` только в ответе на этот запрос — сохраните его. Поле `expires_at` в ответе не заполняется.  Ключи, которыми управляет платформа (`is_readonly: true`), перевыпустить нельзя: вернётся 403 с `error_code` `ai_key_is_readonly`.
     * Перевыпуск ключа AI Gateway
     */
    async regenerateAiKeyRaw(requestParameters: RegenerateAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiKey201Response>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling regenerateAiKey.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}/regenerate`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiKey201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы перевыпустить ключ AI Gateway, отправьте PUT-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/regenerate`.  Ключ получает новое значение, старое перестаёт действовать сразу. Название, лимиты, запасные модели и статистика сохраняются. Новое значение (`sk-...`) возвращается в поле `key` только в ответе на этот запрос — сохраните его. Поле `expires_at` в ответе не заполняется.  Ключи, которыми управляет платформа (`is_readonly: true`), перевыпустить нельзя: вернётся 403 с `error_code` `ai_key_is_readonly`.
     * Перевыпуск ключа AI Gateway
     */
    async regenerateAiKey(requestParameters: RegenerateAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiKey201Response> {
        const response = await this.regenerateAiKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы задать все лимиты ключа AI Gateway на один период одним запросом, отправьте PUT-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/sync`.  Лимиты из `limits` создаются или обновляются (по `model_id`), а лимиты того же периода, которых нет в запросе, удаляются. Изменения применяются целиком или не применяются совсем.  Если в записи не задан ни `limit`, ни `money_limit` или `money_limit` снимается без `limit`, вернётся 400 с `error_code` `entity_keys_limit_value_required`. Если лимиты одновременно изменил другой запрос, вернётся 409 с `error_code` `entity_keys_limits_sync_conflict` — повторите запрос.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_entity_limits` и `meta` — лимиты периода после синхронизации.
     * Синхронизация лимитов ключа AI Gateway
     */
    async syncAiKeyLimitsRaw(requestParameters: SyncAiKeyLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiKeyLimits200Response>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling syncAiKeyLimits.');
        }

        if (requestParameters.syncAiKeyLimits === null || requestParameters.syncAiKeyLimits === undefined) {
            throw new runtime.RequiredError('syncAiKeyLimits','Required parameter requestParameters.syncAiKeyLimits was null or undefined when calling syncAiKeyLimits.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/sync`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SyncAiKeyLimitsToJSON(requestParameters.syncAiKeyLimits),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiKeyLimits200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы задать все лимиты ключа AI Gateway на один период одним запросом, отправьте PUT-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/sync`.  Лимиты из `limits` создаются или обновляются (по `model_id`), а лимиты того же периода, которых нет в запросе, удаляются. Изменения применяются целиком или не применяются совсем.  Если в записи не задан ни `limit`, ни `money_limit` или `money_limit` снимается без `limit`, вернётся 400 с `error_code` `entity_keys_limit_value_required`. Если лимиты одновременно изменил другой запрос, вернётся 409 с `error_code` `entity_keys_limits_sync_conflict` — повторите запрос.  Тело ответа будет представлять собой объект JSON с ключами `ai_key_entity_limits` и `meta` — лимиты периода после синхронизации.
     * Синхронизация лимитов ключа AI Gateway
     */
    async syncAiKeyLimits(requestParameters: SyncAiKeyLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiKeyLimits200Response> {
        const response = await this.syncAiKeyLimitsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить ключ AI Gateway, отправьте PATCH-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}`, передав изменяемые поля.  Ключи, которыми управляет платформа (`is_readonly: true` — ключи AI-решений и кластеров Kubernetes), изменить нельзя: вернётся 403 с `error_code` `ai_key_is_readonly`.  Ошибки в `fallback_models` — как при создании ключа (400). Поле `expires_at` в ответе этого запроса не заполняется — срок действия ключа смотрите в списке ключей.
     * Изменение ключа AI Gateway
     */
    async updateAiKeyRaw(requestParameters: UpdateAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateAiKey200Response>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling updateAiKey.');
        }

        if (requestParameters.updateAiKey === null || requestParameters.updateAiKey === undefined) {
            throw new runtime.RequiredError('updateAiKey','Required parameter requestParameters.updateAiKey was null or undefined when calling updateAiKey.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAiKeyToJSON(requestParameters.updateAiKey),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateAiKey200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить ключ AI Gateway, отправьте PATCH-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}`, передав изменяемые поля.  Ключи, которыми управляет платформа (`is_readonly: true` — ключи AI-решений и кластеров Kubernetes), изменить нельзя: вернётся 403 с `error_code` `ai_key_is_readonly`.  Ошибки в `fallback_models` — как при создании ключа (400). Поле `expires_at` в ответе этого запроса не заполняется — срок действия ключа смотрите в списке ключей.
     * Изменение ключа AI Gateway
     */
    async updateAiKey(requestParameters: UpdateAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateAiKey200Response> {
        const response = await this.updateAiKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить лимит ключа AI Gateway, отправьте PATCH-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.  Не переданные поля не меняются. Если не передан ни `limit`, ни `money_limit` или `money_limit` снимается без `limit`, вернётся 400 с `error_code` `entity_keys_limit_value_required`. Если лимит относится к другому ключу, вернётся 403.
     * Изменение лимита ключа AI Gateway
     */
    async updateAiKeyLimitRaw(requestParameters: UpdateAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiKeyLimit201Response>> {
        if (requestParameters.keyId === null || requestParameters.keyId === undefined) {
            throw new runtime.RequiredError('keyId','Required parameter requestParameters.keyId was null or undefined when calling updateAiKeyLimit.');
        }

        if (requestParameters.limitId === null || requestParameters.limitId === undefined) {
            throw new runtime.RequiredError('limitId','Required parameter requestParameters.limitId was null or undefined when calling updateAiKeyLimit.');
        }

        if (requestParameters.updateAiKeyLimit === null || requestParameters.updateAiKeyLimit === undefined) {
            throw new runtime.RequiredError('updateAiKeyLimit','Required parameter requestParameters.updateAiKeyLimit was null or undefined when calling updateAiKeyLimit.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.replace(`{${"key_id"}}`, encodeURIComponent(String(requestParameters.keyId))).replace(`{${"limit_id"}}`, encodeURIComponent(String(requestParameters.limitId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAiKeyLimitToJSON(requestParameters.updateAiKeyLimit),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiKeyLimit201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить лимит ключа AI Gateway, отправьте PATCH-запрос на `/api/v1/cloud-ai/ai-keys/{key_id}/entity-limits/{limit_id}`.  Не переданные поля не меняются. Если не передан ни `limit`, ни `money_limit` или `money_limit` снимается без `limit`, вернётся 400 с `error_code` `entity_keys_limit_value_required`. Если лимит относится к другому ключу, вернётся 403.
     * Изменение лимита ключа AI Gateway
     */
    async updateAiKeyLimit(requestParameters: UpdateAiKeyLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiKeyLimit201Response> {
        const response = await this.updateAiKeyLimitRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const GetAiKeyCallsStatisticEntityTypeEnum = {
    Aikey: 'aikey',
    K8s: 'k8s'
} as const;
export type GetAiKeyCallsStatisticEntityTypeEnum = typeof GetAiKeyCallsStatisticEntityTypeEnum[keyof typeof GetAiKeyCallsStatisticEntityTypeEnum];
/**
 * @export
 */
export const GetAiKeyLimitsLimitTypeEnum = {
    Hour: 'hour',
    Day: 'day',
    Week: 'week',
    Month: 'month'
} as const;
export type GetAiKeyLimitsLimitTypeEnum = typeof GetAiKeyLimitsLimitTypeEnum[keyof typeof GetAiKeyLimitsLimitTypeEnum];
/**
 * @export
 */
export const GetAiKeyModelsStatisticEntityTypeEnum = {
    Aikey: 'aikey',
    K8s: 'k8s'
} as const;
export type GetAiKeyModelsStatisticEntityTypeEnum = typeof GetAiKeyModelsStatisticEntityTypeEnum[keyof typeof GetAiKeyModelsStatisticEntityTypeEnum];
/**
 * @export
 */
export const GetAiKeyTokenUsageStatisticEntityTypeEnum = {
    Aikey: 'aikey',
    K8s: 'k8s'
} as const;
export type GetAiKeyTokenUsageStatisticEntityTypeEnum = typeof GetAiKeyTokenUsageStatisticEntityTypeEnum[keyof typeof GetAiKeyTokenUsageStatisticEntityTypeEnum];
