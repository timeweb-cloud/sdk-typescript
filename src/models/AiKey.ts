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
/**
 * Ключ AI Gateway
 * @export
 * @interface AiKey
 */
export interface AiKey {
    /**
     * ID ключа (UUID)
     * @type {string}
     * @memberof AiKey
     */
    id: string;
    /**
     * Логин аккаунта
     * @type {string}
     * @memberof AiKey
     */
    accountId: string;
    /**
     * Название ключа
     * @type {string}
     * @memberof AiKey
     */
    name: string;
    /**
     * Описание ключа
     * @type {string}
     * @memberof AiKey
     */
    description: string | null;
    /**
     * Тип ключа: `aikey` — ключ, созданный пользователем (в том числе ключ AI-решения), `k8s` — ключ, выпущенный платформой для кластера Kubernetes
     * @type {string}
     * @memberof AiKey
     */
    entityType: AiKeyEntityTypeEnum;
    /**
     * ID ресурса, для которого платформа выпустила ключ (например, кластера Kubernetes). `null` — у ключей, созданных пользователем
     * @type {string}
     * @memberof AiKey
     */
    entityId: string | null;
    /**
     * ID проекта, к которому привязан ключ
     * @type {number}
     * @memberof AiKey
     */
    projectId: number | null;
    /**
     * Дата и время окончания действия ключа. `null` — ключ бессрочный
     * @type {Date}
     * @memberof AiKey
     */
    expiresAt: Date | null;
    /**
     * Ключ управляется платформой (выпущен для AI-решения или кластера Kubernetes): изменить, перевыпустить и удалить его нельзя — такие запросы вернут 403
     * @type {boolean}
     * @memberof AiKey
     */
    isReadonly: boolean;
    /**
     * Запасные модели в порядке приоритета. `[]` — не настроены, `null` — настройки временно не удалось прочитать (повторите запрос позже). Запасные модели применяются к любой модели, запрошенной этим ключом, и только в `/v1/chat/completions` и `/v1/responses`: если запрошенная модель не ответила, запрос по порядку повторяется на запасных. Запасная модель, совпадающая с запрошенной, пропускается. Резерв средств и проверка лимитов делаются по цене запрошенной модели, списание и учёт расхода — по цене ответившей: если запасная модель дороже, итоговое списание может превысить резерв и денежный лимит ключа.
     * @type {Array<string>}
     * @memberof AiKey
     */
    fallbackModels: Array<string> | null;
    /**
     * Дата и время создания ключа
     * @type {Date}
     * @memberof AiKey
     */
    createdAt: Date;
    /**
     * Дата и время изменения ключа
     * @type {Date}
     * @memberof AiKey
     */
    updatedAt: Date;
}


/**
 * @export
 */
export const AiKeyEntityTypeEnum = {
    Aikey: 'aikey',
    K8s: 'k8s'
} as const;
export type AiKeyEntityTypeEnum = typeof AiKeyEntityTypeEnum[keyof typeof AiKeyEntityTypeEnum];


/**
 * Check if a given object implements the AiKey interface.
 */
export function instanceOfAiKey(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "accountId" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "entityType" in value;
    isInstance = isInstance && "entityId" in value;
    isInstance = isInstance && "projectId" in value;
    isInstance = isInstance && "expiresAt" in value;
    isInstance = isInstance && "isReadonly" in value;
    isInstance = isInstance && "fallbackModels" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;

    return isInstance;
}

export function AiKeyFromJSON(json: any): AiKey {
    return AiKeyFromJSONTyped(json, false);
}

export function AiKeyFromJSONTyped(json: any, ignoreDiscriminator: boolean): AiKey {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'accountId': json['account_id'],
        'name': json['name'],
        'description': json['description'],
        'entityType': json['entity_type'],
        'entityId': json['entity_id'],
        'projectId': json['project_id'],
        'expiresAt': (json['expires_at'] === null ? null : new Date(json['expires_at'])),
        'isReadonly': json['is_readonly'],
        'fallbackModels': json['fallback_models'],
        'createdAt': (new Date(json['created_at'])),
        'updatedAt': (new Date(json['updated_at'])),
    };
}

export function AiKeyToJSON(value?: AiKey | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'account_id': value.accountId,
        'name': value.name,
        'description': value.description,
        'entity_type': value.entityType,
        'entity_id': value.entityId,
        'project_id': value.projectId,
        'expires_at': (value.expiresAt === null ? null : value.expiresAt.toISOString()),
        'is_readonly': value.isReadonly,
        'fallback_models': value.fallbackModels,
        'created_at': (value.createdAt.toISOString()),
        'updated_at': (value.updatedAt.toISOString()),
    };
}

