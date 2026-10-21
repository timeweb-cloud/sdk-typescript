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
  AddTokenPackage,
  ChangeAgentModel,
  CreateAgent,
  CreateAgent201Response,
  CreateAgentEntityLimit,
  CreateAgentEntityLimit201Response,
  CreateAgentV2,
  DeleteAgent,
  ExportAgentChatsCsv200Response,
  GetAccountStatus403Response,
  GetAgentChatList200Response,
  GetAgentChatMessages200Response,
  GetAgentEntityLimits200Response,
  GetAgentStatistics200Response,
  GetAgentV3200Response,
  GetAgents200Response,
  GetAgentsV3200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  SyncAgentEntityLimits,
  UpdateAgent,
  UpdateAgentEntityLimit,
  UpdateDatabaseInstance409Response,
} from '../models/index';
import {
    AddTokenPackageFromJSON,
    AddTokenPackageToJSON,
    ChangeAgentModelFromJSON,
    ChangeAgentModelToJSON,
    CreateAgentFromJSON,
    CreateAgentToJSON,
    CreateAgent201ResponseFromJSON,
    CreateAgent201ResponseToJSON,
    CreateAgentEntityLimitFromJSON,
    CreateAgentEntityLimitToJSON,
    CreateAgentEntityLimit201ResponseFromJSON,
    CreateAgentEntityLimit201ResponseToJSON,
    CreateAgentV2FromJSON,
    CreateAgentV2ToJSON,
    DeleteAgentFromJSON,
    DeleteAgentToJSON,
    ExportAgentChatsCsv200ResponseFromJSON,
    ExportAgentChatsCsv200ResponseToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAgentChatList200ResponseFromJSON,
    GetAgentChatList200ResponseToJSON,
    GetAgentChatMessages200ResponseFromJSON,
    GetAgentChatMessages200ResponseToJSON,
    GetAgentEntityLimits200ResponseFromJSON,
    GetAgentEntityLimits200ResponseToJSON,
    GetAgentStatistics200ResponseFromJSON,
    GetAgentStatistics200ResponseToJSON,
    GetAgentV3200ResponseFromJSON,
    GetAgentV3200ResponseToJSON,
    GetAgents200ResponseFromJSON,
    GetAgents200ResponseToJSON,
    GetAgentsV3200ResponseFromJSON,
    GetAgentsV3200ResponseToJSON,
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
    SyncAgentEntityLimitsFromJSON,
    SyncAgentEntityLimitsToJSON,
    UpdateAgentFromJSON,
    UpdateAgentToJSON,
    UpdateAgentEntityLimitFromJSON,
    UpdateAgentEntityLimitToJSON,
    UpdateDatabaseInstance409ResponseFromJSON,
    UpdateDatabaseInstance409ResponseToJSON,
} from '../models/index';

export interface AddAdditionalTokenPackageRequest {
    id: number;
    addTokenPackage?: AddTokenPackage;
}

export interface ChangeAgentModelRequest {
    id: number;
    changeAgentModel: ChangeAgentModel;
}

export interface CreateAgentRequest {
    createAgent: CreateAgent;
}

export interface CreateAgentEntityLimitRequest {
    id: number;
    createAgentEntityLimit: CreateAgentEntityLimit;
}

export interface CreateAgentV2Request {
    createAgentV2: CreateAgentV2;
}

export interface DeleteAgentRequest {
    id: number;
    deleteAgent?: DeleteAgent;
}

export interface DeleteAgentEntityLimitRequest {
    id: number;
    limitId: string;
}

export interface ExportAgentChatsCsvRequest {
    id: number;
    offset?: number;
    limit?: number;
    order?: ExportAgentChatsCsvOrderEnum;
    from?: Date;
    to?: Date;
    locale?: ExportAgentChatsCsvLocaleEnum;
}

export interface GetAgentRequest {
    id: number;
}

export interface GetAgentChatListRequest {
    id: number;
    offset?: number;
    limit?: number;
    order?: GetAgentChatListOrderEnum;
    from?: Date;
    to?: Date;
    reactionType?: GetAgentChatListReactionTypeEnum;
    responseTimeRanges?: Array<string>;
}

export interface GetAgentChatMessagesRequest {
    id: number;
    chatId: string;
    offset?: number;
    limit?: number;
    order?: GetAgentChatMessagesOrderEnum;
    from?: Date;
    to?: Date;
}

export interface GetAgentEntityLimitRequest {
    id: number;
    limitId: string;
}

export interface GetAgentEntityLimitsRequest {
    id: number;
    limitType?: GetAgentEntityLimitsLimitTypeEnum;
}

export interface GetAgentStatisticsRequest {
    id: number;
    startTime?: Date;
    endTime?: Date;
    interval?: number;
}

export interface GetAgentV3Request {
    id: number;
}

export interface SyncAgentEntityLimitsRequest {
    id: number;
    syncAgentEntityLimits: SyncAgentEntityLimits;
}

export interface UpdateAgentRequest {
    id: number;
    updateAgent: UpdateAgent;
}

export interface UpdateAgentEntityLimitRequest {
    id: number;
    limitId: string;
    updateAgentEntityLimit: UpdateAgentEntityLimit;
}

/**
 * 
 */
export class AIAgentsApi extends runtime.BaseAPI {

    /**
     * Чтобы докупить дополнительные пакеты токенов для AI агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{id}/add-additional-token-package`.  Метод относится к устаревшей схеме оплаты пакетами токенов и работает только для агентов с пакетом (`token_package_id` в ответе агента). Для агентов с поресурсной оплатой вернётся 400 `per-resource_agents_do_not_support_additional_token_packages`. Стоимость (цена дополнительного пакета модели агента × `count`) сразу списывается с баланса; при нехватке средств — 400 `insufficient_balance`, если подписка агента истекла — 400 `subscription_expired`. После покупки заблокированный агент разблокируется.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Добавление дополнительного пакета токенов
     */
    async addAdditionalTokenPackageRaw(requestParameters: AddAdditionalTokenPackageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling addAdditionalTokenPackage.');
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
            path: `/api/v1/cloud-ai/agents/{id}/add-additional-token-package`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddTokenPackageToJSON(requestParameters.addTokenPackage),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы докупить дополнительные пакеты токенов для AI агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{id}/add-additional-token-package`.  Метод относится к устаревшей схеме оплаты пакетами токенов и работает только для агентов с пакетом (`token_package_id` в ответе агента). Для агентов с поресурсной оплатой вернётся 400 `per-resource_agents_do_not_support_additional_token_packages`. Стоимость (цена дополнительного пакета модели агента × `count`) сразу списывается с баланса; при нехватке средств — 400 `insufficient_balance`, если подписка агента истекла — 400 `subscription_expired`. После покупки заблокированный агент разблокируется.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Добавление дополнительного пакета токенов
     */
    async addAdditionalTokenPackage(requestParameters: AddAdditionalTokenPackageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addAdditionalTokenPackageRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы сменить основную модель AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/agents/{id}/model`.  Параметры модели из `settings.model`, которые новая модель не поддерживает, отбрасываются. Смена модели доступна только агентам с поресурсной оплатой (для агента с пакетом токенов — 400 `model_change_is_allowed_only_for_per-resource_account_and_agent`). Если модель не найдена или недоступна — 404 `model_not_found`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Смена модели AI агента
     */
    async changeAgentModelRaw(requestParameters: ChangeAgentModelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgent201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling changeAgentModel.');
        }

        if (requestParameters.changeAgentModel === null || requestParameters.changeAgentModel === undefined) {
            throw new runtime.RequiredError('changeAgentModel','Required parameter requestParameters.changeAgentModel was null or undefined when calling changeAgentModel.');
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
            path: `/api/v1/cloud-ai/agents/{id}/model`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ChangeAgentModelToJSON(requestParameters.changeAgentModel),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgent201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы сменить основную модель AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/agents/{id}/model`.  Параметры модели из `settings.model`, которые новая модель не поддерживает, отбрасываются. Смена модели доступна только агентам с поресурсной оплатой (для агента с пакетом токенов — 400 `model_change_is_allowed_only_for_per-resource_account_and_agent`). Если модель не найдена или недоступна — 404 `model_not_found`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Смена модели AI агента
     */
    async changeAgentModel(requestParameters: ChangeAgentModelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgent201Response> {
        const response = await this.changeAgentModelRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать AI агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents`, задав необходимые атрибуты.  Метод устарел — используйте `POST /api/v2/cloud-ai/agents`. Поле `token_package_id` обязательно, но не учитывается: агент всегда создаётся с поресурсной оплатой (оплачиваются фактические запросы к модели).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Создание AI агента
     */
    async createAgentRaw(requestParameters: CreateAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgent201Response>> {
        if (requestParameters.createAgent === null || requestParameters.createAgent === undefined) {
            throw new runtime.RequiredError('createAgent','Required parameter requestParameters.createAgent was null or undefined when calling createAgent.');
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
            path: `/api/v1/cloud-ai/agents`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAgentToJSON(requestParameters.createAgent),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgent201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать AI агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents`, задав необходимые атрибуты.  Метод устарел — используйте `POST /api/v2/cloud-ai/agents`. Поле `token_package_id` обязательно, но не учитывается: агент всегда создаётся с поресурсной оплатой (оплачиваются фактические запросы к модели).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Создание AI агента
     */
    async createAgent(requestParameters: CreateAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgent201Response> {
        const response = await this.createAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать лимит AI агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits`.  Лимиты агента ограничивают расход на его запросы за период (`hour`, `day`, `week`, `month`) — в токенах (`limit`) или в деньгах (`money_limit`, приоритетнее). Лимит действует на все модели агента (`model_id` = `null`) или на одну модель. При достижении лимита запросы к агенту отклоняются до конца периода.  Нужно передать `limit` или `money_limit` (иначе — 400 `entity_keys_limit_value_required`). Если лимит с тем же периодом и моделью уже есть — 409 `entity_keys_limit_already_exists` (измените его или используйте синхронизацию).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Создание лимита агента
     */
    async createAgentEntityLimitRaw(requestParameters: CreateAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentEntityLimit201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling createAgentEntityLimit.');
        }

        if (requestParameters.createAgentEntityLimit === null || requestParameters.createAgentEntityLimit === undefined) {
            throw new runtime.RequiredError('createAgentEntityLimit','Required parameter requestParameters.createAgentEntityLimit was null or undefined when calling createAgentEntityLimit.');
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
            path: `/api/v1/cloud-ai/agents/{id}/entity-limits`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAgentEntityLimitToJSON(requestParameters.createAgentEntityLimit),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentEntityLimit201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать лимит AI агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits`.  Лимиты агента ограничивают расход на его запросы за период (`hour`, `day`, `week`, `month`) — в токенах (`limit`) или в деньгах (`money_limit`, приоритетнее). Лимит действует на все модели агента (`model_id` = `null`) или на одну модель. При достижении лимита запросы к агенту отклоняются до конца периода.  Нужно передать `limit` или `money_limit` (иначе — 400 `entity_keys_limit_value_required`). Если лимит с тем же периодом и моделью уже есть — 409 `entity_keys_limit_already_exists` (измените его или используйте синхронизацию).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Создание лимита агента
     */
    async createAgentEntityLimit(requestParameters: CreateAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentEntityLimit201Response> {
        const response = await this.createAgentEntityLimitRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать AI агента, отправьте POST-запрос на `/api/v2/cloud-ai/agents`, задав необходимые атрибуты.  Агент создаётся с поресурсной оплатой: оплачиваются фактические запросы к модели. Если не переданы настройки виджета, подставляются значения по умолчанию. Дневной лимит расходов можно задать сразу полем `money_limit`, остальные лимиты — через лимиты агента (`/api/v1/cloud-ai/agents/{id}/entity-limits`).  Если модель не найдена или недоступна, вернётся 404 `model_not_found`; если модель не поддерживается — 400 `model_not_supported`; недопустимые параметры модели в `settings.model` — 400.  Вызывать созданного агента из своих приложений можно через OpenAI-совместимое API по его `access_id` — см. [документацию](https://agent.timeweb.cloud/docs).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Создание AI агента
     */
    async createAgentV2Raw(requestParameters: CreateAgentV2Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgent201Response>> {
        if (requestParameters.createAgentV2 === null || requestParameters.createAgentV2 === undefined) {
            throw new runtime.RequiredError('createAgentV2','Required parameter requestParameters.createAgentV2 was null or undefined when calling createAgentV2.');
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
            path: `/api/v2/cloud-ai/agents`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAgentV2ToJSON(requestParameters.createAgentV2),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgent201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать AI агента, отправьте POST-запрос на `/api/v2/cloud-ai/agents`, задав необходимые атрибуты.  Агент создаётся с поресурсной оплатой: оплачиваются фактические запросы к модели. Если не переданы настройки виджета, подставляются значения по умолчанию. Дневной лимит расходов можно задать сразу полем `money_limit`, остальные лимиты — через лимиты агента (`/api/v1/cloud-ai/agents/{id}/entity-limits`).  Если модель не найдена или недоступна, вернётся 404 `model_not_found`; если модель не поддерживается — 400 `model_not_supported`; недопустимые параметры модели в `settings.model` — 400.  Вызывать созданного агента из своих приложений можно через OpenAI-совместимое API по его `access_id` — см. [документацию](https://agent.timeweb.cloud/docs).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Создание AI агента
     */
    async createAgentV2(requestParameters: CreateAgentV2Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgent201Response> {
        const response = await this.createAgentV2Raw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{id}`.  Вместе с агентом отключаются его базы знаний, навыки и интеграции (Telegram, MAX, Jivo, Crisp). В теле запроса можно необязательно указать причину удаления.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Удаление AI агента
     */
    async deleteAgentRaw(requestParameters: DeleteAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteAgent.');
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
            path: `/api/v1/cloud-ai/agents/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteAgentToJSON(requestParameters.deleteAgent),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{id}`.  Вместе с агентом отключаются его базы знаний, навыки и интеграции (Telegram, MAX, Jivo, Crisp). В теле запроса можно необязательно указать причину удаления.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Удаление AI агента
     */
    async deleteAgent(requestParameters: DeleteAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить лимит AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Удаление лимита агента
     */
    async deleteAgentEntityLimitRaw(requestParameters: DeleteAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling deleteAgentEntityLimit.');
        }

        if (requestParameters.limitId === null || requestParameters.limitId === undefined) {
            throw new runtime.RequiredError('limitId','Required parameter requestParameters.limitId was null or undefined when calling deleteAgentEntityLimit.');
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
            path: `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"limit_id"}}`, encodeURIComponent(String(requestParameters.limitId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить лимит AI агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Удаление лимита агента
     */
    async deleteAgentEntityLimit(requestParameters: DeleteAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentEntityLimitRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы выгрузить чаты AI агента в формате CSV, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/chats/docs`.  CSV возвращается строкой в поле `chats_csv.csv` тела JSON. `limit` и `offset` применяются к сообщениям, а не к чатам. Если передан `from`, выгружаются сообщения от `from` до `to` (по умолчанию — до текущего момента). Чаты внешнего чата не выгружаются.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Выгрузка чатов агента в CSV
     */
    async exportAgentChatsCsvRaw(requestParameters: ExportAgentChatsCsvRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ExportAgentChatsCsv200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling exportAgentChatsCsv.');
        }

        const queryParameters: any = {};

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.order !== undefined) {
            queryParameters['order'] = requestParameters.order;
        }

        if (requestParameters.from !== undefined) {
            queryParameters['from'] = (requestParameters.from as any).toISOString();
        }

        if (requestParameters.to !== undefined) {
            queryParameters['to'] = (requestParameters.to as any).toISOString();
        }

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
            path: `/api/v1/cloud-ai/agents/{id}/chats/docs`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ExportAgentChatsCsv200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы выгрузить чаты AI агента в формате CSV, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/chats/docs`.  CSV возвращается строкой в поле `chats_csv.csv` тела JSON. `limit` и `offset` применяются к сообщениям, а не к чатам. Если передан `from`, выгружаются сообщения от `from` до `to` (по умолчанию — до текущего момента). Чаты внешнего чата не выгружаются.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Выгрузка чатов агента в CSV
     */
    async exportAgentChatsCsv(requestParameters: ExportAgentChatsCsvRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ExportAgentChatsCsv200Response> {
        const response = await this.exportAgentChatsCsvRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию об AI агенте, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение AI агента
     */
    async getAgentRaw(requestParameters: GetAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgent201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgent.');
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
            path: `/api/v1/cloud-ai/agents/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgent201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию об AI агенте, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение AI агента
     */
    async getAgent(requestParameters: GetAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgent201Response> {
        const response = await this.getAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список чатов (диалогов) AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/chat-list`.  Для каждого чата возвращаются первое сообщение пользователя, количество оценок и среднее время ответа. Чаты внешнего чата сюда не входят. Фильтр по периоду применяется, только если переданы оба параметра `from` и `to`. В `meta.metrics` — сводка по чатам для фильтров.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение списка чатов агента
     */
    async getAgentChatListRaw(requestParameters: GetAgentChatListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentChatList200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgentChatList.');
        }

        const queryParameters: any = {};

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.order !== undefined) {
            queryParameters['order'] = requestParameters.order;
        }

        if (requestParameters.from !== undefined) {
            queryParameters['from'] = (requestParameters.from as any).toISOString();
        }

        if (requestParameters.to !== undefined) {
            queryParameters['to'] = (requestParameters.to as any).toISOString();
        }

        if (requestParameters.reactionType !== undefined) {
            queryParameters['reaction_type'] = requestParameters.reactionType;
        }

        if (requestParameters.responseTimeRanges) {
            queryParameters['response_time_ranges'] = requestParameters.responseTimeRanges;
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
            path: `/api/v1/cloud-ai/agents/{id}/chat-list`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentChatList200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список чатов (диалогов) AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/chat-list`.  Для каждого чата возвращаются первое сообщение пользователя, количество оценок и среднее время ответа. Чаты внешнего чата сюда не входят. Фильтр по периоду применяется, только если переданы оба параметра `from` и `to`. В `meta.metrics` — сводка по чатам для фильтров.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение списка чатов агента
     */
    async getAgentChatList(requestParameters: GetAgentChatListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentChatList200Response> {
        const response = await this.getAgentChatListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить сообщения чата AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/chat-list/{chat_id}/messages`.  Возвращаются сообщения пользователя и ответы агента. Фильтр по периоду применяется, только если переданы оба параметра `from` и `to`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение сообщений чата агента
     */
    async getAgentChatMessagesRaw(requestParameters: GetAgentChatMessagesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentChatMessages200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgentChatMessages.');
        }

        if (requestParameters.chatId === null || requestParameters.chatId === undefined) {
            throw new runtime.RequiredError('chatId','Required parameter requestParameters.chatId was null or undefined when calling getAgentChatMessages.');
        }

        const queryParameters: any = {};

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.order !== undefined) {
            queryParameters['order'] = requestParameters.order;
        }

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
            path: `/api/v1/cloud-ai/agents/{id}/chat-list/{chat_id}/messages`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"chat_id"}}`, encodeURIComponent(String(requestParameters.chatId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentChatMessages200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить сообщения чата AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/chat-list/{chat_id}/messages`.  Возвращаются сообщения пользователя и ответы агента. Фильтр по периоду применяется, только если переданы оба параметра `from` и `to`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение сообщений чата агента
     */
    async getAgentChatMessages(requestParameters: GetAgentChatMessagesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentChatMessages200Response> {
        const response = await this.getAgentChatMessagesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить лимит AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение лимита агента
     */
    async getAgentEntityLimitRaw(requestParameters: GetAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentEntityLimit201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgentEntityLimit.');
        }

        if (requestParameters.limitId === null || requestParameters.limitId === undefined) {
            throw new runtime.RequiredError('limitId','Required parameter requestParameters.limitId was null or undefined when calling getAgentEntityLimit.');
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
            path: `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"limit_id"}}`, encodeURIComponent(String(requestParameters.limitId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentEntityLimit201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить лимит AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение лимита агента
     */
    async getAgentEntityLimit(requestParameters: GetAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentEntityLimit201Response> {
        const response = await this.getAgentEntityLimitRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить лимиты AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits`.  Лимиты агента ограничивают расход на его запросы за период (`hour`, `day`, `week`, `month`) — в токенах (`limit`) или в деньгах (`money_limit`, приоритетнее). Лимит действует на все модели агента (`model_id` = `null`) или на одну модель. При достижении лимита запросы к агенту отклоняются до конца периода.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение лимитов агента
     */
    async getAgentEntityLimitsRaw(requestParameters: GetAgentEntityLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentEntityLimits200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgentEntityLimits.');
        }

        const queryParameters: any = {};

        if (requestParameters.limitType !== undefined) {
            queryParameters['limit_type'] = requestParameters.limitType;
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
            path: `/api/v1/cloud-ai/agents/{id}/entity-limits`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentEntityLimits200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить лимиты AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits`.  Лимиты агента ограничивают расход на его запросы за период (`hour`, `day`, `week`, `month`) — в токенах (`limit`) или в деньгах (`money_limit`, приоритетнее). Лимит действует на все модели агента (`model_id` = `null`) или на одну модель. При достижении лимита запросы к агенту отклоняются до конца периода.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение лимитов агента
     */
    async getAgentEntityLimits(requestParameters: GetAgentEntityLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentEntityLimits200Response> {
        const response = await this.getAgentEntityLimitsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статистику использования токенов AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/statistic`.  Статистика разбита на интервалы длиной `interval` минут: для каждого интервала возвращается по точке на каждую модель, к которой были запросы за период, а для интервалов без запросов — одна нулевая точка без `model_name`. По умолчанию возвращаются последние 24 часа.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение статистики использования токенов агента
     */
    async getAgentStatisticsRaw(requestParameters: GetAgentStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentStatistics200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgentStatistics.');
        }

        const queryParameters: any = {};

        if (requestParameters.startTime !== undefined) {
            queryParameters['startTime'] = (requestParameters.startTime as any).toISOString();
        }

        if (requestParameters.endTime !== undefined) {
            queryParameters['endTime'] = (requestParameters.endTime as any).toISOString();
        }

        if (requestParameters.interval !== undefined) {
            queryParameters['interval'] = requestParameters.interval;
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
            path: `/api/v1/cloud-ai/agents/{id}/statistic`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentStatistics200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статистику использования токенов AI агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{id}/statistic`.  Статистика разбита на интервалы длиной `interval` минут: для каждого интервала возвращается по точке на каждую модель, к которой были запросы за период, а для интервалов без запросов — одна нулевая точка без `model_name`. По умолчанию возвращаются последние 24 часа.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение статистики использования токенов агента
     */
    async getAgentStatistics(requestParameters: GetAgentStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentStatistics200Response> {
        const response = await this.getAgentStatisticsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию об AI агенте, отправьте GET-запрос на `/api/v3/cloud-ai/agents/{id}`.  Отличается от `/api/v1/cloud-ai/agents/{id}` тем, что вместо `knowledge_bases_ids` возвращает `knowledge_bases` — подключённые базы знаний с режимом поиска.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение AI агента (v3)
     */
    async getAgentV3Raw(requestParameters: GetAgentV3Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentV3200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling getAgentV3.');
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
            path: `/api/v3/cloud-ai/agents/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentV3200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию об AI агенте, отправьте GET-запрос на `/api/v3/cloud-ai/agents/{id}`.  Отличается от `/api/v1/cloud-ai/agents/{id}` тем, что вместо `knowledge_bases_ids` возвращает `knowledge_bases` — подключённые базы знаний с режимом поиска.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение AI агента (v3)
     */
    async getAgentV3(requestParameters: GetAgentV3Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentV3200Response> {
        const response = await this.getAgentV3Raw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список AI агентов, отправьте GET-запрос на `/api/v1/cloud-ai/agents`.  Возвращаются все агенты аккаунта (без пагинации), включая приостановленных и заблокированных. Тело ответа будет представлять собой объект JSON с ключами `agents` и `meta`. Подключённые базы знаний вместе с режимом поиска возвращает метод `/api/v3/cloud-ai/agents`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение списка AI агентов
     */
    async getAgentsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgents200Response>> {
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
            path: `/api/v1/cloud-ai/agents`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgents200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список AI агентов, отправьте GET-запрос на `/api/v1/cloud-ai/agents`.  Возвращаются все агенты аккаунта (без пагинации), включая приостановленных и заблокированных. Тело ответа будет представлять собой объект JSON с ключами `agents` и `meta`. Подключённые базы знаний вместе с режимом поиска возвращает метод `/api/v3/cloud-ai/agents`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение списка AI агентов
     */
    async getAgents(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgents200Response> {
        const response = await this.getAgentsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список AI агентов, отправьте GET-запрос на `/api/v3/cloud-ai/agents`.  Отличается от `/api/v1/cloud-ai/agents` тем, что вместо `knowledge_bases_ids` возвращает `knowledge_bases` — подключённые базы знаний с режимом поиска.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение списка AI агентов (v3)
     */
    async getAgentsV3Raw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentsV3200Response>> {
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
            path: `/api/v3/cloud-ai/agents`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentsV3200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список AI агентов, отправьте GET-запрос на `/api/v3/cloud-ai/agents`.  Отличается от `/api/v1/cloud-ai/agents` тем, что вместо `knowledge_bases_ids` возвращает `knowledge_bases` — подключённые базы знаний с режимом поиска.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:read`.
     * Получение списка AI агентов (v3)
     */
    async getAgentsV3(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentsV3200Response> {
        const response = await this.getAgentsV3Raw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы задать полный набор лимитов AI агента за период, отправьте PUT-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/sync`.  Лимиты из запроса создаются или обновляются (сопоставление по `model_id`), а лимиты этого периода, которых нет в запросе, удаляются. Лимиты других периодов не затрагиваются. В ответе — актуальные лимиты периода. Если лимиты одновременно изменил другой запрос, вернётся 409 `entity_keys_limits_sync_conflict` — повторите запрос.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Синхронизация лимитов агента за период
     */
    async syncAgentEntityLimitsRaw(requestParameters: SyncAgentEntityLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentEntityLimits200Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling syncAgentEntityLimits.');
        }

        if (requestParameters.syncAgentEntityLimits === null || requestParameters.syncAgentEntityLimits === undefined) {
            throw new runtime.RequiredError('syncAgentEntityLimits','Required parameter requestParameters.syncAgentEntityLimits was null or undefined when calling syncAgentEntityLimits.');
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
            path: `/api/v1/cloud-ai/agents/{id}/entity-limits/sync`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SyncAgentEntityLimitsToJSON(requestParameters.syncAgentEntityLimits),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentEntityLimits200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы задать полный набор лимитов AI агента за период, отправьте PUT-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/sync`.  Лимиты из запроса создаются или обновляются (сопоставление по `model_id`), а лимиты этого периода, которых нет в запросе, удаляются. Лимиты других периодов не затрагиваются. В ответе — актуальные лимиты периода. Если лимиты одновременно изменил другой запрос, вернётся 409 `entity_keys_limits_sync_conflict` — повторите запрос.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Синхронизация лимитов агента за период
     */
    async syncAgentEntityLimits(requestParameters: SyncAgentEntityLimitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentEntityLimits200Response> {
        const response = await this.syncAgentEntityLimitsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы обновить AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/agents/{id}`, передав изменяемые поля.  Особенности: - `settings` заменяются целиком (кроме `web_search_allowed_sites`, `additional_models` и `memory_enabled`, которые сохраняются, если не переданы) — передавайте полный объект настроек, включая `widget`; - основную модель меняет отдельный метод `PATCH /api/v1/cloud-ai/agents/{id}/model`; - поле `token_limit` больше не поддерживается: запрос с ним отклоняется с кодом 410 — лимиты задаются через `/api/v1/cloud-ai/agents/{id}/entity-limits`; - ошибки привязки `ai_gateway_key_id`: 400 `ai_gateway_key_not_found`, `agent_is_already_migrated_to_another_ai_gateway_key`, `agent_is_not_eligible_for_ai_gateway_migration`; 503 — проверку временно не удалось выполнить; - изменить статус заблокированного или удалённого агента нельзя (400 `agent_can\'t_change_status`).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Обновление AI агента
     */
    async updateAgentRaw(requestParameters: UpdateAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgent201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updateAgent.');
        }

        if (requestParameters.updateAgent === null || requestParameters.updateAgent === undefined) {
            throw new runtime.RequiredError('updateAgent','Required parameter requestParameters.updateAgent was null or undefined when calling updateAgent.');
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
            path: `/api/v1/cloud-ai/agents/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAgentToJSON(requestParameters.updateAgent),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgent201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/agents/{id}`, передав изменяемые поля.  Особенности: - `settings` заменяются целиком (кроме `web_search_allowed_sites`, `additional_models` и `memory_enabled`, которые сохраняются, если не переданы) — передавайте полный объект настроек, включая `widget`; - основную модель меняет отдельный метод `PATCH /api/v1/cloud-ai/agents/{id}/model`; - поле `token_limit` больше не поддерживается: запрос с ним отклоняется с кодом 410 — лимиты задаются через `/api/v1/cloud-ai/agents/{id}/entity-limits`; - ошибки привязки `ai_gateway_key_id`: 400 `ai_gateway_key_not_found`, `agent_is_already_migrated_to_another_ai_gateway_key`, `agent_is_not_eligible_for_ai_gateway_migration`; 503 — проверку временно не удалось выполнить; - изменить статус заблокированного или удалённого агента нельзя (400 `agent_can\'t_change_status`).  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Обновление AI агента
     */
    async updateAgent(requestParameters: UpdateAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgent201Response> {
        const response = await this.updateAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить значение лимита AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.  Непереданные поля не меняются. Снять денежный лимит (`money_limit`: `null`) можно только вместе с передачей `limit`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Изменение лимита агента
     */
    async updateAgentEntityLimitRaw(requestParameters: UpdateAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentEntityLimit201Response>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updateAgentEntityLimit.');
        }

        if (requestParameters.limitId === null || requestParameters.limitId === undefined) {
            throw new runtime.RequiredError('limitId','Required parameter requestParameters.limitId was null or undefined when calling updateAgentEntityLimit.');
        }

        if (requestParameters.updateAgentEntityLimit === null || requestParameters.updateAgentEntityLimit === undefined) {
            throw new runtime.RequiredError('updateAgentEntityLimit','Required parameter requestParameters.updateAgentEntityLimit was null or undefined when calling updateAgentEntityLimit.');
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
            path: `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))).replace(`{${"limit_id"}}`, encodeURIComponent(String(requestParameters.limitId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAgentEntityLimitToJSON(requestParameters.updateAgentEntityLimit),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentEntityLimit201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить значение лимита AI агента, отправьте PATCH-запрос на `/api/v1/cloud-ai/agents/{id}/entity-limits/{limit_id}`.  Непереданные поля не меняются. Снять денежный лимит (`money_limit`: `null`) можно только вместе с передачей `limit`.  Для токенов дополнительных пользователей аккаунта нужна роль `ai:write`.
     * Изменение лимита агента
     */
    async updateAgentEntityLimit(requestParameters: UpdateAgentEntityLimitRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentEntityLimit201Response> {
        const response = await this.updateAgentEntityLimitRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ExportAgentChatsCsvOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type ExportAgentChatsCsvOrderEnum = typeof ExportAgentChatsCsvOrderEnum[keyof typeof ExportAgentChatsCsvOrderEnum];
/**
 * @export
 */
export const ExportAgentChatsCsvLocaleEnum = {
    Ru: 'ru',
    En: 'en'
} as const;
export type ExportAgentChatsCsvLocaleEnum = typeof ExportAgentChatsCsvLocaleEnum[keyof typeof ExportAgentChatsCsvLocaleEnum];
/**
 * @export
 */
export const GetAgentChatListOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetAgentChatListOrderEnum = typeof GetAgentChatListOrderEnum[keyof typeof GetAgentChatListOrderEnum];
/**
 * @export
 */
export const GetAgentChatListReactionTypeEnum = {
    Likes: 'likes',
    Dislikes: 'dislikes',
    With: 'with',
    None: 'none'
} as const;
export type GetAgentChatListReactionTypeEnum = typeof GetAgentChatListReactionTypeEnum[keyof typeof GetAgentChatListReactionTypeEnum];
/**
 * @export
 */
export const GetAgentChatMessagesOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetAgentChatMessagesOrderEnum = typeof GetAgentChatMessagesOrderEnum[keyof typeof GetAgentChatMessagesOrderEnum];
/**
 * @export
 */
export const GetAgentEntityLimitsLimitTypeEnum = {
    Hour: 'hour',
    Day: 'day',
    Week: 'week',
    Month: 'month'
} as const;
export type GetAgentEntityLimitsLimitTypeEnum = typeof GetAgentEntityLimitsLimitTypeEnum[keyof typeof GetAgentEntityLimitsLimitTypeEnum];
