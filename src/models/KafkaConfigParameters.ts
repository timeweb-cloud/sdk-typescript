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
 * Настройки топика Kafka. Все значения возвращаются в виде строк. Не заданные явно параметры возвращаются со значениями по умолчанию.
 * @export
 * @interface KafkaConfigParameters
 */
export interface KafkaConfigParameters {
    /**
     * Количество партиций топика.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    partitions?: string;
    /**
     * Политика очистки старых сегментов лога: `delete` — удалять, `compact` — уплотнять.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    cleanupPolicy?: KafkaConfigParametersCleanupPolicyEnum;
    /**
     * Тип сжатия сообщений в топике.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    compressionType?: KafkaConfigParametersCompressionTypeEnum;
    /**
     * Время (в мс) хранения меток удаления для уплотняемых топиков.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    deleteRetentionMs?: string;
    /**
     * Задержка (в мс) перед удалением файла из файловой системы.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    fileDeleteDelayMs?: string;
    /**
     * Количество сообщений, после которого данные принудительно сбрасываются на диск.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    flushMessages?: string;
    /**
     * Интервал (в мс), после которого данные принудительно сбрасываются на диск.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    flushMs?: string;
    /**
     * Интервал (в байтах), с которым Kafka добавляет запись в индекс смещений.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    indexIntervalBytes?: string;
    /**
     * Минимальное время (в мс), в течение которого сообщение остается неуплотненным.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    minCompactionLagMs?: string;
    /**
     * Максимальное время (в мс), в течение которого сообщение может оставаться неуплотненным.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    maxCompactionLagMs?: string;
    /**
     * Максимальный размер (в байтах) пакета сообщений.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    maxMessageBytes?: string;
    /**
     * Версия формата сообщений, в котором Kafka добавляет сообщения в лог.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    messageFormatVersion?: string;
    /**
     * Максимально допустимая разница (в мс) между временной меткой сообщения и временем его получения брокером.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    messageTimestampDifferenceMaxMs?: string;
    /**
     * Понижение версии формата сообщений для старых клиентов.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    messageDownconversionEnable?: KafkaConfigParametersMessageDownconversionEnableEnum;
    /**
     * Источник временной метки сообщения: `CreateTime` — время создания сообщения клиентом, `LogAppendTime` — время добавления сообщения в лог брокером.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    messageTimestampType?: KafkaConfigParametersMessageTimestampTypeEnum;
    /**
     * Доля неуплотненных данных в логе, при которой запускается уплотнение.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    minCleanableDirtyRatio?: string;
    /**
     * Минимальное количество синхронизированных реплик, необходимое для подтверждения записи.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    minInsyncReplicas?: string;
    /**
     * Предварительное выделение места на диске при создании нового сегмента лога.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    preallocate?: KafkaConfigParametersPreallocateEnum;
    /**
     * Максимальный размер (в байтах) партиции топика, после которого старые сегменты удаляются. `-1` — без ограничения.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    retentionBytes?: string;
    /**
     * Время (в мс) хранения сообщений в топике. `-1` — хранить бессрочно.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    retentionMs?: string;
    /**
     * Максимальный размер (в байтах) одного сегмента лога.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    segmentBytes?: string;
    /**
     * Максимальный размер (в байтах) индексного файла сегмента лога.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    segmentIndexBytes?: string;
    /**
     * Максимальное случайное отклонение (в мс) от времени ротации сегмента.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    segmentJitterMs?: string;
    /**
     * Период (в мс), после которого Kafka создает новый сегмент лога.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    segmentMs?: string;
    /**
     * Возможность выбрать лидером партиции реплику, которая не входит в число синхронизированных.
     * @type {string}
     * @memberof KafkaConfigParameters
     */
    uncleanLeaderElectionEnable?: KafkaConfigParametersUncleanLeaderElectionEnableEnum;
}


/**
 * @export
 */
export const KafkaConfigParametersCleanupPolicyEnum = {
    Delete: 'delete',
    Compact: 'compact'
} as const;
export type KafkaConfigParametersCleanupPolicyEnum = typeof KafkaConfigParametersCleanupPolicyEnum[keyof typeof KafkaConfigParametersCleanupPolicyEnum];

/**
 * @export
 */
export const KafkaConfigParametersCompressionTypeEnum = {
    Uncompressed: 'uncompressed',
    Zstd: 'zstd',
    Lz4: 'lz4',
    Snappy: 'snappy',
    Gzip: 'gzip',
    Producer: 'producer'
} as const;
export type KafkaConfigParametersCompressionTypeEnum = typeof KafkaConfigParametersCompressionTypeEnum[keyof typeof KafkaConfigParametersCompressionTypeEnum];

/**
 * @export
 */
export const KafkaConfigParametersMessageDownconversionEnableEnum = {
    On: 'ON',
    Off: 'OFF'
} as const;
export type KafkaConfigParametersMessageDownconversionEnableEnum = typeof KafkaConfigParametersMessageDownconversionEnableEnum[keyof typeof KafkaConfigParametersMessageDownconversionEnableEnum];

/**
 * @export
 */
export const KafkaConfigParametersMessageTimestampTypeEnum = {
    CreateTime: 'CreateTime',
    LogAppendTime: 'LogAppendTime'
} as const;
export type KafkaConfigParametersMessageTimestampTypeEnum = typeof KafkaConfigParametersMessageTimestampTypeEnum[keyof typeof KafkaConfigParametersMessageTimestampTypeEnum];

/**
 * @export
 */
export const KafkaConfigParametersPreallocateEnum = {
    On: 'ON',
    Off: 'OFF'
} as const;
export type KafkaConfigParametersPreallocateEnum = typeof KafkaConfigParametersPreallocateEnum[keyof typeof KafkaConfigParametersPreallocateEnum];

/**
 * @export
 */
export const KafkaConfigParametersUncleanLeaderElectionEnableEnum = {
    On: 'ON',
    Off: 'OFF'
} as const;
export type KafkaConfigParametersUncleanLeaderElectionEnableEnum = typeof KafkaConfigParametersUncleanLeaderElectionEnableEnum[keyof typeof KafkaConfigParametersUncleanLeaderElectionEnableEnum];


/**
 * Check if a given object implements the KafkaConfigParameters interface.
 */
export function instanceOfKafkaConfigParameters(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function KafkaConfigParametersFromJSON(json: any): KafkaConfigParameters {
    return KafkaConfigParametersFromJSONTyped(json, false);
}

export function KafkaConfigParametersFromJSONTyped(json: any, ignoreDiscriminator: boolean): KafkaConfigParameters {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'partitions': !exists(json, 'partitions') ? undefined : json['partitions'],
        'cleanupPolicy': !exists(json, 'cleanup_policy') ? undefined : json['cleanup_policy'],
        'compressionType': !exists(json, 'compression_type') ? undefined : json['compression_type'],
        'deleteRetentionMs': !exists(json, 'delete_retention_ms') ? undefined : json['delete_retention_ms'],
        'fileDeleteDelayMs': !exists(json, 'file_delete_delay_ms') ? undefined : json['file_delete_delay_ms'],
        'flushMessages': !exists(json, 'flush_messages') ? undefined : json['flush_messages'],
        'flushMs': !exists(json, 'flush_ms') ? undefined : json['flush_ms'],
        'indexIntervalBytes': !exists(json, 'index_interval_bytes') ? undefined : json['index_interval_bytes'],
        'minCompactionLagMs': !exists(json, 'min_compaction_lag_ms') ? undefined : json['min_compaction_lag_ms'],
        'maxCompactionLagMs': !exists(json, 'max_compaction_lag_ms') ? undefined : json['max_compaction_lag_ms'],
        'maxMessageBytes': !exists(json, 'max_message_bytes') ? undefined : json['max_message_bytes'],
        'messageFormatVersion': !exists(json, 'message_format_version') ? undefined : json['message_format_version'],
        'messageTimestampDifferenceMaxMs': !exists(json, 'message_timestamp_difference_max_ms') ? undefined : json['message_timestamp_difference_max_ms'],
        'messageDownconversionEnable': !exists(json, 'message_downconversion_enable') ? undefined : json['message_downconversion_enable'],
        'messageTimestampType': !exists(json, 'message_timestamp_type') ? undefined : json['message_timestamp_type'],
        'minCleanableDirtyRatio': !exists(json, 'min_cleanable_dirty_ratio') ? undefined : json['min_cleanable_dirty_ratio'],
        'minInsyncReplicas': !exists(json, 'min_insync_replicas') ? undefined : json['min_insync_replicas'],
        'preallocate': !exists(json, 'preallocate') ? undefined : json['preallocate'],
        'retentionBytes': !exists(json, 'retention_bytes') ? undefined : json['retention_bytes'],
        'retentionMs': !exists(json, 'retention_ms') ? undefined : json['retention_ms'],
        'segmentBytes': !exists(json, 'segment_bytes') ? undefined : json['segment_bytes'],
        'segmentIndexBytes': !exists(json, 'segment_index_bytes') ? undefined : json['segment_index_bytes'],
        'segmentJitterMs': !exists(json, 'segment_jitter_ms') ? undefined : json['segment_jitter_ms'],
        'segmentMs': !exists(json, 'segment_ms') ? undefined : json['segment_ms'],
        'uncleanLeaderElectionEnable': !exists(json, 'unclean_leader_election_enable') ? undefined : json['unclean_leader_election_enable'],
    };
}

export function KafkaConfigParametersToJSON(value?: KafkaConfigParameters | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'partitions': value.partitions,
        'cleanup_policy': value.cleanupPolicy,
        'compression_type': value.compressionType,
        'delete_retention_ms': value.deleteRetentionMs,
        'file_delete_delay_ms': value.fileDeleteDelayMs,
        'flush_messages': value.flushMessages,
        'flush_ms': value.flushMs,
        'index_interval_bytes': value.indexIntervalBytes,
        'min_compaction_lag_ms': value.minCompactionLagMs,
        'max_compaction_lag_ms': value.maxCompactionLagMs,
        'max_message_bytes': value.maxMessageBytes,
        'message_format_version': value.messageFormatVersion,
        'message_timestamp_difference_max_ms': value.messageTimestampDifferenceMaxMs,
        'message_downconversion_enable': value.messageDownconversionEnable,
        'message_timestamp_type': value.messageTimestampType,
        'min_cleanable_dirty_ratio': value.minCleanableDirtyRatio,
        'min_insync_replicas': value.minInsyncReplicas,
        'preallocate': value.preallocate,
        'retention_bytes': value.retentionBytes,
        'retention_ms': value.retentionMs,
        'segment_bytes': value.segmentBytes,
        'segment_index_bytes': value.segmentIndexBytes,
        'segment_jitter_ms': value.segmentJitterMs,
        'segment_ms': value.segmentMs,
        'unclean_leader_election_enable': value.uncleanLeaderElectionEnable,
    };
}

