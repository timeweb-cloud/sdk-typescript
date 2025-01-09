/* tslint:disable */
/* eslint-disable */
/**
 * Timeweb Cloud API
 * # Введение API Timeweb Cloud позволяет вам управлять ресурсами в облаке программным способом с использованием обычных HTTP-запросов.  Множество функций, которые доступны в панели управления Timeweb Cloud, также доступны через API, что позволяет вам автоматизировать ваши собственные сценарии.  В этой документации сперва будет описан общий дизайн и принципы работы API, а после этого конкретные конечные точки. Также будут приведены примеры запросов к ним.   ## Запросы Запросы должны выполняться по протоколу `HTTPS`, чтобы гарантировать шифрование транзакций. Поддерживаются следующие методы запроса: |Метод|Применение| |--- |--- | |GET|Извлекает данные о коллекциях и отдельных ресурсах.| |POST|Для коллекций создает новый ресурс этого типа. Также используется для выполнения действий с конкретным ресурсом.| |PUT|Обновляет существующий ресурс.| |PATCH|Некоторые ресурсы поддерживают частичное обновление, то есть обновление только части атрибутов ресурса, в этом случае вместо метода PUT будет использован PATCH.| |DELETE|Удаляет ресурс.|  Методы `POST`, `PUT` и `PATCH` могут включать объект в тело запроса с типом содержимого `application/json`.  ### Параметры в запросах Некоторые коллекции поддерживают пагинацию, поиск или сортировку в запросах. В параметрах запроса требуется передать: - `limit` — обозначает количество записей, которое необходимо вернуть  - `offset` — указывает на смещение, относительно начала списка  - `search` — позволяет указать набор символов для поиска  - `sort` — можно задать правило сортировки коллекции  ## Ответы Запросы вернут один из следующих кодов состояния ответа HTTP:  |Статус|Описание| |--- |--- | |200 OK|Действие с ресурсом было выполнено успешно.| |201 Created|Ресурс был успешно создан. При этом ресурс может быть как уже готовым к использованию, так и находиться в процессе запуска.| |204 No Content|Действие с ресурсом было выполнено успешно, и ответ не содержит дополнительной информации в теле.| |400 Bad Request|Был отправлен неверный запрос, например, в нем отсутствуют обязательные параметры и т. д. Тело ответа будет содержать дополнительную информацию об ошибке.| |401 Unauthorized|Ошибка аутентификации.| |403 Forbidden|Аутентификация прошла успешно, но недостаточно прав для выполнения действия.| |404 Not Found|Запрашиваемый ресурс не найден.| |409 Conflict|Запрос конфликтует с текущим состоянием.| |423 Locked|Ресурс из запроса заблокирован от применения к нему указанного метода.| |429 Too Many Requests|Был достигнут лимит по количеству запросов в единицу времени.| |500 Internal Server Error|При выполнении запроса произошла какая-то внутренняя ошибка. Чтобы решить эту проблему, лучше всего создать тикет в панели управления.|  ### Структура успешного ответа Все конечные точки будут возвращать данные в формате `JSON`. Ответы на `GET`-запросы будут иметь на верхнем уровне следующую структуру атрибутов:  |Название поля|Тип|Описание| |--- |--- |--- | |[entity_name]|object, object[], string[], number[], boolean|Динамическое поле, которое будет меняться в зависимости от запрашиваемого ресурса и будет содержать все атрибуты, необходимые для описания этого ресурса. Например, при запросе списка баз данных будет возвращаться поле `dbs`, а при запросе конкретного облачного сервера `server`. Для некоторых конечных точек в ответе может возвращаться сразу несколько ресурсов.| |meta|object|Опционально. Объект, который содержит вспомогательную информацию о ресурсе. Чаще всего будет встречаться при запросе коллекций и содержать поле `total`, которое будет указывать на количество элементов в коллекции.| |response_id|string|Опционально. В большинстве случаев в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее. Также вы можете использовать этот идентификатор, чтобы убедиться, что это новый ответ на запрос и результат не был получен из кэша.|  Пример запроса на получение списка SSH-ключей: ```     HTTP/2.0 200 OK     {       \"ssh_keys\":[           {             \"body\":\"ssh-rsa AAAAB3NzaC1sdfghjkOAsBwWhs= example@device.local\",             \"created_at\":\"2021-09-15T19:52:27Z\",             \"expired_at\":null,             \"id\":5297,             \"is_default\":false,             \"name\":\"example@device.local\",             \"used_at\":null,             \"used_by\":[]           }       ],       \"meta\":{           \"total\":1       },       \"response_id\":\"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ### Структура ответа с ошибкой |Название поля|Тип|Описание| |--- |--- |--- | |status_code|number|Короткий числовой идентификатор ошибки.| |error_code|string|Короткий текстовый идентификатор ошибки, который уточняет числовой идентификатор и удобен для программной обработки. Самый простой пример — это код `not_found` для ошибки 404.| |message|string, string[]|Опционально. В большинстве случаев в ответе будет содержаться человекочитаемое подробное описание ошибки или ошибок, которые помогут понять, что нужно исправить.| |response_id|string|Опционально. В большинстве случае в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее.|  Пример: ```     HTTP/2.0 403 Forbidden     {       \"status_code\": 403,       \"error_code\":  \"forbidden\",       \"message\":     \"You do not have access for the attempted action\",       \"response_id\": \"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ## Статусы ресурсов Важно учесть, что при создании большинства ресурсов внутри платформы вам будет сразу возвращен ответ от сервера со статусом `200 OK` или `201 Created` и идентификатором созданного ресурса в теле ответа, но при этом этот ресурс может быть ещё в *состоянии запуска*.  Для того чтобы понять, в каком состоянии сейчас находится ваш ресурс, мы добавили поле `status` в ответ на получение информации о ресурсе.  Список статусов будет отличаться в зависимости от типа ресурса. Увидеть поддерживаемый список статусов вы сможете в описании каждого конкретного ресурса.     ## Ограничение скорости запросов (Rate Limiting) Чтобы обеспечить стабильность для всех пользователей, Timeweb Cloud защищает API от всплесков входящего трафика, анализируя количество запросов c каждого аккаунта к каждой конечной точке.  Если ваше приложение отправляет более 20 запросов в секунду на одну конечную точку, то для этого запроса API может вернуть код состояния HTTP `429 Too Many Requests`.   ## Аутентификация Доступ к API осуществляется с помощью JWT-токена. Токенами можно управлять внутри панели управления Timeweb Cloud в разделе *API и Terraform*.  Токен необходимо передавать в заголовке каждого запроса в формате: ```   Authorization: Bearer $TIMEWEB_CLOUD_TOKEN ```  ## Формат примеров API Примеры в этой документации описаны с помощью `curl`, HTTP-клиента командной строки. На компьютерах `Linux` и `macOS` обычно по умолчанию установлен `curl`, и он доступен для загрузки на всех популярных платформах, включая `Windows`.  Каждый пример разделен на несколько строк символом `\\`, который совместим с `bash`. Типичный пример выглядит так: ```   curl -X PATCH      -H \"Content-Type: application/json\"      -H \"Authorization: Bearer $TIMEWEB_CLOUD_TOKEN\"      -d \'{\"name\":\"Cute Corvus\",\"comment\":\"Development Server\"}\'      \"https://api.timeweb.cloud/api/v1/dedicated/1051\" ``` - Параметр `-X` задает метод запроса. Для согласованности метод будет указан во всех примерах, даже если он явно не требуется для методов `GET`. - Строки `-H` задают требуемые HTTP-заголовки. - Примеры, для которых требуется объект JSON в теле запроса, передают требуемые данные через параметр `-d`.  Чтобы использовать приведенные примеры, не подставляя каждый раз в них свой токен, вы можете добавить токен один раз в переменные окружения в вашей консоли. Например, на `Linux` это можно сделать с помощью команды:  ``` TIMEWEB_CLOUD_TOKEN=\"token\" ```  После этого токен будет автоматически подставляться в ваши запросы.  Обратите внимание, что все значения в этой документации являются примерами. Не полагайтесь на идентификаторы операционных систем, тарифов и т.д., используемые в примерах. Используйте соответствующую конечную точку для получения значений перед созданием ресурсов.   ## Версионирование API построено согласно принципам [семантического версионирования](https://semver.org/lang/ru). Это значит, что мы гарантируем обратную совместимость всех изменений в пределах одной мажорной версии.  Мажорная версия каждой конечной точки обозначается в пути запроса, например, запрос `/api/v1/servers` указывает, что этот метод имеет версию 1.
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
  AddCountriesToAllowedList201Response,
  AddCountriesToAllowedListRequest,
  AddIPsToAllowedList201Response,
  AddIPsToAllowedListRequest,
  DeleteCountriesFromAllowedList200Response,
  DeleteCountriesFromAllowedListRequest,
  DeleteIPsFromAllowedList200Response,
  DeleteIPsFromAllowedListRequest,
  GetAccountStatus200Response,
  GetAuthAccessSettings200Response,
  GetCountries200Response,
  GetFinances200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances403Response,
  GetFinances429Response,
  GetFinances500Response,
  GetNotificationSettings200Response,
  UpdateAuthRestrictionsByCountriesRequest,
  UpdateNotificationSettingsRequest,
} from '../models/index';
import {
    AddCountriesToAllowedList201ResponseFromJSON,
    AddCountriesToAllowedList201ResponseToJSON,
    AddCountriesToAllowedListRequestFromJSON,
    AddCountriesToAllowedListRequestToJSON,
    AddIPsToAllowedList201ResponseFromJSON,
    AddIPsToAllowedList201ResponseToJSON,
    AddIPsToAllowedListRequestFromJSON,
    AddIPsToAllowedListRequestToJSON,
    DeleteCountriesFromAllowedList200ResponseFromJSON,
    DeleteCountriesFromAllowedList200ResponseToJSON,
    DeleteCountriesFromAllowedListRequestFromJSON,
    DeleteCountriesFromAllowedListRequestToJSON,
    DeleteIPsFromAllowedList200ResponseFromJSON,
    DeleteIPsFromAllowedList200ResponseToJSON,
    DeleteIPsFromAllowedListRequestFromJSON,
    DeleteIPsFromAllowedListRequestToJSON,
    GetAccountStatus200ResponseFromJSON,
    GetAccountStatus200ResponseToJSON,
    GetAuthAccessSettings200ResponseFromJSON,
    GetAuthAccessSettings200ResponseToJSON,
    GetCountries200ResponseFromJSON,
    GetCountries200ResponseToJSON,
    GetFinances200ResponseFromJSON,
    GetFinances200ResponseToJSON,
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
    GetNotificationSettings200ResponseFromJSON,
    GetNotificationSettings200ResponseToJSON,
    UpdateAuthRestrictionsByCountriesRequestFromJSON,
    UpdateAuthRestrictionsByCountriesRequestToJSON,
    UpdateNotificationSettingsRequestFromJSON,
    UpdateNotificationSettingsRequestToJSON,
} from '../models/index';

export interface AddCountriesToAllowedListOperationRequest {
    addCountriesToAllowedListRequest: AddCountriesToAllowedListRequest;
}

export interface AddIPsToAllowedListOperationRequest {
    addIPsToAllowedListRequest: AddIPsToAllowedListRequest;
}

export interface DeleteCountriesFromAllowedListOperationRequest {
    deleteCountriesFromAllowedListRequest: DeleteCountriesFromAllowedListRequest;
}

export interface DeleteIPsFromAllowedListOperationRequest {
    deleteIPsFromAllowedListRequest: DeleteIPsFromAllowedListRequest;
}

export interface UpdateAuthRestrictionsByCountriesOperationRequest {
    updateAuthRestrictionsByCountriesRequest: UpdateAuthRestrictionsByCountriesRequest;
}

export interface UpdateAuthRestrictionsByIPRequest {
    updateAuthRestrictionsByCountriesRequest: UpdateAuthRestrictionsByCountriesRequest;
}

export interface UpdateNotificationSettingsOperationRequest {
    updateNotificationSettingsRequest: UpdateNotificationSettingsRequest;
}

/**
 * 
 */
export class AccountApi extends runtime.BaseAPI {

    /**
     * Чтобы добавить страны в список разрешенных, отправьте POST-запрос в `api/v1/access/countries`, передав в теле запроса параметр `countries` со списком стран.
     * Добавление стран в список разрешенных
     */
    async addCountriesToAllowedListRaw(requestParameters: AddCountriesToAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddCountriesToAllowedList201Response>> {
        if (requestParameters.addCountriesToAllowedListRequest === null || requestParameters.addCountriesToAllowedListRequest === undefined) {
            throw new runtime.RequiredError('addCountriesToAllowedListRequest','Required parameter requestParameters.addCountriesToAllowedListRequest was null or undefined when calling addCountriesToAllowedList.');
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
            path: `/api/v1/auth/access/countries`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddCountriesToAllowedListRequestToJSON(requestParameters.addCountriesToAllowedListRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddCountriesToAllowedList201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить страны в список разрешенных, отправьте POST-запрос в `api/v1/access/countries`, передав в теле запроса параметр `countries` со списком стран.
     * Добавление стран в список разрешенных
     */
    async addCountriesToAllowedList(requestParameters: AddCountriesToAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddCountriesToAllowedList201Response> {
        const response = await this.addCountriesToAllowedListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить IP-адреса в список разрешенных, отправьте POST-запрос в `api/v1/access/ips`, передав в теле запроса параметр `ips` со списком IP-адресов.
     * Добавление IP-адресов в список разрешенных
     */
    async addIPsToAllowedListRaw(requestParameters: AddIPsToAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddIPsToAllowedList201Response>> {
        if (requestParameters.addIPsToAllowedListRequest === null || requestParameters.addIPsToAllowedListRequest === undefined) {
            throw new runtime.RequiredError('addIPsToAllowedListRequest','Required parameter requestParameters.addIPsToAllowedListRequest was null or undefined when calling addIPsToAllowedList.');
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
            path: `/api/v1/auth/access/ips`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddIPsToAllowedListRequestToJSON(requestParameters.addIPsToAllowedListRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddIPsToAllowedList201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить IP-адреса в список разрешенных, отправьте POST-запрос в `api/v1/access/ips`, передав в теле запроса параметр `ips` со списком IP-адресов.
     * Добавление IP-адресов в список разрешенных
     */
    async addIPsToAllowedList(requestParameters: AddIPsToAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddIPsToAllowedList201Response> {
        const response = await this.addIPsToAllowedListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить страны из списка разрешенных, отправьте DELETE-запрос в `api/v1/access/countries`, передав в теле запроса параметр `countries` со списком стран.
     * Удаление стран из списка разрешенных
     */
    async deleteCountriesFromAllowedListRaw(requestParameters: DeleteCountriesFromAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteCountriesFromAllowedList200Response>> {
        if (requestParameters.deleteCountriesFromAllowedListRequest === null || requestParameters.deleteCountriesFromAllowedListRequest === undefined) {
            throw new runtime.RequiredError('deleteCountriesFromAllowedListRequest','Required parameter requestParameters.deleteCountriesFromAllowedListRequest was null or undefined when calling deleteCountriesFromAllowedList.');
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
            path: `/api/v1/auth/access/countries`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteCountriesFromAllowedListRequestToJSON(requestParameters.deleteCountriesFromAllowedListRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteCountriesFromAllowedList200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить страны из списка разрешенных, отправьте DELETE-запрос в `api/v1/access/countries`, передав в теле запроса параметр `countries` со списком стран.
     * Удаление стран из списка разрешенных
     */
    async deleteCountriesFromAllowedList(requestParameters: DeleteCountriesFromAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteCountriesFromAllowedList200Response> {
        const response = await this.deleteCountriesFromAllowedListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить IP-адреса из списка разрешенных, отправьте DELETE-запрос в `api/v1/access/ips`, передав в теле запроса параметр `ips` со списком IP-адресов.
     * Удаление IP-адресов из списка разрешенных
     */
    async deleteIPsFromAllowedListRaw(requestParameters: DeleteIPsFromAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteIPsFromAllowedList200Response>> {
        if (requestParameters.deleteIPsFromAllowedListRequest === null || requestParameters.deleteIPsFromAllowedListRequest === undefined) {
            throw new runtime.RequiredError('deleteIPsFromAllowedListRequest','Required parameter requestParameters.deleteIPsFromAllowedListRequest was null or undefined when calling deleteIPsFromAllowedList.');
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
            path: `/api/v1/auth/access/ips`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteIPsFromAllowedListRequestToJSON(requestParameters.deleteIPsFromAllowedListRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteIPsFromAllowedList200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить IP-адреса из списка разрешенных, отправьте DELETE-запрос в `api/v1/access/ips`, передав в теле запроса параметр `ips` со списком IP-адресов.
     * Удаление IP-адресов из списка разрешенных
     */
    async deleteIPsFromAllowedList(requestParameters: DeleteIPsFromAllowedListOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteIPsFromAllowedList200Response> {
        const response = await this.deleteIPsFromAllowedListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статус аккаунта, отправьте GET-запрос на `/api/v1/account/status`.
     * Получение статуса аккаунта
     */
    async getAccountStatusRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAccountStatus200Response>> {
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
            path: `/api/v1/account/status`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAccountStatus200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статус аккаунта, отправьте GET-запрос на `/api/v1/account/status`.
     * Получение статуса аккаунта
     */
    async getAccountStatus(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAccountStatus200Response> {
        const response = await this.getAccountStatusRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о ограничениях авторизации пользователя, отправьте GET-запрос на `/api/v1/auth/access`.   Тело ответа будет представлять собой объект JSON с ключами `is_ip_restrictions_enabled`, `is_country_restrictions_enabled` и `white_list`.
     * Получить информацию о ограничениях авторизации пользователя
     */
    async getAuthAccessSettingsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAuthAccessSettings200Response>> {
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
            path: `/api/v1/auth/access`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAuthAccessSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о ограничениях авторизации пользователя, отправьте GET-запрос на `/api/v1/auth/access`.   Тело ответа будет представлять собой объект JSON с ключами `is_ip_restrictions_enabled`, `is_country_restrictions_enabled` и `white_list`.
     * Получить информацию о ограничениях авторизации пользователя
     */
    async getAuthAccessSettings(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAuthAccessSettings200Response> {
        const response = await this.getAuthAccessSettingsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список стран, отправьте GET-запрос на `/api/v1/auth/access/countries`.   Тело ответа будет представлять собой объект JSON с ключом `countries`.
     * Получение списка стран
     */
    async getCountriesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCountries200Response>> {
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
            path: `/api/v1/auth/access/countries`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCountries200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список стран, отправьте GET-запрос на `/api/v1/auth/access/countries`.   Тело ответа будет представлять собой объект JSON с ключом `countries`.
     * Получение списка стран
     */
    async getCountries(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCountries200Response> {
        const response = await this.getCountriesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить платежную информацию, отправьте GET-запрос на `/api/v1/account/finances`.
     * Получение платежной информации
     */
    async getFinancesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetFinances200Response>> {
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
            path: `/api/v1/account/finances`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFinances200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить платежную информацию, отправьте GET-запрос на `/api/v1/account/finances`.
     * Получение платежной информации
     */
    async getFinances(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetFinances200Response> {
        const response = await this.getFinancesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статус аккаунта, отправьте GET запрос на `/api/v1/account/notification-settings`.
     * Получение настроек уведомлений аккаунта
     */
    async getNotificationSettingsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetNotificationSettings200Response>> {
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
            path: `/api/v1/account/notification-settings`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetNotificationSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статус аккаунта, отправьте GET запрос на `/api/v1/account/notification-settings`.
     * Получение настроек уведомлений аккаунта
     */
    async getNotificationSettings(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetNotificationSettings200Response> {
        const response = await this.getNotificationSettingsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы включить/отключить ограничения по стране, отправьте POST-запрос в `api/v1/access/countries/enabled`, передав в теле запроса параметр `is_enabled`
     * Включение/отключение ограничений по стране
     */
    async updateAuthRestrictionsByCountriesRaw(requestParameters: UpdateAuthRestrictionsByCountriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.updateAuthRestrictionsByCountriesRequest === null || requestParameters.updateAuthRestrictionsByCountriesRequest === undefined) {
            throw new runtime.RequiredError('updateAuthRestrictionsByCountriesRequest','Required parameter requestParameters.updateAuthRestrictionsByCountriesRequest was null or undefined when calling updateAuthRestrictionsByCountries.');
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
            path: `/api/v1/auth/access/countries/enabled`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAuthRestrictionsByCountriesRequestToJSON(requestParameters.updateAuthRestrictionsByCountriesRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы включить/отключить ограничения по стране, отправьте POST-запрос в `api/v1/access/countries/enabled`, передав в теле запроса параметр `is_enabled`
     * Включение/отключение ограничений по стране
     */
    async updateAuthRestrictionsByCountries(requestParameters: UpdateAuthRestrictionsByCountriesOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateAuthRestrictionsByCountriesRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы включить/отключить ограничения по IP-адресу, отправьте POST-запрос в `api/v1/access/ips/enabled`, передав в теле запроса параметр `is_enabled`
     * Включение/отключение ограничений по IP-адресу
     */
    async updateAuthRestrictionsByIPRaw(requestParameters: UpdateAuthRestrictionsByIPRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.updateAuthRestrictionsByCountriesRequest === null || requestParameters.updateAuthRestrictionsByCountriesRequest === undefined) {
            throw new runtime.RequiredError('updateAuthRestrictionsByCountriesRequest','Required parameter requestParameters.updateAuthRestrictionsByCountriesRequest was null or undefined when calling updateAuthRestrictionsByIP.');
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
            path: `/api/v1/auth/access/ips/enabled`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAuthRestrictionsByCountriesRequestToJSON(requestParameters.updateAuthRestrictionsByCountriesRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы включить/отключить ограничения по IP-адресу, отправьте POST-запрос в `api/v1/access/ips/enabled`, передав в теле запроса параметр `is_enabled`
     * Включение/отключение ограничений по IP-адресу
     */
    async updateAuthRestrictionsByIP(requestParameters: UpdateAuthRestrictionsByIPRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateAuthRestrictionsByIPRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы изменить настройки уведомлений аккаунта, отправьте PATCH запрос на `/api/v1/account/notification-settings`.
     * Изменение настроек уведомлений аккаунта
     */
    async updateNotificationSettingsRaw(requestParameters: UpdateNotificationSettingsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetNotificationSettings200Response>> {
        if (requestParameters.updateNotificationSettingsRequest === null || requestParameters.updateNotificationSettingsRequest === undefined) {
            throw new runtime.RequiredError('updateNotificationSettingsRequest','Required parameter requestParameters.updateNotificationSettingsRequest was null or undefined when calling updateNotificationSettings.');
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
            path: `/api/v1/account/notification-settings`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateNotificationSettingsRequestToJSON(requestParameters.updateNotificationSettingsRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetNotificationSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить настройки уведомлений аккаунта, отправьте PATCH запрос на `/api/v1/account/notification-settings`.
     * Изменение настроек уведомлений аккаунта
     */
    async updateNotificationSettings(requestParameters: UpdateNotificationSettingsOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetNotificationSettings200Response> {
        const response = await this.updateNotificationSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
