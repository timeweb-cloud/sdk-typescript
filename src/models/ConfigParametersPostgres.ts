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
 * Параметры PostgreSQL (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`)
 * @export
 * @interface ConfigParametersPostgres
 */
export interface ConfigParametersPostgres {
    /**
     * Максимальное количество одновременных подключений к серверу (`mysql5` | `mysql` | `mysql8_4` | `postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxConnections?: string;
    /**
     * Доля изменения строк таблицы перед запуском автоматического анализа (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    autovacuumAnalyzeScaleFactor?: string;
    /**
     * Максимальное количество процессов autovacuum, которые могут работать одновременно (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    autovacuumMaxWorkers?: string;
    /**
     * Интервал между запусками процессов autovacuum (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    autovacuumNaptime?: string;
    /**
     * Доля вставленных строк перед запуском vacuum для таблиц с большим количеством вставок (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    autovacuumVacuumInsertScaleFactor?: string;
    /**
     * Доля измененных или удаленных строк перед запуском autovacuum (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    autovacuumVacuumScaleFactor?: string;
    /**
     * Объем памяти, используемый одним процессом autovacuum (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    autovacuumWorkMem?: string;
    /**
     * Интервал между циклами фонового процесса записи страниц (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    bgwriterDelay?: string;
    /**
     * Максимальное количество страниц, записываемых background writer за один цикл (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    bgwriterLruMaxpages?: string;
    /**
     * Время ожидания блокировки перед проверкой взаимной блокировки (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    deadlockTimeout?: string;
    /**
     * Максимальный размер списка ожидающих вставок индекса GIN (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    ginPendingListLimit?: string;
    /**
     * Время ожидания неактивной транзакционной сессии перед завершением соединения (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    idleInTransactionSessionTimeout?: string;
    /**
     * Максимальное количество таблиц в JOIN, которые планировщик может переупорядочить (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    joinCollapseLimit?: string;
    /**
     * Максимальное время ожидания блокировки перед отменой запроса (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    lockTimeout?: string;
    /**
     * Максимальное количество подготовленных транзакций, которые могут существовать одновременно (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxPreparedTransactions?: string;
    /**
     * Размер общей памяти, используемой PostgreSQL для буферного кэша (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    sharedBuffers?: string;
    /**
     * Минимальное время выполнения запроса, после которого он записывается в журнал (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    logMinDurationStatement?: string;
    /**
     * Размер памяти, используемой для буферизации WAL-записей (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    walBuffers?: string;
    /**
     * Максимальный объем памяти для временных таблиц каждой сессии (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    tempBuffers?: string;
    /**
     * Объем памяти, используемый одной операцией сортировки или хеширования (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    workMem?: string;
    /**
     * Уровень изоляции транзакций по умолчанию (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    defaultTransactionIsolation?: string;
    /**
     * Оценка объема дискового кэша, доступного планировщику запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    effectiveCacheSize?: string;
    /**
     * Максимальный размер WAL перед запуском контрольной точки (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxWalSize?: string;
    /**
     * Минимальный размер WAL, который сохраняется между контрольными точками (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    minWalSize?: string;
    /**
     * Уровень детализации записи WAL для восстановления и репликации (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    walLevel?: string;
    /**
     * Максимальное количество слотов репликации, которые могут быть созданы (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxReplicationSlots?: string;
    /**
     * Максимальное количество процессов отправки WAL для репликации (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxWalSenders?: string;
    /**
     * Максимальное количество фоновых процессов PostgreSQL (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxWorkerProcesses?: string;
    /**
     * Максимальное количество процессов логической репликации (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxLogicalReplicationWorkers?: string;
    /**
     * Максимальное количество параллельных процессов для операций обслуживания (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxParallelMaintenanceWorkers?: string;
    /**
     * Максимальное количество параллельных рабочих процессов для запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxParallelWorkers?: string;
    /**
     * Максимальное количество параллельных рабочих процессов на один Gather-узел (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxParallelWorkersPerGather?: string;
    /**
     * Разрешение использования NULL в массивах PostgreSQL (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    arrayNulls?: string;
    /**
     * Количество страниц, после записи которых выполняется принудительная очистка данных на диск серверным процессом (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    backendFlushAfter?: string;
    /**
     * Управление использованием обратного слеша в строковых литералах (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    backslashQuote?: string;
    /**
     * Количество страниц, после которого background writer выполняет очистку данных на диск (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    bgwriterFlushAfter?: string;
    /**
     * Множитель количества страниц, которые background writer пытается очистить (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    bgwriterLruMultiplier?: string;
    /**
     * Определяет режим транзакций только для чтения по умолчанию (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    defaultTransactionReadOnly?: string;
    /**
     * Разрешение использования Hash Aggregate планировщиком запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableHashagg?: string;
    /**
     * Разрешение использования Hash Join планировщиком запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableHashjoin?: string;
    /**
     * Разрешение использования инкрементальной сортировки планировщиком (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableIncrementalSort?: string;
    /**
     * Разрешение использования обычного индексного сканирования (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableIndexscan?: string;
    /**
     * Разрешение использования index-only scan (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableIndexonlyscan?: string;
    /**
     * Разрешение использования материализации промежуточных результатов запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableMaterial?: string;
    /**
     * Разрешение использования Memoize узлов планировщиком запросов (`postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableMemoize?: string;
    /**
     * Разрешение использования Merge Join планировщиком запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableMergejoin?: string;
    /**
     * Разрешение использования параллельного Append для запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableParallelAppend?: string;
    /**
     * Разрешение использования параллельных Hash операций (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableParallelHash?: string;
    /**
     * Разрешение удаления ненужных разделов таблицы при планировании запроса (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enablePartitionPruning?: string;
    /**
     * Разрешение выполнения соединений между секционированными таблицами с учетом секций (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enablePartitionwiseJoin?: string;
    /**
     * Разрешение выполнения агрегатных операций отдельно для секций таблиц (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enablePartitionwiseAggregate?: string;
    /**
     * Разрешение использования последовательного сканирования таблиц планировщиком запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableSeqscan?: string;
    /**
     * Разрешение использования операций сортировки планировщиком запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableSort?: string;
    /**
     * Разрешение использования TID Scan для поиска строк по физическим идентификаторам (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    enableTidscan?: string;
    /**
     * Завершение сессии при возникновении ошибки SQL (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    exitOnError?: string;
    /**
     * Максимальное количество элементов FROM, которые планировщик может объединять при оптимизации запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    fromCollapseLimit?: string;
    /**
     * Включение JIT-компиляции для ускорения выполнения запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    jit?: string;
    /**
     * Режим использования кэша планов подготовленных запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    planCacheMode?: string;
    /**
     * Всегда заключать идентификаторы в кавычки при генерации SQL (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    quoteAllIdentifiers?: string;
    /**
     * Использование стандартного поведения строковых литералов SQL (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    standardConformingStrings?: string;
    /**
     * Максимальное время выполнения SQL-запроса перед автоматической отменой (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    statementTimeout?: string;
    /**
     * Часовой пояс сервера PostgreSQL по умолчанию (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    timezone?: string;
    /**
     * Преобразование выражений вида `NULL = NULL` в проверку IS NULL (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    transformNullEquals?: string;
    /**
     * Количество объектов, которые может блокировать одна транзакция (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maxLocksPerTransaction?: string;
    /**
     * Лимит стоимости операций autovacuum перед приостановкой работы (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    autovacuumVacuumCostLimit?: string;
    /**
     * Максимальный интервал времени между автоматическими контрольными точками (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    checkpointTimeout?: string;
    /**
     * Доля интервала checkpoint, за которую PostgreSQL распределяет запись данных (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    checkpointCompletionTarget?: string;
    /**
     * Включение сжатия WAL-записей для уменьшения объема журнала (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    walCompression?: string;
    /**
     * Оценочная стоимость случайного чтения страницы для планировщика запросов (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    randomPageCost?: string;
    /**
     * Количество параллельных операций ввода-вывода, которые планировщик может учитывать (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    effectiveIoConcurrency?: string;
    /**
     * Включение записи в журнал информации об ожидании блокировок дольше deadlock_timeout (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    logLockWaits?: string;
    /**
     * Минимальный размер временных файлов, при котором они записываются в журнал (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    logTempFiles?: string;
    /**
     * Включение сбора статистики времени операций ввода-вывода (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    trackIoTiming?: string;
    /**
     * Максимальный объем памяти для операций обслуживания, таких как VACUUM и CREATE INDEX (`postgres` | `postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    maintenanceWorkMem?: string;
    /**
     * Время ожидания неактивной сессии перед автоматическим завершением соединения (`postgres14` | `postgres15` | `postgres16` | `postgres17` | `postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    idleSessionTimeout?: string;
    /**
     * Метод выполнения операций ввода-вывода PostgreSQL (`postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    ioMethod?: string;
    /**
     * Количество фоновых процессов для выполнения операций ввода-вывода (`postgres18`).
     * @type {string}
     * @memberof ConfigParametersPostgres
     */
    ioWorkers?: string;
}

/**
 * Check if a given object implements the ConfigParametersPostgres interface.
 */
export function instanceOfConfigParametersPostgres(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ConfigParametersPostgresFromJSON(json: any): ConfigParametersPostgres {
    return ConfigParametersPostgresFromJSONTyped(json, false);
}

export function ConfigParametersPostgresFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfigParametersPostgres {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'maxConnections': !exists(json, 'max_connections') ? undefined : json['max_connections'],
        'autovacuumAnalyzeScaleFactor': !exists(json, 'autovacuum_analyze_scale_factor') ? undefined : json['autovacuum_analyze_scale_factor'],
        'autovacuumMaxWorkers': !exists(json, 'autovacuum_max_workers') ? undefined : json['autovacuum_max_workers'],
        'autovacuumNaptime': !exists(json, 'autovacuum_naptime') ? undefined : json['autovacuum_naptime'],
        'autovacuumVacuumInsertScaleFactor': !exists(json, 'autovacuum_vacuum_insert_scale_factor') ? undefined : json['autovacuum_vacuum_insert_scale_factor'],
        'autovacuumVacuumScaleFactor': !exists(json, 'autovacuum_vacuum_scale_factor') ? undefined : json['autovacuum_vacuum_scale_factor'],
        'autovacuumWorkMem': !exists(json, 'autovacuum_work_mem') ? undefined : json['autovacuum_work_mem'],
        'bgwriterDelay': !exists(json, 'bgwriter_delay') ? undefined : json['bgwriter_delay'],
        'bgwriterLruMaxpages': !exists(json, 'bgwriter_lru_maxpages') ? undefined : json['bgwriter_lru_maxpages'],
        'deadlockTimeout': !exists(json, 'deadlock_timeout') ? undefined : json['deadlock_timeout'],
        'ginPendingListLimit': !exists(json, 'gin_pending_list_limit') ? undefined : json['gin_pending_list_limit'],
        'idleInTransactionSessionTimeout': !exists(json, 'idle_in_transaction_session_timeout') ? undefined : json['idle_in_transaction_session_timeout'],
        'joinCollapseLimit': !exists(json, 'join_collapse_limit') ? undefined : json['join_collapse_limit'],
        'lockTimeout': !exists(json, 'lock_timeout') ? undefined : json['lock_timeout'],
        'maxPreparedTransactions': !exists(json, 'max_prepared_transactions') ? undefined : json['max_prepared_transactions'],
        'sharedBuffers': !exists(json, 'shared_buffers') ? undefined : json['shared_buffers'],
        'logMinDurationStatement': !exists(json, 'log_min_duration_statement') ? undefined : json['log_min_duration_statement'],
        'walBuffers': !exists(json, 'wal_buffers') ? undefined : json['wal_buffers'],
        'tempBuffers': !exists(json, 'temp_buffers') ? undefined : json['temp_buffers'],
        'workMem': !exists(json, 'work_mem') ? undefined : json['work_mem'],
        'defaultTransactionIsolation': !exists(json, 'default_transaction_isolation') ? undefined : json['default_transaction_isolation'],
        'effectiveCacheSize': !exists(json, 'effective_cache_size') ? undefined : json['effective_cache_size'],
        'maxWalSize': !exists(json, 'max_wal_size') ? undefined : json['max_wal_size'],
        'minWalSize': !exists(json, 'min_wal_size') ? undefined : json['min_wal_size'],
        'walLevel': !exists(json, 'wal_level') ? undefined : json['wal_level'],
        'maxReplicationSlots': !exists(json, 'max_replication_slots') ? undefined : json['max_replication_slots'],
        'maxWalSenders': !exists(json, 'max_wal_senders') ? undefined : json['max_wal_senders'],
        'maxWorkerProcesses': !exists(json, 'max_worker_processes') ? undefined : json['max_worker_processes'],
        'maxLogicalReplicationWorkers': !exists(json, 'max_logical_replication_workers') ? undefined : json['max_logical_replication_workers'],
        'maxParallelMaintenanceWorkers': !exists(json, 'max_parallel_maintenance_workers') ? undefined : json['max_parallel_maintenance_workers'],
        'maxParallelWorkers': !exists(json, 'max_parallel_workers') ? undefined : json['max_parallel_workers'],
        'maxParallelWorkersPerGather': !exists(json, 'max_parallel_workers_per_gather') ? undefined : json['max_parallel_workers_per_gather'],
        'arrayNulls': !exists(json, 'array_nulls') ? undefined : json['array_nulls'],
        'backendFlushAfter': !exists(json, 'backend_flush_after') ? undefined : json['backend_flush_after'],
        'backslashQuote': !exists(json, 'backslash_quote') ? undefined : json['backslash_quote'],
        'bgwriterFlushAfter': !exists(json, 'bgwriter_flush_after') ? undefined : json['bgwriter_flush_after'],
        'bgwriterLruMultiplier': !exists(json, 'bgwriter_lru_multiplier') ? undefined : json['bgwriter_lru_multiplier'],
        'defaultTransactionReadOnly': !exists(json, 'default_transaction_read_only') ? undefined : json['default_transaction_read_only'],
        'enableHashagg': !exists(json, 'enable_hashagg') ? undefined : json['enable_hashagg'],
        'enableHashjoin': !exists(json, 'enable_hashjoin') ? undefined : json['enable_hashjoin'],
        'enableIncrementalSort': !exists(json, 'enable_incremental_sort') ? undefined : json['enable_incremental_sort'],
        'enableIndexscan': !exists(json, 'enable_indexscan') ? undefined : json['enable_indexscan'],
        'enableIndexonlyscan': !exists(json, 'enable_indexonlyscan') ? undefined : json['enable_indexonlyscan'],
        'enableMaterial': !exists(json, 'enable_material') ? undefined : json['enable_material'],
        'enableMemoize': !exists(json, 'enable_memoize') ? undefined : json['enable_memoize'],
        'enableMergejoin': !exists(json, 'enable_mergejoin') ? undefined : json['enable_mergejoin'],
        'enableParallelAppend': !exists(json, 'enable_parallel_append') ? undefined : json['enable_parallel_append'],
        'enableParallelHash': !exists(json, 'enable_parallel_hash') ? undefined : json['enable_parallel_hash'],
        'enablePartitionPruning': !exists(json, 'enable_partition_pruning') ? undefined : json['enable_partition_pruning'],
        'enablePartitionwiseJoin': !exists(json, 'enable_partitionwise_join') ? undefined : json['enable_partitionwise_join'],
        'enablePartitionwiseAggregate': !exists(json, 'enable_partitionwise_aggregate') ? undefined : json['enable_partitionwise_aggregate'],
        'enableSeqscan': !exists(json, 'enable_seqscan') ? undefined : json['enable_seqscan'],
        'enableSort': !exists(json, 'enable_sort') ? undefined : json['enable_sort'],
        'enableTidscan': !exists(json, 'enable_tidscan') ? undefined : json['enable_tidscan'],
        'exitOnError': !exists(json, 'exit_on_error') ? undefined : json['exit_on_error'],
        'fromCollapseLimit': !exists(json, 'from_collapse_limit') ? undefined : json['from_collapse_limit'],
        'jit': !exists(json, 'jit') ? undefined : json['jit'],
        'planCacheMode': !exists(json, 'plan_cache_mode') ? undefined : json['plan_cache_mode'],
        'quoteAllIdentifiers': !exists(json, 'quote_all_identifiers') ? undefined : json['quote_all_identifiers'],
        'standardConformingStrings': !exists(json, 'standard_conforming_strings') ? undefined : json['standard_conforming_strings'],
        'statementTimeout': !exists(json, 'statement_timeout') ? undefined : json['statement_timeout'],
        'timezone': !exists(json, 'timezone') ? undefined : json['timezone'],
        'transformNullEquals': !exists(json, 'transform_null_equals') ? undefined : json['transform_null_equals'],
        'maxLocksPerTransaction': !exists(json, 'max_locks_per_transaction') ? undefined : json['max_locks_per_transaction'],
        'autovacuumVacuumCostLimit': !exists(json, 'autovacuum_vacuum_cost_limit') ? undefined : json['autovacuum_vacuum_cost_limit'],
        'checkpointTimeout': !exists(json, 'checkpoint_timeout') ? undefined : json['checkpoint_timeout'],
        'checkpointCompletionTarget': !exists(json, 'checkpoint_completion_target') ? undefined : json['checkpoint_completion_target'],
        'walCompression': !exists(json, 'wal_compression') ? undefined : json['wal_compression'],
        'randomPageCost': !exists(json, 'random_page_cost') ? undefined : json['random_page_cost'],
        'effectiveIoConcurrency': !exists(json, 'effective_io_concurrency') ? undefined : json['effective_io_concurrency'],
        'logLockWaits': !exists(json, 'log_lock_waits') ? undefined : json['log_lock_waits'],
        'logTempFiles': !exists(json, 'log_temp_files') ? undefined : json['log_temp_files'],
        'trackIoTiming': !exists(json, 'track_io_timing') ? undefined : json['track_io_timing'],
        'maintenanceWorkMem': !exists(json, 'maintenance_work_mem') ? undefined : json['maintenance_work_mem'],
        'idleSessionTimeout': !exists(json, 'idle_session_timeout') ? undefined : json['idle_session_timeout'],
        'ioMethod': !exists(json, 'io_method') ? undefined : json['io_method'],
        'ioWorkers': !exists(json, 'io_workers') ? undefined : json['io_workers'],
    };
}

export function ConfigParametersPostgresToJSON(value?: ConfigParametersPostgres | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'max_connections': value.maxConnections,
        'autovacuum_analyze_scale_factor': value.autovacuumAnalyzeScaleFactor,
        'autovacuum_max_workers': value.autovacuumMaxWorkers,
        'autovacuum_naptime': value.autovacuumNaptime,
        'autovacuum_vacuum_insert_scale_factor': value.autovacuumVacuumInsertScaleFactor,
        'autovacuum_vacuum_scale_factor': value.autovacuumVacuumScaleFactor,
        'autovacuum_work_mem': value.autovacuumWorkMem,
        'bgwriter_delay': value.bgwriterDelay,
        'bgwriter_lru_maxpages': value.bgwriterLruMaxpages,
        'deadlock_timeout': value.deadlockTimeout,
        'gin_pending_list_limit': value.ginPendingListLimit,
        'idle_in_transaction_session_timeout': value.idleInTransactionSessionTimeout,
        'join_collapse_limit': value.joinCollapseLimit,
        'lock_timeout': value.lockTimeout,
        'max_prepared_transactions': value.maxPreparedTransactions,
        'shared_buffers': value.sharedBuffers,
        'log_min_duration_statement': value.logMinDurationStatement,
        'wal_buffers': value.walBuffers,
        'temp_buffers': value.tempBuffers,
        'work_mem': value.workMem,
        'default_transaction_isolation': value.defaultTransactionIsolation,
        'effective_cache_size': value.effectiveCacheSize,
        'max_wal_size': value.maxWalSize,
        'min_wal_size': value.minWalSize,
        'wal_level': value.walLevel,
        'max_replication_slots': value.maxReplicationSlots,
        'max_wal_senders': value.maxWalSenders,
        'max_worker_processes': value.maxWorkerProcesses,
        'max_logical_replication_workers': value.maxLogicalReplicationWorkers,
        'max_parallel_maintenance_workers': value.maxParallelMaintenanceWorkers,
        'max_parallel_workers': value.maxParallelWorkers,
        'max_parallel_workers_per_gather': value.maxParallelWorkersPerGather,
        'array_nulls': value.arrayNulls,
        'backend_flush_after': value.backendFlushAfter,
        'backslash_quote': value.backslashQuote,
        'bgwriter_flush_after': value.bgwriterFlushAfter,
        'bgwriter_lru_multiplier': value.bgwriterLruMultiplier,
        'default_transaction_read_only': value.defaultTransactionReadOnly,
        'enable_hashagg': value.enableHashagg,
        'enable_hashjoin': value.enableHashjoin,
        'enable_incremental_sort': value.enableIncrementalSort,
        'enable_indexscan': value.enableIndexscan,
        'enable_indexonlyscan': value.enableIndexonlyscan,
        'enable_material': value.enableMaterial,
        'enable_memoize': value.enableMemoize,
        'enable_mergejoin': value.enableMergejoin,
        'enable_parallel_append': value.enableParallelAppend,
        'enable_parallel_hash': value.enableParallelHash,
        'enable_partition_pruning': value.enablePartitionPruning,
        'enable_partitionwise_join': value.enablePartitionwiseJoin,
        'enable_partitionwise_aggregate': value.enablePartitionwiseAggregate,
        'enable_seqscan': value.enableSeqscan,
        'enable_sort': value.enableSort,
        'enable_tidscan': value.enableTidscan,
        'exit_on_error': value.exitOnError,
        'from_collapse_limit': value.fromCollapseLimit,
        'jit': value.jit,
        'plan_cache_mode': value.planCacheMode,
        'quote_all_identifiers': value.quoteAllIdentifiers,
        'standard_conforming_strings': value.standardConformingStrings,
        'statement_timeout': value.statementTimeout,
        'timezone': value.timezone,
        'transform_null_equals': value.transformNullEquals,
        'max_locks_per_transaction': value.maxLocksPerTransaction,
        'autovacuum_vacuum_cost_limit': value.autovacuumVacuumCostLimit,
        'checkpoint_timeout': value.checkpointTimeout,
        'checkpoint_completion_target': value.checkpointCompletionTarget,
        'wal_compression': value.walCompression,
        'random_page_cost': value.randomPageCost,
        'effective_io_concurrency': value.effectiveIoConcurrency,
        'log_lock_waits': value.logLockWaits,
        'log_temp_files': value.logTempFiles,
        'track_io_timing': value.trackIoTiming,
        'maintenance_work_mem': value.maintenanceWorkMem,
        'idle_session_timeout': value.idleSessionTimeout,
        'io_method': value.ioMethod,
        'io_workers': value.ioWorkers,
    };
}

