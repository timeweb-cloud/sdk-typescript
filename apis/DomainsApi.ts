/* tslint:disable */
/* eslint-disable */
/**
 * Timeweb Cloud API
 * # Введение API Timeweb Cloud позволяет вам управлять ресурсами в облаке программным способом с использованием обычных HTTP-запросов.  Множество функций, которые доступны в панели управления Timeweb Cloud, также доступны через API, что позволяет вам автоматизировать ваши собственные сценарии.  В этой документации сперва будет описан общий дизайн и принципы работы API, а после этого конкретные конечные точки. Также будут приведены примеры запросов к ним.   ## Запросы Запросы должны выполняться по протоколу `HTTPS`, чтобы гарантировать шифрование транзакций. Поддерживаются следующие методы запроса: |Метод|Применение| |--- |--- | |GET|Извлекает данные о коллекциях и отдельных ресурсах.| |POST|Для коллекций создает новый ресурс этого типа. Также используется для выполнения действий с конкретным ресурсом.| |PUT|Обновляет существующий ресурс.| |PATCH|Некоторые ресурсы поддерживают частичное обновление, то есть обновление только части атрибутов ресурса, в этом случае вместо метода PUT будет использован PATCH.| |DELETE|Удаляет ресурс.|  Методы `POST`, `PUT` и `PATCH` могут включать объект в тело запроса с типом содержимого `application/json`.  ### Параметры в запросах Некоторые коллекции поддерживают пагинацию, поиск или сортировку в запросах. В параметрах запроса требуется передать: - `limit` — обозначает количество записей, которое необходимо вернуть  - `offset` — указывает на смещение, относительно начала списка  - `search` — позволяет указать набор символов для поиска  - `sort` — можно задать правило сортировки коллекции  ## Ответы Запросы вернут один из следующих кодов состояния ответа HTTP:  |Статус|Описание| |--- |--- | |200 OK|Действие с ресурсом было выполнено успешно.| |201 Created|Ресурс был успешно создан. При этом ресурс может быть как уже готовым к использованию, так и находиться в процессе запуска.| |204 No Content|Действие с ресурсом было выполнено успешно, и ответ не содержит дополнительной информации в теле.| |400 Bad Request|Был отправлен неверный запрос, например, в нем отсутствуют обязательные параметры и т. д. Тело ответа будет содержать дополнительную информацию об ошибке.| |401 Unauthorized|Ошибка аутентификации.| |403 Forbidden|Аутентификация прошла успешно, но недостаточно прав для выполнения действия.| |404 Not Found|Запрашиваемый ресурс не найден.| |409 Conflict|Запрос конфликтует с текущим состоянием.| |423 Locked|Ресурс из запроса заблокирован от применения к нему указанного метода.| |429 Too Many Requests|Был достигнут лимит по количеству запросов в единицу времени.| |500 Internal Server Error|При выполнении запроса произошла какая-то внутренняя ошибка. Чтобы решить эту проблему, лучше всего создать тикет в панели управления.|  ### Структура успешного ответа Все конечные точки будут возвращать данные в формате `JSON`. Ответы на `GET`-запросы будут иметь на верхнем уровне следующую структуру атрибутов:  |Название поля|Тип|Описание| |--- |--- |--- | |[entity_name]|object, object[], string[], number[], boolean|Динамическое поле, которое будет меняться в зависимости от запрашиваемого ресурса и будет содержать все атрибуты, необходимые для описания этого ресурса. Например, при запросе списка баз данных будет возвращаться поле `dbs`, а при запросе конкретного облачного сервера `server`. Для некоторых конечных точек в ответе может возвращаться сразу несколько ресурсов.| |meta|object|Опционально. Объект, который содержит вспомогательную информацию о ресурсе. Чаще всего будет встречаться при запросе коллекций и содержать поле `total`, которое будет указывать на количество элементов в коллекции.| |response_id|string|Опционально. В большинстве случаев в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее. Также вы можете использовать этот идентификатор, чтобы убедиться, что это новый ответ на запрос и результат не был получен из кэша.|  Пример запроса на получение списка SSH-ключей: ```     HTTP/2.0 200 OK     {       \"ssh_keys\":[           {             \"body\":\"ssh-rsa AAAAB3NzaC1sdfghjkOAsBwWhs= example@device.local\",             \"created_at\":\"2021-09-15T19:52:27Z\",             \"expired_at\":null,             \"id\":5297,             \"is_default\":false,             \"name\":\"example@device.local\",             \"used_at\":null,             \"used_by\":[]           }       ],       \"meta\":{           \"total\":1       },       \"response_id\":\"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ### Структура ответа с ошибкой |Название поля|Тип|Описание| |--- |--- |--- | |status_code|number|Короткий числовой идентификатор ошибки.| |error_code|string|Короткий текстовый идентификатор ошибки, который уточняет числовой идентификатор и удобен для программной обработки. Самый простой пример — это код `not_found` для ошибки 404.| |message|string, string[]|Опционально. В большинстве случаев в ответе будет содержаться человекочитаемое подробное описание ошибки или ошибок, которые помогут понять, что нужно исправить.| |response_id|string|Опционально. В большинстве случае в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее.|  Пример: ```     HTTP/2.0 403 Forbidden     {       \"status_code\": 403,       \"error_code\":  \"forbidden\",       \"message\":     \"You do not have access for the attempted action\",       \"response_id\": \"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ## Статусы ресурсов Важно учесть, что при создании большинства ресурсов внутри платформы вам будет сразу возвращен ответ от сервера со статусом `200 OK` или `201 Created` и идентификатором созданного ресурса в теле ответа, но при этом этот ресурс может быть ещё в *состоянии запуска*.  Для того чтобы понять, в каком состоянии сейчас находится ваш ресурс, мы добавили поле `status` в ответ на получение информации о ресурсе.  Список статусов будет отличаться в зависимости от типа ресурса. Увидеть поддерживаемый список статусов вы сможете в описании каждого конкретного ресурса.     ## Ограничение скорости запросов (Rate Limiting) Чтобы обеспечить стабильность для всех пользователей, Timeweb Cloud защищает API от всплесков входящего трафика, анализируя количество запросов c каждого аккаунта к каждой конечной точке.  Если ваше приложение отправляет более 20 запросов в секунду на одну конечную точку, то для этого запроса API может вернуть код состояния HTTP `429 Too Many Requests`.   ## Аутентификация Доступ к API осуществляется с помощью JWT-токена. Токенами можно управлять внутри панели управления Timeweb Cloud в разделе *API и Terraform*.  Токен необходимо передавать в заголовке каждого запроса в формате: ```   Authorization: Bearer $TIMEWEB_CLOUD_TOKEN ```  ## Формат примеров API Примеры в этой документации описаны с помощью `curl`, HTTP-клиента командной строки. На компьютерах `Linux` и `macOS` обычно по умолчанию установлен `curl`, и он доступен для загрузки на всех популярных платформах, включая `Windows`.  Каждый пример разделен на несколько строк символом `\\`, который совместим с `bash`. Типичный пример выглядит так: ```   curl -X PATCH      -H \"Content-Type: application/json\"      -H \"Authorization: Bearer $TIMEWEB_CLOUD_TOKEN\"      -d \'{\"name\":\"Cute Corvus\",\"comment\":\"Development Server\"}\'      \"https://api.timeweb.cloud/api/v1/dedicated/1051\" ``` - Параметр `-X` задает метод запроса. Для согласованности метод будет указан во всех примерах, даже если он явно не требуется для методов `GET`. - Строки `-H` задают требуемые HTTP-заголовки. - Примеры, для которых требуется объект JSON в теле запроса, передают требуемые данные через параметр `-d`.  Чтобы использовать приведенные примеры, не подставляя каждый раз в них свой токен, вы можете добавить токен один раз в переменные окружения в вашей консоли. Например, на `Linux` это можно сделать с помощью команды:  ``` TIMEWEB_CLOUD_TOKEN=\"token\" ```  После этого токен будет автоматически подставляться в ваши запросы.  Обратите внимание, что все значения в этой документации являются примерами. Не полагайтесь на идентификаторы операционных систем, тарифов и т.д., используемые в примерах. Используйте соответствующую конечную точку для получения значений перед созданием ресурсов.   ## Версионирование API построено согласно принципам [семантического версионирования](https://semver.org/lang/ru). Это значит, что мы гарантируем обратную совместимость всех изменений в пределах одной мажорной версии.  Мажорная версия каждой конечной точки обозначается в пути запроса, например, запрос `/api/v1/servers` указывает, что этот метод имеет версию 1.
 *
 * The version of the OpenAPI document: 
 * Contact: info@timeweb.cloud
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  AddSubdomain201Response,
  CheckDomain200Response,
  CreateDatabaseBackup409Response,
  CreateDns,
  CreateDomainDNSRecord201Response,
  CreateDomainRequest201Response,
  CreateDomainRequestRequest,
  GetDomain200Response,
  GetDomainDNSRecords200Response,
  GetDomainNameServers200Response,
  GetDomainRequests200Response,
  GetDomains200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances404Response,
  GetFinances429Response,
  GetFinances500Response,
  GetTLD200Response,
  GetTLDs200Response,
  UpdateDomain,
  UpdateDomainAutoProlongation200Response,
  UpdateDomainNameServers,
  UpdateDomainRequestRequest,
} from '../models/index';
import {
    AddSubdomain201ResponseFromJSON,
    AddSubdomain201ResponseToJSON,
    CheckDomain200ResponseFromJSON,
    CheckDomain200ResponseToJSON,
    CreateDatabaseBackup409ResponseFromJSON,
    CreateDatabaseBackup409ResponseToJSON,
    CreateDnsFromJSON,
    CreateDnsToJSON,
    CreateDomainDNSRecord201ResponseFromJSON,
    CreateDomainDNSRecord201ResponseToJSON,
    CreateDomainRequest201ResponseFromJSON,
    CreateDomainRequest201ResponseToJSON,
    CreateDomainRequestRequestFromJSON,
    CreateDomainRequestRequestToJSON,
    GetDomain200ResponseFromJSON,
    GetDomain200ResponseToJSON,
    GetDomainDNSRecords200ResponseFromJSON,
    GetDomainDNSRecords200ResponseToJSON,
    GetDomainNameServers200ResponseFromJSON,
    GetDomainNameServers200ResponseToJSON,
    GetDomainRequests200ResponseFromJSON,
    GetDomainRequests200ResponseToJSON,
    GetDomains200ResponseFromJSON,
    GetDomains200ResponseToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances404ResponseFromJSON,
    GetFinances404ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    GetTLD200ResponseFromJSON,
    GetTLD200ResponseToJSON,
    GetTLDs200ResponseFromJSON,
    GetTLDs200ResponseToJSON,
    UpdateDomainFromJSON,
    UpdateDomainToJSON,
    UpdateDomainAutoProlongation200ResponseFromJSON,
    UpdateDomainAutoProlongation200ResponseToJSON,
    UpdateDomainNameServersFromJSON,
    UpdateDomainNameServersToJSON,
    UpdateDomainRequestRequestFromJSON,
    UpdateDomainRequestRequestToJSON,
} from '../models/index';

export interface AddDomainRequest {
    fqdn: string;
}

export interface AddSubdomainRequest {
    fqdn: string;
    subdomainFqdn: string;
}

export interface CheckDomainRequest {
    fqdn: string;
}

export interface CreateDomainDNSRecordRequest {
    fqdn: string;
    createDns: CreateDns;
}

export interface CreateDomainRequestOperationRequest {
    createDomainRequestRequest: CreateDomainRequestRequest;
}

export interface DeleteDomainRequest {
    fqdn: string;
}

export interface DeleteDomainDNSRecordRequest {
    fqdn: string;
    recordId: number;
}

export interface DeleteSubdomainRequest {
    fqdn: string;
    subdomainFqdn: string;
}

export interface GetDomainRequest {
    fqdn: string;
}

export interface GetDomainDNSRecordsRequest {
    fqdn: string;
    limit?: number;
    offset?: number;
}

export interface GetDomainDefaultDNSRecordsRequest {
    fqdn: string;
    limit?: number;
    offset?: number;
}

export interface GetDomainNameServersRequest {
    fqdn: string;
}

export interface GetDomainRequestRequest {
    requestId: number;
}

export interface GetDomainRequestsRequest {
    personId?: number;
}

export interface GetDomainsRequest {
    limit?: number;
    offset?: number;
    idnName?: string;
    linkedIp?: string;
    order?: GetDomainsOrderEnum;
    sort?: GetDomainsSortEnum;
}

export interface GetTLDRequest {
    tldId: number;
}

export interface GetTLDsRequest {
    isPublished?: boolean;
    isRegistered?: boolean;
}

export interface UpdateDomainAutoProlongationRequest {
    fqdn: string;
    updateDomain: UpdateDomain;
}

export interface UpdateDomainDNSRecordRequest {
    fqdn: string;
    recordId: number;
    createDns: CreateDns;
}

export interface UpdateDomainNameServersRequest {
    fqdn: string;
    updateDomainNameServers: UpdateDomainNameServers;
}

export interface UpdateDomainRequestOperationRequest {
    requestId: number;
    updateDomainRequestRequest: UpdateDomainRequestRequest;
}

/**
 * 
 */
export class DomainsApi extends runtime.BaseAPI {

    /**
     * Чтобы добавить домен на свой аккаунт, отправьте запрос POST на `/api/v1/add-domain/{fqdn}`.
     * Добавление домена на аккаунт
     */
    async addDomainRaw(requestParameters: AddDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling addDomain.');
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
            path: `/api/v1/add-domain/{fqdn}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы добавить домен на свой аккаунт, отправьте запрос POST на `/api/v1/add-domain/{fqdn}`.
     * Добавление домена на аккаунт
     */
    async addDomain(requestParameters: AddDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addDomainRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы добавить поддомен, отправьте запрос POST на `/api/v1/domains/{fqdn}/subdomains/{subdomain_fqdn}`, задав необходимые атрибуты.  Поддомен будет добавлен с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о добавленном поддомене.
     * Добавление поддомена
     */
    async addSubdomainRaw(requestParameters: AddSubdomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddSubdomain201Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling addSubdomain.');
        }

        if (requestParameters.subdomainFqdn === null || requestParameters.subdomainFqdn === undefined) {
            throw new runtime.RequiredError('subdomainFqdn','Required parameter requestParameters.subdomainFqdn was null or undefined when calling addSubdomain.');
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
            path: `/api/v1/domains/{fqdn}/subdomains/{subdomain_fqdn}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))).replace(`{${"subdomain_fqdn"}}`, encodeURIComponent(String(requestParameters.subdomainFqdn))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddSubdomain201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить поддомен, отправьте запрос POST на `/api/v1/domains/{fqdn}/subdomains/{subdomain_fqdn}`, задав необходимые атрибуты.  Поддомен будет добавлен с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о добавленном поддомене.
     * Добавление поддомена
     */
    async addSubdomain(requestParameters: AddSubdomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddSubdomain201Response> {
        const response = await this.addSubdomainRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы проверить, доступен ли домен для регистрации, отправьте запрос GET на `/api/v1/check-domain/{fqdn}`.
     * Проверить, доступен ли домен для регистрации
     */
    async checkDomainRaw(requestParameters: CheckDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CheckDomain200Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling checkDomain.');
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
            path: `/api/v1/check-domain/{fqdn}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CheckDomain200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы проверить, доступен ли домен для регистрации, отправьте запрос GET на `/api/v1/check-domain/{fqdn}`.
     * Проверить, доступен ли домен для регистрации
     */
    async checkDomain(requestParameters: CheckDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CheckDomain200Response> {
        const response = await this.checkDomainRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить информацию о DNS-записи для домена или поддомена, отправьте запрос POST на `/api/v1/domains/{fqdn}/dns-records`, задав необходимые атрибуты.  DNS-запись будет добавлена с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о добавленной DNS-записи.
     * Добавить информацию о DNS-записи для домена или поддомена
     */
    async createDomainDNSRecordRaw(requestParameters: CreateDomainDNSRecordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDomainDNSRecord201Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling createDomainDNSRecord.');
        }

        if (requestParameters.createDns === null || requestParameters.createDns === undefined) {
            throw new runtime.RequiredError('createDns','Required parameter requestParameters.createDns was null or undefined when calling createDomainDNSRecord.');
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
            path: `/api/v1/domains/{fqdn}/dns-records`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateDnsToJSON(requestParameters.createDns),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDomainDNSRecord201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить информацию о DNS-записи для домена или поддомена, отправьте запрос POST на `/api/v1/domains/{fqdn}/dns-records`, задав необходимые атрибуты.  DNS-запись будет добавлена с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о добавленной DNS-записи.
     * Добавить информацию о DNS-записи для домена или поддомена
     */
    async createDomainDNSRecord(requestParameters: CreateDomainDNSRecordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDomainDNSRecord201Response> {
        const response = await this.createDomainDNSRecordRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать заявку на регистрацию/продление/трансфер домена, отправьте POST-запрос в `api/v1/domains-requests`, задав необходимые атрибуты.  Заявка будет создана с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданной заявке.
     * Создание заявки на регистрацию/продление/трансфер домена
     */
    async createDomainRequestRaw(requestParameters: CreateDomainRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDomainRequest201Response>> {
        if (requestParameters.createDomainRequestRequest === null || requestParameters.createDomainRequestRequest === undefined) {
            throw new runtime.RequiredError('createDomainRequestRequest','Required parameter requestParameters.createDomainRequestRequest was null or undefined when calling createDomainRequest.');
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
            path: `/api/v1/domains-requests`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateDomainRequestRequestToJSON(requestParameters.createDomainRequestRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDomainRequest201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать заявку на регистрацию/продление/трансфер домена, отправьте POST-запрос в `api/v1/domains-requests`, задав необходимые атрибуты.  Заявка будет создана с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданной заявке.
     * Создание заявки на регистрацию/продление/трансфер домена
     */
    async createDomainRequest(requestParameters: CreateDomainRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDomainRequest201Response> {
        const response = await this.createDomainRequestRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить домен, отправьте запрос DELETE на `/api/v1/domains/{fqdn}`.
     * Удаление домена
     */
    async deleteDomainRaw(requestParameters: DeleteDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling deleteDomain.');
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
            path: `/api/v1/domains/{fqdn}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить домен, отправьте запрос DELETE на `/api/v1/domains/{fqdn}`.
     * Удаление домена
     */
    async deleteDomain(requestParameters: DeleteDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDomainRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить информацию о DNS-записи для домена или поддомена, отправьте запрос DELETE на `/api/v1/domains/{fqdn}/dns-records/{record_id}`.
     * Удалить информацию о DNS-записи для домена или поддомена
     */
    async deleteDomainDNSRecordRaw(requestParameters: DeleteDomainDNSRecordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling deleteDomainDNSRecord.');
        }

        if (requestParameters.recordId === null || requestParameters.recordId === undefined) {
            throw new runtime.RequiredError('recordId','Required parameter requestParameters.recordId was null or undefined when calling deleteDomainDNSRecord.');
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
            path: `/api/v1/domains/{fqdn}/dns-records/{record_id}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))).replace(`{${"record_id"}}`, encodeURIComponent(String(requestParameters.recordId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить информацию о DNS-записи для домена или поддомена, отправьте запрос DELETE на `/api/v1/domains/{fqdn}/dns-records/{record_id}`.
     * Удалить информацию о DNS-записи для домена или поддомена
     */
    async deleteDomainDNSRecord(requestParameters: DeleteDomainDNSRecordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDomainDNSRecordRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить поддомен, отправьте запрос DELETE на `/api/v1/domains/{fqdn}/subdomains/{subdomain_fqdn}`.
     * Удаление поддомена
     */
    async deleteSubdomainRaw(requestParameters: DeleteSubdomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling deleteSubdomain.');
        }

        if (requestParameters.subdomainFqdn === null || requestParameters.subdomainFqdn === undefined) {
            throw new runtime.RequiredError('subdomainFqdn','Required parameter requestParameters.subdomainFqdn was null or undefined when calling deleteSubdomain.');
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
            path: `/api/v1/domains/{fqdn}/subdomains/{subdomain_fqdn}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))).replace(`{${"subdomain_fqdn"}}`, encodeURIComponent(String(requestParameters.subdomainFqdn))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить поддомен, отправьте запрос DELETE на `/api/v1/domains/{fqdn}/subdomains/{subdomain_fqdn}`.
     * Удаление поддомена
     */
    async deleteSubdomain(requestParameters: DeleteSubdomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteSubdomainRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отобразить информацию об отдельном домене, отправьте запрос GET на `/api/v1/domains/{fqdn}`.
     * Получение информации о домене
     */
    async getDomainRaw(requestParameters: GetDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDomain200Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling getDomain.');
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
            path: `/api/v1/domains/{fqdn}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDomain200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отобразить информацию об отдельном домене, отправьте запрос GET на `/api/v1/domains/{fqdn}`.
     * Получение информации о домене
     */
    async getDomain(requestParameters: GetDomainRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDomain200Response> {
        const response = await this.getDomainRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию обо всех пользовательских DNS-записях домена или поддомена, отправьте запрос GET на `/api/v1/domains/{fqdn}/dns-records`.
     * Получить информацию обо всех пользовательских DNS-записях домена или поддомена
     */
    async getDomainDNSRecordsRaw(requestParameters: GetDomainDNSRecordsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDomainDNSRecords200Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling getDomainDNSRecords.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
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
            path: `/api/v1/domains/{fqdn}/dns-records`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDomainDNSRecords200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию обо всех пользовательских DNS-записях домена или поддомена, отправьте запрос GET на `/api/v1/domains/{fqdn}/dns-records`.
     * Получить информацию обо всех пользовательских DNS-записях домена или поддомена
     */
    async getDomainDNSRecords(requestParameters: GetDomainDNSRecordsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDomainDNSRecords200Response> {
        const response = await this.getDomainDNSRecordsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию обо всех DNS-записях по умолчанию домена или поддомена, отправьте запрос GET на `/api/v1/domains/{fqdn}/default-dns-records`.
     * Получить информацию обо всех DNS-записях по умолчанию домена или поддомена
     */
    async getDomainDefaultDNSRecordsRaw(requestParameters: GetDomainDefaultDNSRecordsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDomainDNSRecords200Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling getDomainDefaultDNSRecords.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
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
            path: `/api/v1/domains/{fqdn}/default-dns-records`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDomainDNSRecords200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию обо всех DNS-записях по умолчанию домена или поддомена, отправьте запрос GET на `/api/v1/domains/{fqdn}/default-dns-records`.
     * Получить информацию обо всех DNS-записях по умолчанию домена или поддомена
     */
    async getDomainDefaultDNSRecords(requestParameters: GetDomainDefaultDNSRecordsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDomainDNSRecords200Response> {
        const response = await this.getDomainDefaultDNSRecordsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список name-серверов домена, отправьте запрос GET на `/api/v1/domains/{fqdn}/name-servers`.
     * Получение списка name-серверов домена
     */
    async getDomainNameServersRaw(requestParameters: GetDomainNameServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDomainNameServers200Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling getDomainNameServers.');
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
            path: `/api/v1/domains/{fqdn}/name-servers`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDomainNameServers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список name-серверов домена, отправьте запрос GET на `/api/v1/domains/{fqdn}/name-servers`.
     * Получение списка name-серверов домена
     */
    async getDomainNameServers(requestParameters: GetDomainNameServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDomainNameServers200Response> {
        const response = await this.getDomainNameServersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить заявку на регистрацию/продление/трансфер домена, отправьте запрос GET на `/api/v1/domains-requests/{request_id}`.
     * Получение заявки на регистрацию/продление/трансфер домена
     */
    async getDomainRequestRaw(requestParameters: GetDomainRequestRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDomainRequest201Response>> {
        if (requestParameters.requestId === null || requestParameters.requestId === undefined) {
            throw new runtime.RequiredError('requestId','Required parameter requestParameters.requestId was null or undefined when calling getDomainRequest.');
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
            path: `/api/v1/domains-requests/{request_id}`.replace(`{${"request_id"}}`, encodeURIComponent(String(requestParameters.requestId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDomainRequest201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить заявку на регистрацию/продление/трансфер домена, отправьте запрос GET на `/api/v1/domains-requests/{request_id}`.
     * Получение заявки на регистрацию/продление/трансфер домена
     */
    async getDomainRequest(requestParameters: GetDomainRequestRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDomainRequest201Response> {
        const response = await this.getDomainRequestRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список заявок на регистрацию/продление/трансфер домена, отправьте запрос GET на `/api/v1/domains-requests`.
     * Получение списка заявок на регистрацию/продление/трансфер домена
     */
    async getDomainRequestsRaw(requestParameters: GetDomainRequestsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDomainRequests200Response>> {
        const queryParameters: any = {};

        if (requestParameters.personId !== undefined) {
            queryParameters['person_id'] = requestParameters.personId;
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
            path: `/api/v1/domains-requests`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDomainRequests200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список заявок на регистрацию/продление/трансфер домена, отправьте запрос GET на `/api/v1/domains-requests`.
     * Получение списка заявок на регистрацию/продление/трансфер домена
     */
    async getDomainRequests(requestParameters: GetDomainRequestsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDomainRequests200Response> {
        const response = await this.getDomainRequestsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех доменов на вашем аккаунте, отправьте GET-запрос на `/api/v1/domains`.   Тело ответа будет представлять собой объект JSON с ключом `domains`.
     * Получение списка всех доменов
     */
    async getDomainsRaw(requestParameters: GetDomainsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDomains200Response>> {
        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.idnName !== undefined) {
            queryParameters['idn_name'] = requestParameters.idnName;
        }

        if (requestParameters.linkedIp !== undefined) {
            queryParameters['linked_ip'] = requestParameters.linkedIp;
        }

        if (requestParameters.order !== undefined) {
            queryParameters['order'] = requestParameters.order;
        }

        if (requestParameters.sort !== undefined) {
            queryParameters['sort'] = requestParameters.sort;
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
            path: `/api/v1/domains`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDomains200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех доменов на вашем аккаунте, отправьте GET-запрос на `/api/v1/domains`.   Тело ответа будет представлять собой объект JSON с ключом `domains`.
     * Получение списка всех доменов
     */
    async getDomains(requestParameters: GetDomainsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDomains200Response> {
        const response = await this.getDomainsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о доменной зоне по идентификатору, отправьте запрос GET на `/api/v1/tlds/{tld_id}`.
     * Получить информацию о доменной зоне по идентификатору
     */
    async getTLDRaw(requestParameters: GetTLDRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetTLD200Response>> {
        if (requestParameters.tldId === null || requestParameters.tldId === undefined) {
            throw new runtime.RequiredError('tldId','Required parameter requestParameters.tldId was null or undefined when calling getTLD.');
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
            path: `/api/v1/tlds/{tld_id}`.replace(`{${"tld_id"}}`, encodeURIComponent(String(requestParameters.tldId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetTLD200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о доменной зоне по идентификатору, отправьте запрос GET на `/api/v1/tlds/{tld_id}`.
     * Получить информацию о доменной зоне по идентификатору
     */
    async getTLD(requestParameters: GetTLDRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetTLD200Response> {
        const response = await this.getTLDRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о доменных зонах, отправьте запрос GET на `/api/v1/tlds`.
     * Получить информацию о доменных зонах
     */
    async getTLDsRaw(requestParameters: GetTLDsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetTLDs200Response>> {
        const queryParameters: any = {};

        if (requestParameters.isPublished !== undefined) {
            queryParameters['is_published'] = requestParameters.isPublished;
        }

        if (requestParameters.isRegistered !== undefined) {
            queryParameters['is_registered'] = requestParameters.isRegistered;
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
            path: `/api/v1/tlds`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetTLDs200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о доменных зонах, отправьте запрос GET на `/api/v1/tlds`.
     * Получить информацию о доменных зонах
     */
    async getTLDs(requestParameters: GetTLDsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetTLDs200Response> {
        const response = await this.getTLDsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы включить/выключить автопродление домена, отправьте запрос PATCH на `/api/v1/domains/{fqdn}`, передав в теле запроса параметр `is_autoprolong_enabled`
     * Включение/выключение автопродления домена
     */
    async updateDomainAutoProlongationRaw(requestParameters: UpdateDomainAutoProlongationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateDomainAutoProlongation200Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling updateDomainAutoProlongation.');
        }

        if (requestParameters.updateDomain === null || requestParameters.updateDomain === undefined) {
            throw new runtime.RequiredError('updateDomain','Required parameter requestParameters.updateDomain was null or undefined when calling updateDomainAutoProlongation.');
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
            path: `/api/v1/domains/{fqdn}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateDomainToJSON(requestParameters.updateDomain),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateDomainAutoProlongation200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы включить/выключить автопродление домена, отправьте запрос PATCH на `/api/v1/domains/{fqdn}`, передав в теле запроса параметр `is_autoprolong_enabled`
     * Включение/выключение автопродления домена
     */
    async updateDomainAutoProlongation(requestParameters: UpdateDomainAutoProlongationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateDomainAutoProlongation200Response> {
        const response = await this.updateDomainAutoProlongationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы обновить информацию о DNS-записи для домена или поддомена, отправьте запрос PATCH на `/api/v1/domains/{fqdn}/dns-records/{record_id}`, задав необходимые атрибуты.  DNS-запись будет обновлена с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией об добавленной DNS-записи.
     * Обновить информацию о DNS-записи домена или поддомена
     */
    async updateDomainDNSRecordRaw(requestParameters: UpdateDomainDNSRecordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDomainDNSRecord201Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling updateDomainDNSRecord.');
        }

        if (requestParameters.recordId === null || requestParameters.recordId === undefined) {
            throw new runtime.RequiredError('recordId','Required parameter requestParameters.recordId was null or undefined when calling updateDomainDNSRecord.');
        }

        if (requestParameters.createDns === null || requestParameters.createDns === undefined) {
            throw new runtime.RequiredError('createDns','Required parameter requestParameters.createDns was null or undefined when calling updateDomainDNSRecord.');
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
            path: `/api/v1/domains/{fqdn}/dns-records/{record_id}`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))).replace(`{${"record_id"}}`, encodeURIComponent(String(requestParameters.recordId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: CreateDnsToJSON(requestParameters.createDns),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDomainDNSRecord201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить информацию о DNS-записи для домена или поддомена, отправьте запрос PATCH на `/api/v1/domains/{fqdn}/dns-records/{record_id}`, задав необходимые атрибуты.  DNS-запись будет обновлена с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией об добавленной DNS-записи.
     * Обновить информацию о DNS-записи домена или поддомена
     */
    async updateDomainDNSRecord(requestParameters: UpdateDomainDNSRecordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDomainDNSRecord201Response> {
        const response = await this.updateDomainDNSRecordRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить name-серверы домена, отправьте запрос PUT на `/api/v1/domains/{fqdn}/name-servers`, задав необходимые атрибуты.  Name-серверы будут изменены с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о name-серверах домена.
     * Изменение name-серверов домена
     */
    async updateDomainNameServersRaw(requestParameters: UpdateDomainNameServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDomainNameServers200Response>> {
        if (requestParameters.fqdn === null || requestParameters.fqdn === undefined) {
            throw new runtime.RequiredError('fqdn','Required parameter requestParameters.fqdn was null or undefined when calling updateDomainNameServers.');
        }

        if (requestParameters.updateDomainNameServers === null || requestParameters.updateDomainNameServers === undefined) {
            throw new runtime.RequiredError('updateDomainNameServers','Required parameter requestParameters.updateDomainNameServers was null or undefined when calling updateDomainNameServers.');
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
            path: `/api/v1/domains/{fqdn}/name-servers`.replace(`{${"fqdn"}}`, encodeURIComponent(String(requestParameters.fqdn))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateDomainNameServersToJSON(requestParameters.updateDomainNameServers),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDomainNameServers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить name-серверы домена, отправьте запрос PUT на `/api/v1/domains/{fqdn}/name-servers`, задав необходимые атрибуты.  Name-серверы будут изменены с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о name-серверах домена.
     * Изменение name-серверов домена
     */
    async updateDomainNameServers(requestParameters: UpdateDomainNameServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDomainNameServers200Response> {
        const response = await this.updateDomainNameServersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы оплатить/обновить заявку на регистрацию/продление/трансфер домена, отправьте запрос PATCH на `/api/v1/domains-requests/{request_id}`, задав необходимые атрибуты.  Заявка будет обновлена с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о обновленной заявке.
     * Оплата/обновление заявки на регистрацию/продление/трансфер домена
     */
    async updateDomainRequestRaw(requestParameters: UpdateDomainRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDomainRequest201Response>> {
        if (requestParameters.requestId === null || requestParameters.requestId === undefined) {
            throw new runtime.RequiredError('requestId','Required parameter requestParameters.requestId was null or undefined when calling updateDomainRequest.');
        }

        if (requestParameters.updateDomainRequestRequest === null || requestParameters.updateDomainRequestRequest === undefined) {
            throw new runtime.RequiredError('updateDomainRequestRequest','Required parameter requestParameters.updateDomainRequestRequest was null or undefined when calling updateDomainRequest.');
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
            path: `/api/v1/domains-requests/{request_id}`.replace(`{${"request_id"}}`, encodeURIComponent(String(requestParameters.requestId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateDomainRequestRequestToJSON(requestParameters.updateDomainRequestRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDomainRequest201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы оплатить/обновить заявку на регистрацию/продление/трансфер домена, отправьте запрос PATCH на `/api/v1/domains-requests/{request_id}`, задав необходимые атрибуты.  Заявка будет обновлена с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о обновленной заявке.
     * Оплата/обновление заявки на регистрацию/продление/трансфер домена
     */
    async updateDomainRequest(requestParameters: UpdateDomainRequestOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDomainRequest201Response> {
        const response = await this.updateDomainRequestRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const GetDomainsOrderEnum = {
    Asc: 'asc',
    Dsc: 'dsc'
} as const;
export type GetDomainsOrderEnum = typeof GetDomainsOrderEnum[keyof typeof GetDomainsOrderEnum];
/**
 * @export
 */
export const GetDomainsSortEnum = {
    IdnName: 'idn_name'
} as const;
export type GetDomainsSortEnum = typeof GetDomainsSortEnum[keyof typeof GetDomainsSortEnum];
