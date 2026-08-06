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
  AddCdnCertificate422Response,
  AddCertificate,
  ClearCache,
  CreateCdnResource201Response,
  CreateHttpResource,
  GetAccountStatus403Response,
  GetCdnCertificateTasks200Response,
  GetCdnCertificates200Response,
  GetCdnOriginNodes200Response,
  GetCdnPresets200Response,
  GetCdnResourceConfiguration200Response,
  GetCdnResourceNodes200Response,
  GetCdnResourceStatistics200Response,
  GetCdnResources200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  IssueCertificate,
  PreloadCache,
  UpdateDatabaseInstance409Response,
  UpdateHttpResource,
} from '../models/index';
import {
    AddCdnCertificate422ResponseFromJSON,
    AddCdnCertificate422ResponseToJSON,
    AddCertificateFromJSON,
    AddCertificateToJSON,
    ClearCacheFromJSON,
    ClearCacheToJSON,
    CreateCdnResource201ResponseFromJSON,
    CreateCdnResource201ResponseToJSON,
    CreateHttpResourceFromJSON,
    CreateHttpResourceToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetCdnCertificateTasks200ResponseFromJSON,
    GetCdnCertificateTasks200ResponseToJSON,
    GetCdnCertificates200ResponseFromJSON,
    GetCdnCertificates200ResponseToJSON,
    GetCdnOriginNodes200ResponseFromJSON,
    GetCdnOriginNodes200ResponseToJSON,
    GetCdnPresets200ResponseFromJSON,
    GetCdnPresets200ResponseToJSON,
    GetCdnResourceConfiguration200ResponseFromJSON,
    GetCdnResourceConfiguration200ResponseToJSON,
    GetCdnResourceNodes200ResponseFromJSON,
    GetCdnResourceNodes200ResponseToJSON,
    GetCdnResourceStatistics200ResponseFromJSON,
    GetCdnResourceStatistics200ResponseToJSON,
    GetCdnResources200ResponseFromJSON,
    GetCdnResources200ResponseToJSON,
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
    IssueCertificateFromJSON,
    IssueCertificateToJSON,
    PreloadCacheFromJSON,
    PreloadCacheToJSON,
    UpdateDatabaseInstance409ResponseFromJSON,
    UpdateDatabaseInstance409ResponseToJSON,
    UpdateHttpResourceFromJSON,
    UpdateHttpResourceToJSON,
} from '../models/index';

export interface AddCdnCertificateRequest {
    addCertificate: AddCertificate;
}

export interface ArchiveCdnCertificateTaskRequest {
    taskId: number;
}

export interface ClearCdnResourceCacheRequest {
    resourceId: number;
    clearCache: ClearCache;
}

export interface CreateCdnResourceRequest {
    createHttpResource: CreateHttpResource;
}

export interface DeleteCdnCertificateRequest {
    certificateId: number;
}

export interface DeleteCdnResourceRequest {
    resourceId: number;
}

export interface GetCdnCertificateTasksRequest {
    resourceId?: number;
}

export interface GetCdnCertificatesRequest {
    resourceId?: number;
}

export interface GetCdnOriginNodesRequest {
    withExtraZones?: boolean;
}

export interface GetCdnResourceRequest {
    resourceId: number;
}

export interface GetCdnResourceConfigurationRequest {
    resourceId: number;
}

export interface GetCdnResourceNodesRequest {
    resourceId: number;
    withExtraZones?: boolean;
    country?: Array<string>;
}

export interface GetCdnResourceStatisticsRequest {
    resourceId: number;
    from?: Date;
    to?: Date;
}

export interface GetCdnResourcesRequest {
    bucketId?: number;
}

export interface IssueCdnCertificateRequest {
    issueCertificate: IssueCertificate;
}

export interface PreloadCdnResourceCacheRequest {
    resourceId: number;
    preloadCache: PreloadCache;
}

export interface ResumeCdnResourceRequest {
    resourceId: number;
}

export interface SuspendCdnResourceRequest {
    resourceId: number;
}

export interface UpdateCdnResourceRequest {
    resourceId: number;
    updateHttpResource: UpdateHttpResource;
}

/**
 * 
 */
export class CDNApi extends runtime.BaseAPI {

    /**
     * Чтобы загрузить собственный SSL-сертификат, отправьте POST-запрос на `/api/v1/cdn/certificates`.  После загрузки сертификат появится в списке `/api/v1/cdn/certificates` — привязать его к ресурсу можно, передав его ID в поле `config.security.certificate_id` PATCH-запроса на `/api/v1/cdn/http-resources/{resource_id}`.  Если сертификат или приватный ключ не проходят проверку — например, истек срок действия или ключ не соответствует сертификату — вернется ошибка `422`.
     * Загрузка собственного сертификата CDN
     */
    async addCdnCertificateRaw(requestParameters: AddCdnCertificateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.addCertificate === null || requestParameters.addCertificate === undefined) {
            throw new runtime.RequiredError('addCertificate','Required parameter requestParameters.addCertificate was null or undefined when calling addCdnCertificate.');
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
            path: `/api/v1/cdn/certificates`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddCertificateToJSON(requestParameters.addCertificate),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы загрузить собственный SSL-сертификат, отправьте POST-запрос на `/api/v1/cdn/certificates`.  После загрузки сертификат появится в списке `/api/v1/cdn/certificates` — привязать его к ресурсу можно, передав его ID в поле `config.security.certificate_id` PATCH-запроса на `/api/v1/cdn/http-resources/{resource_id}`.  Если сертификат или приватный ключ не проходят проверку — например, истек срок действия или ключ не соответствует сертификату — вернется ошибка `422`.
     * Загрузка собственного сертификата CDN
     */
    async addCdnCertificate(requestParameters: AddCdnCertificateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addCdnCertificateRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы убрать из списка задачу на выпуск сертификата, отправьте POST-запрос на `/api/v1/cdn/certificates/tasks/{task_id}/archive`.
     * Архивация задачи на выпуск сертификата
     */
    async archiveCdnCertificateTaskRaw(requestParameters: ArchiveCdnCertificateTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.taskId === null || requestParameters.taskId === undefined) {
            throw new runtime.RequiredError('taskId','Required parameter requestParameters.taskId was null or undefined when calling archiveCdnCertificateTask.');
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
            path: `/api/v1/cdn/certificates/tasks/{task_id}/archive`.replace(`{${"task_id"}}`, encodeURIComponent(String(requestParameters.taskId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы убрать из списка задачу на выпуск сертификата, отправьте POST-запрос на `/api/v1/cdn/certificates/tasks/{task_id}/archive`.
     * Архивация задачи на выпуск сертификата
     */
    async archiveCdnCertificateTask(requestParameters: ArchiveCdnCertificateTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.archiveCdnCertificateTaskRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы очистить кэш на узлах CDN, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/clear-cache`.  При `purge_type` = `full` очищается весь кэш ресурса, при `purge_type` = `partial` — только файлы из списка `paths`.
     * Очистка кэша CDN-ресурса
     */
    async clearCdnResourceCacheRaw(requestParameters: ClearCdnResourceCacheRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling clearCdnResourceCache.');
        }

        if (requestParameters.clearCache === null || requestParameters.clearCache === undefined) {
            throw new runtime.RequiredError('clearCache','Required parameter requestParameters.clearCache was null or undefined when calling clearCdnResourceCache.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}/clear-cache`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ClearCacheToJSON(requestParameters.clearCache),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы очистить кэш на узлах CDN, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/clear-cache`.  При `purge_type` = `full` очищается весь кэш ресурса, при `purge_type` = `partial` — только файлы из списка `paths`.
     * Очистка кэша CDN-ресурса
     */
    async clearCdnResourceCache(requestParameters: ClearCdnResourceCacheRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.clearCdnResourceCacheRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать CDN-ресурс, отправьте POST-запрос на `/api/v1/cdn/http-resources`.  Источник контента задается ровно одним из полей: `storage_id` для S3-хранилища или `server` для произвольного origin-сервера. Если ни одно из них не передано, вернется ошибка `400`.  Сразу после создания ресурсу выдается технический домен `cdn_domain`, а сам ресурс какое-то время находится в статусе `processing`, пока конфигурация применяется на узлах CDN.
     * Создание CDN-ресурса
     */
    async createCdnResourceRaw(requestParameters: CreateCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCdnResource201Response>> {
        if (requestParameters.createHttpResource === null || requestParameters.createHttpResource === undefined) {
            throw new runtime.RequiredError('createHttpResource','Required parameter requestParameters.createHttpResource was null or undefined when calling createCdnResource.');
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
            path: `/api/v1/cdn/http-resources`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateHttpResourceToJSON(requestParameters.createHttpResource),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCdnResource201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать CDN-ресурс, отправьте POST-запрос на `/api/v1/cdn/http-resources`.  Источник контента задается ровно одним из полей: `storage_id` для S3-хранилища или `server` для произвольного origin-сервера. Если ни одно из них не передано, вернется ошибка `400`.  Сразу после создания ресурсу выдается технический домен `cdn_domain`, а сам ресурс какое-то время находится в статусе `processing`, пока конфигурация применяется на узлах CDN.
     * Создание CDN-ресурса
     */
    async createCdnResource(requestParameters: CreateCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCdnResource201Response> {
        const response = await this.createCdnResourceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить SSL-сертификат, отправьте DELETE-запрос на `/api/v1/cdn/certificates/{certificate_id}`.  Если сертификат привязан к CDN-ресурсу, вернется ошибка `409` — сначала отвяжите его, передав `config.security.certificate_id` = `null` в PATCH-запросе на `/api/v1/cdn/http-resources/{resource_id}`.
     * Удаление сертификата CDN
     */
    async deleteCdnCertificateRaw(requestParameters: DeleteCdnCertificateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.certificateId === null || requestParameters.certificateId === undefined) {
            throw new runtime.RequiredError('certificateId','Required parameter requestParameters.certificateId was null or undefined when calling deleteCdnCertificate.');
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
            path: `/api/v1/cdn/certificates/{certificate_id}`.replace(`{${"certificate_id"}}`, encodeURIComponent(String(requestParameters.certificateId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить SSL-сертификат, отправьте DELETE-запрос на `/api/v1/cdn/certificates/{certificate_id}`.  Если сертификат привязан к CDN-ресурсу, вернется ошибка `409` — сначала отвяжите его, передав `config.security.certificate_id` = `null` в PATCH-запросе на `/api/v1/cdn/http-resources/{resource_id}`.
     * Удаление сертификата CDN
     */
    async deleteCdnCertificate(requestParameters: DeleteCdnCertificateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteCdnCertificateRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить CDN-ресурс, отправьте DELETE-запрос на `/api/v1/cdn/http-resources/{resource_id}`. Вместе с ресурсом освобождается его технический домен, а привязанный сертификат отвязывается.
     * Удаление CDN-ресурса
     */
    async deleteCdnResourceRaw(requestParameters: DeleteCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling deleteCdnResource.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить CDN-ресурс, отправьте DELETE-запрос на `/api/v1/cdn/http-resources/{resource_id}`. Вместе с ресурсом освобождается его технический домен, а привязанный сертификат отвязывается.
     * Удаление CDN-ресурса
     */
    async deleteCdnResource(requestParameters: DeleteCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteCdnResourceRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить список задач на выпуск сертификатов Let\'s Encrypt, отправьте GET-запрос на `/api/v1/cdn/certificates/tasks`.
     * Получение списка задач на выпуск сертификатов
     */
    async getCdnCertificateTasksRaw(requestParameters: GetCdnCertificateTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnCertificateTasks200Response>> {
        const queryParameters: any = {};

        if (requestParameters.resourceId !== undefined) {
            queryParameters['resource_id'] = requestParameters.resourceId;
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
            path: `/api/v1/cdn/certificates/tasks`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnCertificateTasks200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список задач на выпуск сертификатов Let\'s Encrypt, отправьте GET-запрос на `/api/v1/cdn/certificates/tasks`.
     * Получение списка задач на выпуск сертификатов
     */
    async getCdnCertificateTasks(requestParameters: GetCdnCertificateTasksRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnCertificateTasks200Response> {
        const response = await this.getCdnCertificateTasksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список SSL-сертификатов, доступных для доменов CDN-ресурсов, отправьте GET-запрос на `/api/v1/cdn/certificates`.
     * Получение списка сертификатов CDN
     */
    async getCdnCertificatesRaw(requestParameters: GetCdnCertificatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnCertificates200Response>> {
        const queryParameters: any = {};

        if (requestParameters.resourceId !== undefined) {
            queryParameters['resource_id'] = requestParameters.resourceId;
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
            path: `/api/v1/cdn/certificates`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnCertificates200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список SSL-сертификатов, доступных для доменов CDN-ресурсов, отправьте GET-запрос на `/api/v1/cdn/certificates`.
     * Получение списка сертификатов CDN
     */
    async getCdnCertificates(requestParameters: GetCdnCertificatesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnCertificates200Response> {
        const response = await this.getCdnCertificatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список IP-адресов и подсетей, с которых узлы CDN обращаются к источнику контента, отправьте GET-запрос на `/api/v1/cdn/nodes/origin`. Этот список удобно использовать, чтобы разрешить доступ к origin-серверу только для узлов CDN.
     * Получение списка подсетей узлов CDN
     */
    async getCdnOriginNodesRaw(requestParameters: GetCdnOriginNodesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnOriginNodes200Response>> {
        const queryParameters: any = {};

        if (requestParameters.withExtraZones !== undefined) {
            queryParameters['with_extra_zones'] = requestParameters.withExtraZones;
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
            path: `/api/v1/cdn/nodes/origin`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnOriginNodes200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список IP-адресов и подсетей, с которых узлы CDN обращаются к источнику контента, отправьте GET-запрос на `/api/v1/cdn/nodes/origin`. Этот список удобно использовать, чтобы разрешить доступ к origin-серверу только для узлов CDN.
     * Получение списка подсетей узлов CDN
     */
    async getCdnOriginNodes(requestParameters: GetCdnOriginNodesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnOriginNodes200Response> {
        const response = await this.getCdnOriginNodesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список доступных тарифов CDN, отправьте GET-запрос на `/api/v1/cdn/presets`. ID тарифа из этого списка указывается в поле `preset_id` при создании и изменении ресурса.
     * Получение списка тарифов CDN
     */
    async getCdnPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnPresets200Response>> {
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
            path: `/api/v1/cdn/presets`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список доступных тарифов CDN, отправьте GET-запрос на `/api/v1/cdn/presets`. ID тарифа из этого списка указывается в поле `preset_id` при создании и изменении ресурса.
     * Получение списка тарифов CDN
     */
    async getCdnPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnPresets200Response> {
        const response = await this.getCdnPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию об отдельном CDN-ресурсе, отправьте GET-запрос на `/api/v1/cdn/http-resources/{resource_id}`.
     * Получение CDN-ресурса
     */
    async getCdnResourceRaw(requestParameters: GetCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCdnResource201Response>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling getCdnResource.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCdnResource201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию об отдельном CDN-ресурсе, отправьте GET-запрос на `/api/v1/cdn/http-resources/{resource_id}`.
     * Получение CDN-ресурса
     */
    async getCdnResource(requestParameters: GetCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCdnResource201Response> {
        const response = await this.getCdnResourceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить текущую конфигурацию CDN-ресурса, отправьте GET-запрос на `/api/v1/cdn/http-resources/{resource_id}/configuration`.  Изменить конфигурацию можно в поле `config` PATCH-запроса на `/api/v1/cdn/http-resources/{resource_id}`.
     * Получение конфигурации CDN-ресурса
     */
    async getCdnResourceConfigurationRaw(requestParameters: GetCdnResourceConfigurationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnResourceConfiguration200Response>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling getCdnResourceConfiguration.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}/configuration`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnResourceConfiguration200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить текущую конфигурацию CDN-ресурса, отправьте GET-запрос на `/api/v1/cdn/http-resources/{resource_id}/configuration`.  Изменить конфигурацию можно в поле `config` PATCH-запроса на `/api/v1/cdn/http-resources/{resource_id}`.
     * Получение конфигурации CDN-ресурса
     */
    async getCdnResourceConfiguration(requestParameters: GetCdnResourceConfigurationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnResourceConfiguration200Response> {
        const response = await this.getCdnResourceConfigurationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список узлов, которые раздают контент доменов ресурса, отправьте GET-запрос на `/api/v1/cdn/nodes/http-resources/{resource_id}`.
     * Получение списка раздающих узлов CDN-ресурса
     */
    async getCdnResourceNodesRaw(requestParameters: GetCdnResourceNodesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnResourceNodes200Response>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling getCdnResourceNodes.');
        }

        const queryParameters: any = {};

        if (requestParameters.withExtraZones !== undefined) {
            queryParameters['with_extra_zones'] = requestParameters.withExtraZones;
        }

        if (requestParameters.country) {
            queryParameters['country'] = requestParameters.country;
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
            path: `/api/v1/cdn/nodes/http-resources/{resource_id}`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnResourceNodes200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список узлов, которые раздают контент доменов ресурса, отправьте GET-запрос на `/api/v1/cdn/nodes/http-resources/{resource_id}`.
     * Получение списка раздающих узлов CDN-ресурса
     */
    async getCdnResourceNodes(requestParameters: GetCdnResourceNodesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnResourceNodes200Response> {
        const response = await this.getCdnResourceNodesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статистику трафика и запросов CDN-ресурса, отправьте GET-запрос на `/api/v1/cdn/http-resources/{resource_id}/statistics`.  Данные возвращаются с разбивкой по часовым интервалам. Если период не указан, вернется статистика за последние 6 часов.
     * Получение статистики CDN-ресурса
     */
    async getCdnResourceStatisticsRaw(requestParameters: GetCdnResourceStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnResourceStatistics200Response>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling getCdnResourceStatistics.');
        }

        const queryParameters: any = {};

        if (requestParameters.from !== undefined) {
            queryParameters['from'] = (requestParameters.from as any).toISOString();
        }

        if (requestParameters.to !== undefined) {
            queryParameters['to'] = (requestParameters.to as any).toISOString();
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
            path: `/api/v1/cdn/http-resources/{resource_id}/statistics`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnResourceStatistics200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статистику трафика и запросов CDN-ресурса, отправьте GET-запрос на `/api/v1/cdn/http-resources/{resource_id}/statistics`.  Данные возвращаются с разбивкой по часовым интервалам. Если период не указан, вернется статистика за последние 6 часов.
     * Получение статистики CDN-ресурса
     */
    async getCdnResourceStatistics(requestParameters: GetCdnResourceStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnResourceStatistics200Response> {
        const response = await this.getCdnResourceStatisticsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список CDN-ресурсов, отправьте GET-запрос на `/api/v1/cdn/http-resources`.
     * Получение списка CDN-ресурсов
     */
    async getCdnResourcesRaw(requestParameters: GetCdnResourcesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCdnResources200Response>> {
        const queryParameters: any = {};

        if (requestParameters.bucketId !== undefined) {
            queryParameters['bucket_id'] = requestParameters.bucketId;
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
            path: `/api/v1/cdn/http-resources`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCdnResources200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список CDN-ресурсов, отправьте GET-запрос на `/api/v1/cdn/http-resources`.
     * Получение списка CDN-ресурсов
     */
    async getCdnResources(requestParameters: GetCdnResourcesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCdnResources200Response> {
        const response = await this.getCdnResourcesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы выпустить бесплатный сертификат Let\'s Encrypt для доменов CDN-ресурса, отправьте POST-запрос на `/api/v1/cdn/certificates/issue`.  Выпуск выполняется асинхронно: в ответ возвращается код `202`, а следить за ходом выпуска можно по списку задач `/api/v1/cdn/certificates/tasks`. Готовый сертификат привязывается к ресурсу автоматически.  Перед выпуском убедитесь, что домены ресурса указывают на его технический домен `cdn_domain` — иначе вернется ошибка `422`.
     * Выпуск сертификата Let\'s Encrypt для CDN-ресурса
     */
    async issueCdnCertificateRaw(requestParameters: IssueCdnCertificateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.issueCertificate === null || requestParameters.issueCertificate === undefined) {
            throw new runtime.RequiredError('issueCertificate','Required parameter requestParameters.issueCertificate was null or undefined when calling issueCdnCertificate.');
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
            path: `/api/v1/cdn/certificates/issue`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssueCertificateToJSON(requestParameters.issueCertificate),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы выпустить бесплатный сертификат Let\'s Encrypt для доменов CDN-ресурса, отправьте POST-запрос на `/api/v1/cdn/certificates/issue`.  Выпуск выполняется асинхронно: в ответ возвращается код `202`, а следить за ходом выпуска можно по списку задач `/api/v1/cdn/certificates/tasks`. Готовый сертификат привязывается к ресурсу автоматически.  Перед выпуском убедитесь, что домены ресурса указывают на его технический домен `cdn_domain` — иначе вернется ошибка `422`.
     * Выпуск сертификата Let\'s Encrypt для CDN-ресурса
     */
    async issueCdnCertificate(requestParameters: IssueCdnCertificateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.issueCdnCertificateRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы заранее загрузить файлы в кэш узлов CDN, не дожидаясь первого обращения пользователей, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/preload-cache`.
     * Предварительная загрузка кэша CDN-ресурса
     */
    async preloadCdnResourceCacheRaw(requestParameters: PreloadCdnResourceCacheRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling preloadCdnResourceCache.');
        }

        if (requestParameters.preloadCache === null || requestParameters.preloadCache === undefined) {
            throw new runtime.RequiredError('preloadCache','Required parameter requestParameters.preloadCache was null or undefined when calling preloadCdnResourceCache.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}/preload-cache`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PreloadCacheToJSON(requestParameters.preloadCache),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы заранее загрузить файлы в кэш узлов CDN, не дожидаясь первого обращения пользователей, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/preload-cache`.
     * Предварительная загрузка кэша CDN-ресурса
     */
    async preloadCdnResourceCache(requestParameters: PreloadCdnResourceCacheRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.preloadCdnResourceCacheRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы возобновить раздачу контента после приостановки, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/resume`.  Если ресурс заблокирован, вернется ошибка `409`.
     * Возобновление раздачи CDN-ресурса
     */
    async resumeCdnResourceRaw(requestParameters: ResumeCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCdnResource201Response>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling resumeCdnResource.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}/resume`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCdnResource201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы возобновить раздачу контента после приостановки, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/resume`.  Если ресурс заблокирован, вернется ошибка `409`.
     * Возобновление раздачи CDN-ресурса
     */
    async resumeCdnResource(requestParameters: ResumeCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCdnResource201Response> {
        const response = await this.resumeCdnResourceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы приостановить раздачу контента, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/suspend`. Ресурс перейдет в статус `stopped`, его настройки и домены сохранятся.  Если ресурс заблокирован, вернется ошибка `409`.
     * Приостановка раздачи CDN-ресурса
     */
    async suspendCdnResourceRaw(requestParameters: SuspendCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCdnResource201Response>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling suspendCdnResource.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}/suspend`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCdnResource201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы приостановить раздачу контента, отправьте POST-запрос на `/api/v1/cdn/http-resources/{resource_id}/suspend`. Ресурс перейдет в статус `stopped`, его настройки и домены сохранятся.  Если ресурс заблокирован, вернется ошибка `409`.
     * Приостановка раздачи CDN-ресурса
     */
    async suspendCdnResource(requestParameters: SuspendCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCdnResource201Response> {
        const response = await this.suspendCdnResourceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить CDN-ресурс, отправьте PATCH-запрос на `/api/v1/cdn/http-resources/{resource_id}`.  Передавайте только те поля, которые нужно изменить: переданные значения накладываются на текущую конфигурацию, а непереданные остаются без изменений. Чтобы сбросить настройку, передайте в соответствующем поле `null`.  Поля `storage_id` и `config.origin.servers` нельзя передавать вместе — источник контента может быть только один.
     * Изменение CDN-ресурса
     */
    async updateCdnResourceRaw(requestParameters: UpdateCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCdnResource201Response>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling updateCdnResource.');
        }

        if (requestParameters.updateHttpResource === null || requestParameters.updateHttpResource === undefined) {
            throw new runtime.RequiredError('updateHttpResource','Required parameter requestParameters.updateHttpResource was null or undefined when calling updateCdnResource.');
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
            path: `/api/v1/cdn/http-resources/{resource_id}`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateHttpResourceToJSON(requestParameters.updateHttpResource),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCdnResource201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить CDN-ресурс, отправьте PATCH-запрос на `/api/v1/cdn/http-resources/{resource_id}`.  Передавайте только те поля, которые нужно изменить: переданные значения накладываются на текущую конфигурацию, а непереданные остаются без изменений. Чтобы сбросить настройку, передайте в соответствующем поле `null`.  Поля `storage_id` и `config.origin.servers` нельзя передавать вместе — источник контента может быть только один.
     * Изменение CDN-ресурса
     */
    async updateCdnResource(requestParameters: UpdateCdnResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCdnResource201Response> {
        const response = await this.updateCdnResourceRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
