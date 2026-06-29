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
 * Параметры MySQL (`mysql5` | `mysql` | `mysql8_4`)
 * @export
 * @interface Mysql
 */
export interface Mysql {
    /**
     * Размер буфера, используемого при соединениях таблиц без индексов (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    joinBufferSize?: string;
    /**
     * Максимальное количество одновременных подключений к серверу (`mysql5` | `mysql` | `mysql8_4` | `postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof Mysql
     */
    maxConnections?: string;
    /**
     * Размер буфера сортировки для операций ORDER BY и GROUP BY (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    sortBufferSize?: string;
    /**
     * Количество потоков, которые сервер сохраняет для повторного использования (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    threadCacheSize?: string;
    /**
     * Размер буферного пула InnoDB для хранения данных и индексов в памяти (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbBufferPoolSize?: string;
    /**
     * Интервал между значениями столбцов с атрибутом `AUTO_INCREMENT` (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    autoIncrementIncrement?: string;
    /**
     * Начальное значение для столбцов с атрибутом `AUTO_INCREMENT` (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    autoIncrementOffset?: string;
    /**
     * Количество операций ввода-вывода в секунду `IOPS`, используемых InnoDB (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbIoCapacity?: string;
    /**
     * Количество потоков, используемых для фоновой очистки undo-записей InnoDB (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbPurgeThreads?: string;
    /**
     * Количество потоков ввода-вывода для операций чтения InnoDB (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbReadIoThreads?: string;
    /**
     * Ограничение количества одновременно выполняющихся потоков InnoDB (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbThreadConcurrency?: string;
    /**
     * Количество потоков ввода-вывода для операций записи InnoDB (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbWriteIoThreads?: string;
    /**
     * Размер файла журнала транзакций InnoDB redo log (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbLogFileSize?: string;
    /**
     * Максимальный размер пакета данных, который может передаваться между клиентом и сервером (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    maxAllowedPacket?: string;
    /**
     * Максимальный размер таблиц типа MEMORY (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    maxHeapTableSize?: string;
    /**
     * Режим работы SQL сервера, определяющий поведение обработки запросов (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    sqlMode?: string;
    /**
     * Тип кэша запросов (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    queryCacheType?: string;
    /**
     * Объем памяти, выделяемый для кэширования результатов запросов (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    queryCacheSize?: string;
    /**
     * Режим записи журнала InnoDB при фиксации транзакций (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbFlushLogAtTrxCommit?: string;
    /**
     * Уровень изоляции транзакций по умолчанию (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    transactionIsolation?: string;
    /**
     * Время выполнения запроса, после которого он считается долгим и может попасть в slow query log (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    longQueryTime?: string;
    /**
     * Максимальный размер временных таблиц в памяти (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    tmpTableSize?: string;
    /**
     * Количество открытых таблиц, которые сервер может хранить в кэше (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    tableOpenCache?: string;
    /**
     * Количество экземпляров кэша открытых таблиц для снижения конкуренции между потоками (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    tableOpenCacheInstances?: string;
    /**
     * Метод выполнения операций записи и синхронизации файлов InnoDB (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbFlushMethod?: string;
    /**
     * Включение строгой проверки операций InnoDB (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbStrictMode?: string;
    /**
     * Включение журнала медленных запросов (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    slowQueryLog?: string;
    /**
     * Размер кэша бинарного журнала для транзакций (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    binlogCacheSize?: string;
    /**
     * Задержка синхронизации групповой фиксации бинарного журнала в микросекундах (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    binlogGroupCommitSyncDelay?: string;
    /**
     * Количество информации, записываемой в бинарный журнал при row-based репликации (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    binlogRowImage?: string;
    /**
     * Включение записи SQL-запросов в бинарный журнал при row-based репликации (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    binlogRowsQueryLogEvents?: string;
    /**
     * Кодировка по умолчанию для сервера MySQL (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    characterSetServer?: string;
    /**
     * Определяет автоматическое поведение TIMESTAMP без явных значений по умолчанию (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    explicitDefaultsForTimestamp?: string;
    /**
     * Максимальная длина результата функции GROUP_CONCAT (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    groupConcatMaxLen?: string;
    /**
     * Включение или отключение адаптивного хэш-индекса InnoDB для ускорения поиска по индексам (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbAdaptiveHashIndex?: string;
    /**
     * Время ожидания блокировки InnoDB перед завершением транзакции с ошибкой (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbLockWaitTimeout?: string;
    /**
     * Включение распределения памяти InnoDB между NUMA-узлами (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbNumaInterleave?: string;
    /**
     * Время ожидания данных от клиента при чтении сетевого соединения (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    netReadTimeout?: string;
    /**
     * Время ожидания записи данных клиенту через сетевое соединение (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    netWriteTimeout?: string;
    /**
     * Максимальное время выполнения регулярных выражений (`mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    regexpTimeLimit?: string;
    /**
     * Количество операций записи бинарного журнала перед принудительной синхронизацией на диск (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    syncBinlog?: string;
    /**
     * Количество определений таблиц, хранящихся в кэше (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    tableDefinitionCache?: string;
    /**
     * Разрешение создания хранимых функций без проверки бинарной регистрации (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    logBinTrustFunctionCreators?: string;
    /**
     * Отключение DNS-разрешения имен клиентов при подключении к серверу (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    skipNameResolve?: string;
    /**
     * Общий размер redo log InnoDB для хранения журнала восстановления (`mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    innodbRedoLogCapacity?: string;
    /**
     * Время ожидания неактивного клиентского соединения перед закрытием (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    waitTimeout?: string;
    /**
     * Время ожидания неактивного интерактивного соединения перед закрытием (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    interactiveTimeout?: string;
    /**
     * Часовой пояс сервера MySQL по умолчанию (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    defaultTimeZone?: string;
    /**
     * Режим строгой проверки операций в Percona XtraDB Cluster (`mysql5` | `mysql` | `mysql8_4`).
     * @type {string}
     * @memberof Mysql
     */
    pxcStrictMode?: string;
}

/**
 * Check if a given object implements the Mysql interface.
 */
export function instanceOfMysql(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function MysqlFromJSON(json: any): Mysql {
    return MysqlFromJSONTyped(json, false);
}

export function MysqlFromJSONTyped(json: any, ignoreDiscriminator: boolean): Mysql {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'joinBufferSize': !exists(json, 'join_buffer_size') ? undefined : json['join_buffer_size'],
        'maxConnections': !exists(json, 'max_connections') ? undefined : json['max_connections'],
        'sortBufferSize': !exists(json, 'sort_buffer_size') ? undefined : json['sort_buffer_size'],
        'threadCacheSize': !exists(json, 'thread_cache_size') ? undefined : json['thread_cache_size'],
        'innodbBufferPoolSize': !exists(json, 'innodb_buffer_pool_size') ? undefined : json['innodb_buffer_pool_size'],
        'autoIncrementIncrement': !exists(json, 'auto_increment_increment') ? undefined : json['auto_increment_increment'],
        'autoIncrementOffset': !exists(json, 'auto_increment_offset') ? undefined : json['auto_increment_offset'],
        'innodbIoCapacity': !exists(json, 'innodb_io_capacity') ? undefined : json['innodb_io_capacity'],
        'innodbPurgeThreads': !exists(json, 'innodb_purge_threads') ? undefined : json['innodb_purge_threads'],
        'innodbReadIoThreads': !exists(json, 'innodb_read_io_threads') ? undefined : json['innodb_read_io_threads'],
        'innodbThreadConcurrency': !exists(json, 'innodb_thread_concurrency') ? undefined : json['innodb_thread_concurrency'],
        'innodbWriteIoThreads': !exists(json, 'innodb_write_io_threads') ? undefined : json['innodb_write_io_threads'],
        'innodbLogFileSize': !exists(json, 'innodb_log_file_size') ? undefined : json['innodb_log_file_size'],
        'maxAllowedPacket': !exists(json, 'max_allowed_packet') ? undefined : json['max_allowed_packet'],
        'maxHeapTableSize': !exists(json, 'max_heap_table_size') ? undefined : json['max_heap_table_size'],
        'sqlMode': !exists(json, 'sql_mode') ? undefined : json['sql_mode'],
        'queryCacheType': !exists(json, 'query_cache_type') ? undefined : json['query_cache_type'],
        'queryCacheSize': !exists(json, 'query_cache_size') ? undefined : json['query_cache_size'],
        'innodbFlushLogAtTrxCommit': !exists(json, 'innodb_flush_log_at_trx_commit') ? undefined : json['innodb_flush_log_at_trx_commit'],
        'transactionIsolation': !exists(json, 'transaction_isolation') ? undefined : json['transaction_isolation'],
        'longQueryTime': !exists(json, 'long_query_time') ? undefined : json['long_query_time'],
        'tmpTableSize': !exists(json, 'tmp_table_size') ? undefined : json['tmp_table_size'],
        'tableOpenCache': !exists(json, 'table_open_cache') ? undefined : json['table_open_cache'],
        'tableOpenCacheInstances': !exists(json, 'table_open_cache_instances') ? undefined : json['table_open_cache_instances'],
        'innodbFlushMethod': !exists(json, 'innodb_flush_method') ? undefined : json['innodb_flush_method'],
        'innodbStrictMode': !exists(json, 'innodb_strict_mode') ? undefined : json['innodb_strict_mode'],
        'slowQueryLog': !exists(json, 'slow_query_log') ? undefined : json['slow_query_log'],
        'binlogCacheSize': !exists(json, 'binlog_cache_size') ? undefined : json['binlog_cache_size'],
        'binlogGroupCommitSyncDelay': !exists(json, 'binlog_group_commit_sync_delay') ? undefined : json['binlog_group_commit_sync_delay'],
        'binlogRowImage': !exists(json, 'binlog_row_image') ? undefined : json['binlog_row_image'],
        'binlogRowsQueryLogEvents': !exists(json, 'binlog_rows_query_log_events') ? undefined : json['binlog_rows_query_log_events'],
        'characterSetServer': !exists(json, 'character_set_server') ? undefined : json['character_set_server'],
        'explicitDefaultsForTimestamp': !exists(json, 'explicit_defaults_for_timestamp') ? undefined : json['explicit_defaults_for_timestamp'],
        'groupConcatMaxLen': !exists(json, 'group_concat_max_len') ? undefined : json['group_concat_max_len'],
        'innodbAdaptiveHashIndex': !exists(json, 'innodb_adaptive_hash_index') ? undefined : json['innodb_adaptive_hash_index'],
        'innodbLockWaitTimeout': !exists(json, 'innodb_lock_wait_timeout') ? undefined : json['innodb_lock_wait_timeout'],
        'innodbNumaInterleave': !exists(json, 'innodb_numa_interleave') ? undefined : json['innodb_numa_interleave'],
        'netReadTimeout': !exists(json, 'net_read_timeout') ? undefined : json['net_read_timeout'],
        'netWriteTimeout': !exists(json, 'net_write_timeout') ? undefined : json['net_write_timeout'],
        'regexpTimeLimit': !exists(json, 'regexp_time_limit') ? undefined : json['regexp_time_limit'],
        'syncBinlog': !exists(json, 'sync_binlog') ? undefined : json['sync_binlog'],
        'tableDefinitionCache': !exists(json, 'table_definition_cache') ? undefined : json['table_definition_cache'],
        'logBinTrustFunctionCreators': !exists(json, 'log_bin_trust_function_creators') ? undefined : json['log_bin_trust_function_creators'],
        'skipNameResolve': !exists(json, 'skip_name_resolve') ? undefined : json['skip_name_resolve'],
        'innodbRedoLogCapacity': !exists(json, 'innodb_redo_log_capacity') ? undefined : json['innodb_redo_log_capacity'],
        'waitTimeout': !exists(json, 'wait_timeout') ? undefined : json['wait_timeout'],
        'interactiveTimeout': !exists(json, 'interactive_timeout') ? undefined : json['interactive_timeout'],
        'defaultTimeZone': !exists(json, 'default-time-zone') ? undefined : json['default-time-zone'],
        'pxcStrictMode': !exists(json, 'pxc_strict_mode') ? undefined : json['pxc_strict_mode'],
    };
}

export function MysqlToJSON(value?: Mysql | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'join_buffer_size': value.joinBufferSize,
        'max_connections': value.maxConnections,
        'sort_buffer_size': value.sortBufferSize,
        'thread_cache_size': value.threadCacheSize,
        'innodb_buffer_pool_size': value.innodbBufferPoolSize,
        'auto_increment_increment': value.autoIncrementIncrement,
        'auto_increment_offset': value.autoIncrementOffset,
        'innodb_io_capacity': value.innodbIoCapacity,
        'innodb_purge_threads': value.innodbPurgeThreads,
        'innodb_read_io_threads': value.innodbReadIoThreads,
        'innodb_thread_concurrency': value.innodbThreadConcurrency,
        'innodb_write_io_threads': value.innodbWriteIoThreads,
        'innodb_log_file_size': value.innodbLogFileSize,
        'max_allowed_packet': value.maxAllowedPacket,
        'max_heap_table_size': value.maxHeapTableSize,
        'sql_mode': value.sqlMode,
        'query_cache_type': value.queryCacheType,
        'query_cache_size': value.queryCacheSize,
        'innodb_flush_log_at_trx_commit': value.innodbFlushLogAtTrxCommit,
        'transaction_isolation': value.transactionIsolation,
        'long_query_time': value.longQueryTime,
        'tmp_table_size': value.tmpTableSize,
        'table_open_cache': value.tableOpenCache,
        'table_open_cache_instances': value.tableOpenCacheInstances,
        'innodb_flush_method': value.innodbFlushMethod,
        'innodb_strict_mode': value.innodbStrictMode,
        'slow_query_log': value.slowQueryLog,
        'binlog_cache_size': value.binlogCacheSize,
        'binlog_group_commit_sync_delay': value.binlogGroupCommitSyncDelay,
        'binlog_row_image': value.binlogRowImage,
        'binlog_rows_query_log_events': value.binlogRowsQueryLogEvents,
        'character_set_server': value.characterSetServer,
        'explicit_defaults_for_timestamp': value.explicitDefaultsForTimestamp,
        'group_concat_max_len': value.groupConcatMaxLen,
        'innodb_adaptive_hash_index': value.innodbAdaptiveHashIndex,
        'innodb_lock_wait_timeout': value.innodbLockWaitTimeout,
        'innodb_numa_interleave': value.innodbNumaInterleave,
        'net_read_timeout': value.netReadTimeout,
        'net_write_timeout': value.netWriteTimeout,
        'regexp_time_limit': value.regexpTimeLimit,
        'sync_binlog': value.syncBinlog,
        'table_definition_cache': value.tableDefinitionCache,
        'log_bin_trust_function_creators': value.logBinTrustFunctionCreators,
        'skip_name_resolve': value.skipNameResolve,
        'innodb_redo_log_capacity': value.innodbRedoLogCapacity,
        'wait_timeout': value.waitTimeout,
        'interactive_timeout': value.interactiveTimeout,
        'default-time-zone': value.defaultTimeZone,
        'pxc_strict_mode': value.pxcStrictMode,
    };
}

