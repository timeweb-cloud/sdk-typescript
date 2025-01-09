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
  AddIPsToBalancerRequest,
  CreateBalancer,
  CreateBalancer200Response,
  CreateBalancerRule200Response,
  CreateRule,
  DeleteBalancer200Response,
  GetBalancerIPs200Response,
  GetBalancerRules200Response,
  GetBalancers200Response,
  GetBalancersPresets200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances403Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  UpdateBalancer,
  UpdateRule,
} from '../models/index';
import {
    AddIPsToBalancerRequestFromJSON,
    AddIPsToBalancerRequestToJSON,
    CreateBalancerFromJSON,
    CreateBalancerToJSON,
    CreateBalancer200ResponseFromJSON,
    CreateBalancer200ResponseToJSON,
    CreateBalancerRule200ResponseFromJSON,
    CreateBalancerRule200ResponseToJSON,
    CreateRuleFromJSON,
    CreateRuleToJSON,
    DeleteBalancer200ResponseFromJSON,
    DeleteBalancer200ResponseToJSON,
    GetBalancerIPs200ResponseFromJSON,
    GetBalancerIPs200ResponseToJSON,
    GetBalancerRules200ResponseFromJSON,
    GetBalancerRules200ResponseToJSON,
    GetBalancers200ResponseFromJSON,
    GetBalancers200ResponseToJSON,
    GetBalancersPresets200ResponseFromJSON,
    GetBalancersPresets200ResponseToJSON,
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
    UpdateBalancerFromJSON,
    UpdateBalancerToJSON,
    UpdateRuleFromJSON,
    UpdateRuleToJSON,
} from '../models/index';

export interface AddIPsToBalancerOperationRequest {
    balancerId: number;
    addIPsToBalancerRequest: AddIPsToBalancerRequest;
}

export interface CreateBalancerRequest {
    createBalancer: CreateBalancer;
}

export interface CreateBalancerRuleRequest {
    balancerId: number;
    createRule: CreateRule;
}

export interface DeleteBalancerRequest {
    balancerId: number;
    hash?: string;
    code?: string;
}

export interface DeleteBalancerRuleRequest {
    balancerId: number;
    ruleId: number;
}

export interface DeleteIPsFromBalancerRequest {
    balancerId: number;
    addIPsToBalancerRequest: AddIPsToBalancerRequest;
}

export interface GetBalancerRequest {
    balancerId: number;
}

export interface GetBalancerIPsRequest {
    balancerId: number;
}

export interface GetBalancerRulesRequest {
    balancerId: number;
}

export interface GetBalancersRequest {
    limit?: number;
    offset?: number;
}

export interface UpdateBalancerRequest {
    balancerId: number;
    updateBalancer: UpdateBalancer;
}

export interface UpdateBalancerRuleRequest {
    balancerId: number;
    ruleId: number;
    updateRule: UpdateRule;
}

/**
 * 
 */
export class BalancersApi extends runtime.BaseAPI {

    /**
     * Чтобы добавить `IP`-адреса к балансировщику, отправьте запрос POST в `api/v1/balancers/{balancer_id}/ips`. 
     * Добавление IP-адресов к балансировщику
     */
    async addIPsToBalancerRaw(requestParameters: AddIPsToBalancerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling addIPsToBalancer.');
        }

        if (requestParameters.addIPsToBalancerRequest === null || requestParameters.addIPsToBalancerRequest === undefined) {
            throw new runtime.RequiredError('addIPsToBalancerRequest','Required parameter requestParameters.addIPsToBalancerRequest was null or undefined when calling addIPsToBalancer.');
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
            path: `/api/v1/balancers/{balancer_id}/ips`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddIPsToBalancerRequestToJSON(requestParameters.addIPsToBalancerRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы добавить `IP`-адреса к балансировщику, отправьте запрос POST в `api/v1/balancers/{balancer_id}/ips`. 
     * Добавление IP-адресов к балансировщику
     */
    async addIPsToBalancer(requestParameters: AddIPsToBalancerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addIPsToBalancerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать бaлансировщик на вашем аккаунте, отправьте POST-запрос на `/api/v1/balancers`, задав необходимые атрибуты.  Балансировщик будет создан с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданном балансировщике.
     * Создание бaлансировщика
     */
    async createBalancerRaw(requestParameters: CreateBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateBalancer200Response>> {
        if (requestParameters.createBalancer === null || requestParameters.createBalancer === undefined) {
            throw new runtime.RequiredError('createBalancer','Required parameter requestParameters.createBalancer was null or undefined when calling createBalancer.');
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
            path: `/api/v1/balancers`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateBalancerToJSON(requestParameters.createBalancer),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateBalancer200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать бaлансировщик на вашем аккаунте, отправьте POST-запрос на `/api/v1/balancers`, задав необходимые атрибуты.  Балансировщик будет создан с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданном балансировщике.
     * Создание бaлансировщика
     */
    async createBalancer(requestParameters: CreateBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateBalancer200Response> {
        const response = await this.createBalancerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать правило для балансировщика, отправьте запрос POST в `api/v1/balancers/{balancer_id}/rules`. 
     * Создание правила для балансировщика
     */
    async createBalancerRuleRaw(requestParameters: CreateBalancerRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateBalancerRule200Response>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling createBalancerRule.');
        }

        if (requestParameters.createRule === null || requestParameters.createRule === undefined) {
            throw new runtime.RequiredError('createRule','Required parameter requestParameters.createRule was null or undefined when calling createBalancerRule.');
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
            path: `/api/v1/balancers/{balancer_id}/rules`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateRuleToJSON(requestParameters.createRule),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateBalancerRule200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать правило для балансировщика, отправьте запрос POST в `api/v1/balancers/{balancer_id}/rules`. 
     * Создание правила для балансировщика
     */
    async createBalancerRule(requestParameters: CreateBalancerRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateBalancerRule200Response> {
        const response = await this.createBalancerRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить балансировщик, отправьте запрос DELETE в `api/v1/balancers/{balancer_id}`. 
     * Удаление балансировщика
     */
    async deleteBalancerRaw(requestParameters: DeleteBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteBalancer200Response>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling deleteBalancer.');
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
            path: `/api/v1/balancers/{balancer_id}`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteBalancer200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить балансировщик, отправьте запрос DELETE в `api/v1/balancers/{balancer_id}`. 
     * Удаление балансировщика
     */
    async deleteBalancer(requestParameters: DeleteBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteBalancer200Response> {
        const response = await this.deleteBalancerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить правило для балансировщика, отправьте запрос DELETE в `api/v1/balancers/{balancer_id}/rules/{rule_id}`. 
     * Удаление правила для балансировщика
     */
    async deleteBalancerRuleRaw(requestParameters: DeleteBalancerRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling deleteBalancerRule.');
        }

        if (requestParameters.ruleId === null || requestParameters.ruleId === undefined) {
            throw new runtime.RequiredError('ruleId','Required parameter requestParameters.ruleId was null or undefined when calling deleteBalancerRule.');
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
            path: `/api/v1/balancers/{balancer_id}/rules/{rule_id}`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))).replace(`{${"rule_id"}}`, encodeURIComponent(String(requestParameters.ruleId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить правило для балансировщика, отправьте запрос DELETE в `api/v1/balancers/{balancer_id}/rules/{rule_id}`. 
     * Удаление правила для балансировщика
     */
    async deleteBalancerRule(requestParameters: DeleteBalancerRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteBalancerRuleRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить `IP`-адреса из балансировщика, отправьте запрос DELETE в `api/v1/balancers/{balancer_id}/ips`. 
     * Удаление IP-адресов из балансировщика
     */
    async deleteIPsFromBalancerRaw(requestParameters: DeleteIPsFromBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling deleteIPsFromBalancer.');
        }

        if (requestParameters.addIPsToBalancerRequest === null || requestParameters.addIPsToBalancerRequest === undefined) {
            throw new runtime.RequiredError('addIPsToBalancerRequest','Required parameter requestParameters.addIPsToBalancerRequest was null or undefined when calling deleteIPsFromBalancer.');
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
            path: `/api/v1/balancers/{balancer_id}/ips`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: AddIPsToBalancerRequestToJSON(requestParameters.addIPsToBalancerRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить `IP`-адреса из балансировщика, отправьте запрос DELETE в `api/v1/balancers/{balancer_id}/ips`. 
     * Удаление IP-адресов из балансировщика
     */
    async deleteIPsFromBalancer(requestParameters: DeleteIPsFromBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteIPsFromBalancerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отобразить информацию об отдельном балансировщике, отправьте запрос GET на `api/v1/balancers/{balancer_id}`. 
     * Получение бaлансировщика
     */
    async getBalancerRaw(requestParameters: GetBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateBalancer200Response>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling getBalancer.');
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
            path: `/api/v1/balancers/{balancer_id}`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateBalancer200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отобразить информацию об отдельном балансировщике, отправьте запрос GET на `api/v1/balancers/{balancer_id}`. 
     * Получение бaлансировщика
     */
    async getBalancer(requestParameters: GetBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateBalancer200Response> {
        const response = await this.getBalancerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить `IP`-адреса к балансировщику, отправьте запрос GET в `api/v1/balancers/{balancer_id}/ips`. 
     * Получение списка IP-адресов балансировщика
     */
    async getBalancerIPsRaw(requestParameters: GetBalancerIPsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetBalancerIPs200Response>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling getBalancerIPs.');
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
            path: `/api/v1/balancers/{balancer_id}/ips`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetBalancerIPs200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить `IP`-адреса к балансировщику, отправьте запрос GET в `api/v1/balancers/{balancer_id}/ips`. 
     * Получение списка IP-адресов балансировщика
     */
    async getBalancerIPs(requestParameters: GetBalancerIPsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetBalancerIPs200Response> {
        const response = await this.getBalancerIPsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить правила балансировщика, отправьте запрос GET в `api/v1/balancers/{balancer_id}/rules`. 
     * Получение правил балансировщика
     */
    async getBalancerRulesRaw(requestParameters: GetBalancerRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetBalancerRules200Response>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling getBalancerRules.');
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
            path: `/api/v1/balancers/{balancer_id}/rules`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetBalancerRules200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить правила балансировщика, отправьте запрос GET в `api/v1/balancers/{balancer_id}/rules`. 
     * Получение правил балансировщика
     */
    async getBalancerRules(requestParameters: GetBalancerRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetBalancerRules200Response> {
        const response = await this.getBalancerRulesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех бaлансировщиков на вашем аккаунте, отправьте GET-запрос на `/api/v1/balancers`.   Тело ответа будет представлять собой объект JSON с ключом `balancers`.
     * Получение списка всех бaлансировщиков
     */
    async getBalancersRaw(requestParameters: GetBalancersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetBalancers200Response>> {
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
            path: `/api/v1/balancers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetBalancers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех бaлансировщиков на вашем аккаунте, отправьте GET-запрос на `/api/v1/balancers`.   Тело ответа будет представлять собой объект JSON с ключом `balancers`.
     * Получение списка всех бaлансировщиков
     */
    async getBalancers(requestParameters: GetBalancersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetBalancers200Response> {
        const response = await this.getBalancersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список тарифов для балансировщика, отправьте GET-запрос на `/api/v1/presets/balancers`.   Тело ответа будет представлять собой объект JSON с ключом `balancers_presets`.
     * Получение списка тарифов для балансировщика
     */
    async getBalancersPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetBalancersPresets200Response>> {
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
            path: `/api/v1/presets/balancers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetBalancersPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список тарифов для балансировщика, отправьте GET-запрос на `/api/v1/presets/balancers`.   Тело ответа будет представлять собой объект JSON с ключом `balancers_presets`.
     * Получение списка тарифов для балансировщика
     */
    async getBalancersPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetBalancersPresets200Response> {
        const response = await this.getBalancersPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы обновить только определенные атрибуты балансировщика, отправьте запрос PATCH в `api/v1/balancers/{balancer_id}`. 
     * Обновление балансировщика
     */
    async updateBalancerRaw(requestParameters: UpdateBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateBalancer200Response>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling updateBalancer.');
        }

        if (requestParameters.updateBalancer === null || requestParameters.updateBalancer === undefined) {
            throw new runtime.RequiredError('updateBalancer','Required parameter requestParameters.updateBalancer was null or undefined when calling updateBalancer.');
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
            path: `/api/v1/balancers/{balancer_id}`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateBalancerToJSON(requestParameters.updateBalancer),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateBalancer200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить только определенные атрибуты балансировщика, отправьте запрос PATCH в `api/v1/balancers/{balancer_id}`. 
     * Обновление балансировщика
     */
    async updateBalancer(requestParameters: UpdateBalancerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateBalancer200Response> {
        const response = await this.updateBalancerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы обновить правило для балансировщика, отправьте запрос PATCH в `api/v1/balancers/{balancer_id}/rules/{rule_id}`. 
     * Обновление правила для балансировщика
     */
    async updateBalancerRuleRaw(requestParameters: UpdateBalancerRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateBalancerRule200Response>> {
        if (requestParameters.balancerId === null || requestParameters.balancerId === undefined) {
            throw new runtime.RequiredError('balancerId','Required parameter requestParameters.balancerId was null or undefined when calling updateBalancerRule.');
        }

        if (requestParameters.ruleId === null || requestParameters.ruleId === undefined) {
            throw new runtime.RequiredError('ruleId','Required parameter requestParameters.ruleId was null or undefined when calling updateBalancerRule.');
        }

        if (requestParameters.updateRule === null || requestParameters.updateRule === undefined) {
            throw new runtime.RequiredError('updateRule','Required parameter requestParameters.updateRule was null or undefined when calling updateBalancerRule.');
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
            path: `/api/v1/balancers/{balancer_id}/rules/{rule_id}`.replace(`{${"balancer_id"}}`, encodeURIComponent(String(requestParameters.balancerId))).replace(`{${"rule_id"}}`, encodeURIComponent(String(requestParameters.ruleId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateRuleToJSON(requestParameters.updateRule),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateBalancerRule200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить правило для балансировщика, отправьте запрос PATCH в `api/v1/balancers/{balancer_id}/rules/{rule_id}`. 
     * Обновление правила для балансировщика
     */
    async updateBalancerRule(requestParameters: UpdateBalancerRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateBalancerRule200Response> {
        const response = await this.updateBalancerRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
