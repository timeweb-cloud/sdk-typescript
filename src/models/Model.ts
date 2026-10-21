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

import { exists, mapValues } from '../runtime';
import type { ModelParamInfo } from './ModelParamInfo';
import {
    ModelParamInfoFromJSON,
    ModelParamInfoFromJSONTyped,
    ModelParamInfoToJSON,
} from './ModelParamInfo';

/**
 * AI модель
 * @export
 * @interface Model
 */
export interface Model {
    /**
     * ID модели
     * @type {number}
     * @memberof Model
     */
    id: number;
    /**
     * ID провайдера модели
     * @type {number}
     * @memberof Model
     */
    providerId: number;
    /**
     * Семейство модели
     * @type {string}
     * @memberof Model
     */
    name: string;
    /**
     * Отображаемое название модели
     * @type {string}
     * @memberof Model
     */
    publicName: string;
    /**
     * Идентификатор модели с префиксом провайдера — передаётся в поле `model` запросов к AI Gateway
     * @type {string}
     * @memberof Model
     */
    modelName: string;
    /**
     * Тип модели:
     * - `llm` — языковая модель
     * - `hosted-llm` — языковая модель, размещённая в Timeweb Cloud
     * - `embedding` — модель эмбеддингов
     * - `image` — генерация изображений
     * - `audio` — работа с аудио
     * - `video` — генерация видео
     * - `moderation` — модерация контента
     * - `system-one` — служебная модель с собственным API
     * @type {string}
     * @memberof Model
     */
    type: ModelTypeEnum;
    /**
     * Версия модели
     * @type {string}
     * @memberof Model
     */
    version: string;
    /**
     * Модель устарела и недоступна для выбора в новых агентах
     * @type {boolean}
     * @memberof Model
     */
    isDeprecated: boolean;
    /**
     * Поддержка модели остановлена: запросы к ней не выполняются
     * @type {boolean}
     * @memberof Model
     */
    isStopped: boolean;
    /**
     * Дата отключения модели у провайдера. `null`, если отключение не запланировано
     * @type {Date}
     * @memberof Model
     */
    deprecationDate: Date | null;
    /**
     * Модель поддерживает режим рассуждений
     * @type {boolean}
     * @memberof Model
     */
    isReasoning: boolean;
    /**
     * Параметры генерации, которые можно настроить у агента с этой моделью. Ключ — имя параметра (`temperature`, `top_p`, `max_tokens`, `reasoning_effort` и т.д.). `null`, если параметры не заданы
     * @type {{ [key: string]: ModelParamInfo; }}
     * @memberof Model
     */
    paramsInfo: { [key: string]: ModelParamInfo; } | null;
}


/**
 * @export
 */
export const ModelTypeEnum = {
    Llm: 'llm',
    HostedLlm: 'hosted-llm',
    Embedding: 'embedding',
    Image: 'image',
    Audio: 'audio',
    Video: 'video',
    Moderation: 'moderation',
    SystemOne: 'system-one'
} as const;
export type ModelTypeEnum = typeof ModelTypeEnum[keyof typeof ModelTypeEnum];


/**
 * Check if a given object implements the Model interface.
 */
export function instanceOfModel(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "providerId" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "publicName" in value;
    isInstance = isInstance && "modelName" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "version" in value;
    isInstance = isInstance && "isDeprecated" in value;
    isInstance = isInstance && "isStopped" in value;
    isInstance = isInstance && "deprecationDate" in value;
    isInstance = isInstance && "isReasoning" in value;
    isInstance = isInstance && "paramsInfo" in value;

    return isInstance;
}

export function ModelFromJSON(json: any): Model {
    return ModelFromJSONTyped(json, false);
}

export function ModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): Model {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'providerId': json['provider_id'],
        'name': json['name'],
        'publicName': json['public_name'],
        'modelName': json['model_name'],
        'type': json['type'],
        'version': json['version'],
        'isDeprecated': json['is_deprecated'],
        'isStopped': json['is_stopped'],
        'deprecationDate': (json['deprecation_date'] === null ? null : new Date(json['deprecation_date'])),
        'isReasoning': json['is_reasoning'],
        'paramsInfo': (json['params_info'] === null ? null : mapValues(json['params_info'], ModelParamInfoFromJSON)),
    };
}

export function ModelToJSON(value?: Model | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'provider_id': value.providerId,
        'name': value.name,
        'public_name': value.publicName,
        'model_name': value.modelName,
        'type': value.type,
        'version': value.version,
        'is_deprecated': value.isDeprecated,
        'is_stopped': value.isStopped,
        'deprecation_date': (value.deprecationDate === null ? null : value.deprecationDate.toISOString()),
        'is_reasoning': value.isReasoning,
        'params_info': (value.paramsInfo === null ? null : mapValues(value.paramsInfo, ModelParamInfoToJSON)),
    };
}

