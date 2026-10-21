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
  GetFinances401Response,
  JsonRpcErrorResponse,
  JsonRpcRequest,
  JsonRpcResultResponse,
} from '../models/index';
import {
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    JsonRpcErrorResponseFromJSON,
    JsonRpcErrorResponseToJSON,
    JsonRpcRequestFromJSON,
    JsonRpcRequestToJSON,
    JsonRpcResultResponseFromJSON,
    JsonRpcResultResponseToJSON,
} from '../models/index';

export interface OpenMcpSearchStreamRequest {
    accept: string;
    mCPProtocolVersion?: OpenMcpSearchStreamMCPProtocolVersionEnum;
}

export interface OpenMcpStreamRequest {
    accept: string;
    mCPProtocolVersion?: OpenMcpStreamMCPProtocolVersionEnum;
}

export interface SendMcpMessageRequest {
    accept: string;
    jsonRpcRequest: JsonRpcRequest;
    mCPProtocolVersion?: SendMcpMessageMCPProtocolVersionEnum;
    xMcpConfirmationUi?: SendMcpMessageXMcpConfirmationUiEnum;
}

export interface SendMcpSearchMessageRequest {
    accept: string;
    jsonRpcRequest: JsonRpcRequest;
    mCPProtocolVersion?: SendMcpSearchMessageMCPProtocolVersionEnum;
    xToolAccess?: SendMcpSearchMessageXToolAccessEnum;
    xAllowedTools?: string;
    xMcpConfirmationUi?: SendMcpSearchMessageXMcpConfirmationUiEnum;
}

/**
 * 
 */
export class MCPApi extends runtime.BaseAPI {

    /**
     * Чтобы завершить сессию сервера MCP `timeweb-cloud-mcp-search`, отправьте DELETE-запрос на `/api/v1/mcp/search`.  Сервер не хранит сессий (не выдаёт `Mcp-Session-Id`), поэтому завершать нечего: ответ всегда 200 без тела.
     * Завершение сессии сервера MCP с поиском инструментов
     */
    async deleteMcpSearchSessionRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
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
            path: `/api/v1/mcp/search`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы завершить сессию сервера MCP `timeweb-cloud-mcp-search`, отправьте DELETE-запрос на `/api/v1/mcp/search`.  Сервер не хранит сессий (не выдаёт `Mcp-Session-Id`), поэтому завершать нечего: ответ всегда 200 без тела.
     * Завершение сессии сервера MCP с поиском инструментов
     */
    async deleteMcpSearchSession(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteMcpSearchSessionRaw(initOverrides);
    }

    /**
     * Чтобы завершить сессию сервера MCP `timeweb-cloud-mcp`, отправьте DELETE-запрос на `/api/v1/mcp`.  Сервер не хранит сессий (не выдаёт `Mcp-Session-Id`), поэтому завершать нечего: ответ всегда 200 без тела.
     * Завершение сессии сервера MCP
     */
    async deleteMcpSessionRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
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
            path: `/api/v1/mcp`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы завершить сессию сервера MCP `timeweb-cloud-mcp`, отправьте DELETE-запрос на `/api/v1/mcp`.  Сервер не хранит сессий (не выдаёт `Mcp-Session-Id`), поэтому завершать нечего: ответ всегда 200 без тела.
     * Завершение сессии сервера MCP
     */
    async deleteMcpSession(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteMcpSessionRaw(initOverrides);
    }

    /**
     * Чтобы открыть поток сообщений, которые сервер MCP `timeweb-cloud-mcp-search` отправляет по своей инициативе, отправьте GET-запрос на `/api/v1/mcp/search`.  Сервер не отправляет сообщений по своей инициативе, поэтому поток не содержит событий и остаётся открытым, пока его не закроет шлюз. Через шлюз заголовки ответа на этот запрос могут долго не приходить. Открывать поток не нужно: работайте с сервером только POST-запросами — если клиент позволяет выбрать режим, отключите в нём GET-поток.
     * Открытие потока событий сервера MCP с поиском инструментов
     */
    async openMcpSearchStreamRaw(requestParameters: OpenMcpSearchStreamRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.accept === null || requestParameters.accept === undefined) {
            throw new runtime.RequiredError('accept','Required parameter requestParameters.accept was null or undefined when calling openMcpSearchStream.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.accept !== undefined && requestParameters.accept !== null) {
            headerParameters['Accept'] = String(requestParameters.accept);
        }

        if (requestParameters.mCPProtocolVersion !== undefined && requestParameters.mCPProtocolVersion !== null) {
            headerParameters['MCP-Protocol-Version'] = String(requestParameters.mCPProtocolVersion);
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/mcp/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Чтобы открыть поток сообщений, которые сервер MCP `timeweb-cloud-mcp-search` отправляет по своей инициативе, отправьте GET-запрос на `/api/v1/mcp/search`.  Сервер не отправляет сообщений по своей инициативе, поэтому поток не содержит событий и остаётся открытым, пока его не закроет шлюз. Через шлюз заголовки ответа на этот запрос могут долго не приходить. Открывать поток не нужно: работайте с сервером только POST-запросами — если клиент позволяет выбрать режим, отключите в нём GET-поток.
     * Открытие потока событий сервера MCP с поиском инструментов
     */
    async openMcpSearchStream(requestParameters: OpenMcpSearchStreamRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.openMcpSearchStreamRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы открыть поток сообщений, которые сервер MCP `timeweb-cloud-mcp` отправляет по своей инициативе, отправьте GET-запрос на `/api/v1/mcp`.  Сервер не отправляет сообщений по своей инициативе, поэтому поток не содержит событий и остаётся открытым, пока его не закроет шлюз. Через шлюз заголовки ответа на этот запрос могут долго не приходить. Открывать поток не нужно: работайте с сервером только POST-запросами — если клиент позволяет выбрать режим, отключите в нём GET-поток.
     * Открытие потока событий сервера MCP
     */
    async openMcpStreamRaw(requestParameters: OpenMcpStreamRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.accept === null || requestParameters.accept === undefined) {
            throw new runtime.RequiredError('accept','Required parameter requestParameters.accept was null or undefined when calling openMcpStream.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.accept !== undefined && requestParameters.accept !== null) {
            headerParameters['Accept'] = String(requestParameters.accept);
        }

        if (requestParameters.mCPProtocolVersion !== undefined && requestParameters.mCPProtocolVersion !== null) {
            headerParameters['MCP-Protocol-Version'] = String(requestParameters.mCPProtocolVersion);
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/mcp`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Чтобы открыть поток сообщений, которые сервер MCP `timeweb-cloud-mcp` отправляет по своей инициативе, отправьте GET-запрос на `/api/v1/mcp`.  Сервер не отправляет сообщений по своей инициативе, поэтому поток не содержит событий и остаётся открытым, пока его не закроет шлюз. Через шлюз заголовки ответа на этот запрос могут долго не приходить. Открывать поток не нужно: работайте с сервером только POST-запросами — если клиент позволяет выбрать режим, отключите в нём GET-поток.
     * Открытие потока событий сервера MCP
     */
    async openMcpStream(requestParameters: OpenMcpStreamRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.openMcpStreamRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы отправить запрос или уведомление серверу MCP `timeweb-cloud-mcp`, отправьте POST-запрос на `/api/v1/mcp` с сообщением JSON-RPC 2.0 в теле.  Через этот метод идут все запросы MCP: `initialize`, `tools/list` (все инструменты сразу), `tools/call`, `resources/list`, `resources/read`, `ping`. Ответ на запрос приходит потоком `text/event-stream` с одним событием `message`, уведомление принимается с кодом 202 без тела. Изменяющие инструменты выполняются в два вызова с `confirm_token` — см. описание раздела.  Заголовки `x-tool-access` и `x-allowed-tools` здесь не действуют — используйте `/api/v1/mcp/search`.
     * Отправка JSON-RPC-сообщения серверу MCP
     */
    async sendMcpMessageRaw(requestParameters: SendMcpMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JsonRpcResultResponse>> {
        if (requestParameters.accept === null || requestParameters.accept === undefined) {
            throw new runtime.RequiredError('accept','Required parameter requestParameters.accept was null or undefined when calling sendMcpMessage.');
        }

        if (requestParameters.jsonRpcRequest === null || requestParameters.jsonRpcRequest === undefined) {
            throw new runtime.RequiredError('jsonRpcRequest','Required parameter requestParameters.jsonRpcRequest was null or undefined when calling sendMcpMessage.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (requestParameters.accept !== undefined && requestParameters.accept !== null) {
            headerParameters['Accept'] = String(requestParameters.accept);
        }

        if (requestParameters.mCPProtocolVersion !== undefined && requestParameters.mCPProtocolVersion !== null) {
            headerParameters['MCP-Protocol-Version'] = String(requestParameters.mCPProtocolVersion);
        }

        if (requestParameters.xMcpConfirmationUi !== undefined && requestParameters.xMcpConfirmationUi !== null) {
            headerParameters['x-mcp-confirmation-ui'] = String(requestParameters.xMcpConfirmationUi);
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/mcp`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: JsonRpcRequestToJSON(requestParameters.jsonRpcRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => JsonRpcResultResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отправить запрос или уведомление серверу MCP `timeweb-cloud-mcp`, отправьте POST-запрос на `/api/v1/mcp` с сообщением JSON-RPC 2.0 в теле.  Через этот метод идут все запросы MCP: `initialize`, `tools/list` (все инструменты сразу), `tools/call`, `resources/list`, `resources/read`, `ping`. Ответ на запрос приходит потоком `text/event-stream` с одним событием `message`, уведомление принимается с кодом 202 без тела. Изменяющие инструменты выполняются в два вызова с `confirm_token` — см. описание раздела.  Заголовки `x-tool-access` и `x-allowed-tools` здесь не действуют — используйте `/api/v1/mcp/search`.
     * Отправка JSON-RPC-сообщения серверу MCP
     */
    async sendMcpMessage(requestParameters: SendMcpMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JsonRpcResultResponse> {
        const response = await this.sendMcpMessageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы отправить запрос или уведомление серверу MCP `timeweb-cloud-mcp-search`, отправьте POST-запрос на `/api/v1/mcp/search` с сообщением JSON-RPC 2.0 в теле.  `tools/list` возвращает четыре инструмента: `search_tools`, `get_tool_definition`, `execute_tool` и `request_user_confirmation`. Все операции облака находятся через `search_tools` и выполняются через `execute_tool`; изменяющие операции — в два вызова `execute_tool` с `confirm_token` внутри `arguments`.  Доступ модели можно сузить заголовками `x-tool-access` и `x-allowed-tools`. Недопустимое значение `x-tool-access` — ответ 400 с ошибкой `-32600`.
     * Отправка JSON-RPC-сообщения серверу MCP с поиском инструментов
     */
    async sendMcpSearchMessageRaw(requestParameters: SendMcpSearchMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JsonRpcResultResponse>> {
        if (requestParameters.accept === null || requestParameters.accept === undefined) {
            throw new runtime.RequiredError('accept','Required parameter requestParameters.accept was null or undefined when calling sendMcpSearchMessage.');
        }

        if (requestParameters.jsonRpcRequest === null || requestParameters.jsonRpcRequest === undefined) {
            throw new runtime.RequiredError('jsonRpcRequest','Required parameter requestParameters.jsonRpcRequest was null or undefined when calling sendMcpSearchMessage.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (requestParameters.accept !== undefined && requestParameters.accept !== null) {
            headerParameters['Accept'] = String(requestParameters.accept);
        }

        if (requestParameters.mCPProtocolVersion !== undefined && requestParameters.mCPProtocolVersion !== null) {
            headerParameters['MCP-Protocol-Version'] = String(requestParameters.mCPProtocolVersion);
        }

        if (requestParameters.xToolAccess !== undefined && requestParameters.xToolAccess !== null) {
            headerParameters['x-tool-access'] = String(requestParameters.xToolAccess);
        }

        if (requestParameters.xAllowedTools !== undefined && requestParameters.xAllowedTools !== null) {
            headerParameters['x-allowed-tools'] = String(requestParameters.xAllowedTools);
        }

        if (requestParameters.xMcpConfirmationUi !== undefined && requestParameters.xMcpConfirmationUi !== null) {
            headerParameters['x-mcp-confirmation-ui'] = String(requestParameters.xMcpConfirmationUi);
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/mcp/search`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: JsonRpcRequestToJSON(requestParameters.jsonRpcRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => JsonRpcResultResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отправить запрос или уведомление серверу MCP `timeweb-cloud-mcp-search`, отправьте POST-запрос на `/api/v1/mcp/search` с сообщением JSON-RPC 2.0 в теле.  `tools/list` возвращает четыре инструмента: `search_tools`, `get_tool_definition`, `execute_tool` и `request_user_confirmation`. Все операции облака находятся через `search_tools` и выполняются через `execute_tool`; изменяющие операции — в два вызова `execute_tool` с `confirm_token` внутри `arguments`.  Доступ модели можно сузить заголовками `x-tool-access` и `x-allowed-tools`. Недопустимое значение `x-tool-access` — ответ 400 с ошибкой `-32600`.
     * Отправка JSON-RPC-сообщения серверу MCP с поиском инструментов
     */
    async sendMcpSearchMessage(requestParameters: SendMcpSearchMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JsonRpcResultResponse> {
        const response = await this.sendMcpSearchMessageRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const OpenMcpSearchStreamMCPProtocolVersionEnum = {
    _20251125: '2025-11-25',
    _20250618: '2025-06-18',
    _20250326: '2025-03-26',
    _20241105: '2024-11-05',
    _20241007: '2024-10-07'
} as const;
export type OpenMcpSearchStreamMCPProtocolVersionEnum = typeof OpenMcpSearchStreamMCPProtocolVersionEnum[keyof typeof OpenMcpSearchStreamMCPProtocolVersionEnum];
/**
 * @export
 */
export const OpenMcpStreamMCPProtocolVersionEnum = {
    _20251125: '2025-11-25',
    _20250618: '2025-06-18',
    _20250326: '2025-03-26',
    _20241105: '2024-11-05',
    _20241007: '2024-10-07'
} as const;
export type OpenMcpStreamMCPProtocolVersionEnum = typeof OpenMcpStreamMCPProtocolVersionEnum[keyof typeof OpenMcpStreamMCPProtocolVersionEnum];
/**
 * @export
 */
export const SendMcpMessageMCPProtocolVersionEnum = {
    _20251125: '2025-11-25',
    _20250618: '2025-06-18',
    _20250326: '2025-03-26',
    _20241105: '2024-11-05',
    _20241007: '2024-10-07'
} as const;
export type SendMcpMessageMCPProtocolVersionEnum = typeof SendMcpMessageMCPProtocolVersionEnum[keyof typeof SendMcpMessageMCPProtocolVersionEnum];
/**
 * @export
 */
export const SendMcpMessageXMcpConfirmationUiEnum = {
    Text: 'text',
    Buttons: 'buttons'
} as const;
export type SendMcpMessageXMcpConfirmationUiEnum = typeof SendMcpMessageXMcpConfirmationUiEnum[keyof typeof SendMcpMessageXMcpConfirmationUiEnum];
/**
 * @export
 */
export const SendMcpSearchMessageMCPProtocolVersionEnum = {
    _20251125: '2025-11-25',
    _20250618: '2025-06-18',
    _20250326: '2025-03-26',
    _20241105: '2024-11-05',
    _20241007: '2024-10-07'
} as const;
export type SendMcpSearchMessageMCPProtocolVersionEnum = typeof SendMcpSearchMessageMCPProtocolVersionEnum[keyof typeof SendMcpSearchMessageMCPProtocolVersionEnum];
/**
 * @export
 */
export const SendMcpSearchMessageXToolAccessEnum = {
    ReadOnly: 'read-only'
} as const;
export type SendMcpSearchMessageXToolAccessEnum = typeof SendMcpSearchMessageXToolAccessEnum[keyof typeof SendMcpSearchMessageXToolAccessEnum];
/**
 * @export
 */
export const SendMcpSearchMessageXMcpConfirmationUiEnum = {
    Text: 'text',
    Buttons: 'buttons'
} as const;
export type SendMcpSearchMessageXMcpConfirmationUiEnum = typeof SendMcpSearchMessageXMcpConfirmationUiEnum[keyof typeof SendMcpSearchMessageXMcpConfirmationUiEnum];
