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
  FirewallGroupInAPI,
  FirewallGroupOutResponse,
  FirewallGroupResourceOutResponse,
  FirewallGroupResourcesOutResponse,
  FirewallGroupsOutResponse,
  FirewallRuleInAPI,
  FirewallRuleOutResponse,
  FirewallRulesOutResponse,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  ResourceType,
} from '../models/index';
import {
    FirewallGroupInAPIFromJSON,
    FirewallGroupInAPIToJSON,
    FirewallGroupOutResponseFromJSON,
    FirewallGroupOutResponseToJSON,
    FirewallGroupResourceOutResponseFromJSON,
    FirewallGroupResourceOutResponseToJSON,
    FirewallGroupResourcesOutResponseFromJSON,
    FirewallGroupResourcesOutResponseToJSON,
    FirewallGroupsOutResponseFromJSON,
    FirewallGroupsOutResponseToJSON,
    FirewallRuleInAPIFromJSON,
    FirewallRuleInAPIToJSON,
    FirewallRuleOutResponseFromJSON,
    FirewallRuleOutResponseToJSON,
    FirewallRulesOutResponseFromJSON,
    FirewallRulesOutResponseToJSON,
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
    ResourceTypeFromJSON,
    ResourceTypeToJSON,
} from '../models/index';

export interface AddResourceToGroupRequest {
    groupId: string;
    resourceId: string;
    resourceType?: ResourceType;
}

export interface CreateGroupRequest {
    firewallGroupInAPI: FirewallGroupInAPI;
    policy?: CreateGroupPolicyEnum;
}

export interface CreateGroupRuleRequest {
    groupId: string;
    firewallRuleInAPI: FirewallRuleInAPI;
}

export interface DeleteGroupRequest {
    groupId: string;
}

export interface DeleteGroupRuleRequest {
    groupId: string;
    ruleId: string;
}

export interface DeleteResourceFromGroupRequest {
    groupId: string;
    resourceId: string;
    resourceType?: ResourceType;
}

export interface GetGroupRequest {
    groupId: string;
}

export interface GetGroupResourcesRequest {
    groupId: string;
    limit?: number;
    offset?: number;
}

export interface GetGroupRuleRequest {
    ruleId: string;
    groupId: string;
}

export interface GetGroupRulesRequest {
    groupId: string;
    limit?: number;
    offset?: number;
}

export interface GetGroupsRequest {
    limit?: number;
    offset?: number;
}

export interface GetRulesForResourceRequest {
    resourceId: string;
    resourceType: ResourceType;
    limit?: number;
    offset?: number;
}

export interface UpdateGroupRequest {
    groupId: string;
    firewallGroupInAPI: FirewallGroupInAPI;
}

export interface UpdateGroupRuleRequest {
    groupId: string;
    ruleId: string;
    firewallRuleInAPI: FirewallRuleInAPI;
}

/**
 * 
 */
export class FirewallApi extends runtime.BaseAPI {

    /**
     * Чтобы слинковать ресурс с группой правил, отправьте POST запрос на `/api/v1/firewall/groups/{group_id}/resources/{resource_id}`
     * Линковка ресурса в firewall group
     */
    async addResourceToGroupRaw(requestParameters: AddResourceToGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallGroupResourceOutResponse>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling addResourceToGroup.');
        }

        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling addResourceToGroup.');
        }

        const queryParameters: any = {};

        if (requestParameters.resourceType !== undefined) {
            queryParameters['resource_type'] = requestParameters.resourceType;
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
            path: `/api/v1/firewall/groups/{group_id}/resources/{resource_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))).replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallGroupResourceOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы слинковать ресурс с группой правил, отправьте POST запрос на `/api/v1/firewall/groups/{group_id}/resources/{resource_id}`
     * Линковка ресурса в firewall group
     */
    async addResourceToGroup(requestParameters: AddResourceToGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallGroupResourceOutResponse> {
        const response = await this.addResourceToGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать группу правил, отправьте POST запрос на `/api/v1/firewall/groups`
     * Создание группы правил
     */
    async createGroupRaw(requestParameters: CreateGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallGroupOutResponse>> {
        if (requestParameters.firewallGroupInAPI === null || requestParameters.firewallGroupInAPI === undefined) {
            throw new runtime.RequiredError('firewallGroupInAPI','Required parameter requestParameters.firewallGroupInAPI was null or undefined when calling createGroup.');
        }

        const queryParameters: any = {};

        if (requestParameters.policy !== undefined) {
            queryParameters['policy'] = requestParameters.policy;
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
            path: `/api/v1/firewall/groups`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FirewallGroupInAPIToJSON(requestParameters.firewallGroupInAPI),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallGroupOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать группу правил, отправьте POST запрос на `/api/v1/firewall/groups`
     * Создание группы правил
     */
    async createGroup(requestParameters: CreateGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallGroupOutResponse> {
        const response = await this.createGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать правило в группе, отправьте POST запрос на `/api/v1/firewall/groups/{group_id}/rules`
     * Создание firewall правила
     */
    async createGroupRuleRaw(requestParameters: CreateGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallRuleOutResponse>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling createGroupRule.');
        }

        if (requestParameters.firewallRuleInAPI === null || requestParameters.firewallRuleInAPI === undefined) {
            throw new runtime.RequiredError('firewallRuleInAPI','Required parameter requestParameters.firewallRuleInAPI was null or undefined when calling createGroupRule.');
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
            path: `/api/v1/firewall/groups/{group_id}/rules`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FirewallRuleInAPIToJSON(requestParameters.firewallRuleInAPI),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallRuleOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать правило в группе, отправьте POST запрос на `/api/v1/firewall/groups/{group_id}/rules`
     * Создание firewall правила
     */
    async createGroupRule(requestParameters: CreateGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallRuleOutResponse> {
        const response = await this.createGroupRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить группу правил, отправьте DELETE запрос на `/api/v1/firewall/groups/{group_id}`
     * Удаление группы правил
     */
    async deleteGroupRaw(requestParameters: DeleteGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling deleteGroup.');
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
            path: `/api/v1/firewall/groups/{group_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить группу правил, отправьте DELETE запрос на `/api/v1/firewall/groups/{group_id}`
     * Удаление группы правил
     */
    async deleteGroup(requestParameters: DeleteGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteGroupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить правило, отправьте DELETE запрос на `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`
     * Удаление firewall правила
     */
    async deleteGroupRuleRaw(requestParameters: DeleteGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling deleteGroupRule.');
        }

        if (requestParameters.ruleId === null || requestParameters.ruleId === undefined) {
            throw new runtime.RequiredError('ruleId','Required parameter requestParameters.ruleId was null or undefined when calling deleteGroupRule.');
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
            path: `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))).replace(`{${"rule_id"}}`, encodeURIComponent(String(requestParameters.ruleId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить правило, отправьте DELETE запрос на `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`
     * Удаление firewall правила
     */
    async deleteGroupRule(requestParameters: DeleteGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteGroupRuleRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отлинковать ресурс от группы правил, отправьте DELETE запрос на `/api/v1/firewall/groups/{group_id}/resources/{resource_id}`
     * Отлинковка ресурса из firewall group
     */
    async deleteResourceFromGroupRaw(requestParameters: DeleteResourceFromGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling deleteResourceFromGroup.');
        }

        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling deleteResourceFromGroup.');
        }

        const queryParameters: any = {};

        if (requestParameters.resourceType !== undefined) {
            queryParameters['resource_type'] = requestParameters.resourceType;
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
            path: `/api/v1/firewall/groups/{group_id}/resources/{resource_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))).replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отлинковать ресурс от группы правил, отправьте DELETE запрос на `/api/v1/firewall/groups/{group_id}/resources/{resource_id}`
     * Отлинковка ресурса из firewall group
     */
    async deleteResourceFromGroup(requestParameters: DeleteResourceFromGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteResourceFromGroupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить информацию о группе правил, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}`
     * Получение информации о группе правил
     */
    async getGroupRaw(requestParameters: GetGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallGroupOutResponse>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling getGroup.');
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
            path: `/api/v1/firewall/groups/{group_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallGroupOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о группе правил, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}`
     * Получение информации о группе правил
     */
    async getGroup(requestParameters: GetGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallGroupOutResponse> {
        const response = await this.getGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить слинкованных ресурсов для группы правил, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}/resources`
     * Получение слинкованных ресурсов
     */
    async getGroupResourcesRaw(requestParameters: GetGroupResourcesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallGroupResourcesOutResponse>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling getGroupResources.');
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
            path: `/api/v1/firewall/groups/{group_id}/resources`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallGroupResourcesOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить слинкованных ресурсов для группы правил, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}/resources`
     * Получение слинкованных ресурсов
     */
    async getGroupResources(requestParameters: GetGroupResourcesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallGroupResourcesOutResponse> {
        const response = await this.getGroupResourcesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить инфомрацию о правиле, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`
     * Получение информации о правиле
     */
    async getGroupRuleRaw(requestParameters: GetGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallRuleOutResponse>> {
        if (requestParameters.ruleId === null || requestParameters.ruleId === undefined) {
            throw new runtime.RequiredError('ruleId','Required parameter requestParameters.ruleId was null or undefined when calling getGroupRule.');
        }

        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling getGroupRule.');
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
            path: `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`.replace(`{${"rule_id"}}`, encodeURIComponent(String(requestParameters.ruleId))).replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallRuleOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить инфомрацию о правиле, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`
     * Получение информации о правиле
     */
    async getGroupRule(requestParameters: GetGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallRuleOutResponse> {
        const response = await this.getGroupRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список правил в группе, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}/rules`
     * Получение списка правил
     */
    async getGroupRulesRaw(requestParameters: GetGroupRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallRulesOutResponse>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling getGroupRules.');
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
            path: `/api/v1/firewall/groups/{group_id}/rules`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallRulesOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список правил в группе, отправьте GET запрос на `/api/v1/firewall/groups/{group_id}/rules`
     * Получение списка правил
     */
    async getGroupRules(requestParameters: GetGroupRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallRulesOutResponse> {
        const response = await this.getGroupRulesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить групп правил для аккаунта, отправьте GET запрос на `/api/v1/firewall/groups`
     * Получение групп правил
     */
    async getGroupsRaw(requestParameters: GetGroupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallGroupsOutResponse>> {
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
            path: `/api/v1/firewall/groups`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallGroupsOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить групп правил для аккаунта, отправьте GET запрос на `/api/v1/firewall/groups`
     * Получение групп правил
     */
    async getGroups(requestParameters: GetGroupsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallGroupsOutResponse> {
        const response = await this.getGroupsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список групп правил, с которыми слинкован ресурс, отправьте GET запрос на `/api/v1/firewall/service/{resource_type}/{resource_id}`
     * Получение групп правил для ресурса
     */
    async getRulesForResourceRaw(requestParameters: GetRulesForResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallGroupsOutResponse>> {
        if (requestParameters.resourceId === null || requestParameters.resourceId === undefined) {
            throw new runtime.RequiredError('resourceId','Required parameter requestParameters.resourceId was null or undefined when calling getRulesForResource.');
        }

        if (requestParameters.resourceType === null || requestParameters.resourceType === undefined) {
            throw new runtime.RequiredError('resourceType','Required parameter requestParameters.resourceType was null or undefined when calling getRulesForResource.');
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
            path: `/api/v1/firewall/service/{resource_type}/{resource_id}`.replace(`{${"resource_id"}}`, encodeURIComponent(String(requestParameters.resourceId))).replace(`{${"resource_type"}}`, encodeURIComponent(String(requestParameters.resourceType))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallGroupsOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список групп правил, с которыми слинкован ресурс, отправьте GET запрос на `/api/v1/firewall/service/{resource_type}/{resource_id}`
     * Получение групп правил для ресурса
     */
    async getRulesForResource(requestParameters: GetRulesForResourceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallGroupsOutResponse> {
        const response = await this.getRulesForResourceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить группу правил, отправьте PATCH запрос на `/api/v1/firewall/groups/{group_id}`
     * Обновление группы правил
     */
    async updateGroupRaw(requestParameters: UpdateGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallGroupOutResponse>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling updateGroup.');
        }

        if (requestParameters.firewallGroupInAPI === null || requestParameters.firewallGroupInAPI === undefined) {
            throw new runtime.RequiredError('firewallGroupInAPI','Required parameter requestParameters.firewallGroupInAPI was null or undefined when calling updateGroup.');
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
            path: `/api/v1/firewall/groups/{group_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: FirewallGroupInAPIToJSON(requestParameters.firewallGroupInAPI),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallGroupOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить группу правил, отправьте PATCH запрос на `/api/v1/firewall/groups/{group_id}`
     * Обновление группы правил
     */
    async updateGroup(requestParameters: UpdateGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallGroupOutResponse> {
        const response = await this.updateGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить правило, отправьте PATCH запрос на `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`
     * Обновление firewall правила
     */
    async updateGroupRuleRaw(requestParameters: UpdateGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FirewallRuleOutResponse>> {
        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling updateGroupRule.');
        }

        if (requestParameters.ruleId === null || requestParameters.ruleId === undefined) {
            throw new runtime.RequiredError('ruleId','Required parameter requestParameters.ruleId was null or undefined when calling updateGroupRule.');
        }

        if (requestParameters.firewallRuleInAPI === null || requestParameters.firewallRuleInAPI === undefined) {
            throw new runtime.RequiredError('firewallRuleInAPI','Required parameter requestParameters.firewallRuleInAPI was null or undefined when calling updateGroupRule.');
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
            path: `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))).replace(`{${"rule_id"}}`, encodeURIComponent(String(requestParameters.ruleId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: FirewallRuleInAPIToJSON(requestParameters.firewallRuleInAPI),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FirewallRuleOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить правило, отправьте PATCH запрос на `/api/v1/firewall/groups/{group_id}/rules/{rule_id}`
     * Обновление firewall правила
     */
    async updateGroupRule(requestParameters: UpdateGroupRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FirewallRuleOutResponse> {
        const response = await this.updateGroupRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const CreateGroupPolicyEnum = {
    Drop: 'DROP',
    Accept: 'ACCEPT'
} as const;
export type CreateGroupPolicyEnum = typeof CreateGroupPolicyEnum[keyof typeof CreateGroupPolicyEnum];
