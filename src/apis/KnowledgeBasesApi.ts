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
  CreateDocument,
  CreateKnowledgebase,
  CreateKnowledgebase201Response,
  CreateKnowledgebaseDocument201Response,
  GetAccountStatus403Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  GetKnowledgebaseDocumentsV2200Response,
  GetKnowledgebaseV3200Response,
  GetKnowledgebases200Response,
  GetKnowledgebasesV2200Response,
  GetKnowledgebasesV3200Response,
  KnowledgebaseAddTokenPackage,
  LinkKnowledgebase,
  UpdateDocument,
  UpdateKnowledgebase,
  UploadResult,
} from '../models/index';
import {
    CreateDocumentFromJSON,
    CreateDocumentToJSON,
    CreateKnowledgebaseFromJSON,
    CreateKnowledgebaseToJSON,
    CreateKnowledgebase201ResponseFromJSON,
    CreateKnowledgebase201ResponseToJSON,
    CreateKnowledgebaseDocument201ResponseFromJSON,
    CreateKnowledgebaseDocument201ResponseToJSON,
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
    GetKnowledgebaseDocumentsV2200ResponseFromJSON,
    GetKnowledgebaseDocumentsV2200ResponseToJSON,
    GetKnowledgebaseV3200ResponseFromJSON,
    GetKnowledgebaseV3200ResponseToJSON,
    GetKnowledgebases200ResponseFromJSON,
    GetKnowledgebases200ResponseToJSON,
    GetKnowledgebasesV2200ResponseFromJSON,
    GetKnowledgebasesV2200ResponseToJSON,
    GetKnowledgebasesV3200ResponseFromJSON,
    GetKnowledgebasesV3200ResponseToJSON,
    KnowledgebaseAddTokenPackageFromJSON,
    KnowledgebaseAddTokenPackageToJSON,
    LinkKnowledgebaseFromJSON,
    LinkKnowledgebaseToJSON,
    UpdateDocumentFromJSON,
    UpdateDocumentToJSON,
    UpdateKnowledgebaseFromJSON,
    UpdateKnowledgebaseToJSON,
    UploadResultFromJSON,
    UploadResultToJSON,
} from '../models/index';

export interface AddAdditionalTokenPackageToKnowledgebaseRequest {
    id: number;
    knowledgebaseAddTokenPackage?: KnowledgebaseAddTokenPackage;
}

export interface CreateKnowledgebaseRequest {
    createKnowledgebase: CreateKnowledgebase;
}

export interface CreateKnowledgebaseDocumentRequest {
    id: number;
    createDocument: CreateDocument;
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

export interface GetKnowledgebaseDocumentsV2Request {
    id: number;
    limit?: number;
    offset?: number;
    sortBy?: GetKnowledgebaseDocumentsV2SortByEnum;
    sortOrder?: GetKnowledgebaseDocumentsV2SortOrderEnum;
    search?: string;
}

export interface GetKnowledgebaseV3Request {
    id: number;
}

export interface LinkKnowledgebaseToAgentRequest {
    id: number;
    agentId: number;
    linkKnowledgebase?: LinkKnowledgebase;
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

export interface UpdateKnowledgebaseAgentLinkRequest {
    id: number;
    agentId: number;
    linkKnowledgebase?: LinkKnowledgebase;
}

export interface UpdateKnowledgebaseDocumentRequest {
    id: number;
    documentId: number;
    updateDocument: UpdateDocument;
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
     * Чтобы докупить токены для базы знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/add-additional-token-package`.  Покупается дополнительный пакет (`package_type: additional`) из `GET /api/v1/cloud-ai/token-packages/knowledge-bases` в количестве `count`. Стоимость списывается с баланса, токены добавляются к текущему периоду подписки, заблокированная база знаний разблокируется.  Возможные ошибки: - `400 insufficient_balance` — на балансе недостаточно средств - `400 subscription_expired` — база знаний заблокирована и дата продления подписки прошла: продлите подписку в панели управления - `404 additional_token_package_not_found` — дополнительный пакет недоступен
     * Покупка дополнительных пакетов токенов
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
            body: KnowledgebaseAddTokenPackageToJSON(requestParameters.knowledgebaseAddTokenPackage),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы докупить токены для базы знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/add-additional-token-package`.  Покупается дополнительный пакет (`package_type: additional`) из `GET /api/v1/cloud-ai/token-packages/knowledge-bases` в количестве `count`. Стоимость списывается с баланса, токены добавляются к текущему периоду подписки, заблокированная база знаний разблокируется.  Возможные ошибки: - `400 insufficient_balance` — на балансе недостаточно средств - `400 subscription_expired` — база знаний заблокирована и дата продления подписки прошла: продлите подписку в панели управления - `404 additional_token_package_not_found` — дополнительный пакет недоступен
     * Покупка дополнительных пакетов токенов
     */
    async addAdditionalTokenPackageToKnowledgebase(requestParameters: AddAdditionalTokenPackageToKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addAdditionalTokenPackageToKnowledgebaseRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases`, задав необходимые атрибуты.  Для базы знаний в вашем аккаунте создаётся кластер базы данных OpenSearch по выбранному тарифу в указанной приватной сети, а с баланса сразу списывается стоимость пакета токенов. Подписка продлевается автоматически раз в период пакета.  Пока кластер создаётся, база знаний находится в статусе `creating`; документы, добавленные в это время, будут проиндексированы после перехода в `active`.  Возможные ошибки: - `404 token_package_not_found` — пакет токенов не найден или недоступен - `400 invalid_token_package_type` — пакет не является базовым пакетом для баз знаний - `400 insufficient_balance` — на балансе недостаточно средств для оплаты пакета  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
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
     * Чтобы создать базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases`, задав необходимые атрибуты.  Для базы знаний в вашем аккаунте создаётся кластер базы данных OpenSearch по выбранному тарифу в указанной приватной сети, а с баланса сразу списывается стоимость пакета токенов. Подписка продлевается автоматически раз в период пакета.  Пока кластер создаётся, база знаний находится в статусе `creating`; документы, добавленные в это время, будут проиндексированы после перехода в `active`.  Возможные ошибки: - `404 token_package_not_found` — пакет токенов не найден или недоступен - `400 invalid_token_package_type` — пакет не является базовым пакетом для баз знаний - `400 insufficient_balance` — на балансе недостаточно средств для оплаты пакета  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
     * Создание базы знаний
     */
    async createKnowledgebase(requestParameters: CreateKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebase201Response> {
        const response = await this.createKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить в базу знаний документ по ссылке, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents`.  Перед добавлением выполняется HEAD-запрос к `url`: адрес должен быть публично доступен, а ответ — содержать заголовок `Content-Type` одного из поддерживаемых форматов (текст, Markdown, HTML, XML, CSV, PDF, DOC, DOCX, XLS, XLSX; JSON не поддерживается). Документ сразу ставится в очередь на индексацию. Чтобы содержимое по ссылке переиндексировалось автоматически, задайте `indexing_schedule`.  Возможные ошибки: - `400 url_is_not_accessible` — адрес недоступен или вернул ошибку - `400 unsupported_file_type` — неподдерживаемый `Content-Type`  Тело ответа будет представлять собой объект JSON с ключом `document`.
     * Добавление документа по ссылке
     */
    async createKnowledgebaseDocumentRaw(requestParameters: CreateKnowledgebaseDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateKnowledgebaseDocument201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling createKnowledgebaseDocument.');
        }

        if (requestParameters.createDocument === null || requestParameters.createDocument === undefined) {
            throw new runtime.RequiredError('createDocument','Required parameter requestParameters.createDocument was null or undefined when calling createKnowledgebaseDocument.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/documents`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateDocumentToJSON(requestParameters.createDocument),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateKnowledgebaseDocument201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить в базу знаний документ по ссылке, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents`.  Перед добавлением выполняется HEAD-запрос к `url`: адрес должен быть публично доступен, а ответ — содержать заголовок `Content-Type` одного из поддерживаемых форматов (текст, Markdown, HTML, XML, CSV, PDF, DOC, DOCX, XLS, XLSX; JSON не поддерживается). Документ сразу ставится в очередь на индексацию. Чтобы содержимое по ссылке переиндексировалось автоматически, задайте `indexing_schedule`.  Возможные ошибки: - `400 url_is_not_accessible` — адрес недоступен или вернул ошибку - `400 unsupported_file_type` — неподдерживаемый `Content-Type`  Тело ответа будет представлять собой объект JSON с ключом `document`.
     * Добавление документа по ссылке
     */
    async createKnowledgebaseDocument(requestParameters: CreateKnowledgebaseDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebaseDocument201Response> {
        const response = await this.createKnowledgebaseDocumentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить документ из базы знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.  Документ удаляется вместе с его фрагментами в поисковом индексе.
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
     * Чтобы удалить документ из базы знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.  Документ удаляется вместе с его фрагментами в поисковом индексе.
     * Удаление документа из базы знаний
     */
    async deleteDocument(requestParameters: DeleteDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDocumentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить базу знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.  База знаний отвязывается от всех агентов, её кластер базы данных OpenSearch удаляется, подписка закрывается.
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
     * Чтобы удалить базу знаний, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.  База знаний отвязывается от всех агентов, её кластер базы данных OpenSearch удаляется, подписка закрывается.
     * Удаление базы знаний
     */
    async deleteKnowledgebase(requestParameters: DeleteKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteKnowledgebaseRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы скачать загруженный файл документа, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/download`.  Доступно только для документов типа `file`. Файл возвращается потоком с исходным MIME-типом в заголовке `Content-Type` и именем в `Content-Disposition`.
     * Скачивание файла документа
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
     * Чтобы скачать загруженный файл документа, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/download`.  Доступно только для документов типа `file`. Файл возвращается потоком с исходным MIME-типом в заголовке `Content-Type` и именем в `Content-Disposition`.
     * Скачивание файла документа
     */
    async downloadDocument(requestParameters: DownloadDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.downloadDocumentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о базе знаний вместе со всеми её документами, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
     * Получение базы знаний со списком документов
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
     * Чтобы получить информацию о базе знаний вместе со всеми её документами, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
     * Получение базы знаний со списком документов
     */
    async getKnowledgebase(requestParameters: GetKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebase201Response> {
        const response = await this.getKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список документов базы знаний с пагинацией, отправьте GET-запрос на `/api/v2/cloud-ai/knowledge-bases/{id}/documents`.  Некорректные значения параметров пагинации и сортировки не приводят к ошибке — вместо них применяются значения по умолчанию.  Тело ответа будет представлять собой объект JSON с ключами `knowledgebase_documents` и `meta`.
     * Получение списка документов базы знаний
     */
    async getKnowledgebaseDocumentsV2Raw(requestParameters: GetKnowledgebaseDocumentsV2Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKnowledgebaseDocumentsV2200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getKnowledgebaseDocumentsV2.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.sortBy !== undefined) {
            queryParameters['sort_by'] = requestParameters.sortBy;
        }

        if (requestParameters.sortOrder !== undefined) {
            queryParameters['sort_order'] = requestParameters.sortOrder;
        }

        if (requestParameters.search !== undefined) {
            queryParameters['search'] = requestParameters.search;
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
            path: `/api/v2/cloud-ai/knowledge-bases/{id}/documents`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKnowledgebaseDocumentsV2200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список документов базы знаний с пагинацией, отправьте GET-запрос на `/api/v2/cloud-ai/knowledge-bases/{id}/documents`.  Некорректные значения параметров пагинации и сортировки не приводят к ошибке — вместо них применяются значения по умолчанию.  Тело ответа будет представлять собой объект JSON с ключами `knowledgebase_documents` и `meta`.
     * Получение списка документов базы знаний
     */
    async getKnowledgebaseDocumentsV2(requestParameters: GetKnowledgebaseDocumentsV2Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebaseDocumentsV2200Response> {
        const response = await this.getKnowledgebaseDocumentsV2Raw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о базе знаний, отправьте GET-запрос на `/api/v3/cloud-ai/knowledge-bases/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
     * Получение базы знаний
     */
    async getKnowledgebaseV3Raw(requestParameters: GetKnowledgebaseV3Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKnowledgebaseV3200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getKnowledgebaseV3.');
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
            path: `/api/v3/cloud-ai/knowledge-bases/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKnowledgebaseV3200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о базе знаний, отправьте GET-запрос на `/api/v3/cloud-ai/knowledge-bases/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
     * Получение базы знаний
     */
    async getKnowledgebaseV3(requestParameters: GetKnowledgebaseV3Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebaseV3200Response> {
        const response = await this.getKnowledgebaseV3Raw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Метод устарел — используйте `GET /api/v3/cloud-ai/knowledge-bases`.  Чтобы получить список баз знаний вместе со всеми их документами, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases`.  Тело ответа будет представлять собой объект JSON с ключами `knowledge_bases` и `meta`.
     * Получение списка баз знаний (v1)
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
     * Метод устарел — используйте `GET /api/v3/cloud-ai/knowledge-bases`.  Чтобы получить список баз знаний вместе со всеми их документами, отправьте GET-запрос на `/api/v1/cloud-ai/knowledge-bases`.  Тело ответа будет представлять собой объект JSON с ключами `knowledge_bases` и `meta`.
     * Получение списка баз знаний (v1)
     */
    async getKnowledgebases(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebases200Response> {
        const response = await this.getKnowledgebasesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список баз знаний, отправьте GET-запрос на `/api/v2/cloud-ai/knowledge-bases`.  Вместо списка документов возвращается их количество, привязанные агенты — списком ID. Режим поиска для каждого агента возвращает `GET /api/v3/cloud-ai/knowledge-bases`.  Тело ответа будет представлять собой объект JSON с ключами `knowledge_bases` и `meta`.
     * Получение списка баз знаний (v2)
     */
    async getKnowledgebasesV2Raw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKnowledgebasesV2200Response>> {
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
            path: `/api/v2/cloud-ai/knowledge-bases`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKnowledgebasesV2200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список баз знаний, отправьте GET-запрос на `/api/v2/cloud-ai/knowledge-bases`.  Вместо списка документов возвращается их количество, привязанные агенты — списком ID. Режим поиска для каждого агента возвращает `GET /api/v3/cloud-ai/knowledge-bases`.  Тело ответа будет представлять собой объект JSON с ключами `knowledge_bases` и `meta`.
     * Получение списка баз знаний (v2)
     */
    async getKnowledgebasesV2(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebasesV2200Response> {
        const response = await this.getKnowledgebasesV2Raw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список баз знаний, отправьте GET-запрос на `/api/v3/cloud-ai/knowledge-bases`.  Ответ содержит количество документов и привязанных агентов с режимом поиска. Документы базы знаний запрашивайте отдельно — `GET /api/v2/cloud-ai/knowledge-bases/{id}/documents`.  Тело ответа будет представлять собой объект JSON с ключами `knowledge_bases` и `meta`.
     * Получение списка баз знаний
     */
    async getKnowledgebasesV3Raw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKnowledgebasesV3200Response>> {
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
            path: `/api/v3/cloud-ai/knowledge-bases`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKnowledgebasesV3200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список баз знаний, отправьте GET-запрос на `/api/v3/cloud-ai/knowledge-bases`.  Ответ содержит количество документов и привязанных агентов с режимом поиска. Документы базы знаний запрашивайте отдельно — `GET /api/v2/cloud-ai/knowledge-bases/{id}/documents`.  Тело ответа будет представлять собой объект JSON с ключами `knowledge_bases` и `meta`.
     * Получение списка баз знаний
     */
    async getKnowledgebasesV3(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebasesV3200Response> {
        const response = await this.getKnowledgebasesV3Raw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы привязать базу знаний к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.  Тело запроса необязательно: в нём можно выбрать режим поиска `retrievalMode` (по умолчанию `agentic`). Изменить режим для существующей привязки можно запросом PATCH на тот же адрес.  Возможные ошибки: `404 knowledgebase_not_found`, `404 agent_not_found`.
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

        headerParameters['Content-Type'] = 'application/json';

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
            body: LinkKnowledgebaseToJSON(requestParameters.linkKnowledgebase),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы привязать базу знаний к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.  Тело запроса необязательно: в нём можно выбрать режим поиска `retrievalMode` (по умолчанию `agentic`). Изменить режим для существующей привязки можно запросом PATCH на тот же адрес.  Возможные ошибки: `404 knowledgebase_not_found`, `404 agent_not_found`.
     * Привязка базы знаний к агенту
     */
    async linkKnowledgebaseToAgent(requestParameters: LinkKnowledgebaseToAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.linkKnowledgebaseToAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы переиндексировать документ, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/reindex`.  Документ ставится в очередь на индексацию; следите за полем `status` документа. Для документа по ссылке содержимое скачивается заново. Если база знаний не в статусе `active`, документ будет проиндексирован после активации.  Возможные ошибки: `404 knowledgebase_not_found`, `404 document_not_found`.
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
     * Чтобы переиндексировать документ, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}/reindex`.  Документ ставится в очередь на индексацию; следите за полем `status` документа. Для документа по ссылке содержимое скачивается заново. Если база знаний не в статусе `active`, документ будет проиндексирован после активации.  Возможные ошибки: `404 knowledgebase_not_found`, `404 document_not_found`.
     * Переиндексация документа
     */
    async reindexDocument(requestParameters: ReindexDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.reindexDocumentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отвязать базу знаний от AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.  Возможные ошибки: `404 knowledgebase_not_found`, `404 agent_not_found`.
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
     * Чтобы отвязать базу знаний от AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.  Возможные ошибки: `404 knowledgebase_not_found`, `404 agent_not_found`.
     * Отвязка базы знаний от агента
     */
    async unlinkKnowledgebaseFromAgent(requestParameters: UnlinkKnowledgebaseFromAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.unlinkKnowledgebaseFromAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы изменить название или описание базы знаний, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
     * Изменение базы знаний
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
     * Чтобы изменить название или описание базы знаний, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `knowledge_base`.
     * Изменение базы знаний
     */
    async updateKnowledgebase(requestParameters: UpdateKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebase201Response> {
        const response = await this.updateKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить режим поиска по привязанной базе знаний для AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.  Если `retrievalMode` не передан, устанавливается `agentic`. Если база знаний не привязана к агенту, запрос ничего не меняет и также возвращает `204`.  Возможные ошибки: `404 knowledgebase_not_found`, `404 agent_not_found`.
     * Изменение режима поиска по базе знаний для агента
     */
    async updateKnowledgebaseAgentLinkRaw(requestParameters: UpdateKnowledgebaseAgentLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updateKnowledgebaseAgentLink.');
        }

        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling updateKnowledgebaseAgentLink.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: LinkKnowledgebaseToJSON(requestParameters.linkKnowledgebase),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы изменить режим поиска по привязанной базе знаний для AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/link/{agent_id}`.  Если `retrievalMode` не передан, устанавливается `agentic`. Если база знаний не привязана к агенту, запрос ничего не меняет и также возвращает `204`.  Возможные ошибки: `404 knowledgebase_not_found`, `404 agent_not_found`.
     * Изменение режима поиска по базе знаний для агента
     */
    async updateKnowledgebaseAgentLink(requestParameters: UpdateKnowledgebaseAgentLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateKnowledgebaseAgentLinkRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы изменить документ базы знаний, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.  Можно изменить название, расписание переиндексации и — только для документов типа `link` — адрес. После смены адреса документ переиндексируется; изменение названия и расписания переиндексацию не запускает. Новый адрес проверяется так же, как при добавлении документа.  Тело ответа будет представлять собой объект JSON с ключом `document`.
     * Изменение документа
     */
    async updateKnowledgebaseDocumentRaw(requestParameters: UpdateKnowledgebaseDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateKnowledgebaseDocument201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updateKnowledgebaseDocument.');
        }

        if (requestParameters.documentId === null || requestParameters.documentId === undefined) {
            throw new runtime.RequiredError('documentId','Required parameter requestParameters.documentId was null or undefined when calling updateKnowledgebaseDocument.');
        }

        if (requestParameters.updateDocument === null || requestParameters.updateDocument === undefined) {
            throw new runtime.RequiredError('updateDocument','Required parameter requestParameters.updateDocument was null or undefined when calling updateKnowledgebaseDocument.');
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
            path: `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"document_id"}}`, encodeURIComponent(String(requestParameters.documentId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateDocumentToJSON(requestParameters.updateDocument),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateKnowledgebaseDocument201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить документ базы знаний, отправьте PATCH-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/documents/{document_id}`.  Можно изменить название, расписание переиндексации и — только для документов типа `link` — адрес. После смены адреса документ переиндексируется; изменение названия и расписания переиндексацию не запускает. Новый адрес проверяется так же, как при добавлении документа.  Тело ответа будет представлять собой объект JSON с ключом `document`.
     * Изменение документа
     */
    async updateKnowledgebaseDocument(requestParameters: UpdateKnowledgebaseDocumentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateKnowledgebaseDocument201Response> {
        const response = await this.updateKnowledgebaseDocumentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы загрузить файлы в базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/upload` с файлами в поле `files` формата `multipart/form-data`. Для каждого файла создаётся документ типа `file`, после загрузки документы ставятся в очередь на индексацию (если база знаний в статусе `active`; иначе — после активации).  Поддерживаемые форматы: TXT, Markdown (`md`, `markdown`), HTML (`html`, `htm`), XML, CSV, PDF, DOC, DOCX, XLS, XLSX, а также другие файлы с MIME-типом `text/_*`. JSON (`json`, `jsonl`, `ndjson`) не поддерживается. Размер одного файла — не более 50 МБ.  Если хотя бы один файл неподдерживаемого формата, запрос завершается ошибкой.  Тело ответа будет представлять собой объект JSON с ключами `uploadedFiles` и `documents`.
     * Загрузка файлов в базу знаний
     */
    async uploadFilesToKnowledgebaseRaw(requestParameters: UploadFilesToKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UploadResult>> {
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

        return new runtime.JSONApiResponse(response, (jsonValue) => UploadResultFromJSON(jsonValue));
    }

    /**
     * Чтобы загрузить файлы в базу знаний, отправьте POST-запрос на `/api/v1/cloud-ai/knowledge-bases/{id}/upload` с файлами в поле `files` формата `multipart/form-data`. Для каждого файла создаётся документ типа `file`, после загрузки документы ставятся в очередь на индексацию (если база знаний в статусе `active`; иначе — после активации).  Поддерживаемые форматы: TXT, Markdown (`md`, `markdown`), HTML (`html`, `htm`), XML, CSV, PDF, DOC, DOCX, XLS, XLSX, а также другие файлы с MIME-типом `text/_*`. JSON (`json`, `jsonl`, `ndjson`) не поддерживается. Размер одного файла — не более 50 МБ.  Если хотя бы один файл неподдерживаемого формата, запрос завершается ошибкой.  Тело ответа будет представлять собой объект JSON с ключами `uploadedFiles` и `documents`.
     * Загрузка файлов в базу знаний
     */
    async uploadFilesToKnowledgebase(requestParameters: UploadFilesToKnowledgebaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UploadResult> {
        const response = await this.uploadFilesToKnowledgebaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const GetKnowledgebaseDocumentsV2SortByEnum = {
    Name: 'name',
    Size: 'size',
    Status: 'status',
    IndexingTimestamp: 'indexing_timestamp'
} as const;
export type GetKnowledgebaseDocumentsV2SortByEnum = typeof GetKnowledgebaseDocumentsV2SortByEnum[keyof typeof GetKnowledgebaseDocumentsV2SortByEnum];
/**
 * @export
 */
export const GetKnowledgebaseDocumentsV2SortOrderEnum = {
    Asc: 'ASC',
    Desc: 'DESC'
} as const;
export type GetKnowledgebaseDocumentsV2SortOrderEnum = typeof GetKnowledgebaseDocumentsV2SortOrderEnum[keyof typeof GetKnowledgebaseDocumentsV2SortOrderEnum];
