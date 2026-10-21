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
  AddAiSolutionTelegramBot201Response,
  ApproveTelegramPairing,
  ConnectTelegram,
  CreateAiSolution,
  CreateAiSolution201Response,
  ErrorResponse,
  GetAccountStatus403Response,
  GetAiSolutionChatStatus200Response,
  GetAiSolutionMainChatHistory200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  ListAiSolutionConversations200Response,
  ListAiSolutionTelegramBots200Response,
  ListAiSolutionTypes200Response,
  ListAiSolutions200Response,
  RegenerateAiSolutionAiKey200Response,
  ResetAiSolutionChat,
  ResetAiSolutionChat200Response,
  SendAiSolutionMessage,
  SendAiSolutionMessage200Response,
  StopAiSolutionChat,
  StreamError,
  UpdateAiSolution,
  UpdateDatabaseInstance409Response,
} from '../models/index';
import {
    AddAiSolutionTelegramBot201ResponseFromJSON,
    AddAiSolutionTelegramBot201ResponseToJSON,
    ApproveTelegramPairingFromJSON,
    ApproveTelegramPairingToJSON,
    ConnectTelegramFromJSON,
    ConnectTelegramToJSON,
    CreateAiSolutionFromJSON,
    CreateAiSolutionToJSON,
    CreateAiSolution201ResponseFromJSON,
    CreateAiSolution201ResponseToJSON,
    ErrorResponseFromJSON,
    ErrorResponseToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAiSolutionChatStatus200ResponseFromJSON,
    GetAiSolutionChatStatus200ResponseToJSON,
    GetAiSolutionMainChatHistory200ResponseFromJSON,
    GetAiSolutionMainChatHistory200ResponseToJSON,
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
    ListAiSolutionConversations200ResponseFromJSON,
    ListAiSolutionConversations200ResponseToJSON,
    ListAiSolutionTelegramBots200ResponseFromJSON,
    ListAiSolutionTelegramBots200ResponseToJSON,
    ListAiSolutionTypes200ResponseFromJSON,
    ListAiSolutionTypes200ResponseToJSON,
    ListAiSolutions200ResponseFromJSON,
    ListAiSolutions200ResponseToJSON,
    RegenerateAiSolutionAiKey200ResponseFromJSON,
    RegenerateAiSolutionAiKey200ResponseToJSON,
    ResetAiSolutionChatFromJSON,
    ResetAiSolutionChatToJSON,
    ResetAiSolutionChat200ResponseFromJSON,
    ResetAiSolutionChat200ResponseToJSON,
    SendAiSolutionMessageFromJSON,
    SendAiSolutionMessageToJSON,
    SendAiSolutionMessage200ResponseFromJSON,
    SendAiSolutionMessage200ResponseToJSON,
    StopAiSolutionChatFromJSON,
    StopAiSolutionChatToJSON,
    StreamErrorFromJSON,
    StreamErrorToJSON,
    UpdateAiSolutionFromJSON,
    UpdateAiSolutionToJSON,
    UpdateDatabaseInstance409ResponseFromJSON,
    UpdateDatabaseInstance409ResponseToJSON,
} from '../models/index';

export interface AddAiSolutionTelegramBotRequest {
    solutionId: number;
    connectTelegram: ConnectTelegram;
}

export interface ApproveAiSolutionTelegramPairingRequest {
    solutionId: number;
    accountKey: string;
    approveTelegramPairing: ApproveTelegramPairing;
}

export interface CreateAiSolutionRequest {
    createAiSolution: CreateAiSolution;
}

export interface DeleteAiSolutionRequest {
    solutionId: number;
}

export interface GetAiSolutionRequest {
    solutionId: number;
}

export interface GetAiSolutionChatFullHistoryRequest {
    solutionId: number;
    limit?: number;
    offset?: number;
}

export interface GetAiSolutionChatHistoryRequest {
    solutionId: number;
    conversationId: string;
    limit?: number;
    offset?: number;
}

export interface GetAiSolutionChatStatusRequest {
    solutionId: number;
}

export interface GetAiSolutionMainChatHistoryRequest {
    solutionId: number;
    limit?: number;
    offset?: number;
}

export interface ListAiSolutionConversationsRequest {
    solutionId: number;
}

export interface ListAiSolutionTelegramBotsRequest {
    solutionId: number;
}

export interface RegenerateAiSolutionAiKeyRequest {
    solutionId: number;
}

export interface RemoveAiSolutionTelegramBotRequest {
    solutionId: number;
    accountKey: string;
}

export interface ResetAiSolutionChatRequest {
    solutionId: number;
    resetAiSolutionChat?: ResetAiSolutionChat;
}

export interface SendAiSolutionMessageRequest {
    solutionId: number;
    sendAiSolutionMessage: SendAiSolutionMessage;
}

export interface ShutdownAiSolutionRequest {
    solutionId: number;
}

export interface StartAiSolutionRequest {
    solutionId: number;
}

export interface StopAiSolutionChatRequest {
    solutionId: number;
    stopAiSolutionChat?: StopAiSolutionChat;
}

export interface StreamAiSolutionChatRequest {
    solutionId: number;
    sendAiSolutionMessage: SendAiSolutionMessage;
}

export interface UpdateAiSolutionRequest {
    solutionId: number;
    updateAiSolution: UpdateAiSolution;
}

/**
 * 
 */
export class AISolutionsApi extends runtime.BaseAPI {

    /**
     * Чтобы подключить Telegram-бота к решению, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots`.  Принимает токен бота от @BotFather, проверяет его в Telegram и настраивает бота на сервере решения. Владелец подтверждается кодом: пока он не подтверждён, бот никому не отвечает. Напишите боту в личные сообщения, получите в ответ код и передайте его в метод подтверждения владельца.  К решению можно подключить только одного бота: повторный запрос для того же бота обновляет его токен, для другого бота — возвращает 409 `ai_solution_already_has_a_connected_telegram_bot`. Если Telegram отклонил токен, ответ — 400 `ai_solution_telegram_token_is_invalid`.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Подключение Telegram-бота к AI-решению
     */
    async addAiSolutionTelegramBotRaw(requestParameters: AddAiSolutionTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddAiSolutionTelegramBot201Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling addAiSolutionTelegramBot.');
        }

        if (requestParameters.connectTelegram === null || requestParameters.connectTelegram === undefined) {
            throw new runtime.RequiredError('connectTelegram','Required parameter requestParameters.connectTelegram was null or undefined when calling addAiSolutionTelegramBot.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ConnectTelegramToJSON(requestParameters.connectTelegram),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddAiSolutionTelegramBot201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить Telegram-бота к решению, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots`.  Принимает токен бота от @BotFather, проверяет его в Telegram и настраивает бота на сервере решения. Владелец подтверждается кодом: пока он не подтверждён, бот никому не отвечает. Напишите боту в личные сообщения, получите в ответ код и передайте его в метод подтверждения владельца.  К решению можно подключить только одного бота: повторный запрос для того же бота обновляет его токен, для другого бота — возвращает 409 `ai_solution_already_has_a_connected_telegram_bot`. Если Telegram отклонил токен, ответ — 400 `ai_solution_telegram_token_is_invalid`.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Подключение Telegram-бота к AI-решению
     */
    async addAiSolutionTelegramBot(requestParameters: AddAiSolutionTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddAiSolutionTelegramBot201Response> {
        const response = await this.addAiSolutionTelegramBotRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы подтвердить владельца Telegram-бота, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots/{account_key}/pairing/approve`.  Передайте код, который бот прислал в личные сообщения в ответ на первое сообщение. После подтверждения агент отвечает этому пользователю Telegram в боте, а бот переходит в состояние `connected`. Владелец привязывается к конкретному боту. Повторный запрос с кодом, уже подтверждённым в последние 15 минут, считается успешным. Некорректный `account_key` — ответ 400 `ai_solution_telegram_token_is_invalid`.
     * Подтверждение владельца Telegram-бота AI-решения
     */
    async approveAiSolutionTelegramPairingRaw(requestParameters: ApproveAiSolutionTelegramPairingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling approveAiSolutionTelegramPairing.');
        }

        if (requestParameters.accountKey === null || requestParameters.accountKey === undefined) {
            throw new runtime.RequiredError('accountKey','Required parameter requestParameters.accountKey was null or undefined when calling approveAiSolutionTelegramPairing.');
        }

        if (requestParameters.approveTelegramPairing === null || requestParameters.approveTelegramPairing === undefined) {
            throw new runtime.RequiredError('approveTelegramPairing','Required parameter requestParameters.approveTelegramPairing was null or undefined when calling approveAiSolutionTelegramPairing.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots/{account_key}/pairing/approve`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))).replace(`{${"account_key"}}`, encodeURIComponent(String(requestParameters.accountKey))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ApproveTelegramPairingToJSON(requestParameters.approveTelegramPairing),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы подтвердить владельца Telegram-бота, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots/{account_key}/pairing/approve`.  Передайте код, который бот прислал в личные сообщения в ответ на первое сообщение. После подтверждения агент отвечает этому пользователю Telegram в боте, а бот переходит в состояние `connected`. Владелец привязывается к конкретному боту. Повторный запрос с кодом, уже подтверждённым в последние 15 минут, считается успешным. Некорректный `account_key` — ответ 400 `ai_solution_telegram_token_is_invalid`.
     * Подтверждение владельца Telegram-бота AI-решения
     */
    async approveAiSolutionTelegramPairing(requestParameters: ApproveAiSolutionTelegramPairingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.approveAiSolutionTelegramPairingRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать AI-решение, отправьте POST-запрос на `/api/v1/cloud-ai/solutions`.  Выпускает для решения ключ AI Gateway и создаёт облачный сервер из образа решения; агент на сервере настраивается на выбранную модель через этот ключ. Сервер тарифицируется по выбранному тарифу, обращения к модели — через ключ AI Gateway.  Решение возвращается в статусе `creating`: развёртывание сервера и настройка агента занимают несколько минут. Дождитесь статуса `active`, а затем `ready: true` в методе получения статуса чата.  Тариф (`preset_id`) должен быть из той же локации, что и зона доступности (`availability_zone` или зона по умолчанию для региона аккаунта), иначе — 400 `invalid_location_zone`. Соответствие тарифа `requirements` типа решения при создании не проверяется — выбирайте тариф не ниже требований сами. Ответ 409 `no_free_node` означает, что в выбранной зоне сейчас нет свободных ресурсов под этот тариф — выберите другой тариф или зону. Неподходящая или устаревшая модель — 404 `model_not_found`.
     * Создание AI-решения
     */
    async createAiSolutionRaw(requestParameters: CreateAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiSolution201Response>> {
        if (requestParameters.createAiSolution === null || requestParameters.createAiSolution === undefined) {
            throw new runtime.RequiredError('createAiSolution','Required parameter requestParameters.createAiSolution was null or undefined when calling createAiSolution.');
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
            path: `/api/v1/cloud-ai/solutions`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAiSolutionToJSON(requestParameters.createAiSolution),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiSolution201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать AI-решение, отправьте POST-запрос на `/api/v1/cloud-ai/solutions`.  Выпускает для решения ключ AI Gateway и создаёт облачный сервер из образа решения; агент на сервере настраивается на выбранную модель через этот ключ. Сервер тарифицируется по выбранному тарифу, обращения к модели — через ключ AI Gateway.  Решение возвращается в статусе `creating`: развёртывание сервера и настройка агента занимают несколько минут. Дождитесь статуса `active`, а затем `ready: true` в методе получения статуса чата.  Тариф (`preset_id`) должен быть из той же локации, что и зона доступности (`availability_zone` или зона по умолчанию для региона аккаунта), иначе — 400 `invalid_location_zone`. Соответствие тарифа `requirements` типа решения при создании не проверяется — выбирайте тариф не ниже требований сами. Ответ 409 `no_free_node` означает, что в выбранной зоне сейчас нет свободных ресурсов под этот тариф — выберите другой тариф или зону. Неподходящая или устаревшая модель — 404 `model_not_found`.
     * Создание AI-решения
     */
    async createAiSolution(requestParameters: CreateAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiSolution201Response> {
        const response = await this.createAiSolutionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить AI-решение, отправьте DELETE-запрос на `/api/v1/cloud-ai/solutions/{solution_id}`.  Решение удаляется вместе с сервером и ключом AI Gateway. Действие необратимо: решение и история его чата становятся недоступны.
     * Удаление AI-решения
     */
    async deleteAiSolutionRaw(requestParameters: DeleteAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling deleteAiSolution.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить AI-решение, отправьте DELETE-запрос на `/api/v1/cloud-ai/solutions/{solution_id}`.  Решение удаляется вместе с сервером и ключом AI Gateway. Действие необратимо: решение и история его чата становятся недоступны.
     * Удаление AI-решения
     */
    async deleteAiSolution(requestParameters: DeleteAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAiSolutionRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить AI-решение, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}`.  Статус решения выводится из текущего состояния его сервера. Тело ответа будет представлять собой объект JSON с ключом `ai_solution`.
     * Получение AI-решения
     */
    async getAiSolutionRaw(requestParameters: GetAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiSolution201Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling getAiSolution.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiSolution201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить AI-решение, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}`.  Статус решения выводится из текущего состояния его сервера. Тело ответа будет представлять собой объект JSON с ключом `ai_solution`.
     * Получение AI-решения
     */
    async getAiSolution(requestParameters: GetAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiSolution201Response> {
        const response = await this.getAiSolutionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить сообщения всех разговоров решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/history`.  В отличие от `chat/messages` (только основной разговор) и `chat/conversations/{conversation_id}/messages` (конкретный разговор), возвращает сообщения из всех разговоров сразу. Сообщения отсортированы по дате создания от новых к старым. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_chat_messages` и `meta`.
     * Получение всей истории чата AI-решения
     */
    async getAiSolutionChatFullHistoryRaw(requestParameters: GetAiSolutionChatFullHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiSolutionMainChatHistory200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling getAiSolutionChatFullHistory.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/history`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiSolutionMainChatHistory200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить сообщения всех разговоров решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/history`.  В отличие от `chat/messages` (только основной разговор) и `chat/conversations/{conversation_id}/messages` (конкретный разговор), возвращает сообщения из всех разговоров сразу. Сообщения отсортированы по дате создания от новых к старым. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_chat_messages` и `meta`.
     * Получение всей истории чата AI-решения
     */
    async getAiSolutionChatFullHistory(requestParameters: GetAiSolutionChatFullHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiSolutionMainChatHistory200Response> {
        const response = await this.getAiSolutionChatFullHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить историю разговора, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/conversations/{conversation_id}/messages`.  Сообщения отсортированы по дате создания от новых к старым: первая страница — последние сообщения разговора. Для несуществующего разговора возвращается пустой список. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_chat_messages` и `meta`.
     * Получение истории разговора AI-решения
     */
    async getAiSolutionChatHistoryRaw(requestParameters: GetAiSolutionChatHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiSolutionMainChatHistory200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling getAiSolutionChatHistory.');
        }

        if (requestParameters.conversationId === null || requestParameters.conversationId === undefined) {
            throw new runtime.RequiredError('conversationId','Required parameter requestParameters.conversationId was null or undefined when calling getAiSolutionChatHistory.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/conversations/{conversation_id}/messages`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))).replace(`{${"conversation_id"}}`, encodeURIComponent(String(requestParameters.conversationId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiSolutionMainChatHistory200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить историю разговора, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/conversations/{conversation_id}/messages`.  Сообщения отсортированы по дате создания от новых к старым: первая страница — последние сообщения разговора. Для несуществующего разговора возвращается пустой список. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_chat_messages` и `meta`.
     * Получение истории разговора AI-решения
     */
    async getAiSolutionChatHistory(requestParameters: GetAiSolutionChatHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiSolutionMainChatHistory200Response> {
        const response = await this.getAiSolutionChatHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы узнать, готов ли агент решения принимать сообщения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/status`.  Готовность чата отличается от статуса решения: тот выводится из состояния сервера, а сервер включается задолго до того, как будет установлено и настроено ПО агента. После создания или запуска решения опрашивайте этот метод, пока `ready` не станет `true`. Тело ответа будет представлять собой объект JSON с ключом `ai_solution_chat_status`.
     * Получение статуса чата AI-решения
     */
    async getAiSolutionChatStatusRaw(requestParameters: GetAiSolutionChatStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiSolutionChatStatus200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling getAiSolutionChatStatus.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/status`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiSolutionChatStatus200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы узнать, готов ли агент решения принимать сообщения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/status`.  Готовность чата отличается от статуса решения: тот выводится из состояния сервера, а сервер включается задолго до того, как будет установлено и настроено ПО агента. После создания или запуска решения опрашивайте этот метод, пока `ready` не станет `true`. Тело ответа будет представлять собой объект JSON с ключом `ai_solution_chat_status`.
     * Получение статуса чата AI-решения
     */
    async getAiSolutionChatStatus(requestParameters: GetAiSolutionChatStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiSolutionChatStatus200Response> {
        const response = await this.getAiSolutionChatStatusRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить историю основного разговора решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/messages`.  ID основного разговора знать не нужно; для других разговоров используйте метод с явным `conversation_id`. Сообщения отсортированы по дате создания от новых к старым: первая страница — последние сообщения. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_chat_messages` и `meta` (`meta.total` — общее количество сообщений).
     * Получение истории основного разговора AI-решения
     */
    async getAiSolutionMainChatHistoryRaw(requestParameters: GetAiSolutionMainChatHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAiSolutionMainChatHistory200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling getAiSolutionMainChatHistory.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/messages`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAiSolutionMainChatHistory200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить историю основного разговора решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/messages`.  ID основного разговора знать не нужно; для других разговоров используйте метод с явным `conversation_id`. Сообщения отсортированы по дате создания от новых к старым: первая страница — последние сообщения. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_chat_messages` и `meta` (`meta.total` — общее количество сообщений).
     * Получение истории основного разговора AI-решения
     */
    async getAiSolutionMainChatHistory(requestParameters: GetAiSolutionMainChatHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAiSolutionMainChatHistory200Response> {
        const response = await this.getAiSolutionMainChatHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список разговоров с агентом решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/conversations`.  Возвращает все разговоры решения, в которых есть сообщения, включая основной, отсортированные по дате последнего сообщения от новых к старым. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_conversations` и `meta`.
     * Получение списка разговоров AI-решения
     */
    async listAiSolutionConversationsRaw(requestParameters: ListAiSolutionConversationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListAiSolutionConversations200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling listAiSolutionConversations.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/conversations`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListAiSolutionConversations200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список разговоров с агентом решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/conversations`.  Возвращает все разговоры решения, в которых есть сообщения, включая основной, отсортированные по дате последнего сообщения от новых к старым. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_conversations` и `meta`.
     * Получение списка разговоров AI-решения
     */
    async listAiSolutionConversations(requestParameters: ListAiSolutionConversationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListAiSolutionConversations200Response> {
        const response = await this.listAiSolutionConversationsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список Telegram-ботов решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots`.  Возвращает подключённых к решению ботов и состояние их подтверждения. Список читается с сервера решения. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_telegram_bots` и `meta`.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Получение списка Telegram-ботов AI-решения
     */
    async listAiSolutionTelegramBotsRaw(requestParameters: ListAiSolutionTelegramBotsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListAiSolutionTelegramBots200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling listAiSolutionTelegramBots.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListAiSolutionTelegramBots200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список Telegram-ботов решения, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots`.  Возвращает подключённых к решению ботов и состояние их подтверждения. Список читается с сервера решения. Тело ответа будет представлять собой объект JSON с ключами `ai_solution_telegram_bots` и `meta`.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Получение списка Telegram-ботов AI-решения
     */
    async listAiSolutionTelegramBots(requestParameters: ListAiSolutionTelegramBotsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListAiSolutionTelegramBots200Response> {
        const response = await this.listAiSolutionTelegramBotsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список типов AI-решений, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/types`.  Возвращает каталог готовых решений, которые можно развернуть на облачном сервере, с минимальными требованиями к конфигурации сервера (`requirements`). Тело ответа будет представлять собой объект JSON с ключами `ai_solution_types` и `meta`.
     * Получение списка типов AI-решений
     */
    async listAiSolutionTypesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListAiSolutionTypes200Response>> {
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
            path: `/api/v1/cloud-ai/solutions/types`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListAiSolutionTypes200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список типов AI-решений, отправьте GET-запрос на `/api/v1/cloud-ai/solutions/types`.  Возвращает каталог готовых решений, которые можно развернуть на облачном сервере, с минимальными требованиями к конфигурации сервера (`requirements`). Тело ответа будет представлять собой объект JSON с ключами `ai_solution_types` и `meta`.
     * Получение списка типов AI-решений
     */
    async listAiSolutionTypes(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListAiSolutionTypes200Response> {
        const response = await this.listAiSolutionTypesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список AI-решений аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/solutions`.  Возвращает все решения аккаунта, кроме удалённых. Статус каждого решения выводится из текущего состояния его сервера. Тело ответа будет представлять собой объект JSON с ключами `ai_solutions` и `meta`.
     * Получение списка AI-решений
     */
    async listAiSolutionsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListAiSolutions200Response>> {
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
            path: `/api/v1/cloud-ai/solutions`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListAiSolutions200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список AI-решений аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/solutions`.  Возвращает все решения аккаунта, кроме удалённых. Статус каждого решения выводится из текущего состояния его сервера. Тело ответа будет представлять собой объект JSON с ключами `ai_solutions` и `meta`.
     * Получение списка AI-решений
     */
    async listAiSolutions(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListAiSolutions200Response> {
        const response = await this.listAiSolutionsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы перевыпустить ключ AI Gateway решения, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/ai-key/regenerate`.  Единственный способ сменить этот ключ: он выпущен платформой для решения и в разделе AI Gateway доступен только для чтения. Новый ключ сразу записывается в конфигурацию агента на сервере решения, старый перестаёт работать немедленно. Сервер должен быть включён и полностью развёрнут — это проверяется до перевыпуска, потому что отменить его нельзя. Если записать новый ключ на сервер не удалось, повторите запрос.
     * Перевыпуск ключа AI Gateway решения
     */
    async regenerateAiSolutionAiKeyRaw(requestParameters: RegenerateAiSolutionAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RegenerateAiSolutionAiKey200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling regenerateAiSolutionAiKey.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/ai-key/regenerate`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegenerateAiSolutionAiKey200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы перевыпустить ключ AI Gateway решения, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/ai-key/regenerate`.  Единственный способ сменить этот ключ: он выпущен платформой для решения и в разделе AI Gateway доступен только для чтения. Новый ключ сразу записывается в конфигурацию агента на сервере решения, старый перестаёт работать немедленно. Сервер должен быть включён и полностью развёрнут — это проверяется до перевыпуска, потому что отменить его нельзя. Если записать новый ключ на сервер не удалось, повторите запрос.
     * Перевыпуск ключа AI Gateway решения
     */
    async regenerateAiSolutionAiKey(requestParameters: RegenerateAiSolutionAiKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RegenerateAiSolutionAiKey200Response> {
        const response = await this.regenerateAiSolutionAiKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы отключить Telegram-бота от решения, отправьте DELETE-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots/{account_key}`.  Удаляет бота из конфигурации сервера решения: агент перестаёт отвечать в этом боте. Если бот не подключён, запрос всё равно возвращает 204. Некорректный `account_key` — ответ 400 `ai_solution_telegram_token_is_invalid`.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Отключение Telegram-бота от AI-решения
     */
    async removeAiSolutionTelegramBotRaw(requestParameters: RemoveAiSolutionTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling removeAiSolutionTelegramBot.');
        }

        if (requestParameters.accountKey === null || requestParameters.accountKey === undefined) {
            throw new runtime.RequiredError('accountKey','Required parameter requestParameters.accountKey was null or undefined when calling removeAiSolutionTelegramBot.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots/{account_key}`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))).replace(`{${"account_key"}}`, encodeURIComponent(String(requestParameters.accountKey))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить Telegram-бота от решения, отправьте DELETE-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/telegram/bots/{account_key}`.  Удаляет бота из конфигурации сервера решения: агент перестаёт отвечать в этом боте. Если бот не подключён, запрос всё равно возвращает 204. Некорректный `account_key` — ответ 400 `ai_solution_telegram_token_is_invalid`.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Отключение Telegram-бота от AI-решения
     */
    async removeAiSolutionTelegramBot(requestParameters: RemoveAiSolutionTelegramBotRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.removeAiSolutionTelegramBotRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы сбросить контекст разговора, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/reset`.  Контекст сбрасывается на месте: разговор сохраняет `conversation_id`, но агент больше не видит предыдущих сообщений. Без `conversation_id` сбрасывается основной разговор решения. В историю добавляется служебное сообщение с ролью `context-reset`, отмечающее границу текущего контекста, — оно и возвращается в ответе (с ключом `ai_solution_chat_message`). Отметка добавляется и для разговора, в котором ещё не было сообщений.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Сброс контекста разговора AI-решения
     */
    async resetAiSolutionChatRaw(requestParameters: ResetAiSolutionChatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResetAiSolutionChat200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling resetAiSolutionChat.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/reset`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ResetAiSolutionChatToJSON(requestParameters.resetAiSolutionChat),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResetAiSolutionChat200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы сбросить контекст разговора, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/reset`.  Контекст сбрасывается на месте: разговор сохраняет `conversation_id`, но агент больше не видит предыдущих сообщений. Без `conversation_id` сбрасывается основной разговор решения. В историю добавляется служебное сообщение с ролью `context-reset`, отмечающее границу текущего контекста, — оно и возвращается в ответе (с ключом `ai_solution_chat_message`). Отметка добавляется и для разговора, в котором ещё не было сообщений.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Сброс контекста разговора AI-решения
     */
    async resetAiSolutionChat(requestParameters: ResetAiSolutionChatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResetAiSolutionChat200Response> {
        const response = await this.resetAiSolutionChatRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы отправить сообщение агенту решения, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/messages`.  Ответ возвращается целиком после завершения хода агента (ожидание — до 3 минут). Без `conversation_id` сообщение уходит в основной разговор решения; новый разговор начинается только при явной передаче нового ID. Без `message` агент сам здоровается — так можно показать первую реплику чата. Чтобы получать ответ по мере генерации, используйте потоковый метод.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Отправка сообщения агенту AI-решения
     */
    async sendAiSolutionMessageRaw(requestParameters: SendAiSolutionMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SendAiSolutionMessage200Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling sendAiSolutionMessage.');
        }

        if (requestParameters.sendAiSolutionMessage === null || requestParameters.sendAiSolutionMessage === undefined) {
            throw new runtime.RequiredError('sendAiSolutionMessage','Required parameter requestParameters.sendAiSolutionMessage was null or undefined when calling sendAiSolutionMessage.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/messages`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SendAiSolutionMessageToJSON(requestParameters.sendAiSolutionMessage),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SendAiSolutionMessage200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отправить сообщение агенту решения, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/messages`.  Ответ возвращается целиком после завершения хода агента (ожидание — до 3 минут). Без `conversation_id` сообщение уходит в основной разговор решения; новый разговор начинается только при явной передаче нового ID. Без `message` агент сам здоровается — так можно показать первую реплику чата. Чтобы получать ответ по мере генерации, используйте потоковый метод.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Отправка сообщения агенту AI-решения
     */
    async sendAiSolutionMessage(requestParameters: SendAiSolutionMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SendAiSolutionMessage200Response> {
        const response = await this.sendAiSolutionMessageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы выключить AI-решение, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/shutdown`.  Выключает сервер решения. Действие асинхронное: следите за результатом по статусу решения (обычно 1–2 минуты до `stopped`). Пока сервер выключен, чат недоступен, а сервер продолжает тарифицироваться. Выключение уже выключенного решения возвращает 204. Пока над сервером выполняется другое действие, ответ — 409 `ai_solution_is_busy`.
     * Выключение AI-решения
     */
    async shutdownAiSolutionRaw(requestParameters: ShutdownAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling shutdownAiSolution.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/shutdown`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы выключить AI-решение, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/shutdown`.  Выключает сервер решения. Действие асинхронное: следите за результатом по статусу решения (обычно 1–2 минуты до `stopped`). Пока сервер выключен, чат недоступен, а сервер продолжает тарифицироваться. Выключение уже выключенного решения возвращает 204. Пока над сервером выполняется другое действие, ответ — 409 `ai_solution_is_busy`.
     * Выключение AI-решения
     */
    async shutdownAiSolution(requestParameters: ShutdownAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.shutdownAiSolutionRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы запустить AI-решение, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/start`.  Включает сервер решения. Действие асинхронное: следите за результатом по статусу решения, а готовность агента проверяйте методом получения статуса чата. Пока над сервером выполняется действие, запуск и выключение возвращают 409 `ai_solution_is_busy`.  Не вызывайте метод для работающего решения: запрос будет принят (204) и запустит действие над сервером, а решение на несколько минут станет занятым.
     * Запуск AI-решения
     */
    async startAiSolutionRaw(requestParameters: StartAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling startAiSolution.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/start`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы запустить AI-решение, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/start`.  Включает сервер решения. Действие асинхронное: следите за результатом по статусу решения, а готовность агента проверяйте методом получения статуса чата. Пока над сервером выполняется действие, запуск и выключение возвращают 409 `ai_solution_is_busy`.  Не вызывайте метод для работающего решения: запрос будет принят (204) и запустит действие над сервером, а решение на несколько минут станет занятым.
     * Запуск AI-решения
     */
    async startAiSolution(requestParameters: StartAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.startAiSolutionRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы остановить текущий ход агента, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/stop`.  Прерывает генерацию ответа — например, если ответ зациклился или тратит слишком много токенов. Без `conversation_id` останавливается текущий ход основного разговора решения. Ход прерывается на стороне агента: закрыть соединение недостаточно, потому что принятый агентом ход продолжает выполняться независимо от клиента. Если хода нет, запрос всё равно возвращает 204.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Остановка хода агента AI-решения
     */
    async stopAiSolutionChatRaw(requestParameters: StopAiSolutionChatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling stopAiSolutionChat.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/stop`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StopAiSolutionChatToJSON(requestParameters.stopAiSolutionChat),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы остановить текущий ход агента, отправьте POST-запрос на `/api/v1/cloud-ai/solutions/{solution_id}/chat/stop`.  Прерывает генерацию ответа — например, если ответ зациклился или тратит слишком много токенов. Без `conversation_id` останавливается текущий ход основного разговора решения. Ход прерывается на стороне агента: закрыть соединение недостаточно, потому что принятый агентом ход продолжает выполняться независимо от клиента. Если хода нет, запрос всё равно возвращает 204.  Перед вызовом убедитесь, что чат готов (`ready: true` в методе получения статуса чата): пока сервер решения разворачивается или выключен, запрос завершается ошибкой.
     * Остановка хода агента AI-решения
     */
    async stopAiSolutionChat(requestParameters: StopAiSolutionChatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.stopAiSolutionChatRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отправить сообщение агенту решения и получать ответ потоком, отправьте POST-запрос на `https://agent.timeweb.cloud/api/v1/cloud-ai/solutions/{solution_id}/chat/stream`.  Метод работает на `https://agent.timeweb.cloud`, а не на `https://api.timeweb.cloud`: шлюз публичного API накапливает ответ целиком и не может передавать его по частям. Авторизация та же — API-токен в заголовке `Authorization`; токену с ограниченными правами нужен доступ на запись к AI-сервисам. Тело запроса такое же, как у метода отправки сообщения.  Ответ — `text/event-stream`: каждое событие приходит как `event: <тип>` и `data: <JSON>`. Отправка сообщения и подписка на ответ — один запрос, поэтому начало ответа не теряется. Строки, начинающиеся с `:`, — комментарии для поддержания соединения (каждые 15 секунд), их нужно игнорировать. ID разговора возвращается в заголовке ответа `X-Conversation-Id`.  Типы событий: - `subscribed` `{}` — ход принят; - `delta` `{text, seq, runId}` — очередной фрагмент ответа; - `tool` `{name, target, phase, status, seq, runId}` — агент использует инструмент; - `message` `{text, seq, id, stopReason}` — финальный ответ целиком, всегда после последнего `delta`; - `done` `{phase, seq, runId}` — ход завершён; - `error` `{reason, message, budget?}` — ход не удался. `reason`: `empty_reply` — агент не выдал текста; `stream_failed` — поток прервался; `agent_failed` — ход упал на стороне агента при исправном соединении, повтор имеет смысл; `budget_exceeded` — исчерпан лимит расходов ключа AI Gateway решения, в `budget` `{max, spent, resetAt}` — цифры лимита, если они известны. `error` всегда последнее событие потока и может прийти после `done` (например, с `empty_reply`).  Ошибки, возникшие до начала потока (решение не найдено, некорректный запрос, нет доступа), возвращаются обычным JSON-ответом с соответствующим HTTP-статусом. Если сервер решения выключен или недоступен, поток может открыться и сразу завершиться событием `error` с `reason: stream_failed` — проверяйте готовность чата заранее методом получения статуса чата.
     * Отправка сообщения агенту AI-решения с потоковым ответом
     */
    async streamAiSolutionChatRaw(requestParameters: StreamAiSolutionChatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling streamAiSolutionChat.');
        }

        if (requestParameters.sendAiSolutionMessage === null || requestParameters.sendAiSolutionMessage === undefined) {
            throw new runtime.RequiredError('sendAiSolutionMessage','Required parameter requestParameters.sendAiSolutionMessage was null or undefined when calling streamAiSolutionChat.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}/chat/stream`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SendAiSolutionMessageToJSON(requestParameters.sendAiSolutionMessage),
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Чтобы отправить сообщение агенту решения и получать ответ потоком, отправьте POST-запрос на `https://agent.timeweb.cloud/api/v1/cloud-ai/solutions/{solution_id}/chat/stream`.  Метод работает на `https://agent.timeweb.cloud`, а не на `https://api.timeweb.cloud`: шлюз публичного API накапливает ответ целиком и не может передавать его по частям. Авторизация та же — API-токен в заголовке `Authorization`; токену с ограниченными правами нужен доступ на запись к AI-сервисам. Тело запроса такое же, как у метода отправки сообщения.  Ответ — `text/event-stream`: каждое событие приходит как `event: <тип>` и `data: <JSON>`. Отправка сообщения и подписка на ответ — один запрос, поэтому начало ответа не теряется. Строки, начинающиеся с `:`, — комментарии для поддержания соединения (каждые 15 секунд), их нужно игнорировать. ID разговора возвращается в заголовке ответа `X-Conversation-Id`.  Типы событий: - `subscribed` `{}` — ход принят; - `delta` `{text, seq, runId}` — очередной фрагмент ответа; - `tool` `{name, target, phase, status, seq, runId}` — агент использует инструмент; - `message` `{text, seq, id, stopReason}` — финальный ответ целиком, всегда после последнего `delta`; - `done` `{phase, seq, runId}` — ход завершён; - `error` `{reason, message, budget?}` — ход не удался. `reason`: `empty_reply` — агент не выдал текста; `stream_failed` — поток прервался; `agent_failed` — ход упал на стороне агента при исправном соединении, повтор имеет смысл; `budget_exceeded` — исчерпан лимит расходов ключа AI Gateway решения, в `budget` `{max, spent, resetAt}` — цифры лимита, если они известны. `error` всегда последнее событие потока и может прийти после `done` (например, с `empty_reply`).  Ошибки, возникшие до начала потока (решение не найдено, некорректный запрос, нет доступа), возвращаются обычным JSON-ответом с соответствующим HTTP-статусом. Если сервер решения выключен или недоступен, поток может открыться и сразу завершиться событием `error` с `reason: stream_failed` — проверяйте готовность чата заранее методом получения статуса чата.
     * Отправка сообщения агенту AI-решения с потоковым ответом
     */
    async streamAiSolutionChat(requestParameters: StreamAiSolutionChatRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.streamAiSolutionChatRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить AI-решение, отправьте PATCH-запрос на `/api/v1/cloud-ai/solutions/{solution_id}`.  Меняются только переданные поля; `description: null` очищает описание. Смена модели переписывает конфигурацию агента на сервере решения и перезапускает агента, поэтому сервер должен быть включён и полностью развёрнут — иначе запрос завершится ошибкой и ничего не изменится. Смена только названия или описания сервер не затрагивает. Неподходящая модель — 404 `model_not_found`.
     * Изменение AI-решения
     */
    async updateAiSolutionRaw(requestParameters: UpdateAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAiSolution201Response>> {
        if (requestParameters.solutionId === null || requestParameters.solutionId === undefined) {
            throw new runtime.RequiredError('solutionId','Required parameter requestParameters.solutionId was null or undefined when calling updateAiSolution.');
        }

        if (requestParameters.updateAiSolution === null || requestParameters.updateAiSolution === undefined) {
            throw new runtime.RequiredError('updateAiSolution','Required parameter requestParameters.updateAiSolution was null or undefined when calling updateAiSolution.');
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
            path: `/api/v1/cloud-ai/solutions/{solution_id}`.replace(`{${"solution_id"}}`, encodeURIComponent(String(requestParameters.solutionId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAiSolutionToJSON(requestParameters.updateAiSolution),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAiSolution201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить AI-решение, отправьте PATCH-запрос на `/api/v1/cloud-ai/solutions/{solution_id}`.  Меняются только переданные поля; `description: null` очищает описание. Смена модели переписывает конфигурацию агента на сервере решения и перезапускает агента, поэтому сервер должен быть включён и полностью развёрнут — иначе запрос завершится ошибкой и ничего не изменится. Смена только названия или описания сервер не затрагивает. Неподходящая модель — 404 `model_not_found`.
     * Изменение AI-решения
     */
    async updateAiSolution(requestParameters: UpdateAiSolutionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAiSolution201Response> {
        const response = await this.updateAiSolutionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
