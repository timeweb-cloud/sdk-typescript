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
  CreateAgentBotTelegramBot201Response,
  CreateBot,
  CreateCrispIntegration,
  CreateJivoIntegration,
  CreateMaxBot,
  GetAccountStatus403Response,
  GetAgentBotMaxBots200Response,
  GetAgentBotMaxBotsByAgent200Response,
  GetAgentBotTelegramBots200Response,
  GetAgentBotTelegramBotsByAgent200Response,
  GetAgentIntegrationCrisp200Response,
  GetAgentIntegrationJivo200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  UpdateBot,
  UpdateDatabaseInstance409Response,
  UpdateMaxBot,
} from '../models/index';
import {
    CreateAgentBotTelegramBot201ResponseFromJSON,
    CreateAgentBotTelegramBot201ResponseToJSON,
    CreateBotFromJSON,
    CreateBotToJSON,
    CreateCrispIntegrationFromJSON,
    CreateCrispIntegrationToJSON,
    CreateJivoIntegrationFromJSON,
    CreateJivoIntegrationToJSON,
    CreateMaxBotFromJSON,
    CreateMaxBotToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAgentBotMaxBots200ResponseFromJSON,
    GetAgentBotMaxBots200ResponseToJSON,
    GetAgentBotMaxBotsByAgent200ResponseFromJSON,
    GetAgentBotMaxBotsByAgent200ResponseToJSON,
    GetAgentBotTelegramBots200ResponseFromJSON,
    GetAgentBotTelegramBots200ResponseToJSON,
    GetAgentBotTelegramBotsByAgent200ResponseFromJSON,
    GetAgentBotTelegramBotsByAgent200ResponseToJSON,
    GetAgentIntegrationCrisp200ResponseFromJSON,
    GetAgentIntegrationCrisp200ResponseToJSON,
    GetAgentIntegrationJivo200ResponseFromJSON,
    GetAgentIntegrationJivo200ResponseToJSON,
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
    UpdateBotFromJSON,
    UpdateBotToJSON,
    UpdateDatabaseInstance409ResponseFromJSON,
    UpdateDatabaseInstance409ResponseToJSON,
    UpdateMaxBotFromJSON,
    UpdateMaxBotToJSON,
} from '../models/index';

export interface CreateAgentBotMaxBotRequest {
    createMaxBot: CreateMaxBot;
}

export interface CreateAgentBotTelegramBotRequest {
    createBot: CreateBot;
}

export interface CreateAgentIntegrationCrispRequest {
    agentId: number;
    createCrispIntegration: CreateCrispIntegration;
}

export interface CreateAgentIntegrationJivoRequest {
    agentId: number;
    createJivoIntegration: CreateJivoIntegration;
}

export interface DeleteAgentBotMaxBotRequest {
    botId: string;
}

export interface DeleteAgentBotTelegramBotRequest {
    botId: string;
}

export interface DeleteAgentIntegrationCrispRequest {
    agentId: number;
}

export interface DeleteAgentIntegrationJivoRequest {
    agentId: number;
}

export interface GetAgentBotMaxBotRequest {
    botId: string;
}

export interface GetAgentBotMaxBotsByAgentRequest {
    agentId: number;
}

export interface GetAgentBotTelegramBotRequest {
    botId: string;
}

export interface GetAgentBotTelegramBotsByAgentRequest {
    agentId: number;
}

export interface GetAgentIntegrationCrispRequest {
    agentId: number;
}

export interface GetAgentIntegrationJivoRequest {
    agentId: number;
}

export interface UpdateAgentBotMaxBotRequest {
    botId: string;
    updateMaxBot: UpdateMaxBot;
}

export interface UpdateAgentBotTelegramBotRequest {
    botId: string;
    updateBot: UpdateBot;
}

/**
 * 
 */
export class AIAgentIntegrationsApi extends runtime.BaseAPI {

    /**
     * Чтобы подключить бота MAX к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/max-bots`, передав ID агента и токен бота от @MasterBot.  Платформа проверит токен в MAX, сохранит бота и сама подпишет его на события (вебхук) — настраивать подписку в MAX не нужно. После этого агент начинает отвечать пользователям бота.  Один бот может быть подключен только к одному агенту. Если бот уже подключен к агенту, который был удален, бот будет переподключен к новому агенту. Ограничение доступа по списку пользователей для ботов MAX не поддерживается.  Ошибки: - `400 invalid_max_token` — MAX не принял токен; - `400 max_webhook_error` — не удалось подписать бота на события; - `409 bot_already_exists` — бот уже подключен к существующему агенту или к другому аккаунту.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Подключение бота MAX к агенту
     */
    async createAgentBotMaxBotRaw(requestParameters: CreateAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentBotTelegramBot201Response>> {
        if (requestParameters.createMaxBot === null || requestParameters.createMaxBot === undefined) {
            throw new runtime.RequiredError('createMaxBot','Required parameter requestParameters.createMaxBot was null or undefined when calling createAgentBotMaxBot.');
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
            path: `/api/v1/cloud-ai/max-bots`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateMaxBotToJSON(requestParameters.createMaxBot),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentBotTelegramBot201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить бота MAX к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/max-bots`, передав ID агента и токен бота от @MasterBot.  Платформа проверит токен в MAX, сохранит бота и сама подпишет его на события (вебхук) — настраивать подписку в MAX не нужно. После этого агент начинает отвечать пользователям бота.  Один бот может быть подключен только к одному агенту. Если бот уже подключен к агенту, который был удален, бот будет переподключен к новому агенту. Ограничение доступа по списку пользователей для ботов MAX не поддерживается.  Ошибки: - `400 invalid_max_token` — MAX не принял токен; - `400 max_webhook_error` — не удалось подписать бота на события; - `409 bot_already_exists` — бот уже подключен к существующему агенту или к другому аккаунту.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Подключение бота MAX к агенту
     */
    async createAgentBotMaxBot(requestParameters: CreateAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentBotTelegramBot201Response> {
        const response = await this.createAgentBotMaxBotRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы подключить Telegram-бота к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/bots`, передав ID агента и токен бота от @BotFather.  Платформа проверит токен в Telegram, сохранит бота и сама установит ему вебхук — настраивать вебхук в Telegram не нужно. После этого агент начинает отвечать пользователям бота. Ранее накопленные у бота обновления сбрасываются.  Один бот может быть подключен только к одному агенту. Если бот уже подключен к агенту, который был удален, бот будет переподключен к новому агенту.  Ошибки: - `400 invalid_telegram_token` — Telegram не принял токен; - `400 telegram_webhook_error` — не удалось установить вебхук; - `409 bot_already_exists` — бот уже подключен к существующему агенту или к другому аккаунту.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Подключение Telegram-бота к агенту
     */
    async createAgentBotTelegramBotRaw(requestParameters: CreateAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentBotTelegramBot201Response>> {
        if (requestParameters.createBot === null || requestParameters.createBot === undefined) {
            throw new runtime.RequiredError('createBot','Required parameter requestParameters.createBot was null or undefined when calling createAgentBotTelegramBot.');
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
            path: `/api/v1/cloud-ai/bots`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateBotToJSON(requestParameters.createBot),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentBotTelegramBot201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить Telegram-бота к AI агенту, отправьте POST-запрос на `/api/v1/cloud-ai/bots`, передав ID агента и токен бота от @BotFather.  Платформа проверит токен в Telegram, сохранит бота и сама установит ему вебхук — настраивать вебхук в Telegram не нужно. После этого агент начинает отвечать пользователям бота. Ранее накопленные у бота обновления сбрасываются.  Один бот может быть подключен только к одному агенту. Если бот уже подключен к агенту, который был удален, бот будет переподключен к новому агенту.  Ошибки: - `400 invalid_telegram_token` — Telegram не принял токен; - `400 telegram_webhook_error` — не удалось установить вебхук; - `409 bot_already_exists` — бот уже подключен к существующему агенту или к другому аккаунту.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Подключение Telegram-бота к агенту
     */
    async createAgentBotTelegramBot(requestParameters: CreateAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentBotTelegramBot201Response> {
        const response = await this.createAgentBotTelegramBotRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы подключить AI агента к Crisp, отправьте POST-запрос на `/api/v1/cloud-ai/agent/{agent_id}/crisp`, передав Website ID сайта и API-токен Crisp (Identifier и Key).  Платформа проверит токен в Crisp и вернет `webhook_secret`. Затем добавьте в Crisp вебхук `https://api.timeweb.cloud/api/v1/crisp/{website_id}/webhook/{webhook_secret}` — подробнее в разделе «Интеграции AI агентов».  К одному агенту можно подключить один сайт Crisp, и один сайт — только к одному агенту.  Ошибки: - `400 invalid_crisp_token` — Crisp не принял токен для этого сайта; - `409 bot_already_exists` — у агента уже есть интеграция с Crisp или сайт подключен к другому агенту; - `503` — интеграция с Crisp временно недоступна.  Тело ответа будет представлять собой объект JSON с ключом `crisp_integration`.
     * Подключение агента к Crisp
     */
    async createAgentIntegrationCrispRaw(requestParameters: CreateAgentIntegrationCrispRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentIntegrationCrisp200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling createAgentIntegrationCrisp.');
        }

        if (requestParameters.createCrispIntegration === null || requestParameters.createCrispIntegration === undefined) {
            throw new runtime.RequiredError('createCrispIntegration','Required parameter requestParameters.createCrispIntegration was null or undefined when calling createAgentIntegrationCrisp.');
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
            path: `/api/v1/cloud-ai/agent/{agent_id}/crisp`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateCrispIntegrationToJSON(requestParameters.createCrispIntegration),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentIntegrationCrisp200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить AI агента к Crisp, отправьте POST-запрос на `/api/v1/cloud-ai/agent/{agent_id}/crisp`, передав Website ID сайта и API-токен Crisp (Identifier и Key).  Платформа проверит токен в Crisp и вернет `webhook_secret`. Затем добавьте в Crisp вебхук `https://api.timeweb.cloud/api/v1/crisp/{website_id}/webhook/{webhook_secret}` — подробнее в разделе «Интеграции AI агентов».  К одному агенту можно подключить один сайт Crisp, и один сайт — только к одному агенту.  Ошибки: - `400 invalid_crisp_token` — Crisp не принял токен для этого сайта; - `409 bot_already_exists` — у агента уже есть интеграция с Crisp или сайт подключен к другому агенту; - `503` — интеграция с Crisp временно недоступна.  Тело ответа будет представлять собой объект JSON с ключом `crisp_integration`.
     * Подключение агента к Crisp
     */
    async createAgentIntegrationCrisp(requestParameters: CreateAgentIntegrationCrispRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentIntegrationCrisp200Response> {
        const response = await this.createAgentIntegrationCrispRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы подключить AI агента к Jivo, отправьте POST-запрос на `/api/v1/cloud-ai/agent/{agent_id}/jivo`, передав Provider ID, выданный поддержкой Jivo.  Подготовка описана в разделе «Интеграции AI агентов»: адрес для событий и токен бота нужно заранее передать в поддержку Jivo.  Если агент не найден, вернется ошибка `404 agent_not_found`.  К одному агенту можно подключить одну интеграцию Jivo. Если она уже есть, вернется ошибка `409 bot_already_exists`.  Тело ответа будет представлять собой объект JSON с ключом `jivo_integration`.
     * Подключение агента к Jivo
     */
    async createAgentIntegrationJivoRaw(requestParameters: CreateAgentIntegrationJivoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentIntegrationJivo200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling createAgentIntegrationJivo.');
        }

        if (requestParameters.createJivoIntegration === null || requestParameters.createJivoIntegration === undefined) {
            throw new runtime.RequiredError('createJivoIntegration','Required parameter requestParameters.createJivoIntegration was null or undefined when calling createAgentIntegrationJivo.');
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
            path: `/api/v1/cloud-ai/agent/{agent_id}/jivo`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateJivoIntegrationToJSON(requestParameters.createJivoIntegration),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentIntegrationJivo200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить AI агента к Jivo, отправьте POST-запрос на `/api/v1/cloud-ai/agent/{agent_id}/jivo`, передав Provider ID, выданный поддержкой Jivo.  Подготовка описана в разделе «Интеграции AI агентов»: адрес для событий и токен бота нужно заранее передать в поддержку Jivo.  Если агент не найден, вернется ошибка `404 agent_not_found`.  К одному агенту можно подключить одну интеграцию Jivo. Если она уже есть, вернется ошибка `409 bot_already_exists`.  Тело ответа будет представлять собой объект JSON с ключом `jivo_integration`.
     * Подключение агента к Jivo
     */
    async createAgentIntegrationJivo(requestParameters: CreateAgentIntegrationJivoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentIntegrationJivo200Response> {
        const response = await this.createAgentIntegrationJivoRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы отключить бота MAX от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/max-bots/{bot_id}`.  Платформа отпишет бота от событий в MAX и удалит подключение. Сам бот в MAX не удаляется — его можно подключить снова.
     * Отключение бота MAX
     */
    async deleteAgentBotMaxBotRaw(requestParameters: DeleteAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.botId === null || requestParameters.botId === undefined) {
            throw new runtime.RequiredError('botId','Required parameter requestParameters.botId was null or undefined when calling deleteAgentBotMaxBot.');
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
            path: `/api/v1/cloud-ai/max-bots/{bot_id}`.replace(`{${"bot_id"}}`, encodeURIComponent(String(requestParameters.botId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить бота MAX от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/max-bots/{bot_id}`.  Платформа отпишет бота от событий в MAX и удалит подключение. Сам бот в MAX не удаляется — его можно подключить снова.
     * Отключение бота MAX
     */
    async deleteAgentBotMaxBot(requestParameters: DeleteAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentBotMaxBotRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отключить Telegram-бота от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/bots/{bot_id}`.  Платформа снимет вебхук бота в Telegram и удалит подключение. Сам бот в Telegram не удаляется — его можно подключить снова.
     * Отключение Telegram-бота
     */
    async deleteAgentBotTelegramBotRaw(requestParameters: DeleteAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.botId === null || requestParameters.botId === undefined) {
            throw new runtime.RequiredError('botId','Required parameter requestParameters.botId was null or undefined when calling deleteAgentBotTelegramBot.');
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
            path: `/api/v1/cloud-ai/bots/{bot_id}`.replace(`{${"bot_id"}}`, encodeURIComponent(String(requestParameters.botId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить Telegram-бота от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/bots/{bot_id}`.  Платформа снимет вебхук бота в Telegram и удалит подключение. Сам бот в Telegram не удаляется — его можно подключить снова.
     * Отключение Telegram-бота
     */
    async deleteAgentBotTelegramBot(requestParameters: DeleteAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentBotTelegramBotRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отключить AI агента от Crisp, отправьте DELETE-запрос на `/api/v1/cloud-ai/agent/{agent_id}/crisp`.  После удаления интеграции агент перестает отвечать в чатах Crisp. Вебхук в настройках Crisp можно удалить вручную.
     * Отключение агента от Crisp
     */
    async deleteAgentIntegrationCrispRaw(requestParameters: DeleteAgentIntegrationCrispRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling deleteAgentIntegrationCrisp.');
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
            path: `/api/v1/cloud-ai/agent/{agent_id}/crisp`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить AI агента от Crisp, отправьте DELETE-запрос на `/api/v1/cloud-ai/agent/{agent_id}/crisp`.  После удаления интеграции агент перестает отвечать в чатах Crisp. Вебхук в настройках Crisp можно удалить вручную.
     * Отключение агента от Crisp
     */
    async deleteAgentIntegrationCrisp(requestParameters: DeleteAgentIntegrationCrispRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentIntegrationCrispRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отключить AI агента от Jivo, отправьте DELETE-запрос на `/api/v1/cloud-ai/agent/{agent_id}/jivo`.  После удаления интеграции агент перестает отвечать на события Jivo. Настройки бота в самом Jivo не меняются.
     * Отключение агента от Jivo
     */
    async deleteAgentIntegrationJivoRaw(requestParameters: DeleteAgentIntegrationJivoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling deleteAgentIntegrationJivo.');
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
            path: `/api/v1/cloud-ai/agent/{agent_id}/jivo`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить AI агента от Jivo, отправьте DELETE-запрос на `/api/v1/cloud-ai/agent/{agent_id}/jivo`.  После удаления интеграции агент перестает отвечать на события Jivo. Настройки бота в самом Jivo не меняются.
     * Отключение агента от Jivo
     */
    async deleteAgentIntegrationJivo(requestParameters: DeleteAgentIntegrationJivoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentIntegrationJivoRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить информацию о боте MAX, отправьте GET-запрос на `/api/v1/cloud-ai/max-bots/{bot_id}`.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Получение информации о боте MAX
     */
    async getAgentBotMaxBotRaw(requestParameters: GetAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentBotTelegramBot201Response>> {
        if (requestParameters.botId === null || requestParameters.botId === undefined) {
            throw new runtime.RequiredError('botId','Required parameter requestParameters.botId was null or undefined when calling getAgentBotMaxBot.');
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
            path: `/api/v1/cloud-ai/max-bots/{bot_id}`.replace(`{${"bot_id"}}`, encodeURIComponent(String(requestParameters.botId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentBotTelegramBot201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о боте MAX, отправьте GET-запрос на `/api/v1/cloud-ai/max-bots/{bot_id}`.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Получение информации о боте MAX
     */
    async getAgentBotMaxBot(requestParameters: GetAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentBotTelegramBot201Response> {
        const response = await this.getAgentBotMaxBotRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список ботов MAX, подключенных к агентам аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/max-bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка ботов MAX
     */
    async getAgentBotMaxBotsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentBotMaxBots200Response>> {
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
            path: `/api/v1/cloud-ai/max-bots`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentBotMaxBots200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список ботов MAX, подключенных к агентам аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/max-bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка ботов MAX
     */
    async getAgentBotMaxBots(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentBotMaxBots200Response> {
        const response = await this.getAgentBotMaxBotsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список ботов MAX, подключенных к AI агенту, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/max-bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка ботов MAX агента
     */
    async getAgentBotMaxBotsByAgentRaw(requestParameters: GetAgentBotMaxBotsByAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentBotMaxBotsByAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling getAgentBotMaxBotsByAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/max-bots`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentBotMaxBotsByAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список ботов MAX, подключенных к AI агенту, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/max-bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка ботов MAX агента
     */
    async getAgentBotMaxBotsByAgent(requestParameters: GetAgentBotMaxBotsByAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentBotMaxBotsByAgent200Response> {
        const response = await this.getAgentBotMaxBotsByAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о Telegram-боте, отправьте GET-запрос на `/api/v1/cloud-ai/bots/{bot_id}`.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Получение информации о Telegram-боте
     */
    async getAgentBotTelegramBotRaw(requestParameters: GetAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentBotTelegramBot201Response>> {
        if (requestParameters.botId === null || requestParameters.botId === undefined) {
            throw new runtime.RequiredError('botId','Required parameter requestParameters.botId was null or undefined when calling getAgentBotTelegramBot.');
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
            path: `/api/v1/cloud-ai/bots/{bot_id}`.replace(`{${"bot_id"}}`, encodeURIComponent(String(requestParameters.botId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentBotTelegramBot201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о Telegram-боте, отправьте GET-запрос на `/api/v1/cloud-ai/bots/{bot_id}`.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Получение информации о Telegram-боте
     */
    async getAgentBotTelegramBot(requestParameters: GetAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentBotTelegramBot201Response> {
        const response = await this.getAgentBotTelegramBotRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список Telegram-ботов, подключенных к агентам аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка Telegram-ботов
     */
    async getAgentBotTelegramBotsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentBotTelegramBots200Response>> {
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
            path: `/api/v1/cloud-ai/bots`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentBotTelegramBots200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список Telegram-ботов, подключенных к агентам аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка Telegram-ботов
     */
    async getAgentBotTelegramBots(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentBotTelegramBots200Response> {
        const response = await this.getAgentBotTelegramBotsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список Telegram-ботов, подключенных к AI агенту, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка Telegram-ботов агента
     */
    async getAgentBotTelegramBotsByAgentRaw(requestParameters: GetAgentBotTelegramBotsByAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentBotTelegramBotsByAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling getAgentBotTelegramBotsByAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/bots`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentBotTelegramBotsByAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список Telegram-ботов, подключенных к AI агенту, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/bots`.  Тело ответа будет представлять собой объект JSON с ключами `bots` и `meta`.
     * Получение списка Telegram-ботов агента
     */
    async getAgentBotTelegramBotsByAgent(requestParameters: GetAgentBotTelegramBotsByAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentBotTelegramBotsByAgent200Response> {
        const response = await this.getAgentBotTelegramBotsByAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить интеграцию AI агента с Crisp, отправьте GET-запрос на `/api/v1/cloud-ai/agent/{agent_id}/crisp`.  В ответе есть `webhook_secret` — по нему можно восстановить адрес вебхука для Crisp. Если агент не подключен к Crisp, вернется ошибка 404.  Тело ответа будет представлять собой объект JSON с ключом `crisp_integration`.
     * Получение интеграции агента с Crisp
     */
    async getAgentIntegrationCrispRaw(requestParameters: GetAgentIntegrationCrispRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentIntegrationCrisp200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling getAgentIntegrationCrisp.');
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
            path: `/api/v1/cloud-ai/agent/{agent_id}/crisp`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentIntegrationCrisp200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить интеграцию AI агента с Crisp, отправьте GET-запрос на `/api/v1/cloud-ai/agent/{agent_id}/crisp`.  В ответе есть `webhook_secret` — по нему можно восстановить адрес вебхука для Crisp. Если агент не подключен к Crisp, вернется ошибка 404.  Тело ответа будет представлять собой объект JSON с ключом `crisp_integration`.
     * Получение интеграции агента с Crisp
     */
    async getAgentIntegrationCrisp(requestParameters: GetAgentIntegrationCrispRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentIntegrationCrisp200Response> {
        const response = await this.getAgentIntegrationCrispRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить интеграцию AI агента с Jivo, отправьте GET-запрос на `/api/v1/cloud-ai/agent/{agent_id}/jivo`.  Если агент не подключен к Jivo, вернется ошибка 404.  Тело ответа будет представлять собой объект JSON с ключом `jivo_integration`.
     * Получение интеграции агента с Jivo
     */
    async getAgentIntegrationJivoRaw(requestParameters: GetAgentIntegrationJivoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentIntegrationJivo200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling getAgentIntegrationJivo.');
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
            path: `/api/v1/cloud-ai/agent/{agent_id}/jivo`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentIntegrationJivo200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить интеграцию AI агента с Jivo, отправьте GET-запрос на `/api/v1/cloud-ai/agent/{agent_id}/jivo`.  Если агент не подключен к Jivo, вернется ошибка 404.  Тело ответа будет представлять собой объект JSON с ключом `jivo_integration`.
     * Получение интеграции агента с Jivo
     */
    async getAgentIntegrationJivo(requestParameters: GetAgentIntegrationJivoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentIntegrationJivo200Response> {
        const response = await this.getAgentIntegrationJivoRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить бота MAX, отправьте PATCH-запрос на `/api/v1/cloud-ai/max-bots/{bot_id}`, передав только изменяемые поля.  Через `token` можно заменить токен того же бота: платформа проверит новый токен и заново подпишет бота на события. Перенести подключение на другого бота нельзя — для этого удалите бота и подключите новый.  Ошибки: - `400 invalid_max_token` — MAX не принял токен или токен принадлежит другому боту; - `400 max_webhook_error` — не удалось подписать бота на события.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Изменение бота MAX
     */
    async updateAgentBotMaxBotRaw(requestParameters: UpdateAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentBotTelegramBot201Response>> {
        if (requestParameters.botId === null || requestParameters.botId === undefined) {
            throw new runtime.RequiredError('botId','Required parameter requestParameters.botId was null or undefined when calling updateAgentBotMaxBot.');
        }

        if (requestParameters.updateMaxBot === null || requestParameters.updateMaxBot === undefined) {
            throw new runtime.RequiredError('updateMaxBot','Required parameter requestParameters.updateMaxBot was null or undefined when calling updateAgentBotMaxBot.');
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
            path: `/api/v1/cloud-ai/max-bots/{bot_id}`.replace(`{${"bot_id"}}`, encodeURIComponent(String(requestParameters.botId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateMaxBotToJSON(requestParameters.updateMaxBot),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentBotTelegramBot201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить бота MAX, отправьте PATCH-запрос на `/api/v1/cloud-ai/max-bots/{bot_id}`, передав только изменяемые поля.  Через `token` можно заменить токен того же бота: платформа проверит новый токен и заново подпишет бота на события. Перенести подключение на другого бота нельзя — для этого удалите бота и подключите новый.  Ошибки: - `400 invalid_max_token` — MAX не принял токен или токен принадлежит другому боту; - `400 max_webhook_error` — не удалось подписать бота на события.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Изменение бота MAX
     */
    async updateAgentBotMaxBot(requestParameters: UpdateAgentBotMaxBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentBotTelegramBot201Response> {
        const response = await this.updateAgentBotMaxBotRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить Telegram-бота, отправьте PATCH-запрос на `/api/v1/cloud-ai/bots/{bot_id}`, передав только изменяемые поля.  Через `token` можно заменить токен того же бота, например после его перевыпуска в @BotFather: платформа проверит новый токен и переустановит вебхук. Перенести подключение на другого бота нельзя — для этого удалите бота и подключите новый. Агента, к которому подключен бот, этим запросом сменить нельзя.  Ошибки: - `400 invalid_telegram_token` — Telegram не принял токен или токен принадлежит другому боту; - `400 telegram_webhook_error` — не удалось переустановить вебхук.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Изменение Telegram-бота
     */
    async updateAgentBotTelegramBotRaw(requestParameters: UpdateAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentBotTelegramBot201Response>> {
        if (requestParameters.botId === null || requestParameters.botId === undefined) {
            throw new runtime.RequiredError('botId','Required parameter requestParameters.botId was null or undefined when calling updateAgentBotTelegramBot.');
        }

        if (requestParameters.updateBot === null || requestParameters.updateBot === undefined) {
            throw new runtime.RequiredError('updateBot','Required parameter requestParameters.updateBot was null or undefined when calling updateAgentBotTelegramBot.');
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
            path: `/api/v1/cloud-ai/bots/{bot_id}`.replace(`{${"bot_id"}}`, encodeURIComponent(String(requestParameters.botId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateBotToJSON(requestParameters.updateBot),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentBotTelegramBot201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить Telegram-бота, отправьте PATCH-запрос на `/api/v1/cloud-ai/bots/{bot_id}`, передав только изменяемые поля.  Через `token` можно заменить токен того же бота, например после его перевыпуска в @BotFather: платформа проверит новый токен и переустановит вебхук. Перенести подключение на другого бота нельзя — для этого удалите бота и подключите новый. Агента, к которому подключен бот, этим запросом сменить нельзя.  Ошибки: - `400 invalid_telegram_token` — Telegram не принял токен или токен принадлежит другому боту; - `400 telegram_webhook_error` — не удалось переустановить вебхук.  Тело ответа будет представлять собой объект JSON с ключом `bot`.
     * Изменение Telegram-бота
     */
    async updateAgentBotTelegramBot(requestParameters: UpdateAgentBotTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentBotTelegramBot201Response> {
        const response = await this.updateAgentBotTelegramBotRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
