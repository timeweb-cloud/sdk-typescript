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
  GetAccountStatus403Response,
  GetAgentsTokenPackages200Response,
  GetAiModelParameters200Response,
  GetAiModelTokenPackages200Response,
  GetAiProvider200Response,
  GetAiProviders200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetKnowledgebasesTokenPackages200Response,
  GetModels200Response,
  GetModelsV3200Response,
} from '../models/index';
import {
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAgentsTokenPackages200ResponseFromJSON,
    GetAgentsTokenPackages200ResponseToJSON,
    GetAiModelParameters200ResponseFromJSON,
    GetAiModelParameters200ResponseToJSON,
    GetAiModelTokenPackages200ResponseFromJSON,
    GetAiModelTokenPackages200ResponseToJSON,
    GetAiProvider200ResponseFromJSON,
    GetAiProvider200ResponseToJSON,
    GetAiProviders200ResponseFromJSON,
    GetAiProviders200ResponseToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    GetKnowledgebasesTokenPackages200ResponseFromJSON,
    GetKnowledgebasesTokenPackages200ResponseToJSON,
    GetModels200ResponseFromJSON,
    GetModels200ResponseToJSON,
    GetModelsV3200ResponseFromJSON,
    GetModelsV3200ResponseToJSON,
} from '../models/index';

export interface GetAiModelTokenPackagesRequest {
    id: number;
}

export interface GetAiProviderRequest {
    id: number;
}

/**
 * 
 */
export class AIModelsApi extends runtime.BaseAPI {

    /**
     * Метод устарел.  Чтобы получить список пакетов токенов для AI агентов всех моделей, отправьте GET-запрос на `/api/v1/cloud-ai/token-packages/agents`.  Тело ответа будет представлять собой объект JSON с ключами `token_packages` и `meta`.
     * Получение списка пакетов токенов для агентов
     */
    async getAgentsTokenPackagesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentsTokenPackages200Response>> {
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
            path: `/api/v1/cloud-ai/token-packages/agents`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentsTokenPackages200ResponseFromJSON(jsonValue));
    }

    /**
     * Метод устарел.  Чтобы получить список пакетов токенов для AI агентов всех моделей, отправьте GET-запрос на `/api/v1/cloud-ai/token-packages/agents`.  Тело ответа будет представлять собой объект JSON с ключами `token_packages` и `meta`.
     * Получение списка пакетов токенов для агентов
     */
    async getAgentsTokenPackages(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentsTokenPackages200Response> {
        const response = await this.getAgentsTokenPackagesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить справочник характеристик, которые возвращаются в `parameter_values` моделей, отправьте GET-запрос на `/api/v3/cloud-ai/model-parameters`.  Справочник описывает название, тип, единицу измерения и направление сравнения каждой характеристики. Цены кэша (`cost_cache_read`, `cost_cache_write`) в справочник не входят.  Тело ответа будет представлять собой объект JSON с ключами `model_parameters` и `meta`.
     * Получение справочника характеристик моделей
     */
    async getAiModelParametersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiModelParameters200Response>> {
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
            path: `/api/v3/cloud-ai/model-parameters`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiModelParameters200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить справочник характеристик, которые возвращаются в `parameter_values` моделей, отправьте GET-запрос на `/api/v3/cloud-ai/model-parameters`.  Справочник описывает название, тип, единицу измерения и направление сравнения каждой характеристики. Цены кэша (`cost_cache_read`, `cost_cache_write`) в справочник не входят.  Тело ответа будет представлять собой объект JSON с ключами `model_parameters` и `meta`.
     * Получение справочника характеристик моделей
     */
    async getAiModelParameters(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiModelParameters200Response> {
        const response = await this.getAiModelParametersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить пакеты токенов, доступные для AI модели, отправьте GET-запрос на `/api/v1/cloud-ai/models/{id}/token-packages`.  Тело ответа будет представлять собой объект JSON с ключами `token_packages` и `meta`.
     * Получение пакетов токенов модели
     */
    async getAiModelTokenPackagesRaw(requestParameters: GetAiModelTokenPackagesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiModelTokenPackages200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAiModelTokenPackages.');
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
            path: `/api/v1/cloud-ai/models/{id}/token-packages`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiModelTokenPackages200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить пакеты токенов, доступные для AI модели, отправьте GET-запрос на `/api/v1/cloud-ai/models/{id}/token-packages`.  Тело ответа будет представлять собой объект JSON с ключами `token_packages` и `meta`.
     * Получение пакетов токенов модели
     */
    async getAiModelTokenPackages(requestParameters: GetAiModelTokenPackagesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiModelTokenPackages200Response> {
        const response = await this.getAiModelTokenPackagesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о провайдере AI моделей, отправьте GET-запрос на `/api/v1/cloud-ai/providers/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `provider`.
     * Получение провайдера моделей
     */
    async getAiProviderRaw(requestParameters: GetAiProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiProvider200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAiProvider.');
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
            path: `/api/v1/cloud-ai/providers/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiProvider200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о провайдере AI моделей, отправьте GET-запрос на `/api/v1/cloud-ai/providers/{id}`.  Тело ответа будет представлять собой объект JSON с ключом `provider`.
     * Получение провайдера моделей
     */
    async getAiProvider(requestParameters: GetAiProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiProvider200Response> {
        const response = await this.getAiProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список провайдеров AI моделей, отправьте GET-запрос на `/api/v1/cloud-ai/providers`.  Провайдер модели — поле `provider_id` модели.  Тело ответа будет представлять собой объект JSON с ключами `providers` и `meta`.
     * Получение списка провайдеров моделей
     */
    async getAiProvidersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiProviders200Response>> {
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
            path: `/api/v1/cloud-ai/providers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiProviders200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список провайдеров AI моделей, отправьте GET-запрос на `/api/v1/cloud-ai/providers`.  Провайдер модели — поле `provider_id` модели.  Тело ответа будет представлять собой объект JSON с ключами `providers` и `meta`.
     * Получение списка провайдеров моделей
     */
    async getAiProviders(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiProviders200Response> {
        const response = await this.getAiProvidersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список пакетов токенов для баз знаний, отправьте GET-запрос на `/api/v1/cloud-ai/token-packages/knowledge-bases`.  Базовый пакет (`package_type: base`) указывается при создании базы знаний, дополнительный (`package_type: additional`) покупается через `POST /api/v1/cloud-ai/knowledge-bases/{id}/add-additional-token-package`.  Тело ответа будет представлять собой объект JSON с ключами `token_packages` и `meta`.
     * Получение списка пакетов токенов для баз знаний
     */
    async getKnowledgebasesTokenPackagesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKnowledgebasesTokenPackages200Response>> {
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
            path: `/api/v1/cloud-ai/token-packages/knowledge-bases`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKnowledgebasesTokenPackages200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список пакетов токенов для баз знаний, отправьте GET-запрос на `/api/v1/cloud-ai/token-packages/knowledge-bases`.  Базовый пакет (`package_type: base`) указывается при создании базы знаний, дополнительный (`package_type: additional`) покупается через `POST /api/v1/cloud-ai/knowledge-bases/{id}/add-additional-token-package`.  Тело ответа будет представлять собой объект JSON с ключами `token_packages` и `meta`.
     * Получение списка пакетов токенов для баз знаний
     */
    async getKnowledgebasesTokenPackages(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKnowledgebasesTokenPackages200Response> {
        const response = await this.getKnowledgebasesTokenPackagesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Метод устарел — используйте `GET /api/v3/cloud-ai/models`.  Чтобы получить список AI моделей, отправьте GET-запрос на `/api/v1/cloud-ai/models`.  Тело ответа будет представлять собой объект JSON с ключами `models` и `meta`.
     * Получение списка моделей (v1)
     */
    async getModelsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetModels200Response>> {
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
            path: `/api/v1/cloud-ai/models`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetModels200ResponseFromJSON(jsonValue));
    }

    /**
     * Метод устарел — используйте `GET /api/v3/cloud-ai/models`.  Чтобы получить список AI моделей, отправьте GET-запрос на `/api/v1/cloud-ai/models`.  Тело ответа будет представлять собой объект JSON с ключами `models` и `meta`.
     * Получение списка моделей (v1)
     */
    async getModels(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetModels200Response> {
        const response = await this.getModelsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список AI моделей с ценами и характеристиками, отправьте GET-запрос на `/api/v3/cloud-ai/models`.  Цены и характеристики (контекст, модальности, индексы качества) возвращаются в словаре `parameter_values`, их названия и единицы — в справочнике `GET /api/v3/cloud-ai/model-parameters`. В списке есть и устаревшие модели — проверяйте `is_deprecated` и `is_stopped`.  Тело ответа будет представлять собой объект JSON с ключами `models` и `meta`.
     * Получение списка моделей
     */
    async getModelsV3Raw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetModelsV3200Response>> {
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
            path: `/api/v3/cloud-ai/models`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetModelsV3200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список AI моделей с ценами и характеристиками, отправьте GET-запрос на `/api/v3/cloud-ai/models`.  Цены и характеристики (контекст, модальности, индексы качества) возвращаются в словаре `parameter_values`, их названия и единицы — в справочнике `GET /api/v3/cloud-ai/model-parameters`. В списке есть и устаревшие модели — проверяйте `is_deprecated` и `is_stopped`.  Тело ответа будет представлять собой объект JSON с ключами `models` и `meta`.
     * Получение списка моделей
     */
    async getModelsV3(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetModelsV3200Response> {
        const response = await this.getModelsV3Raw(initOverrides);
        return await response.value();
    }

}
