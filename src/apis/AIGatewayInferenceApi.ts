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
  AiGatewayBatch,
  AiGatewayBatchCreateRequest,
  AiGatewayBatchList,
  AiGatewayChatCompletion,
  AiGatewayChatCompletionChunk,
  AiGatewayChatCompletionRequest,
  AiGatewayCompletion,
  AiGatewayCompletionRequest,
  AiGatewayEmbeddingList,
  AiGatewayEmbeddingRequest,
  AiGatewayError,
  AiGatewayFile,
  AiGatewayFileDeleted,
  AiGatewayImageGenerationRequest,
  AiGatewayImagesResponse,
  AiGatewayModelList,
  AiGatewayResponse,
  AiGatewayResponseCreateRequest,
  AiGatewayResponseDeleted,
  AiGatewaySpeechRequest,
  AiGatewayTranscription,
  AiGatewayValidationError,
} from '../models/index';
import {
    AiGatewayBatchFromJSON,
    AiGatewayBatchToJSON,
    AiGatewayBatchCreateRequestFromJSON,
    AiGatewayBatchCreateRequestToJSON,
    AiGatewayBatchListFromJSON,
    AiGatewayBatchListToJSON,
    AiGatewayChatCompletionFromJSON,
    AiGatewayChatCompletionToJSON,
    AiGatewayChatCompletionChunkFromJSON,
    AiGatewayChatCompletionChunkToJSON,
    AiGatewayChatCompletionRequestFromJSON,
    AiGatewayChatCompletionRequestToJSON,
    AiGatewayCompletionFromJSON,
    AiGatewayCompletionToJSON,
    AiGatewayCompletionRequestFromJSON,
    AiGatewayCompletionRequestToJSON,
    AiGatewayEmbeddingListFromJSON,
    AiGatewayEmbeddingListToJSON,
    AiGatewayEmbeddingRequestFromJSON,
    AiGatewayEmbeddingRequestToJSON,
    AiGatewayErrorFromJSON,
    AiGatewayErrorToJSON,
    AiGatewayFileFromJSON,
    AiGatewayFileToJSON,
    AiGatewayFileDeletedFromJSON,
    AiGatewayFileDeletedToJSON,
    AiGatewayImageGenerationRequestFromJSON,
    AiGatewayImageGenerationRequestToJSON,
    AiGatewayImagesResponseFromJSON,
    AiGatewayImagesResponseToJSON,
    AiGatewayModelListFromJSON,
    AiGatewayModelListToJSON,
    AiGatewayResponseFromJSON,
    AiGatewayResponseToJSON,
    AiGatewayResponseCreateRequestFromJSON,
    AiGatewayResponseCreateRequestToJSON,
    AiGatewayResponseDeletedFromJSON,
    AiGatewayResponseDeletedToJSON,
    AiGatewaySpeechRequestFromJSON,
    AiGatewaySpeechRequestToJSON,
    AiGatewayTranscriptionFromJSON,
    AiGatewayTranscriptionToJSON,
    AiGatewayValidationErrorFromJSON,
    AiGatewayValidationErrorToJSON,
} from '../models/index';

export interface CancelAiGatewayBatchRequest {
    batchId: string;
}

export interface CancelAiGatewayResponseRequest {
    responseId: string;
}

export interface CreateAiGatewayBatchRequest {
    aiGatewayBatchCreateRequest: AiGatewayBatchCreateRequest;
}

export interface CreateAiGatewayChatCompletionRequest {
    requestBody: { [key: string]: any; };
}

export interface CreateAiGatewayCompletionRequest {
    requestBody: { [key: string]: any; };
}

export interface CreateAiGatewayEmbeddingRequest {
    requestBody: { [key: string]: any; };
}

export interface CreateAiGatewayImageRequest {
    requestBody: { [key: string]: any; };
}

export interface CreateAiGatewayImageEditRequest {
    model: string;
    image: Blob;
    prompt: string;
    mask?: Blob;
    n?: number;
    size?: string;
    quality?: string;
}

export interface CreateAiGatewayResponseRequest {
    requestBody: { [key: string]: any; };
}

export interface CreateAiGatewaySpeechRequest {
    requestBody: { [key: string]: any; };
}

export interface CreateAiGatewayTranscriptionRequest {
    file: Blob;
    model: string;
    language?: string;
    prompt?: string;
    responseFormat?: string;
    temperature?: number;
}

export interface DeleteAiGatewayFileRequest {
    fileId: string;
}

export interface DeleteAiGatewayResponseRequest {
    responseId: string;
}

export interface DownloadAiGatewayFileContentRequest {
    fileId: string;
}

export interface GetAiGatewayBatchRequest {
    batchId: string;
}

export interface GetAiGatewayBatchesRequest {
    limit?: number;
    after?: string;
}

export interface GetAiGatewayFileRequest {
    fileId: string;
}

export interface GetAiGatewayResponseRequest {
    responseId: string;
}

export interface UploadAiGatewayFileRequest {
    file: Blob;
    purpose: string;
    model?: string;
    targetModelNames?: string;
}

/**
 * 
 */
export class AIGatewayInferenceApi extends runtime.BaseAPI {

    /**
     * Чтобы отменить батч, отправьте POST-запрос на `/v1/batches/{batch_id}/cancel`.  Батч переходит в статус `cancelling`, отмена выполняется асинхронно и может занять несколько минут; итоговый статус `cancelled` проверяйте через `GET /v1/batches/{batch_id}`. Пока отмена не завершилась, входной файл батча удалить нельзя.
     * Отмена батча
     */
    async cancelAiGatewayBatchRaw(requestParameters: CancelAiGatewayBatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayBatch>> {
        if (requestParameters.batchId === null || requestParameters.batchId === undefined) {
            throw new runtime.RequiredError('batchId','Required parameter requestParameters.batchId was null or undefined when calling cancelAiGatewayBatch.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/batches/{batch_id}/cancel`.replace(`{${"batch_id"}}`, encodeURIComponent(String(requestParameters.batchId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayBatchFromJSON(jsonValue));
    }

    /**
     * Чтобы отменить батч, отправьте POST-запрос на `/v1/batches/{batch_id}/cancel`.  Батч переходит в статус `cancelling`, отмена выполняется асинхронно и может занять несколько минут; итоговый статус `cancelled` проверяйте через `GET /v1/batches/{batch_id}`. Пока отмена не завершилась, входной файл батча удалить нельзя.
     * Отмена батча
     */
    async cancelAiGatewayBatch(requestParameters: CancelAiGatewayBatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayBatch> {
        const response = await this.cancelAiGatewayBatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы отменить ответ, запущенный с `\"background\": true`, отправьте POST-запрос на `/v1/responses/{response_id}/cancel`.  Отмена может завершиться не сразу: итоговый статус `cancelled` проверяйте через `GET /v1/responses/{response_id}`. Ответ, созданный без `background`, отменить нельзя — вернётся ошибка 400. Неизвестный `response_id` также возвращает 400.
     * Отмена фонового ответа (Responses API)
     */
    async cancelAiGatewayResponseRaw(requestParameters: CancelAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayResponse>> {
        if (requestParameters.responseId === null || requestParameters.responseId === undefined) {
            throw new runtime.RequiredError('responseId','Required parameter requestParameters.responseId was null or undefined when calling cancelAiGatewayResponse.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/responses/{response_id}/cancel`.replace(`{${"response_id"}}`, encodeURIComponent(String(requestParameters.responseId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отменить ответ, запущенный с `\"background\": true`, отправьте POST-запрос на `/v1/responses/{response_id}/cancel`.  Отмена может завершиться не сразу: итоговый статус `cancelled` проверяйте через `GET /v1/responses/{response_id}`. Ответ, созданный без `background`, отменить нельзя — вернётся ошибка 400. Неизвестный `response_id` также возвращает 400.
     * Отмена фонового ответа (Responses API)
     */
    async cancelAiGatewayResponse(requestParameters: CancelAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayResponse> {
        const response = await this.cancelAiGatewayResponseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы запустить асинхронную обработку входного файла, загруженного с `purpose=batch`, отправьте POST-запрос на `/v1/batches`.  При создании батча его оценочная стоимость резервируется на балансе, фактическая стоимость списывается по цене Batch API после выполнения. Модели, эндпоинты и коэффициенты цены Batch API — в поле `batch` каталога моделей (`GET https://api.timeweb.cloud/api/v3/cloud-ai/models`). Batch API доступен только для ключей AI Gateway.
     * Создание батча
     */
    async createAiGatewayBatchRaw(requestParameters: CreateAiGatewayBatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayBatch>> {
        if (requestParameters.aiGatewayBatchCreateRequest === null || requestParameters.aiGatewayBatchCreateRequest === undefined) {
            throw new runtime.RequiredError('aiGatewayBatchCreateRequest','Required parameter requestParameters.aiGatewayBatchCreateRequest was null or undefined when calling createAiGatewayBatch.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/batches`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AiGatewayBatchCreateRequestToJSON(requestParameters.aiGatewayBatchCreateRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayBatchFromJSON(jsonValue));
    }

    /**
     * Чтобы запустить асинхронную обработку входного файла, загруженного с `purpose=batch`, отправьте POST-запрос на `/v1/batches`.  При создании батча его оценочная стоимость резервируется на балансе, фактическая стоимость списывается по цене Batch API после выполнения. Модели, эндпоинты и коэффициенты цены Batch API — в поле `batch` каталога моделей (`GET https://api.timeweb.cloud/api/v3/cloud-ai/models`). Batch API доступен только для ключей AI Gateway.
     * Создание батча
     */
    async createAiGatewayBatch(requestParameters: CreateAiGatewayBatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayBatch> {
        const response = await this.createAiGatewayBatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить следующий ответ модели в диалоге, отправьте POST-запрос на `/v1/chat/completions`.  Запрос не хранит состояние: передавайте всю историю диалога в `messages`. Поддерживаются вызов функций (`tools`), структурированный ответ (`response_format`) и изображения во входных сообщениях (для моделей с поддержкой зрения).  С `\"stream\": true` ответ приходит потоком Server-Sent Events: события `chat.completion.chunk` в строках `data:`, в конце — `data: [DONE]`. С `\"stream_options\": {\"include_usage\": true}` последний чанк содержит расход токенов.  Если у ключа настроены запасные модели и запрошенная модель не ответила, запрос повторяется на запасных. Заголовок ответа `x-timeweb-attempted-fallbacks` показывает, сколько запасных моделей было опробовано.
     * Генерация ответа в диалоге (Chat Completions)
     */
    async createAiGatewayChatCompletionRaw(requestParameters: CreateAiGatewayChatCompletionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayChatCompletion>> {
        if (requestParameters.requestBody === null || requestParameters.requestBody === undefined) {
            throw new runtime.RequiredError('requestBody','Required parameter requestParameters.requestBody was null or undefined when calling createAiGatewayChatCompletion.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/chat/completions`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayChatCompletionFromJSON(jsonValue));
    }

    /**
     * Чтобы получить следующий ответ модели в диалоге, отправьте POST-запрос на `/v1/chat/completions`.  Запрос не хранит состояние: передавайте всю историю диалога в `messages`. Поддерживаются вызов функций (`tools`), структурированный ответ (`response_format`) и изображения во входных сообщениях (для моделей с поддержкой зрения).  С `\"stream\": true` ответ приходит потоком Server-Sent Events: события `chat.completion.chunk` в строках `data:`, в конце — `data: [DONE]`. С `\"stream_options\": {\"include_usage\": true}` последний чанк содержит расход токенов.  Если у ключа настроены запасные модели и запрошенная модель не ответила, запрос повторяется на запасных. Заголовок ответа `x-timeweb-attempted-fallbacks` показывает, сколько запасных моделей было опробовано.
     * Генерация ответа в диалоге (Chat Completions)
     */
    async createAiGatewayChatCompletion(requestParameters: CreateAiGatewayChatCompletionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayChatCompletion> {
        const response = await this.createAiGatewayChatCompletionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить продолжение текста `prompt`, отправьте POST-запрос на `/v1/completions`.  Это устаревший API OpenAI — для новых интеграций используйте `/v1/chat/completions`. С `\"stream\": true` ответ приходит потоком Server-Sent Events и заканчивается `data: [DONE]`.
     * Продолжение текста (Completions)
     */
    async createAiGatewayCompletionRaw(requestParameters: CreateAiGatewayCompletionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayCompletion>> {
        if (requestParameters.requestBody === null || requestParameters.requestBody === undefined) {
            throw new runtime.RequiredError('requestBody','Required parameter requestParameters.requestBody was null or undefined when calling createAiGatewayCompletion.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/completions`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayCompletionFromJSON(jsonValue));
    }

    /**
     * Чтобы получить продолжение текста `prompt`, отправьте POST-запрос на `/v1/completions`.  Это устаревший API OpenAI — для новых интеграций используйте `/v1/chat/completions`. С `\"stream\": true` ответ приходит потоком Server-Sent Events и заканчивается `data: [DONE]`.
     * Продолжение текста (Completions)
     */
    async createAiGatewayCompletion(requestParameters: CreateAiGatewayCompletionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayCompletion> {
        const response = await this.createAiGatewayCompletionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить векторные представления текстов, отправьте POST-запрос на `/v1/embeddings`.  Используйте модель с `mode: embedding` из `GET /v1/models`. Эмбеддинги возвращаются в порядке входных текстов.
     * Получение эмбеддингов
     */
    async createAiGatewayEmbeddingRaw(requestParameters: CreateAiGatewayEmbeddingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayEmbeddingList>> {
        if (requestParameters.requestBody === null || requestParameters.requestBody === undefined) {
            throw new runtime.RequiredError('requestBody','Required parameter requestParameters.requestBody was null or undefined when calling createAiGatewayEmbedding.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/embeddings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayEmbeddingListFromJSON(jsonValue));
    }

    /**
     * Чтобы получить векторные представления текстов, отправьте POST-запрос на `/v1/embeddings`.  Используйте модель с `mode: embedding` из `GET /v1/models`. Эмбеддинги возвращаются в порядке входных текстов.
     * Получение эмбеддингов
     */
    async createAiGatewayEmbedding(requestParameters: CreateAiGatewayEmbeddingRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayEmbeddingList> {
        const response = await this.createAiGatewayEmbeddingRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы сгенерировать изображения по текстовому описанию, отправьте POST-запрос на `/v1/images/generations`.  Используйте модель с `mode: image_generation` из `GET /v1/models`.
     * Генерация изображений
     */
    async createAiGatewayImageRaw(requestParameters: CreateAiGatewayImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayImagesResponse>> {
        if (requestParameters.requestBody === null || requestParameters.requestBody === undefined) {
            throw new runtime.RequiredError('requestBody','Required parameter requestParameters.requestBody was null or undefined when calling createAiGatewayImage.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/images/generations`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayImagesResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы сгенерировать изображения по текстовому описанию, отправьте POST-запрос на `/v1/images/generations`.  Используйте модель с `mode: image_generation` из `GET /v1/models`.
     * Генерация изображений
     */
    async createAiGatewayImage(requestParameters: CreateAiGatewayImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayImagesResponse> {
        const response = await this.createAiGatewayImageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить или дополнить изображения по описанию, отправьте POST-запрос на `/v1/images/edits` (multipart/form-data).  Доступно для моделей GPT Image (`openai/gpt-image-*`) и FLUX.2 (`black_forest_labs/flux-2-*`). Для других моделей, в том числе неизвестных, возвращается ошибка 405.
     * Редактирование изображений
     */
    async createAiGatewayImageEditRaw(requestParameters: CreateAiGatewayImageEditRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayImagesResponse>> {
        if (requestParameters.model === null || requestParameters.model === undefined) {
            throw new runtime.RequiredError('model','Required parameter requestParameters.model was null or undefined when calling createAiGatewayImageEdit.');
        }

        if (requestParameters.image === null || requestParameters.image === undefined) {
            throw new runtime.RequiredError('image','Required parameter requestParameters.image was null or undefined when calling createAiGatewayImageEdit.');
        }

        if (requestParameters.prompt === null || requestParameters.prompt === undefined) {
            throw new runtime.RequiredError('prompt','Required parameter requestParameters.prompt was null or undefined when calling createAiGatewayImageEdit.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.model !== undefined) {
            formParams.append('model', requestParameters.model as any);
        }

        if (requestParameters.image !== undefined) {
            formParams.append('image', requestParameters.image as any);
        }

        if (requestParameters.mask !== undefined) {
            formParams.append('mask', requestParameters.mask as any);
        }

        if (requestParameters.prompt !== undefined) {
            formParams.append('prompt', requestParameters.prompt as any);
        }

        if (requestParameters.n !== undefined) {
            formParams.append('n', requestParameters.n as any);
        }

        if (requestParameters.size !== undefined) {
            formParams.append('size', requestParameters.size as any);
        }

        if (requestParameters.quality !== undefined) {
            formParams.append('quality', requestParameters.quality as any);
        }

        const response = await this.request({
            path: `/v1/images/edits`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayImagesResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить или дополнить изображения по описанию, отправьте POST-запрос на `/v1/images/edits` (multipart/form-data).  Доступно для моделей GPT Image (`openai/gpt-image-*`) и FLUX.2 (`black_forest_labs/flux-2-*`). Для других моделей, в том числе неизвестных, возвращается ошибка 405.
     * Редактирование изображений
     */
    async createAiGatewayImageEdit(requestParameters: CreateAiGatewayImageEditRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayImagesResponse> {
        const response = await this.createAiGatewayImageEditRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить ответ модели через OpenAI Responses API, отправьте POST-запрос на `/v1/responses`.  Диалог можно продолжить по `previous_response_id`, долгие запросы — выполнить в фоне с `\"background\": true` и получать результат через `GET /v1/responses/{response_id}`.  С `\"stream\": true` ответ приходит потоком типизированных событий Server-Sent Events (`response.created`, `response.output_text.delta`, `response.completed` и др.), в конце потока — `data: [DONE]`.  Если у ключа настроены запасные модели и запрошенная модель не ответила, запрос повторяется на запасных (заголовок `x-timeweb-attempted-fallbacks`).
     * Создание ответа (Responses API)
     */
    async createAiGatewayResponseRaw(requestParameters: CreateAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayResponse>> {
        if (requestParameters.requestBody === null || requestParameters.requestBody === undefined) {
            throw new runtime.RequiredError('requestBody','Required parameter requestParameters.requestBody was null or undefined when calling createAiGatewayResponse.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/responses`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить ответ модели через OpenAI Responses API, отправьте POST-запрос на `/v1/responses`.  Диалог можно продолжить по `previous_response_id`, долгие запросы — выполнить в фоне с `\"background\": true` и получать результат через `GET /v1/responses/{response_id}`.  С `\"stream\": true` ответ приходит потоком типизированных событий Server-Sent Events (`response.created`, `response.output_text.delta`, `response.completed` и др.), в конце потока — `data: [DONE]`.  Если у ключа настроены запасные модели и запрошенная модель не ответила, запрос повторяется на запасных (заголовок `x-timeweb-attempted-fallbacks`).
     * Создание ответа (Responses API)
     */
    async createAiGatewayResponse(requestParameters: CreateAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayResponse> {
        const response = await this.createAiGatewayResponseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы озвучить текст, отправьте POST-запрос на `/v1/audio/speech`.  Используйте модель с `mode: audio_speech` из `GET /v1/models`. Ответ — аудиофайл в формате `response_format` (по умолчанию `mp3`).
     * Синтез речи
     */
    async createAiGatewaySpeechRaw(requestParameters: CreateAiGatewaySpeechRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        if (requestParameters.requestBody === null || requestParameters.requestBody === undefined) {
            throw new runtime.RequiredError('requestBody','Required parameter requestParameters.requestBody was null or undefined when calling createAiGatewaySpeech.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/audio/speech`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Чтобы озвучить текст, отправьте POST-запрос на `/v1/audio/speech`.  Используйте модель с `mode: audio_speech` из `GET /v1/models`. Ответ — аудиофайл в формате `response_format` (по умолчанию `mp3`).
     * Синтез речи
     */
    async createAiGatewaySpeech(requestParameters: CreateAiGatewaySpeechRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.createAiGatewaySpeechRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы распознать речь в аудиофайле, отправьте POST-запрос на `/v1/audio/transcriptions` (multipart/form-data).  Доступно для моделей распознавания речи `*-transcribe` (например, `openai/gpt-4o-mini-transcribe`). Для других моделей, в том числе неизвестных, возвращается ошибка 405. Ответ возвращается в JSON.
     * Распознавание речи
     */
    async createAiGatewayTranscriptionRaw(requestParameters: CreateAiGatewayTranscriptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayTranscription>> {
        if (requestParameters.file === null || requestParameters.file === undefined) {
            throw new runtime.RequiredError('file','Required parameter requestParameters.file was null or undefined when calling createAiGatewayTranscription.');
        }

        if (requestParameters.model === null || requestParameters.model === undefined) {
            throw new runtime.RequiredError('model','Required parameter requestParameters.model was null or undefined when calling createAiGatewayTranscription.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.file !== undefined) {
            formParams.append('file', requestParameters.file as any);
        }

        if (requestParameters.model !== undefined) {
            formParams.append('model', requestParameters.model as any);
        }

        if (requestParameters.language !== undefined) {
            formParams.append('language', requestParameters.language as any);
        }

        if (requestParameters.prompt !== undefined) {
            formParams.append('prompt', requestParameters.prompt as any);
        }

        if (requestParameters.responseFormat !== undefined) {
            formParams.append('response_format', requestParameters.responseFormat as any);
        }

        if (requestParameters.temperature !== undefined) {
            formParams.append('temperature', requestParameters.temperature as any);
        }

        const response = await this.request({
            path: `/v1/audio/transcriptions`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayTranscriptionFromJSON(jsonValue));
    }

    /**
     * Чтобы распознать речь в аудиофайле, отправьте POST-запрос на `/v1/audio/transcriptions` (multipart/form-data).  Доступно для моделей распознавания речи `*-transcribe` (например, `openai/gpt-4o-mini-transcribe`). Для других моделей, в том числе неизвестных, возвращается ошибка 405. Ответ возвращается в JSON.
     * Распознавание речи
     */
    async createAiGatewayTranscription(requestParameters: CreateAiGatewayTranscriptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayTranscription> {
        const response = await this.createAiGatewayTranscriptionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить файл, отправьте DELETE-запрос на `/v1/files/{file_id}`.  Входной файл батча, который ещё выполняется или отменяется, и результаты батча, расход которого ещё не списан, удалить нельзя — вернётся ошибка 409.
     * Удаление файла
     */
    async deleteAiGatewayFileRaw(requestParameters: DeleteAiGatewayFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayFileDeleted>> {
        if (requestParameters.fileId === null || requestParameters.fileId === undefined) {
            throw new runtime.RequiredError('fileId','Required parameter requestParameters.fileId was null or undefined when calling deleteAiGatewayFile.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/files/{file_id}`.replace(`{${"file_id"}}`, encodeURIComponent(String(requestParameters.fileId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayFileDeletedFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить файл, отправьте DELETE-запрос на `/v1/files/{file_id}`.  Входной файл батча, который ещё выполняется или отменяется, и результаты батча, расход которого ещё не списан, удалить нельзя — вернётся ошибка 409.
     * Удаление файла
     */
    async deleteAiGatewayFile(requestParameters: DeleteAiGatewayFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayFileDeleted> {
        const response = await this.deleteAiGatewayFileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить сохранённый ответ, отправьте DELETE-запрос на `/v1/responses/{response_id}`.  Неизвестный или уже удалённый `response_id` возвращает ошибку 400.
     * Удаление ответа (Responses API)
     */
    async deleteAiGatewayResponseRaw(requestParameters: DeleteAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayResponseDeleted>> {
        if (requestParameters.responseId === null || requestParameters.responseId === undefined) {
            throw new runtime.RequiredError('responseId','Required parameter requestParameters.responseId was null or undefined when calling deleteAiGatewayResponse.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/responses/{response_id}`.replace(`{${"response_id"}}`, encodeURIComponent(String(requestParameters.responseId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayResponseDeletedFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить сохранённый ответ, отправьте DELETE-запрос на `/v1/responses/{response_id}`.  Неизвестный или уже удалённый `response_id` возвращает ошибку 400.
     * Удаление ответа (Responses API)
     */
    async deleteAiGatewayResponse(requestParameters: DeleteAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayResponseDeleted> {
        const response = await this.deleteAiGatewayResponseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы скачать содержимое файла — например, результаты выполненного батча (`output_file_id`), — отправьте GET-запрос на `/v1/files/{file_id}/content`.  Перед скачиванием результатов получите батч через `GET /v1/batches/{batch_id}` и убедитесь, что он в статусе `completed`. Файлы с `purpose=user_data` скачать нельзя — вернётся ошибка 400.
     * Скачивание файла
     */
    async downloadAiGatewayFileContentRaw(requestParameters: DownloadAiGatewayFileContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Blob>> {
        if (requestParameters.fileId === null || requestParameters.fileId === undefined) {
            throw new runtime.RequiredError('fileId','Required parameter requestParameters.fileId was null or undefined when calling downloadAiGatewayFileContent.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/files/{file_id}/content`.replace(`{${"file_id"}}`, encodeURIComponent(String(requestParameters.fileId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Чтобы скачать содержимое файла — например, результаты выполненного батча (`output_file_id`), — отправьте GET-запрос на `/v1/files/{file_id}/content`.  Перед скачиванием результатов получите батч через `GET /v1/batches/{batch_id}` и убедитесь, что он в статусе `completed`. Файлы с `purpose=user_data` скачать нельзя — вернётся ошибка 400.
     * Скачивание файла
     */
    async downloadAiGatewayFileContent(requestParameters: DownloadAiGatewayFileContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Blob> {
        const response = await this.downloadAiGatewayFileContentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статус батча, отправьте GET-запрос на `/v1/batches/{batch_id}`.  Когда статус станет `completed`, скачайте результаты по `output_file_id` через `GET /v1/files/{file_id}/content`.
     * Получение батча
     */
    async getAiGatewayBatchRaw(requestParameters: GetAiGatewayBatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayBatch>> {
        if (requestParameters.batchId === null || requestParameters.batchId === undefined) {
            throw new runtime.RequiredError('batchId','Required parameter requestParameters.batchId was null or undefined when calling getAiGatewayBatch.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/batches/{batch_id}`.replace(`{${"batch_id"}}`, encodeURIComponent(String(requestParameters.batchId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayBatchFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статус батча, отправьте GET-запрос на `/v1/batches/{batch_id}`.  Когда статус станет `completed`, скачайте результаты по `output_file_id` через `GET /v1/files/{file_id}/content`.
     * Получение батча
     */
    async getAiGatewayBatch(requestParameters: GetAiGatewayBatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayBatch> {
        const response = await this.getAiGatewayBatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список батчей, отправьте GET-запрос на `/v1/batches`.  Для следующей страницы передайте в `after` значение `last_id`, пока `has_more` равно `true`.
     * Получение списка батчей
     */
    async getAiGatewayBatchesRaw(requestParameters: GetAiGatewayBatchesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayBatchList>> {
        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.after !== undefined) {
            queryParameters['after'] = requestParameters.after;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/batches`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayBatchListFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список батчей, отправьте GET-запрос на `/v1/batches`.  Для следующей страницы передайте в `after` значение `last_id`, пока `has_more` равно `true`.
     * Получение списка батчей
     */
    async getAiGatewayBatches(requestParameters: GetAiGatewayBatchesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayBatchList> {
        const response = await this.getAiGatewayBatchesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о загруженном файле, отправьте GET-запрос на `/v1/files/{file_id}`.
     * Получение информации о файле
     */
    async getAiGatewayFileRaw(requestParameters: GetAiGatewayFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayFile>> {
        if (requestParameters.fileId === null || requestParameters.fileId === undefined) {
            throw new runtime.RequiredError('fileId','Required parameter requestParameters.fileId was null or undefined when calling getAiGatewayFile.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/files/{file_id}`.replace(`{${"file_id"}}`, encodeURIComponent(String(requestParameters.fileId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayFileFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о загруженном файле, отправьте GET-запрос на `/v1/files/{file_id}`.
     * Получение информации о файле
     */
    async getAiGatewayFile(requestParameters: GetAiGatewayFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayFile> {
        const response = await this.getAiGatewayFileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список моделей, доступных ключу, отправьте GET-запрос на `/v1/models`.  Поле `mode` показывает назначение модели. В списке могут оставаться модели, снятые с обслуживания: запросы к ним возвращают ошибку 410. Актуальный статус, цены и возможности моделей — в каталоге `GET https://api.timeweb.cloud/api/v3/cloud-ai/models` (снятые модели — `is_stopped: true`).
     * Получение списка моделей AI Gateway
     */
    async getAiGatewayModelsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayModelList>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/models`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayModelListFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список моделей, доступных ключу, отправьте GET-запрос на `/v1/models`.  Поле `mode` показывает назначение модели. В списке могут оставаться модели, снятые с обслуживания: запросы к ним возвращают ошибку 410. Актуальный статус, цены и возможности моделей — в каталоге `GET https://api.timeweb.cloud/api/v3/cloud-ai/models` (снятые модели — `is_stopped: true`).
     * Получение списка моделей AI Gateway
     */
    async getAiGatewayModels(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayModelList> {
        const response = await this.getAiGatewayModelsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить сохранённый ответ — например, дождаться завершения фонового ответа, — отправьте GET-запрос на `/v1/responses/{response_id}`.  Неизвестный или удалённый `response_id` возвращает ошибку 400.
     * Получение ответа (Responses API)
     */
    async getAiGatewayResponseRaw(requestParameters: GetAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayResponse>> {
        if (requestParameters.responseId === null || requestParameters.responseId === undefined) {
            throw new runtime.RequiredError('responseId','Required parameter requestParameters.responseId was null or undefined when calling getAiGatewayResponse.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/responses/{response_id}`.replace(`{${"response_id"}}`, encodeURIComponent(String(requestParameters.responseId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить сохранённый ответ — например, дождаться завершения фонового ответа, — отправьте GET-запрос на `/v1/responses/{response_id}`.  Неизвестный или удалённый `response_id` возвращает ошибку 400.
     * Получение ответа (Responses API)
     */
    async getAiGatewayResponse(requestParameters: GetAiGatewayResponseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayResponse> {
        const response = await this.getAiGatewayResponseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы загрузить файл, отправьте POST-запрос на `/v1/files` (multipart/form-data).  Файл загружается для конкретной модели, поэтому `model` (или `target_model_names`) обязателен: - `purpose=batch` — входной JSONL-файл Batch API. Все строки должны обращаться к одной модели — той, что указана в `model`, иначе вернётся 400. Размер — до 50 МБ и до 50 000 запросов; - `user_data` и другие назначения OpenAI — файлы, на которые можно сослаться по `file_id` в сообщениях.  Загрузка бесплатна. Сохраняйте `id` загруженных файлов: получить список файлов нельзя (`GET /v1/files` возвращает 405).
     * Загрузка файла
     */
    async uploadAiGatewayFileRaw(requestParameters: UploadAiGatewayFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AiGatewayFile>> {
        if (requestParameters.file === null || requestParameters.file === undefined) {
            throw new runtime.RequiredError('file','Required parameter requestParameters.file was null or undefined when calling uploadAiGatewayFile.');
        }

        if (requestParameters.purpose === null || requestParameters.purpose === undefined) {
            throw new runtime.RequiredError('purpose','Required parameter requestParameters.purpose was null or undefined when calling uploadAiGatewayFile.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("AiGatewayKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.file !== undefined) {
            formParams.append('file', requestParameters.file as any);
        }

        if (requestParameters.purpose !== undefined) {
            formParams.append('purpose', requestParameters.purpose as any);
        }

        if (requestParameters.model !== undefined) {
            formParams.append('model', requestParameters.model as any);
        }

        if (requestParameters.targetModelNames !== undefined) {
            formParams.append('target_model_names', requestParameters.targetModelNames as any);
        }

        const response = await this.request({
            path: `/v1/files`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AiGatewayFileFromJSON(jsonValue));
    }

    /**
     * Чтобы загрузить файл, отправьте POST-запрос на `/v1/files` (multipart/form-data).  Файл загружается для конкретной модели, поэтому `model` (или `target_model_names`) обязателен: - `purpose=batch` — входной JSONL-файл Batch API. Все строки должны обращаться к одной модели — той, что указана в `model`, иначе вернётся 400. Размер — до 50 МБ и до 50 000 запросов; - `user_data` и другие назначения OpenAI — файлы, на которые можно сослаться по `file_id` в сообщениях.  Загрузка бесплатна. Сохраняйте `id` загруженных файлов: получить список файлов нельзя (`GET /v1/files` возвращает 405).
     * Загрузка файла
     */
    async uploadAiGatewayFile(requestParameters: UploadAiGatewayFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AiGatewayFile> {
        const response = await this.uploadAiGatewayFileRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
