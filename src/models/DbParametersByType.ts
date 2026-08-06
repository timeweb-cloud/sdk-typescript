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
 * Имена параметров конфигурации, доступных для каждого типа кластера базы данных. Ключ объекта — тип кластера (значение поля `type` при создании кластера), значение — массив имён параметров, которые можно передать в `config_parameters` для кластера этого типа. Наборы параметров различаются между версиями одной СУБД. Значения параметров этот метод не возвращает — рекомендуемые значения можно получить в `GET /api/v1/dbs/default-parameters`.
 * @export
 * @interface DbParametersByType
 */
export interface DbParametersByType {
    /**
     * Параметры, доступные для кластеров типа `mysql5`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mysql5: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `mysql`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mysql: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `mysql8_4`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mysql84: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `postgres` (PostgreSQL 13).
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    postgres: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `postgres14`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    postgres14: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `postgres15`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    postgres15: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `postgres16`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    postgres16: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `postgres17`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    postgres17: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `postgres18`. Набор отличается от предыдущих версий PostgreSQL — например, добавлены `io_method` и `io_workers`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    postgres18: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `redis`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    redis: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `redis7`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    redis7: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `redis8_1`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    redis81: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `valkey`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    valkey: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `valkey7`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    valkey7: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `valkey8_1`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    valkey81: Array<string>;
    /**
     * Параметры, доступные для кластеров типа `valkey9_1`.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    valkey91: Array<string>;
    /**
     * Для кластеров типа `mongodb4` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mongodb4: Array<string>;
    /**
     * Для кластеров типа `mongodb` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mongodb: Array<string>;
    /**
     * Для кластеров типа `mongodb6` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mongodb6: Array<string>;
    /**
     * Для кластеров типа `mongodb7` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mongodb7: Array<string>;
    /**
     * Для кластеров типа `mongodb8_0` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    mongodb80: Array<string>;
    /**
     * Для кластеров типа `opensearch` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    opensearch: Array<string>;
    /**
     * Для кластеров типа `opensearch2_19` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    opensearch219: Array<string>;
    /**
     * Для кластеров типа `clickhouse` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    clickhouse: Array<string>;
    /**
     * Для кластеров типа `clickhouse24` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    clickhouse24: Array<string>;
    /**
     * Для кластеров типа `clickhouse25` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    clickhouse25: Array<string>;
    /**
     * Для кластеров типа `kafka` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    kafka: Array<string>;
    /**
     * Для кластеров типа `rabbitmq` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    rabbitmq: Array<string>;
    /**
     * Для кластеров типа `rabbitmq4_0` настраиваемых параметров нет — всегда пустой массив.
     * @type {Array<string>}
     * @memberof DbParametersByType
     */
    rabbitmq40: Array<string>;
}

/**
 * Check if a given object implements the DbParametersByType interface.
 */
export function instanceOfDbParametersByType(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "mysql5" in value;
    isInstance = isInstance && "mysql" in value;
    isInstance = isInstance && "mysql84" in value;
    isInstance = isInstance && "postgres" in value;
    isInstance = isInstance && "postgres14" in value;
    isInstance = isInstance && "postgres15" in value;
    isInstance = isInstance && "postgres16" in value;
    isInstance = isInstance && "postgres17" in value;
    isInstance = isInstance && "postgres18" in value;
    isInstance = isInstance && "redis" in value;
    isInstance = isInstance && "redis7" in value;
    isInstance = isInstance && "redis81" in value;
    isInstance = isInstance && "valkey" in value;
    isInstance = isInstance && "valkey7" in value;
    isInstance = isInstance && "valkey81" in value;
    isInstance = isInstance && "valkey91" in value;
    isInstance = isInstance && "mongodb4" in value;
    isInstance = isInstance && "mongodb" in value;
    isInstance = isInstance && "mongodb6" in value;
    isInstance = isInstance && "mongodb7" in value;
    isInstance = isInstance && "mongodb80" in value;
    isInstance = isInstance && "opensearch" in value;
    isInstance = isInstance && "opensearch219" in value;
    isInstance = isInstance && "clickhouse" in value;
    isInstance = isInstance && "clickhouse24" in value;
    isInstance = isInstance && "clickhouse25" in value;
    isInstance = isInstance && "kafka" in value;
    isInstance = isInstance && "rabbitmq" in value;
    isInstance = isInstance && "rabbitmq40" in value;

    return isInstance;
}

export function DbParametersByTypeFromJSON(json: any): DbParametersByType {
    return DbParametersByTypeFromJSONTyped(json, false);
}

export function DbParametersByTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): DbParametersByType {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'mysql5': json['mysql5'],
        'mysql': json['mysql'],
        'mysql84': json['mysql8_4'],
        'postgres': json['postgres'],
        'postgres14': json['postgres14'],
        'postgres15': json['postgres15'],
        'postgres16': json['postgres16'],
        'postgres17': json['postgres17'],
        'postgres18': json['postgres18'],
        'redis': json['redis'],
        'redis7': json['redis7'],
        'redis81': json['redis8_1'],
        'valkey': json['valkey'],
        'valkey7': json['valkey7'],
        'valkey81': json['valkey8_1'],
        'valkey91': json['valkey9_1'],
        'mongodb4': json['mongodb4'],
        'mongodb': json['mongodb'],
        'mongodb6': json['mongodb6'],
        'mongodb7': json['mongodb7'],
        'mongodb80': json['mongodb8_0'],
        'opensearch': json['opensearch'],
        'opensearch219': json['opensearch2_19'],
        'clickhouse': json['clickhouse'],
        'clickhouse24': json['clickhouse24'],
        'clickhouse25': json['clickhouse25'],
        'kafka': json['kafka'],
        'rabbitmq': json['rabbitmq'],
        'rabbitmq40': json['rabbitmq4_0'],
    };
}

export function DbParametersByTypeToJSON(value?: DbParametersByType | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'mysql5': value.mysql5,
        'mysql': value.mysql,
        'mysql8_4': value.mysql84,
        'postgres': value.postgres,
        'postgres14': value.postgres14,
        'postgres15': value.postgres15,
        'postgres16': value.postgres16,
        'postgres17': value.postgres17,
        'postgres18': value.postgres18,
        'redis': value.redis,
        'redis7': value.redis7,
        'redis8_1': value.redis81,
        'valkey': value.valkey,
        'valkey7': value.valkey7,
        'valkey8_1': value.valkey81,
        'valkey9_1': value.valkey91,
        'mongodb4': value.mongodb4,
        'mongodb': value.mongodb,
        'mongodb6': value.mongodb6,
        'mongodb7': value.mongodb7,
        'mongodb8_0': value.mongodb80,
        'opensearch': value.opensearch,
        'opensearch2_19': value.opensearch219,
        'clickhouse': value.clickhouse,
        'clickhouse24': value.clickhouse24,
        'clickhouse25': value.clickhouse25,
        'kafka': value.kafka,
        'rabbitmq': value.rabbitmq,
        'rabbitmq4_0': value.rabbitmq40,
    };
}

