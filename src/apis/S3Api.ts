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
  AddStorageSubdomainCertificateRequest,
  AddStorageSubdomains200Response,
  AddStorageSubdomainsRequest,
  CopyStorageFileRequest,
  CreateDatabaseBackup409Response,
  CreateFolderInStorageRequest,
  CreateStorage201Response,
  CreateStorageRequest,
  DeleteStorage200Response,
  DeleteStorageFileRequest,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances403Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  GetProjectStorages200Response,
  GetStorageFilesList200Response,
  GetStorageSubdomains200Response,
  GetStorageTransferStatus200Response,
  GetStorageUsers200Response,
  GetStoragesPresets200Response,
  RenameStorageFileRequest,
  TransferStorageRequest,
  UpdateStorageRequest,
  UpdateStorageUser200Response,
  UpdateStorageUserRequest,
} from '../models/index';
import {
    AddStorageSubdomainCertificateRequestFromJSON,
    AddStorageSubdomainCertificateRequestToJSON,
    AddStorageSubdomains200ResponseFromJSON,
    AddStorageSubdomains200ResponseToJSON,
    AddStorageSubdomainsRequestFromJSON,
    AddStorageSubdomainsRequestToJSON,
    CopyStorageFileRequestFromJSON,
    CopyStorageFileRequestToJSON,
    CreateDatabaseBackup409ResponseFromJSON,
    CreateDatabaseBackup409ResponseToJSON,
    CreateFolderInStorageRequestFromJSON,
    CreateFolderInStorageRequestToJSON,
    CreateStorage201ResponseFromJSON,
    CreateStorage201ResponseToJSON,
    CreateStorageRequestFromJSON,
    CreateStorageRequestToJSON,
    DeleteStorage200ResponseFromJSON,
    DeleteStorage200ResponseToJSON,
    DeleteStorageFileRequestFromJSON,
    DeleteStorageFileRequestToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances403ResponseFromJSON,
    GetFinances403ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    GetImage404ResponseFromJSON,
    GetImage404ResponseToJSON,
    GetProjectStorages200ResponseFromJSON,
    GetProjectStorages200ResponseToJSON,
    GetStorageFilesList200ResponseFromJSON,
    GetStorageFilesList200ResponseToJSON,
    GetStorageSubdomains200ResponseFromJSON,
    GetStorageSubdomains200ResponseToJSON,
    GetStorageTransferStatus200ResponseFromJSON,
    GetStorageTransferStatus200ResponseToJSON,
    GetStorageUsers200ResponseFromJSON,
    GetStorageUsers200ResponseToJSON,
    GetStoragesPresets200ResponseFromJSON,
    GetStoragesPresets200ResponseToJSON,
    RenameStorageFileRequestFromJSON,
    RenameStorageFileRequestToJSON,
    TransferStorageRequestFromJSON,
    TransferStorageRequestToJSON,
    UpdateStorageRequestFromJSON,
    UpdateStorageRequestToJSON,
    UpdateStorageUser200ResponseFromJSON,
    UpdateStorageUser200ResponseToJSON,
    UpdateStorageUserRequestFromJSON,
    UpdateStorageUserRequestToJSON,
} from '../models/index';

export interface AddStorageSubdomainCertificateOperationRequest {
    addStorageSubdomainCertificateRequest: AddStorageSubdomainCertificateRequest;
}

export interface AddStorageSubdomainsOperationRequest {
    bucketId: number;
    addStorageSubdomainsRequest: AddStorageSubdomainsRequest;
}

export interface CopyStorageFileOperationRequest {
    bucketId: number;
    copyStorageFileRequest: CopyStorageFileRequest;
}

export interface CreateFolderInStorageOperationRequest {
    bucketId: number;
    createFolderInStorageRequest: CreateFolderInStorageRequest;
}

export interface CreateStorageOperationRequest {
    createStorageRequest: CreateStorageRequest;
}

export interface DeleteStorageRequest {
    bucketId: number;
    hash?: string;
    code?: string;
}

export interface DeleteStorageFileOperationRequest {
    bucketId: number;
    deleteStorageFileRequest: DeleteStorageFileRequest;
    isMultipart?: boolean;
}

export interface DeleteStorageSubdomainsRequest {
    bucketId: number;
    addStorageSubdomainsRequest: AddStorageSubdomainsRequest;
}

export interface GetStorageFilesListRequest {
    bucketId: number;
    prefix?: string;
    isMultipart?: boolean;
}

export interface GetStorageSubdomainsRequest {
    bucketId: number;
}

export interface GetStorageTransferStatusRequest {
    bucketId: number;
}

export interface RenameStorageFileOperationRequest {
    bucketId: number;
    renameStorageFileRequest: RenameStorageFileRequest;
}

export interface TransferStorageOperationRequest {
    transferStorageRequest: TransferStorageRequest;
}

export interface UpdateStorageOperationRequest {
    bucketId: number;
    updateStorageRequest: UpdateStorageRequest;
}

export interface UpdateStorageUserOperationRequest {
    userId: number;
    updateStorageUserRequest: UpdateStorageUserRequest;
}

export interface UploadFileToStorageRequest {
    bucketId: number;
    files: Array<Blob>;
    path?: string;
}

/**
 * 
 */
export class S3Api extends runtime.BaseAPI {

    /**
     * Чтобы добавить сертификат для поддомена хранилища, отправьте POST-запрос на `/api/v1/storages/certificates/generate`.
     * Добавление сертификата для поддомена хранилища
     */
    async addStorageSubdomainCertificateRaw(requestParameters: AddStorageSubdomainCertificateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.addStorageSubdomainCertificateRequest === null || requestParameters.addStorageSubdomainCertificateRequest === undefined) {
            throw new runtime.RequiredError('addStorageSubdomainCertificateRequest','Required parameter requestParameters.addStorageSubdomainCertificateRequest was null or undefined when calling addStorageSubdomainCertificate.');
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
            path: `/api/v1/storages/certificates/generate`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddStorageSubdomainCertificateRequestToJSON(requestParameters.addStorageSubdomainCertificateRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы добавить сертификат для поддомена хранилища, отправьте POST-запрос на `/api/v1/storages/certificates/generate`.
     * Добавление сертификата для поддомена хранилища
     */
    async addStorageSubdomainCertificate(requestParameters: AddStorageSubdomainCertificateOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addStorageSubdomainCertificateRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы добавить поддомены для хранилища, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/subdomains`.
     * Добавление поддоменов для хранилища
     */
    async addStorageSubdomainsRaw(requestParameters: AddStorageSubdomainsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddStorageSubdomains200Response>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling addStorageSubdomains.');
        }

        if (requestParameters.addStorageSubdomainsRequest === null || requestParameters.addStorageSubdomainsRequest === undefined) {
            throw new runtime.RequiredError('addStorageSubdomainsRequest','Required parameter requestParameters.addStorageSubdomainsRequest was null or undefined when calling addStorageSubdomains.');
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
            path: `/api/v1/storages/buckets/{bucket_id}/subdomains`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddStorageSubdomainsRequestToJSON(requestParameters.addStorageSubdomainsRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddStorageSubdomains200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить поддомены для хранилища, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/subdomains`.
     * Добавление поддоменов для хранилища
     */
    async addStorageSubdomains(requestParameters: AddStorageSubdomainsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddStorageSubdomains200Response> {
        const response = await this.addStorageSubdomainsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы скопировать файла или директорию с вложениями, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/copy`.
     * Копирование файла/директории в хранилище
     */
    async copyStorageFileRaw(requestParameters: CopyStorageFileOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling copyStorageFile.');
        }

        if (requestParameters.copyStorageFileRequest === null || requestParameters.copyStorageFileRequest === undefined) {
            throw new runtime.RequiredError('copyStorageFileRequest','Required parameter requestParameters.copyStorageFileRequest was null or undefined when calling copyStorageFile.');
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
            path: `/api/v1/storages/buckets/{bucket_id}/object-manager/copy`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CopyStorageFileRequestToJSON(requestParameters.copyStorageFileRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы скопировать файла или директорию с вложениями, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/copy`.
     * Копирование файла/директории в хранилище
     */
    async copyStorageFile(requestParameters: CopyStorageFileOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.copyStorageFileRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать директорию в хранилище, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/mkdir`.
     * Создание директории в хранилище
     */
    async createFolderInStorageRaw(requestParameters: CreateFolderInStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling createFolderInStorage.');
        }

        if (requestParameters.createFolderInStorageRequest === null || requestParameters.createFolderInStorageRequest === undefined) {
            throw new runtime.RequiredError('createFolderInStorageRequest','Required parameter requestParameters.createFolderInStorageRequest was null or undefined when calling createFolderInStorage.');
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
            path: `/api/v1/storages/buckets/{bucket_id}/object-manager/mkdir`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateFolderInStorageRequestToJSON(requestParameters.createFolderInStorageRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы создать директорию в хранилище, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/mkdir`.
     * Создание директории в хранилище
     */
    async createFolderInStorage(requestParameters: CreateFolderInStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createFolderInStorageRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать хранилище, отправьте POST-запрос на `/api/v1/storages/buckets`.
     * Создание хранилища
     */
    async createStorageRaw(requestParameters: CreateStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateStorage201Response>> {
        if (requestParameters.createStorageRequest === null || requestParameters.createStorageRequest === undefined) {
            throw new runtime.RequiredError('createStorageRequest','Required parameter requestParameters.createStorageRequest was null or undefined when calling createStorage.');
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
            path: `/api/v1/storages/buckets`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateStorageRequestToJSON(requestParameters.createStorageRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateStorage201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать хранилище, отправьте POST-запрос на `/api/v1/storages/buckets`.
     * Создание хранилища
     */
    async createStorage(requestParameters: CreateStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateStorage201Response> {
        const response = await this.createStorageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить хранилище, отправьте DELETE-запрос на `/api/v1/storages/buckets/{bucket_id}`.
     * Удаление хранилища на аккаунте
     */
    async deleteStorageRaw(requestParameters: DeleteStorageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteStorage200Response>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling deleteStorage.');
        }

        const queryParameters: any = {};

        if (requestParameters.hash !== undefined) {
            queryParameters['hash'] = requestParameters.hash;
        }

        if (requestParameters.code !== undefined) {
            queryParameters['code'] = requestParameters.code;
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
            path: `/api/v1/storages/buckets/{bucket_id}`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteStorage200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить хранилище, отправьте DELETE-запрос на `/api/v1/storages/buckets/{bucket_id}`.
     * Удаление хранилища на аккаунте
     */
    async deleteStorage(requestParameters: DeleteStorageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteStorage200Response> {
        const response = await this.deleteStorageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить файл или директорию с вложениями, отправьте DELETE-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/remove`.
     * Удаление файла/директории в хранилище
     */
    async deleteStorageFileRaw(requestParameters: DeleteStorageFileOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling deleteStorageFile.');
        }

        if (requestParameters.deleteStorageFileRequest === null || requestParameters.deleteStorageFileRequest === undefined) {
            throw new runtime.RequiredError('deleteStorageFileRequest','Required parameter requestParameters.deleteStorageFileRequest was null or undefined when calling deleteStorageFile.');
        }

        const queryParameters: any = {};

        if (requestParameters.isMultipart !== undefined) {
            queryParameters['is_multipart'] = requestParameters.isMultipart;
        }

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
            path: `/api/v1/storages/buckets/{bucket_id}/object-manager/remove`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteStorageFileRequestToJSON(requestParameters.deleteStorageFileRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить файл или директорию с вложениями, отправьте DELETE-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/remove`.
     * Удаление файла/директории в хранилище
     */
    async deleteStorageFile(requestParameters: DeleteStorageFileOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteStorageFileRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить поддомены хранилища, отправьте DELETE-запрос на `/api/v1/storages/buckets/{bucket_id}/subdomains`.
     * Удаление поддоменов хранилища
     */
    async deleteStorageSubdomainsRaw(requestParameters: DeleteStorageSubdomainsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddStorageSubdomains200Response>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling deleteStorageSubdomains.');
        }

        if (requestParameters.addStorageSubdomainsRequest === null || requestParameters.addStorageSubdomainsRequest === undefined) {
            throw new runtime.RequiredError('addStorageSubdomainsRequest','Required parameter requestParameters.addStorageSubdomainsRequest was null or undefined when calling deleteStorageSubdomains.');
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
            path: `/api/v1/storages/buckets/{bucket_id}/subdomains`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: AddStorageSubdomainsRequestToJSON(requestParameters.addStorageSubdomainsRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddStorageSubdomains200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить поддомены хранилища, отправьте DELETE-запрос на `/api/v1/storages/buckets/{bucket_id}/subdomains`.
     * Удаление поддоменов хранилища
     */
    async deleteStorageSubdomains(requestParameters: DeleteStorageSubdomainsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddStorageSubdomains200Response> {
        const response = await this.deleteStorageSubdomainsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список файлов в хранилище по префиксу, отправьте GET-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/list`.
     * Получение списка файлов в хранилище по префиксу
     */
    async getStorageFilesListRaw(requestParameters: GetStorageFilesListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetStorageFilesList200Response>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling getStorageFilesList.');
        }

        const queryParameters: any = {};

        if (requestParameters.prefix !== undefined) {
            queryParameters['prefix'] = requestParameters.prefix;
        }

        if (requestParameters.isMultipart !== undefined) {
            queryParameters['is_multipart'] = requestParameters.isMultipart;
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
            path: `/api/v1/storages/buckets/{bucket_id}/object-manager/list`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetStorageFilesList200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список файлов в хранилище по префиксу, отправьте GET-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/list`.
     * Получение списка файлов в хранилище по префиксу
     */
    async getStorageFilesList(requestParameters: GetStorageFilesListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetStorageFilesList200Response> {
        const response = await this.getStorageFilesListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список поддоменов хранилища, отправьте GET-запрос на `/api/v1/storages/buckets/{bucket_id}/subdomains`.
     * Получение списка поддоменов хранилища
     */
    async getStorageSubdomainsRaw(requestParameters: GetStorageSubdomainsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetStorageSubdomains200Response>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling getStorageSubdomains.');
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
            path: `/api/v1/storages/buckets/{bucket_id}/subdomains`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetStorageSubdomains200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список поддоменов хранилища, отправьте GET-запрос на `/api/v1/storages/buckets/{bucket_id}/subdomains`.
     * Получение списка поддоменов хранилища
     */
    async getStorageSubdomains(requestParameters: GetStorageSubdomainsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetStorageSubdomains200Response> {
        const response = await this.getStorageSubdomainsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статус переноса хранилища от стороннего S3 в Timeweb Cloud, отправьте GET-запрос на `/api/v1/storages/buckets/{bucket_id}/transfer-status`.
     * Получение статуса переноса хранилища от стороннего S3 в Timeweb Cloud
     */
    async getStorageTransferStatusRaw(requestParameters: GetStorageTransferStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetStorageTransferStatus200Response>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling getStorageTransferStatus.');
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
            path: `/api/v1/storages/buckets/{bucket_id}/transfer-status`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetStorageTransferStatus200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статус переноса хранилища от стороннего S3 в Timeweb Cloud, отправьте GET-запрос на `/api/v1/storages/buckets/{bucket_id}/transfer-status`.
     * Получение статуса переноса хранилища от стороннего S3 в Timeweb Cloud
     */
    async getStorageTransferStatus(requestParameters: GetStorageTransferStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetStorageTransferStatus200Response> {
        const response = await this.getStorageTransferStatusRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список пользователей хранилищ аккаунта, отправьте GET-запрос на `/api/v1/storages/users`.
     * Получение списка пользователей хранилищ аккаунта
     */
    async getStorageUsersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetStorageUsers200Response>> {
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
            path: `/api/v1/storages/users`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetStorageUsers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список пользователей хранилищ аккаунта, отправьте GET-запрос на `/api/v1/storages/users`.
     * Получение списка пользователей хранилищ аккаунта
     */
    async getStorageUsers(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetStorageUsers200Response> {
        const response = await this.getStorageUsersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список хранилищ аккаунта, отправьте GET-запрос на `/api/v1/storages/buckets`.
     * Получение списка хранилищ аккаунта
     */
    async getStoragesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectStorages200Response>> {
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
            path: `/api/v1/storages/buckets`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectStorages200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список хранилищ аккаунта, отправьте GET-запрос на `/api/v1/storages/buckets`.
     * Получение списка хранилищ аккаунта
     */
    async getStorages(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectStorages200Response> {
        const response = await this.getStoragesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список тарифов для хранилищ, отправьте GET-запрос на `/api/v1/presets/storages`.   Тело ответа будет представлять собой объект JSON с ключом `storages_presets`.
     * Получение списка тарифов для хранилищ
     */
    async getStoragesPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetStoragesPresets200Response>> {
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
            path: `/api/v1/presets/storages`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetStoragesPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список тарифов для хранилищ, отправьте GET-запрос на `/api/v1/presets/storages`.   Тело ответа будет представлять собой объект JSON с ключом `storages_presets`.
     * Получение списка тарифов для хранилищ
     */
    async getStoragesPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetStoragesPresets200Response> {
        const response = await this.getStoragesPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы переименовать файл/директорию в хранилище, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/rename`.
     * Переименование файла/директории в хранилище
     */
    async renameStorageFileRaw(requestParameters: RenameStorageFileOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling renameStorageFile.');
        }

        if (requestParameters.renameStorageFileRequest === null || requestParameters.renameStorageFileRequest === undefined) {
            throw new runtime.RequiredError('renameStorageFileRequest','Required parameter requestParameters.renameStorageFileRequest was null or undefined when calling renameStorageFile.');
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
            path: `/api/v1/storages/buckets/{bucket_id}/object-manager/rename`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RenameStorageFileRequestToJSON(requestParameters.renameStorageFileRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы переименовать файл/директорию в хранилище, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/rename`.
     * Переименование файла/директории в хранилище
     */
    async renameStorageFile(requestParameters: RenameStorageFileOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.renameStorageFileRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы перенести хранилище от стороннего провайдера S3 в Timeweb Cloud, отправьте POST-запрос на `/api/v1/storages/transfer`.
     * Перенос хранилища от стороннего провайдера S3 в Timeweb Cloud
     */
    async transferStorageRaw(requestParameters: TransferStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.transferStorageRequest === null || requestParameters.transferStorageRequest === undefined) {
            throw new runtime.RequiredError('transferStorageRequest','Required parameter requestParameters.transferStorageRequest was null or undefined when calling transferStorage.');
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
            path: `/api/v1/storages/transfer`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TransferStorageRequestToJSON(requestParameters.transferStorageRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы перенести хранилище от стороннего провайдера S3 в Timeweb Cloud, отправьте POST-запрос на `/api/v1/storages/transfer`.
     * Перенос хранилища от стороннего провайдера S3 в Timeweb Cloud
     */
    async transferStorage(requestParameters: TransferStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.transferStorageRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы изменить хранилище, отправьте PATCH-запрос на `/api/v1/storages/buckets/{bucket_id}`.
     * Изменение хранилища на аккаунте
     */
    async updateStorageRaw(requestParameters: UpdateStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateStorage201Response>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling updateStorage.');
        }

        if (requestParameters.updateStorageRequest === null || requestParameters.updateStorageRequest === undefined) {
            throw new runtime.RequiredError('updateStorageRequest','Required parameter requestParameters.updateStorageRequest was null or undefined when calling updateStorage.');
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
            path: `/api/v1/storages/buckets/{bucket_id}`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateStorageRequestToJSON(requestParameters.updateStorageRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateStorage201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить хранилище, отправьте PATCH-запрос на `/api/v1/storages/buckets/{bucket_id}`.
     * Изменение хранилища на аккаунте
     */
    async updateStorage(requestParameters: UpdateStorageOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateStorage201Response> {
        const response = await this.updateStorageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить пароль пользователя-администратора хранилища, отправьте POST-запрос на `/api/v1/storages/users/{user_id}`.
     * Изменение пароля пользователя-администратора хранилища
     */
    async updateStorageUserRaw(requestParameters: UpdateStorageUserOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateStorageUser200Response>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling updateStorageUser.');
        }

        if (requestParameters.updateStorageUserRequest === null || requestParameters.updateStorageUserRequest === undefined) {
            throw new runtime.RequiredError('updateStorageUserRequest','Required parameter requestParameters.updateStorageUserRequest was null or undefined when calling updateStorageUser.');
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
            path: `/api/v1/storages/users/{user_id}`.replace(`{${"user_id"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateStorageUserRequestToJSON(requestParameters.updateStorageUserRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateStorageUser200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить пароль пользователя-администратора хранилища, отправьте POST-запрос на `/api/v1/storages/users/{user_id}`.
     * Изменение пароля пользователя-администратора хранилища
     */
    async updateStorageUser(requestParameters: UpdateStorageUserOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateStorageUser200Response> {
        const response = await this.updateStorageUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы загрузить файлы в хранилище, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/upload`.
     * Загрузка файлов в хранилище
     */
    async uploadFileToStorageRaw(requestParameters: UploadFileToStorageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.bucketId === null || requestParameters.bucketId === undefined) {
            throw new runtime.RequiredError('bucketId','Required parameter requestParameters.bucketId was null or undefined when calling uploadFileToStorage.');
        }

        if (requestParameters.files === null || requestParameters.files === undefined) {
            throw new runtime.RequiredError('files','Required parameter requestParameters.files was null or undefined when calling uploadFileToStorage.');
        }

        const queryParameters: any = {};

        if (requestParameters.path !== undefined) {
            queryParameters['path'] = requestParameters.path;
        }

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
            path: `/api/v1/storages/buckets/{bucket_id}/object-manager/upload`.replace(`{${"bucket_id"}}`, encodeURIComponent(String(requestParameters.bucketId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы загрузить файлы в хранилище, отправьте POST-запрос на `/api/v1/storages/buckets/{bucket_id}/object-manager/upload`.
     * Загрузка файлов в хранилище
     */
    async uploadFileToStorage(requestParameters: UploadFileToStorageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.uploadFileToStorageRaw(requestParameters, initOverrides);
    }

}
