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
  AuthorizeUrl,
  ConnectAgentTool,
  CreateAgentTool201Response,
  CreateTool,
  GetAccountStatus403Response,
  GetAgentToolTemplatePrices200Response,
  GetAgentToolTemplates200Response,
  GetAgentTools200Response,
  GetAgentToolsByAgent200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  InstallTool,
  UpdateAgentTool,
  UpdateTool,
} from '../models/index';
import {
    AuthorizeUrlFromJSON,
    AuthorizeUrlToJSON,
    ConnectAgentToolFromJSON,
    ConnectAgentToolToJSON,
    CreateAgentTool201ResponseFromJSON,
    CreateAgentTool201ResponseToJSON,
    CreateToolFromJSON,
    CreateToolToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAgentToolTemplatePrices200ResponseFromJSON,
    GetAgentToolTemplatePrices200ResponseToJSON,
    GetAgentToolTemplates200ResponseFromJSON,
    GetAgentToolTemplates200ResponseToJSON,
    GetAgentTools200ResponseFromJSON,
    GetAgentTools200ResponseToJSON,
    GetAgentToolsByAgent200ResponseFromJSON,
    GetAgentToolsByAgent200ResponseToJSON,
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
    InstallToolFromJSON,
    InstallToolToJSON,
    UpdateAgentToolFromJSON,
    UpdateAgentToolToJSON,
    UpdateToolFromJSON,
    UpdateToolToJSON,
} from '../models/index';

export interface ConnectAgentToolToAgentRequest {
    agentId: number;
    connectAgentTool: ConnectAgentTool;
}

export interface CreateAgentToolRequest {
    createTool: CreateTool;
}

export interface DeleteAgentToolRequest {
    id: number;
}

export interface DisconnectAgentToolFromAgentRequest {
    agentId: number;
    toolId: number;
}

export interface GetAgentToolRequest {
    id: number;
}

export interface GetAgentToolOAuth2AuthorizeUrlRequest {
    toolId: number;
    redirectUrl?: string;
}

export interface GetAgentToolTemplatePricesRequest {
    locale?: GetAgentToolTemplatePricesLocaleEnum;
}

export interface GetAgentToolsByAgentRequest {
    agentId: number;
}

export interface InstallAgentToolFromTemplateRequest {
    installTool: InstallTool;
}

export interface RefreshAgentToolMethodsRequest {
    id: number;
}

export interface UpdateAgentToolRequest {
    id: number;
    updateTool: UpdateTool;
}

export interface UpdateAgentToolConnectionRequest {
    agentId: number;
    toolId: number;
    updateAgentTool: UpdateAgentTool;
}

/**
 * 
 */
export class AIAgentToolsApi extends runtime.BaseAPI {

    /**
     * Чтобы подключить MCP-инструмент к агенту, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools`.  В `allowed_methods` перечислите методы, которые агенту разрешено вызывать. Подходят только имена из `methods[].name` инструмента, иначе вернётся 400 с `error_code` `invalid_methods_provided`. Повторно подключить уже подключённый инструмент нельзя. Чтобы изменить список методов, используйте PUT-запрос.
     * Подключение MCP-инструмента к агенту
     */
    async connectAgentToolToAgentRaw(requestParameters: ConnectAgentToolToAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling connectAgentToolToAgent.');
        }

        if (requestParameters.connectAgentTool === null || requestParameters.connectAgentTool === undefined) {
            throw new runtime.RequiredError('connectAgentTool','Required parameter requestParameters.connectAgentTool was null or undefined when calling connectAgentToolToAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/tools`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ConnectAgentToolToJSON(requestParameters.connectAgentTool),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы подключить MCP-инструмент к агенту, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools`.  В `allowed_methods` перечислите методы, которые агенту разрешено вызывать. Подходят только имена из `methods[].name` инструмента, иначе вернётся 400 с `error_code` `invalid_methods_provided`. Повторно подключить уже подключённый инструмент нельзя. Чтобы изменить список методов, используйте PUT-запрос.
     * Подключение MCP-инструмента к агенту
     */
    async connectAgentToolToAgent(requestParameters: ConnectAgentToolToAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.connectAgentToolToAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы подключить собственный MCP-сервер, отправьте POST-запрос на `/api/v1/cloud-ai/tools`.  Платформа сразу подключается к серверу и сохраняет список его методов. Если сервер недоступен или отвечает ошибкой, инструмент не создаётся: вернётся 400 с `error_code` `invalid_methods_provided`. Адреса частных сетей и localhost отклоняются с ошибкой 400.  Для `auth_data.type = oauth2` подключение к серверу при создании не проверяется. Инструмент создаётся в статусе `pending_auth` с пустым списком методов, а методы загружаются после авторизации пользователя: см. «Получение ссылки на OAuth2-авторизацию инструмента». Если не удалось определить адреса авторизации или зарегистрировать клиента, вернётся 401 с `error_code` `tool_authentication_failed`.  Чтобы агент мог пользоваться инструментом, подключите его к агенту.
     * Подключение собственного MCP-сервера
     */
    async createAgentToolRaw(requestParameters: CreateAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentTool201Response>> {
        if (requestParameters.createTool === null || requestParameters.createTool === undefined) {
            throw new runtime.RequiredError('createTool','Required parameter requestParameters.createTool was null or undefined when calling createAgentTool.');
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
            path: `/api/v1/cloud-ai/tools`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateToolToJSON(requestParameters.createTool),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentTool201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить собственный MCP-сервер, отправьте POST-запрос на `/api/v1/cloud-ai/tools`.  Платформа сразу подключается к серверу и сохраняет список его методов. Если сервер недоступен или отвечает ошибкой, инструмент не создаётся: вернётся 400 с `error_code` `invalid_methods_provided`. Адреса частных сетей и localhost отклоняются с ошибкой 400.  Для `auth_data.type = oauth2` подключение к серверу при создании не проверяется. Инструмент создаётся в статусе `pending_auth` с пустым списком методов, а методы загружаются после авторизации пользователя: см. «Получение ссылки на OAuth2-авторизацию инструмента». Если не удалось определить адреса авторизации или зарегистрировать клиента, вернётся 401 с `error_code` `tool_authentication_failed`.  Чтобы агент мог пользоваться инструментом, подключите его к агенту.
     * Подключение собственного MCP-сервера
     */
    async createAgentTool(requestParameters: CreateAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentTool201Response> {
        const response = await this.createAgentToolRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить MCP-инструмент, отправьте DELETE-запрос на `/api/v1/cloud-ai/tools/{id}`.  Инструмент автоматически отключается от всех агентов.
     * Удаление MCP-инструмента
     */
    async deleteAgentToolRaw(requestParameters: DeleteAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteAgentTool.');
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
            path: `/api/v1/cloud-ai/tools/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить MCP-инструмент, отправьте DELETE-запрос на `/api/v1/cloud-ai/tools/{id}`.  Инструмент автоматически отключается от всех агентов.
     * Удаление MCP-инструмента
     */
    async deleteAgentTool(requestParameters: DeleteAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentToolRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отключить MCP-инструмент от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools/{tool_id}`.  Сам инструмент остаётся в аккаунте и у других агентов.
     * Отключение MCP-инструмента от агента
     */
    async disconnectAgentToolFromAgentRaw(requestParameters: DisconnectAgentToolFromAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling disconnectAgentToolFromAgent.');
        }

        if (requestParameters.toolId === null || requestParameters.toolId === undefined) {
            throw new runtime.RequiredError('toolId','Required parameter requestParameters.toolId was null or undefined when calling disconnectAgentToolFromAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/tools/{tool_id}`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))).replace(`{${"tool_id"}}`, encodeURIComponent(String(requestParameters.toolId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить MCP-инструмент от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools/{tool_id}`.  Сам инструмент остаётся в аккаунте и у других агентов.
     * Отключение MCP-инструмента от агента
     */
    async disconnectAgentToolFromAgent(requestParameters: DisconnectAgentToolFromAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.disconnectAgentToolFromAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить MCP-инструмент, отправьте GET-запрос на `/api/v1/cloud-ai/tools/{id}`.  По полю `status` можно отследить завершение OAuth2-авторизации: после неё статус меняется с `pending_auth` на `active`.
     * Получение MCP-инструмента
     */
    async getAgentToolRaw(requestParameters: GetAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentTool201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgentTool.');
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
            path: `/api/v1/cloud-ai/tools/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentTool201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить MCP-инструмент, отправьте GET-запрос на `/api/v1/cloud-ai/tools/{id}`.  По полю `status` можно отследить завершение OAuth2-авторизации: после неё статус меняется с `pending_auth` на `active`.
     * Получение MCP-инструмента
     */
    async getAgentTool(requestParameters: GetAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentTool201Response> {
        const response = await this.getAgentToolRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить ссылку на OAuth2-авторизацию MCP-инструмента, отправьте GET-запрос на `/api/v1/cloud-ai/tools/oauth2/authorize-url/{tool_id}`.  Откройте `authorize_url` в браузере пользователя. Ссылка действует 30 минут. После входа и согласия провайдер вернёт пользователя на адрес возврата платформы `https://api.timeweb.cloud/api/v1/cloud-ai/oauth2/callback`. Платформа обменяет код на токены, переведёт инструмент в статус `active` и загрузит список методов.  Чтобы узнать результат, запрашивайте инструмент, пока его статус не сменится с `pending_auth` на `active`. Этим же запросом можно повторно авторизовать уже активный инструмент.
     * Получение ссылки на OAuth2-авторизацию инструмента
     */
    async getAgentToolOAuth2AuthorizeUrlRaw(requestParameters: GetAgentToolOAuth2AuthorizeUrlRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AuthorizeUrl>> {
        if (requestParameters.toolId === null || requestParameters.toolId === undefined) {
            throw new runtime.RequiredError('toolId','Required parameter requestParameters.toolId was null or undefined when calling getAgentToolOAuth2AuthorizeUrl.');
        }

        const queryParameters: any = {};

        if (requestParameters.redirectUrl !== undefined) {
            queryParameters['redirect_url'] = requestParameters.redirectUrl;
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
            path: `/api/v1/cloud-ai/tools/oauth2/authorize-url/{tool_id}`.replace(`{${"tool_id"}}`, encodeURIComponent(String(requestParameters.toolId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthorizeUrlFromJSON(jsonValue));
    }

    /**
     * Чтобы получить ссылку на OAuth2-авторизацию MCP-инструмента, отправьте GET-запрос на `/api/v1/cloud-ai/tools/oauth2/authorize-url/{tool_id}`.  Откройте `authorize_url` в браузере пользователя. Ссылка действует 30 минут. После входа и согласия провайдер вернёт пользователя на адрес возврата платформы `https://api.timeweb.cloud/api/v1/cloud-ai/oauth2/callback`. Платформа обменяет код на токены, переведёт инструмент в статус `active` и загрузит список методов.  Чтобы узнать результат, запрашивайте инструмент, пока его статус не сменится с `pending_auth` на `active`. Этим же запросом можно повторно авторизовать уже активный инструмент.
     * Получение ссылки на OAuth2-авторизацию инструмента
     */
    async getAgentToolOAuth2AuthorizeUrl(requestParameters: GetAgentToolOAuth2AuthorizeUrlRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AuthorizeUrl> {
        const response = await this.getAgentToolOAuth2AuthorizeUrlRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить цены системных инструментов платформы, например веб-поиска, отправьте GET-запрос на `/api/v1/cloud-ai/tools/templates/prices`.
     * Получение цен системных инструментов
     */
    async getAgentToolTemplatePricesRaw(requestParameters: GetAgentToolTemplatePricesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentToolTemplatePrices200Response>> {
        const queryParameters: any = {};

        if (requestParameters.locale !== undefined) {
            queryParameters['locale'] = requestParameters.locale;
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
            path: `/api/v1/cloud-ai/tools/templates/prices`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentToolTemplatePrices200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить цены системных инструментов платформы, например веб-поиска, отправьте GET-запрос на `/api/v1/cloud-ai/tools/templates/prices`.
     * Получение цен системных инструментов
     */
    async getAgentToolTemplatePrices(requestParameters: GetAgentToolTemplatePricesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentToolTemplatePrices200Response> {
        const response = await this.getAgentToolTemplatePricesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить готовые интеграции маркетплейса, отправьте GET-запрос на `/api/v1/cloud-ai/tools/templates/marketplace`.  Сначала идут самые популярные шаблоны. Поле `config_schema` описывает, что нужно передать в `config_values` при установке.
     * Получение шаблонов MCP-инструментов из маркетплейса
     */
    async getAgentToolTemplatesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentToolTemplates200Response>> {
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
            path: `/api/v1/cloud-ai/tools/templates/marketplace`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentToolTemplates200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить готовые интеграции маркетплейса, отправьте GET-запрос на `/api/v1/cloud-ai/tools/templates/marketplace`.  Сначала идут самые популярные шаблоны. Поле `config_schema` описывает, что нужно передать в `config_values` при установке.
     * Получение шаблонов MCP-инструментов из маркетплейса
     */
    async getAgentToolTemplates(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentToolTemplates200Response> {
        const response = await this.getAgentToolTemplatesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список MCP-инструментов аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/tools`.  В списке есть и собственные MCP-серверы, и инструменты, установленные из маркетплейса. Сначала идут новые. Удалённые инструменты не возвращаются. Секреты в `auth_data` заменены на `********`.
     * Получение списка MCP-инструментов
     */
    async getAgentToolsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentTools200Response>> {
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
            path: `/api/v1/cloud-ai/tools`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentTools200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список MCP-инструментов аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/tools`.  В списке есть и собственные MCP-серверы, и инструменты, установленные из маркетплейса. Сначала идут новые. Удалённые инструменты не возвращаются. Секреты в `auth_data` заменены на `********`.
     * Получение списка MCP-инструментов
     */
    async getAgentTools(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentTools200Response> {
        const response = await this.getAgentToolsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить MCP-инструменты, подключённые к агенту, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools`.  В ответе — инструменты целиком, в том же виде, что и в списке инструментов аккаунта. Списка разрешённых агенту методов в ответе нет.
     * Получение MCP-инструментов агента
     */
    async getAgentToolsByAgentRaw(requestParameters: GetAgentToolsByAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentToolsByAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling getAgentToolsByAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/tools`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentToolsByAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить MCP-инструменты, подключённые к агенту, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools`.  В ответе — инструменты целиком, в том же виде, что и в списке инструментов аккаунта. Списка разрешённых агенту методов в ответе нет.
     * Получение MCP-инструментов агента
     */
    async getAgentToolsByAgent(requestParameters: GetAgentToolsByAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentToolsByAgent200Response> {
        const response = await this.getAgentToolsByAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы установить MCP-инструмент из шаблона маркетплейса, отправьте POST-запрос на `/api/v1/cloud-ai/tools/install`.  Значения полей из `config_schema` шаблона передайте в `config_values`. Платформа соберёт из них заголовки авторизации, подключится к MCP-серверу и сохранит список методов. Если у шаблона есть `config_schema`, поле `auth_data` не используется. Если подключиться к серверу не удалось, вернётся 400 с `error_code` `invalid_methods_provided`.  Один шаблон можно установить несколько раз, например с разными ключами.
     * Установка MCP-инструмента из маркетплейса
     */
    async installAgentToolFromTemplateRaw(requestParameters: InstallAgentToolFromTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentTool201Response>> {
        if (requestParameters.installTool === null || requestParameters.installTool === undefined) {
            throw new runtime.RequiredError('installTool','Required parameter requestParameters.installTool was null or undefined when calling installAgentToolFromTemplate.');
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
            path: `/api/v1/cloud-ai/tools/install`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: InstallToolToJSON(requestParameters.installTool),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentTool201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы установить MCP-инструмент из шаблона маркетплейса, отправьте POST-запрос на `/api/v1/cloud-ai/tools/install`.  Значения полей из `config_schema` шаблона передайте в `config_values`. Платформа соберёт из них заголовки авторизации, подключится к MCP-серверу и сохранит список методов. Если у шаблона есть `config_schema`, поле `auth_data` не используется. Если подключиться к серверу не удалось, вернётся 400 с `error_code` `invalid_methods_provided`.  Один шаблон можно установить несколько раз, например с разными ключами.
     * Установка MCP-инструмента из маркетплейса
     */
    async installAgentToolFromTemplate(requestParameters: InstallAgentToolFromTemplateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentTool201Response> {
        const response = await this.installAgentToolFromTemplateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы заново получить список методов с MCP-сервера, отправьте POST-запрос на `/api/v1/cloud-ai/tools/{id}/refresh-methods`.  Список `methods` заменяется полученным с сервера, а методы, которых больше нет, убираются из разрешённых у всех агентов. Если обновление прошло успешно, инструмент переходит в статус `active`. Если сервер недоступен, инструмент переходит в статус `error` с причиной в `status_info`, а запрос возвращает 400 с `error_code` `invalid_methods_provided`.
     * Обновление списка методов MCP-инструмента
     */
    async refreshAgentToolMethodsRaw(requestParameters: RefreshAgentToolMethodsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentTool201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling refreshAgentToolMethods.');
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
            path: `/api/v1/cloud-ai/tools/{id}/refresh-methods`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentTool201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы заново получить список методов с MCP-сервера, отправьте POST-запрос на `/api/v1/cloud-ai/tools/{id}/refresh-methods`.  Список `methods` заменяется полученным с сервера, а методы, которых больше нет, убираются из разрешённых у всех агентов. Если обновление прошло успешно, инструмент переходит в статус `active`. Если сервер недоступен, инструмент переходит в статус `error` с причиной в `status_info`, а запрос возвращает 400 с `error_code` `invalid_methods_provided`.
     * Обновление списка методов MCP-инструмента
     */
    async refreshAgentToolMethods(requestParameters: RefreshAgentToolMethodsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentTool201Response> {
        const response = await this.refreshAgentToolMethodsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить MCP-инструмент, отправьте PUT-запрос на `/api/v1/cloud-ai/tools/{id}`, передав только изменяемые поля.  Если передать в `auth_data` секрет `********` из ответа API, сохранённый секрет не изменится. Изменение адреса или авторизации не обновляет список методов: после него вызовите обновление методов. Статус `inactive` выключает инструмент у всех агентов, к которым он подключён.
     * Изменение MCP-инструмента
     */
    async updateAgentToolRaw(requestParameters: UpdateAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentTool201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updateAgentTool.');
        }

        if (requestParameters.updateTool === null || requestParameters.updateTool === undefined) {
            throw new runtime.RequiredError('updateTool','Required parameter requestParameters.updateTool was null or undefined when calling updateAgentTool.');
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
            path: `/api/v1/cloud-ai/tools/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateToolToJSON(requestParameters.updateTool),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentTool201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить MCP-инструмент, отправьте PUT-запрос на `/api/v1/cloud-ai/tools/{id}`, передав только изменяемые поля.  Если передать в `auth_data` секрет `********` из ответа API, сохранённый секрет не изменится. Изменение адреса или авторизации не обновляет список методов: после него вызовите обновление методов. Статус `inactive` выключает инструмент у всех агентов, к которым он подключён.
     * Изменение MCP-инструмента
     */
    async updateAgentTool(requestParameters: UpdateAgentToolRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentTool201Response> {
        const response = await this.updateAgentToolRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить список методов, которые агенту разрешено вызывать, отправьте PUT-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools/{tool_id}`.  Список заменяется целиком. Подходят только имена из `methods[].name` инструмента, иначе вернётся 400 с `error_code` `invalid_methods_provided`. Если инструмент не подключён к агенту, вернётся 404 с `error_code` `agent-tool_link_not_found`.
     * Изменение разрешённых методов MCP-инструмента у агента
     */
    async updateAgentToolConnectionRaw(requestParameters: UpdateAgentToolConnectionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling updateAgentToolConnection.');
        }

        if (requestParameters.toolId === null || requestParameters.toolId === undefined) {
            throw new runtime.RequiredError('toolId','Required parameter requestParameters.toolId was null or undefined when calling updateAgentToolConnection.');
        }

        if (requestParameters.updateAgentTool === null || requestParameters.updateAgentTool === undefined) {
            throw new runtime.RequiredError('updateAgentTool','Required parameter requestParameters.updateAgentTool was null or undefined when calling updateAgentToolConnection.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/tools/{tool_id}`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))).replace(`{${"tool_id"}}`, encodeURIComponent(String(requestParameters.toolId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAgentToolToJSON(requestParameters.updateAgentTool),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы изменить список методов, которые агенту разрешено вызывать, отправьте PUT-запрос на `/api/v1/cloud-ai/agents/{agent_id}/tools/{tool_id}`.  Список заменяется целиком. Подходят только имена из `methods[].name` инструмента, иначе вернётся 400 с `error_code` `invalid_methods_provided`. Если инструмент не подключён к агенту, вернётся 404 с `error_code` `agent-tool_link_not_found`.
     * Изменение разрешённых методов MCP-инструмента у агента
     */
    async updateAgentToolConnection(requestParameters: UpdateAgentToolConnectionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateAgentToolConnectionRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const GetAgentToolTemplatePricesLocaleEnum = {
    Ru: 'ru',
    En: 'en'
} as const;
export type GetAgentToolTemplatePricesLocaleEnum = typeof GetAgentToolTemplatePricesLocaleEnum[keyof typeof GetAgentToolTemplatePricesLocaleEnum];
