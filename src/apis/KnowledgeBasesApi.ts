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
  AddTokenPackage,
  CreateKnowledgebase,
  CreateKnowledgebase201Response,
  GetAccountStatus403Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  GetKnowledgebaseStatistics200Response,
  GetKnowledgebases200Response,
  UpdateKnowledgebase,
  UploadFilesToKnowledgebase200Response,
} from '../models/index';
import {
    AddTokenPackageFromJSON,
    AddTokenPackageToJSON,
    CreateKnowledgebaseFromJSON,
    CreateKnowledgebaseToJSON,
    CreateKnowledgebase201ResponseFromJSON,
    CreateKnowledgebase201ResponseToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
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
    GetKnowledgebaseStatistics200ResponseFromJSON,
    GetKnowledgebaseStatistics200ResponseToJSON,
    GetKnowledgebases200ResponseFromJSON,
    GetKnowledgebases200ResponseToJSON,
    UpdateKnowledgebaseFromJSON,
    UpdateKnowledgebaseToJSON,
    UploadFilesToKnowledgebase200ResponseFromJSON,
    UploadFilesToKnowledgebase200ResponseToJSON,
} from '../models/index';

export interface AddAdditionalTokenPackageToKnowledgebaseRequest {
    id: number;
    addTokenPackage?: AddTokenPackage;
}

export interface CreateKnowledgebaseRequest {
    createKnowledgebase: CreateKnowledgebase;
}

export interface DeleteDocumentRequest {
    id: number;
    documentId: number;
}

export interface DeleteKnowledgebaseRequest {
    id: number;
}

export interface DownloadDocumentRequest {
    id: number;
    documentId: number;
}

export interface GetKnowledgebaseRequest {
    id: number;
}

export interface GetKnowledgebaseStatisticsRequest {
    id: number;
    startTime?: Date;
    endTime?: Date;
    interval?: number;
}

export interface LinkKnowledgebaseToAgentRequest {
    id: number;
    agentId: number;
}

export interface ReindexDocumentRequest {
    id: number;
    documentId: number;
}

export interface UnlinkKnowledgebaseFromAgentRequest {
    id: number;
    agentId: number;
}

export interface UpdateKnowledgebaseRequest {
    id: number;
    updateKnowledgebase: UpdateKnowledgebase;
}

export interface UploadFilesToKnowledgebaseRequest {
    id: number;
    files: Array<Blob>;
}

/**
 * 
 */
export class KnowledgeBasesApi extends runtime.BaseAPI {

    /**
     * Чтобы добавить дополнительный пакет токенов для базы знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/add-additional-token-package`.
     * Добавление дополнительного пакета токенов
     */
    async addAdditionalTokenPackageToKnowledgebaseRaw(requestParameters: AddAdditionalTokenPackageToKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling addAdditionalTokenPackageToKnowledgebase.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/add-additional-token-package`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddTokenPackageToJSON(requestParameters.addTokenPackage),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы добавить дополнительный пакет токенов для базы знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/add-additional-token-package`.
     * Добавление дополнительного пакета токенов
     */
    async addAdditionalTokenPackageToKnowledgebase(requestParameters: AddAdditionalTokenPackageToKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addAdditionalTokenPackageToKnowledgebaseRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases`, задав необходимые атрибуты.  База знаний будет создана с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданной базе знаний.
     * Создание базы знаний
     */
    async createKnowledgebaseRaw(requestParameters: CreateKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateKnowledgebase201Response>> {
        if (requestParameters.createKnowledgebase === null || requestParameters.createKnowledgebase === undefined) {
            throw new runtime.RequiredError('createKnowledgebase','Required parameter requestParameters.createKnowledgebase was null or undefined when calling createKnowledgebase.');
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
            path: `/api/v1/cloud-ai/knowledge-bases`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateKnowledgebaseToJSON(requestParameters.createKnowledgebase),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateKnowledgebase201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases`, задав необходимые атрибуты.  База знаний будет создана с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданной базе знаний.
     * Создание базы знаний
     */
    async createKnowledgebase(requestParameters: CreateKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebase201Response> {
        const response = await this.createKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить документ из базы знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.
     * Удаление документа из базы знаний
     */
    async deleteDocumentRaw(requestParameters: DeleteDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteDocument.');
        }

        if (requestParameters.documentId === null || requestParameters.documentId === undefined) {
            throw new runtime.RequiredError('documentId','Required parameter requestParameters.documentId was null or undefined when calling deleteDocument.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"document_id"}}`, encodeURIComponent(String(requestParameters.documentId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить документ из базы знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.
     * Удаление документа из базы знаний
     */
    async deleteDocument(requestParameters: DeleteDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDocumentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить базу знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.
     * Удаление базы знаний
     */
    async deleteKnowledgebaseRaw(requestParameters: DeleteKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteKnowledgebase.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить базу знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.
     * Удаление базы знаний
     */
    async deleteKnowledgebase(requestParameters: DeleteKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteKnowledgebaseRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы скачать документ из базы знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/download`.
     * Скачивание документа из базы знаний
     */
    async downloadDocumentRaw(requestParameters: DownloadDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling downloadDocument.');
        }

        if (requestParameters.documentId === null || requestParameters.documentId === undefined) {
            throw new runtime.RequiredError('documentId','Required parameter requestParameters.documentId was null or undefined when calling downloadDocument.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/download`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"document_id"}}`, encodeURIComponent(String(requestParameters.documentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Чтобы скачать документ из базы знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/download`.
     * Скачивание документа из базы знаний
     */
    async downloadDocument(requestParameters: DownloadDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.downloadDocumentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о базе знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.
     * Получение базы знаний
     */
    async getKnowledgebaseRaw(requestParameters: GetKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateKnowledgebase201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getKnowledgebase.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateKnowledgebase201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о базе знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.
     * Получение базы знаний
     */
    async getKnowledgebase(requestParameters: GetKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebase201Response> {
        const response = await this.getKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статистику использования токенов базы знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/statistic`.  Можно указать временной диапазон и интервал агрегации.
     * Получение статистики использования токенов базы знаний
     */
    async getKnowledgebaseStatisticsRaw(requestParameters: GetKnowledgebaseStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKnowledgebaseStatistics200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getKnowledgebaseStatistics.');
        }

        const queryParameters: any = {};

        if (requestParameters.startTime !== undefined) {
            queryParameters['startTime'] = (requestParameters.startTime as any).toISOString();
        }

        if (requestParameters.endTime !== undefined) {
            queryParameters['endTime'] = (requestParameters.endTime as any).toISOString();
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/statistic`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKnowledgebaseStatistics200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статистику использования токенов базы знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/statistic`.  Можно указать временной диапазон и интервал агрегации.
     * Получение статистики использования токенов базы знаний
     */
    async getKnowledgebaseStatistics(requestParameters: GetKnowledgebaseStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebaseStatistics200Response> {
        const response = await this.getKnowledgebaseStatisticsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список баз знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases`.  Тело ответа будет представлять собой объект JSON с ключом `knowledgebases`.
     * Получение списка баз знаний
     */
    async getKnowledgebasesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKnowledgebases200Response>> {
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
            path: `/api/v1/cloud-ai/knowledge-bases`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKnowledgebases200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список баз знаний, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases`.  Тело ответа будет представлять собой объект JSON с ключом `knowledgebases`.
     * Получение списка баз знаний
     */
    async getKnowledgebases(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebases200Response> {
        const response = await this.getKnowledgebasesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы привязать базу знаний к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.
     * Привязка базы знаний к агенту
     */
    async linkKnowledgebaseToAgentRaw(requestParameters: LinkKnowledgebaseToAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling linkKnowledgebaseToAgent.');
        }

        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling linkKnowledgebaseToAgent.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы привязать базу знаний к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.
     * Привязка базы знаний к агенту
     */
    async linkKnowledgebaseToAgent(requestParameters: LinkKnowledgebaseToAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.linkKnowledgebaseToAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы переиндексировать документ в базе знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/reindex`.
     * Переиндексация документа
     */
    async reindexDocumentRaw(requestParameters: ReindexDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling reindexDocument.');
        }

        if (requestParameters.documentId === null || requestParameters.documentId === undefined) {
            throw new runtime.RequiredError('documentId','Required parameter requestParameters.documentId was null or undefined when calling reindexDocument.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/reindex`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"document_id"}}`, encodeURIComponent(String(requestParameters.documentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы переиндексировать документ в базе знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/reindex`.
     * Переиндексация документа
     */
    async reindexDocument(requestParameters: ReindexDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.reindexDocumentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отвязать базу знаний от AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.
     * Отвязка базы знаний от агента
     */
    async unlinkKnowledgebaseFromAgentRaw(requestParameters: UnlinkKnowledgebaseFromAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling unlinkKnowledgebaseFromAgent.');
        }

        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling unlinkKnowledgebaseFromAgent.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отвязать базу знаний от AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.
     * Отвязка базы знаний от агента
     */
    async unlinkKnowledgebaseFromAgent(requestParameters: UnlinkKnowledgebaseFromAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.unlinkKnowledgebaseFromAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы обновить базу знаний, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.
     * Обновление базы знаний
     */
    async updateKnowledgebaseRaw(requestParameters: UpdateKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateKnowledgebase201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updateKnowledgebase.');
        }

        if (requestParameters.updateKnowledgebase === null || requestParameters.updateKnowledgebase === undefined) {
            throw new runtime.RequiredError('updateKnowledgebase','Required parameter requestParameters.updateKnowledgebase was null or undefined when calling updateKnowledgebase.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateKnowledgebaseToJSON(requestParameters.updateKnowledgebase),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateKnowledgebase201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить базу знаний, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.
     * Обновление базы знаний
     */
    async updateKnowledgebase(requestParameters: UpdateKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebase201Response> {
        const response = await this.updateKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы загрузить файлы в базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/upload` с файлами в формате multipart/form-data.  Поддерживаемые форматы: CSV, XML, Markdown (md), HTML, TXT. JSON не поддерживается. Максимум 10 файлов, до 10 МБ каждый.
     * Загрузка файлов в базу знаний
     */
    async uploadFilesToKnowledgebaseRaw(requestParameters: UploadFilesToKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UploadFilesToKnowledgebase200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling uploadFilesToKnowledgebase.');
        }

        if (requestParameters.files === null || requestParameters.files === undefined) {
            throw new runtime.RequiredError('files','Required parameter requestParameters.files was null or undefined when calling uploadFilesToKnowledgebase.');
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
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.files) {
            requestParameters.files.forEach((element) => {
                formParams.append('files', element as any);
            })
        }

        const response = await this.request({
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/upload`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UploadFilesToKnowledgebase200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы загрузить файлы в базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/upload` с файлами в формате multipart/form-data.  Поддерживаемые форматы: CSV, XML, Markdown (md), HTML, TXT. JSON не поддерживается. Максимум 10 файлов, до 10 МБ каждый.
     * Загрузка файлов в базу знаний
     */
    async uploadFilesToKnowledgebase(requestParameters: UploadFilesToKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UploadFilesToKnowledgebase200Response> {
        const response = await this.uploadFilesToKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
