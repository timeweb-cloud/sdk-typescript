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
  AvailableNetworksResponse,
  AvailableStaticRoutesResponse,
  DnatIn,
  DnatRuleResponse,
  DnatRulesResponse,
  GetAccountStatus403Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  NatIn,
  NetworkEdit,
  NetworkIn,
  NetworkResponse,
  NetworksResponse,
  RouterEdit,
  RouterIn,
  RouterPresetsResponse,
  RouterResponse,
  RouterStatisticsResponse,
  RoutersResponse,
  StaticRouteIn,
  StaticRouteResponse,
  StaticRoutesResponse,
} from '../models/index';
import {
    AvailableNetworksResponseFromJSON,
    AvailableNetworksResponseToJSON,
    AvailableStaticRoutesResponseFromJSON,
    AvailableStaticRoutesResponseToJSON,
    DnatInFromJSON,
    DnatInToJSON,
    DnatRuleResponseFromJSON,
    DnatRuleResponseToJSON,
    DnatRulesResponseFromJSON,
    DnatRulesResponseToJSON,
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
    NatInFromJSON,
    NatInToJSON,
    NetworkEditFromJSON,
    NetworkEditToJSON,
    NetworkInFromJSON,
    NetworkInToJSON,
    NetworkResponseFromJSON,
    NetworkResponseToJSON,
    NetworksResponseFromJSON,
    NetworksResponseToJSON,
    RouterEditFromJSON,
    RouterEditToJSON,
    RouterInFromJSON,
    RouterInToJSON,
    RouterPresetsResponseFromJSON,
    RouterPresetsResponseToJSON,
    RouterResponseFromJSON,
    RouterResponseToJSON,
    RouterStatisticsResponseFromJSON,
    RouterStatisticsResponseToJSON,
    RoutersResponseFromJSON,
    RoutersResponseToJSON,
    StaticRouteInFromJSON,
    StaticRouteInToJSON,
    StaticRouteResponseFromJSON,
    StaticRouteResponseToJSON,
    StaticRoutesResponseFromJSON,
    StaticRoutesResponseToJSON,
} from '../models/index';

export interface AddNetworksRequest {
    routerId: string;
    networkIn: NetworkIn;
}

export interface CreateRouterRequest {
    routerIn: RouterIn;
}

export interface DeleteDnatRequest {
    routerId: string;
    dnatId: string;
}

export interface DeleteRouterRequest {
    routerId: string;
}

export interface DeleteRouterNatRequest {
    routerId: string;
    networkName: string;
}

export interface DeleteRouterNetworkRequest {
    routerId: string;
    networkName: string;
}

export interface DeleteStaticRouteRequest {
    routerId: string;
    staticRouteId: string;
}

export interface GetAvailableStaticRoutesRequest {
    routerId: string;
}

export interface GetDnatRequest {
    routerId: string;
}

export interface GetDnatRuleRequest {
    routerId: string;
    dnatId: string;
}

export interface GetNetworksRequest {
    routerId: string;
}

export interface GetRouterRequest {
    routerId: string;
}

export interface GetRouterStatisticsRequest {
    routerId: string;
    timeFrom: string;
    period: string;
    keys: string;
    nodeId?: string;
}

export interface GetStaticRoutesRequest {
    routerId: string;
}

export interface PatchNetworkRequest {
    routerId: string;
    networkName: string;
    networkEdit: NetworkEdit;
}

export interface PatchNetworksRequest {
    routerId: string;
    networkIn: NetworkIn;
}

export interface PostDnatRequest {
    routerId: string;
    dnatIn: DnatIn;
}

export interface PostStaticRouteRequest {
    routerId: string;
    staticRouteIn: StaticRouteIn;
}

export interface UpdateRouterRequest {
    routerId: string;
    routerEdit: RouterEdit;
}

export interface UpdateRouterNatRequest {
    routerId: string;
    networkName: string;
    natIn: NatIn;
}

/**
 * 
 */
export class RoutersApi extends runtime.BaseAPI {

    /**
     * Чтобы подключить сети к роутеру, отправьте POST-запрос на `/api/v1/routers/{router_id}/networks`.
     * Подключение сетей к роутеру
     */
    async addNetworksRaw(requestParameters: AddNetworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<NetworksResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling addNetworks.');
        }

        if (requestParameters.networkIn === null || requestParameters.networkIn === undefined) {
            throw new runtime.RequiredError('networkIn','Required parameter requestParameters.networkIn was null or undefined when calling addNetworks.');
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
            path: `/api/v1/routers/{router_id}/networks`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NetworkInToJSON(requestParameters.networkIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NetworksResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить сети к роутеру, отправьте POST-запрос на `/api/v1/routers/{router_id}/networks`.
     * Подключение сетей к роутеру
     */
    async addNetworks(requestParameters: AddNetworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<NetworksResponse> {
        const response = await this.addNetworksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать роутер, отправьте POST-запрос на `/api/v1/routers`.
     * Создание роутера
     */
    async createRouterRaw(requestParameters: CreateRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RouterResponse>> {
        if (requestParameters.routerIn === null || requestParameters.routerIn === undefined) {
            throw new runtime.RequiredError('routerIn','Required parameter requestParameters.routerIn was null or undefined when calling createRouter.');
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
            path: `/api/v1/routers`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RouterInToJSON(requestParameters.routerIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RouterResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать роутер, отправьте POST-запрос на `/api/v1/routers`.
     * Создание роутера
     */
    async createRouter(requestParameters: CreateRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RouterResponse> {
        const response = await this.createRouterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить правило проброса портов (DNAT), отправьте DELETE-запрос на `/api/v1/routers/{router_id}/dnat-rules/{dnat_id}`.
     * Удаление правила проброса портов
     */
    async deleteDnatRaw(requestParameters: DeleteDnatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling deleteDnat.');
        }

        if (requestParameters.dnatId === null || requestParameters.dnatId === undefined) {
            throw new runtime.RequiredError('dnatId','Required parameter requestParameters.dnatId was null or undefined when calling deleteDnat.');
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
            path: `/api/v1/routers/{router_id}/dnat-rules/{dnat_id}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"dnat_id"}}`, encodeURIComponent(String(requestParameters.dnatId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить правило проброса портов (DNAT), отправьте DELETE-запрос на `/api/v1/routers/{router_id}/dnat-rules/{dnat_id}`.
     * Удаление правила проброса портов
     */
    async deleteDnat(requestParameters: DeleteDnatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDnatRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить роутер, отправьте DELETE-запрос на `/api/v1/routers/{router_id}`.
     * Удаление роутера
     */
    async deleteRouterRaw(requestParameters: DeleteRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling deleteRouter.');
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
            path: `/api/v1/routers/{router_id}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить роутер, отправьте DELETE-запрос на `/api/v1/routers/{router_id}`.
     * Удаление роутера
     */
    async deleteRouter(requestParameters: DeleteRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteRouterRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы выключить NAT для сети роутера, отправьте DELETE-запрос на `/api/v1/routers/{router_id}/networks/{network_name}/nat`.
     * Выключение NAT для сети
     */
    async deleteRouterNatRaw(requestParameters: DeleteRouterNatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RouterResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling deleteRouterNat.');
        }

        if (requestParameters.networkName === null || requestParameters.networkName === undefined) {
            throw new runtime.RequiredError('networkName','Required parameter requestParameters.networkName was null or undefined when calling deleteRouterNat.');
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
            path: `/api/v1/routers/{router_id}/networks/{network_name}/nat`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"network_name"}}`, encodeURIComponent(String(requestParameters.networkName))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RouterResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы выключить NAT для сети роутера, отправьте DELETE-запрос на `/api/v1/routers/{router_id}/networks/{network_name}/nat`.
     * Выключение NAT для сети
     */
    async deleteRouterNat(requestParameters: DeleteRouterNatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RouterResponse> {
        const response = await this.deleteRouterNatRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы отключить сеть от роутера, отправьте DELETE-запрос на `/api/v1/routers/{router_id}/networks/{network_name}`.
     * Удаление сети из роутера
     */
    async deleteRouterNetworkRaw(requestParameters: DeleteRouterNetworkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling deleteRouterNetwork.');
        }

        if (requestParameters.networkName === null || requestParameters.networkName === undefined) {
            throw new runtime.RequiredError('networkName','Required parameter requestParameters.networkName was null or undefined when calling deleteRouterNetwork.');
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
            path: `/api/v1/routers/{router_id}/networks/{network_name}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"network_name"}}`, encodeURIComponent(String(requestParameters.networkName))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить сеть от роутера, отправьте DELETE-запрос на `/api/v1/routers/{router_id}/networks/{network_name}`.
     * Удаление сети из роутера
     */
    async deleteRouterNetwork(requestParameters: DeleteRouterNetworkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteRouterNetworkRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить статический маршрут, отправьте DELETE-запрос на `/api/v1/routers/{router_id}/static-routes/{static_route_id}`.
     * Удаление статического маршрута
     */
    async deleteStaticRouteRaw(requestParameters: DeleteStaticRouteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling deleteStaticRoute.');
        }

        if (requestParameters.staticRouteId === null || requestParameters.staticRouteId === undefined) {
            throw new runtime.RequiredError('staticRouteId','Required parameter requestParameters.staticRouteId was null or undefined when calling deleteStaticRoute.');
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
            path: `/api/v1/routers/{router_id}/static-routes/{static_route_id}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"static_route_id"}}`, encodeURIComponent(String(requestParameters.staticRouteId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить статический маршрут, отправьте DELETE-запрос на `/api/v1/routers/{router_id}/static-routes/{static_route_id}`.
     * Удаление статического маршрута
     */
    async deleteStaticRoute(requestParameters: DeleteStaticRouteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteStaticRouteRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить список подсетей, доступных для добавления статических маршрутов, отправьте GET-запрос на `/api/v1/routers/{router_id}/static-routes/available`.
     * Получение доступных подсетей для статических маршрутов
     */
    async getAvailableStaticRoutesRaw(requestParameters: GetAvailableStaticRoutesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AvailableStaticRoutesResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling getAvailableStaticRoutes.');
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
            path: `/api/v1/routers/{router_id}/static-routes/available`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AvailableStaticRoutesResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список подсетей, доступных для добавления статических маршрутов, отправьте GET-запрос на `/api/v1/routers/{router_id}/static-routes/available`.
     * Получение доступных подсетей для статических маршрутов
     */
    async getAvailableStaticRoutes(requestParameters: GetAvailableStaticRoutesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AvailableStaticRoutesResponse> {
        const response = await this.getAvailableStaticRoutesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список правил проброса портов (DNAT), отправьте GET-запрос на `/api/v1/routers/{router_id}/dnat-rules`.
     * Получение списка правил проброса портов
     */
    async getDnatRaw(requestParameters: GetDnatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DnatRulesResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling getDnat.');
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
            path: `/api/v1/routers/{router_id}/dnat-rules`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DnatRulesResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список правил проброса портов (DNAT), отправьте GET-запрос на `/api/v1/routers/{router_id}/dnat-rules`.
     * Получение списка правил проброса портов
     */
    async getDnat(requestParameters: GetDnatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DnatRulesResponse> {
        const response = await this.getDnatRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о правиле проброса портов (DNAT), отправьте GET-запрос на `/api/v1/routers/{router_id}/dnat-rules/{dnat_id}`.
     * Получение правила проброса портов
     */
    async getDnatRuleRaw(requestParameters: GetDnatRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DnatRuleResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling getDnatRule.');
        }

        if (requestParameters.dnatId === null || requestParameters.dnatId === undefined) {
            throw new runtime.RequiredError('dnatId','Required parameter requestParameters.dnatId was null or undefined when calling getDnatRule.');
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
            path: `/api/v1/routers/{router_id}/dnat-rules/{dnat_id}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"dnat_id"}}`, encodeURIComponent(String(requestParameters.dnatId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DnatRuleResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о правиле проброса портов (DNAT), отправьте GET-запрос на `/api/v1/routers/{router_id}/dnat-rules/{dnat_id}`.
     * Получение правила проброса портов
     */
    async getDnatRule(requestParameters: GetDnatRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DnatRuleResponse> {
        const response = await this.getDnatRuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список сетей роутера, отправьте GET-запрос на `/api/v1/routers/{router_id}/networks`.
     * Получение списка сетей роутера
     */
    async getNetworksRaw(requestParameters: GetNetworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<NetworksResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling getNetworks.');
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
            path: `/api/v1/routers/{router_id}/networks`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NetworksResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список сетей роутера, отправьте GET-запрос на `/api/v1/routers/{router_id}/networks`.
     * Получение списка сетей роутера
     */
    async getNetworks(requestParameters: GetNetworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<NetworksResponse> {
        const response = await this.getNetworksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о роутере, отправьте GET-запрос на `/api/v1/routers/{router_id}`.
     * Получение информации о роутере
     */
    async getRouterRaw(requestParameters: GetRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RouterResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling getRouter.');
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
            path: `/api/v1/routers/{router_id}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RouterResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о роутере, отправьте GET-запрос на `/api/v1/routers/{router_id}`.
     * Получение информации о роутере
     */
    async getRouter(requestParameters: GetRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RouterResponse> {
        const response = await this.getRouterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список локальных сетей, доступных для подключения к роутеру, отправьте GET-запрос на `/api/v1/routers/networks/available`.
     * Получение списка доступных сетей
     */
    async getRouterAvailableNetworksRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AvailableNetworksResponse>> {
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
            path: `/api/v1/routers/networks/available`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AvailableNetworksResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список локальных сетей, доступных для подключения к роутеру, отправьте GET-запрос на `/api/v1/routers/networks/available`.
     * Получение списка доступных сетей
     */
    async getRouterAvailableNetworks(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AvailableNetworksResponse> {
        const response = await this.getRouterAvailableNetworksRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список доступных тарифов роутеров, отправьте GET-запрос на `/api/v1/presets/routers`.
     * Получение списка тарифов роутеров
     */
    async getRouterPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RouterPresetsResponse>> {
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
            path: `/api/v1/presets/routers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RouterPresetsResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список доступных тарифов роутеров, отправьте GET-запрос на `/api/v1/presets/routers`.
     * Получение списка тарифов роутеров
     */
    async getRouterPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RouterPresetsResponse> {
        const response = await this.getRouterPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статистику роутера, отправьте GET-запрос на `/api/v1/routers/{router_id}/statistics/{time_from}/{period}/{keys}`.
     * Получение статистики роутера
     */
    async getRouterStatisticsRaw(requestParameters: GetRouterStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RouterStatisticsResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling getRouterStatistics.');
        }

        if (requestParameters.timeFrom === null || requestParameters.timeFrom === undefined) {
            throw new runtime.RequiredError('timeFrom','Required parameter requestParameters.timeFrom was null or undefined when calling getRouterStatistics.');
        }

        if (requestParameters.period === null || requestParameters.period === undefined) {
            throw new runtime.RequiredError('period','Required parameter requestParameters.period was null or undefined when calling getRouterStatistics.');
        }

        if (requestParameters.keys === null || requestParameters.keys === undefined) {
            throw new runtime.RequiredError('keys','Required parameter requestParameters.keys was null or undefined when calling getRouterStatistics.');
        }

        const queryParameters: any = {};

        if (requestParameters.nodeId !== undefined) {
            queryParameters['node_id'] = requestParameters.nodeId;
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
            path: `/api/v1/routers/{router_id}/statistics/{time_from}/{period}/{keys}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"time_from"}}`, encodeURIComponent(String(requestParameters.timeFrom))).replace(`{${"period"}}`, encodeURIComponent(String(requestParameters.period))).replace(`{${"keys"}}`, encodeURIComponent(String(requestParameters.keys))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RouterStatisticsResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статистику роутера, отправьте GET-запрос на `/api/v1/routers/{router_id}/statistics/{time_from}/{period}/{keys}`.
     * Получение статистики роутера
     */
    async getRouterStatistics(requestParameters: GetRouterStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RouterStatisticsResponse> {
        const response = await this.getRouterStatisticsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список роутеров, отправьте GET-запрос на `/api/v1/routers`.
     * Получение списка роутеров
     */
    async getRoutersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RoutersResponse>> {
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
            path: `/api/v1/routers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RoutersResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список роутеров, отправьте GET-запрос на `/api/v1/routers`.
     * Получение списка роутеров
     */
    async getRouters(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RoutersResponse> {
        const response = await this.getRoutersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список статических маршрутов роутера, отправьте GET-запрос на `/api/v1/routers/{router_id}/static-routes`.
     * Получение списка статических маршрутов
     */
    async getStaticRoutesRaw(requestParameters: GetStaticRoutesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaticRoutesResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling getStaticRoutes.');
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
            path: `/api/v1/routers/{router_id}/static-routes`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaticRoutesResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список статических маршрутов роутера, отправьте GET-запрос на `/api/v1/routers/{router_id}/static-routes`.
     * Получение списка статических маршрутов
     */
    async getStaticRoutes(requestParameters: GetStaticRoutesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaticRoutesResponse> {
        const response = await this.getStaticRoutesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы включить или выключить DHCP в сети роутера, отправьте PATCH-запрос на `/api/v1/routers/{router_id}/networks/{network_name}`.
     * Обновление информации о сети
     */
    async patchNetworkRaw(requestParameters: PatchNetworkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<NetworkResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling patchNetwork.');
        }

        if (requestParameters.networkName === null || requestParameters.networkName === undefined) {
            throw new runtime.RequiredError('networkName','Required parameter requestParameters.networkName was null or undefined when calling patchNetwork.');
        }

        if (requestParameters.networkEdit === null || requestParameters.networkEdit === undefined) {
            throw new runtime.RequiredError('networkEdit','Required parameter requestParameters.networkEdit was null or undefined when calling patchNetwork.');
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
            path: `/api/v1/routers/{router_id}/networks/{network_name}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"network_name"}}`, encodeURIComponent(String(requestParameters.networkName))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: NetworkEditToJSON(requestParameters.networkEdit),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NetworkResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы включить или выключить DHCP в сети роутера, отправьте PATCH-запрос на `/api/v1/routers/{router_id}/networks/{network_name}`.
     * Обновление информации о сети
     */
    async patchNetwork(requestParameters: PatchNetworkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<NetworkResponse> {
        const response = await this.patchNetworkRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы обновить набор сетей роутера, отправьте PATCH-запрос на `/api/v1/routers/{router_id}/networks`.
     * Обновление сетей роутера
     */
    async patchNetworksRaw(requestParameters: PatchNetworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<NetworksResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling patchNetworks.');
        }

        if (requestParameters.networkIn === null || requestParameters.networkIn === undefined) {
            throw new runtime.RequiredError('networkIn','Required parameter requestParameters.networkIn was null or undefined when calling patchNetworks.');
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
            path: `/api/v1/routers/{router_id}/networks`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: NetworkInToJSON(requestParameters.networkIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NetworksResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить набор сетей роутера, отправьте PATCH-запрос на `/api/v1/routers/{router_id}/networks`.
     * Обновление сетей роутера
     */
    async patchNetworks(requestParameters: PatchNetworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<NetworksResponse> {
        const response = await this.patchNetworksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить правило проброса портов (DNAT), отправьте POST-запрос на `/api/v1/routers/{router_id}/dnat-rules`.
     * Добавление правила проброса портов
     */
    async postDnatRaw(requestParameters: PostDnatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DnatRuleResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling postDnat.');
        }

        if (requestParameters.dnatIn === null || requestParameters.dnatIn === undefined) {
            throw new runtime.RequiredError('dnatIn','Required parameter requestParameters.dnatIn was null or undefined when calling postDnat.');
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
            path: `/api/v1/routers/{router_id}/dnat-rules`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DnatInToJSON(requestParameters.dnatIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DnatRuleResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить правило проброса портов (DNAT), отправьте POST-запрос на `/api/v1/routers/{router_id}/dnat-rules`.
     * Добавление правила проброса портов
     */
    async postDnat(requestParameters: PostDnatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DnatRuleResponse> {
        const response = await this.postDnatRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить статический маршрут, отправьте POST-запрос на `/api/v1/routers/{router_id}/static-routes`.
     * Добавление статического маршрута
     */
    async postStaticRouteRaw(requestParameters: PostStaticRouteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StaticRouteResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling postStaticRoute.');
        }

        if (requestParameters.staticRouteIn === null || requestParameters.staticRouteIn === undefined) {
            throw new runtime.RequiredError('staticRouteIn','Required parameter requestParameters.staticRouteIn was null or undefined when calling postStaticRoute.');
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
            path: `/api/v1/routers/{router_id}/static-routes`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StaticRouteInToJSON(requestParameters.staticRouteIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StaticRouteResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить статический маршрут, отправьте POST-запрос на `/api/v1/routers/{router_id}/static-routes`.
     * Добавление статического маршрута
     */
    async postStaticRoute(requestParameters: PostStaticRouteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StaticRouteResponse> {
        const response = await this.postStaticRouteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы обновить информацию о роутере, отправьте PATCH-запрос на `/api/v1/routers/{router_id}`.
     * Обновление информации о роутере
     */
    async updateRouterRaw(requestParameters: UpdateRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RouterResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling updateRouter.');
        }

        if (requestParameters.routerEdit === null || requestParameters.routerEdit === undefined) {
            throw new runtime.RequiredError('routerEdit','Required parameter requestParameters.routerEdit was null or undefined when calling updateRouter.');
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
            path: `/api/v1/routers/{router_id}`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: RouterEditToJSON(requestParameters.routerEdit),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RouterResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить информацию о роутере, отправьте PATCH-запрос на `/api/v1/routers/{router_id}`.
     * Обновление информации о роутере
     */
    async updateRouter(requestParameters: UpdateRouterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RouterResponse> {
        const response = await this.updateRouterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы включить NAT для сети роутера, отправьте PATCH-запрос на `/api/v1/routers/{router_id}/networks/{network_name}/nat`.
     * Включение NAT для сети
     */
    async updateRouterNatRaw(requestParameters: UpdateRouterNatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RouterResponse>> {
        if (requestParameters.routerId === null || requestParameters.routerId === undefined) {
            throw new runtime.RequiredError('routerId','Required parameter requestParameters.routerId was null or undefined when calling updateRouterNat.');
        }

        if (requestParameters.networkName === null || requestParameters.networkName === undefined) {
            throw new runtime.RequiredError('networkName','Required parameter requestParameters.networkName was null or undefined when calling updateRouterNat.');
        }

        if (requestParameters.natIn === null || requestParameters.natIn === undefined) {
            throw new runtime.RequiredError('natIn','Required parameter requestParameters.natIn was null or undefined when calling updateRouterNat.');
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
            path: `/api/v1/routers/{router_id}/networks/{network_name}/nat`.replace(`{${"router_id"}}`, encodeURIComponent(String(requestParameters.routerId))).replace(`{${"network_name"}}`, encodeURIComponent(String(requestParameters.networkName))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: NatInToJSON(requestParameters.natIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RouterResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы включить NAT для сети роутера, отправьте PATCH-запрос на `/api/v1/routers/{router_id}/networks/{network_name}/nat`.
     * Включение NAT для сети
     */
    async updateRouterNat(requestParameters: UpdateRouterNatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RouterResponse> {
        const response = await this.updateRouterNatRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
