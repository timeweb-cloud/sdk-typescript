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
import type { AvailabilityZone } from './AvailabilityZone';
import {
    AvailabilityZoneFromJSON,
    AvailabilityZoneFromJSONTyped,
    AvailabilityZoneToJSON,
} from './AvailabilityZone';
import type { DatabaseClusterChildServicesInner } from './DatabaseClusterChildServicesInner';
import {
    DatabaseClusterChildServicesInnerFromJSON,
    DatabaseClusterChildServicesInnerFromJSONTyped,
    DatabaseClusterChildServicesInnerToJSON,
} from './DatabaseClusterChildServicesInner';
import type { DatabaseClusterDisk } from './DatabaseClusterDisk';
import {
    DatabaseClusterDiskFromJSON,
    DatabaseClusterDiskFromJSONTyped,
    DatabaseClusterDiskToJSON,
} from './DatabaseClusterDisk';
import type { DatabaseClusterDiskAutoscaling } from './DatabaseClusterDiskAutoscaling';
import {
    DatabaseClusterDiskAutoscalingFromJSON,
    DatabaseClusterDiskAutoscalingFromJSONTyped,
    DatabaseClusterDiskAutoscalingToJSON,
} from './DatabaseClusterDiskAutoscaling';
import type { DatabaseClusterDomainsInner } from './DatabaseClusterDomainsInner';
import {
    DatabaseClusterDomainsInnerFromJSON,
    DatabaseClusterDomainsInnerFromJSONTyped,
    DatabaseClusterDomainsInnerToJSON,
} from './DatabaseClusterDomainsInner';
import type { DatabaseClusterMaintenanceSlot } from './DatabaseClusterMaintenanceSlot';
import {
    DatabaseClusterMaintenanceSlotFromJSON,
    DatabaseClusterMaintenanceSlotFromJSONTyped,
    DatabaseClusterMaintenanceSlotToJSON,
} from './DatabaseClusterMaintenanceSlot';
import type { DatabaseClusterNetworksInner } from './DatabaseClusterNetworksInner';
import {
    DatabaseClusterNetworksInnerFromJSON,
    DatabaseClusterNetworksInnerFromJSONTyped,
    DatabaseClusterNetworksInnerToJSON,
} from './DatabaseClusterNetworksInner';
import type { DatabaseClusterParentServicesInner } from './DatabaseClusterParentServicesInner';
import {
    DatabaseClusterParentServicesInnerFromJSON,
    DatabaseClusterParentServicesInnerFromJSONTyped,
    DatabaseClusterParentServicesInnerToJSON,
} from './DatabaseClusterParentServicesInner';
import type { DatabaseClusterReplicaListInner } from './DatabaseClusterReplicaListInner';
import {
    DatabaseClusterReplicaListInnerFromJSON,
    DatabaseClusterReplicaListInnerFromJSONTyped,
    DatabaseClusterReplicaListInnerToJSON,
} from './DatabaseClusterReplicaListInner';
import type { Mysql } from './Mysql';
import {
    MysqlFromJSON,
    MysqlFromJSONTyped,
    MysqlToJSON,
} from './Mysql';

/**
 * Кластер базы данных
 * @export
 * @interface DatabaseCluster
 */
export interface DatabaseCluster {
    /**
     * ID для каждого экземпляра базы данных. Автоматически генерируется при создании.
     * @type {number}
     * @memberof DatabaseCluster
     */
    id: number;
    /**
     * Значение времени, указанное в комбинированном формате даты и времени ISO8601, которое представляет, когда была создана база данных.
     * @type {string}
     * @memberof DatabaseCluster
     */
    createdAt: string;
    /**
     * Локация сервера.
     * @type {string}
     * @memberof DatabaseCluster
     */
    location: DatabaseClusterLocationEnum;
    /**
     * Название кластера базы данных.
     * @type {string}
     * @memberof DatabaseCluster
     */
    name: string;
    /**
     * Описание кластера базы данных.
     * @type {string}
     * @memberof DatabaseCluster
     */
    description: string;
    /**
     * Список сетей кластера базы данных.
     * @type {Array<DatabaseClusterNetworksInner>}
     * @memberof DatabaseCluster
     */
    networks: Array<DatabaseClusterNetworksInner>;
    /**
     * Использование публичного IPv6-адреса.
     * @type {boolean}
     * @memberof DatabaseCluster
     */
    isEnabledPublicIpv6: boolean;
    /**
     * Тип базы данных. Список возможных значений шире, чем список типов, доступных при создании нового кластера.
     * @type {string}
     * @memberof DatabaseCluster
     */
    type: DatabaseClusterTypeEnum;
    /**
     * Тип хеширования кластера базы данных (mysql5 | mysql | postgres).
     * @type {string}
     * @memberof DatabaseCluster
     */
    hashType: DatabaseClusterHashTypeEnum;
    /**
     * Ссылка на аватар для базы данных.
     * @type {string}
     * @memberof DatabaseCluster
     */
    avatarLink: string | null;
    /**
     * Порт
     * @type {number}
     * @memberof DatabaseCluster
     */
    port: number | null;
    /**
     * Текущий статус кластера базы данных. Значение `read_only` означает, что запись в кластер заблокирована из-за переполнения диска — чтобы снять блокировку, освободите место или увеличьте размер диска.
     * @type {string}
     * @memberof DatabaseCluster
     */
    status: DatabaseClusterStatusEnum;
    /**
     * ID тарифа. Равен `null` у кластеров, созданных через конфигуратор — в этом случае заполнен `configurator_id`.
     * @type {number}
     * @memberof DatabaseCluster
     */
    presetId: number | null;
    /**
     * ID конфигуратора. Равен `null` у кластеров, созданных по тарифу.
     * @type {number}
     * @memberof DatabaseCluster
     */
    configuratorId: number | null;
    /**
     * Количество ядер процессора.
     * @type {number}
     * @memberof DatabaseCluster
     */
    cpu: number | null;
    /**
     * Частота процессора.
     * @type {string}
     * @memberof DatabaseCluster
     */
    cpuFrequency: string | null;
    /**
     * Используются ли выделенные ядра процессора.
     * @type {boolean}
     * @memberof DatabaseCluster
     */
    isDedicatedCpu: boolean;
    /**
     * Объем оперативной памяти (в Мб).
     * @type {number}
     * @memberof DatabaseCluster
     */
    ram: number | null;
    /**
     * 
     * @type {DatabaseClusterDisk}
     * @memberof DatabaseCluster
     */
    disk: DatabaseClusterDisk | null;
    /**
     * Подключен ли к кластеру дополнительный диск.
     * @type {boolean}
     * @memberof DatabaseCluster
     */
    hasAdditionalDisk: boolean;
    /**
     * 
     * @type {DatabaseClusterDiskAutoscaling}
     * @memberof DatabaseCluster
     */
    diskAutoscaling: DatabaseClusterDiskAutoscaling | null;
    /**
     * 
     * @type {Mysql}
     * @memberof DatabaseCluster
     */
    configParameters: Mysql;
    /**
     * Доступность публичного IP-адреса
     * @type {boolean}
     * @memberof DatabaseCluster
     */
    isEnabledPublicNetwork: boolean;
    /**
     * Включено ли защищенное подключение к кластеру базы данных.
     * @type {boolean}
     * @memberof DatabaseCluster
     */
    isSecureConnectionEnabled: boolean;
    /**
     * Включены ли автоматические резервные копии кластера базы данных.
     * @type {boolean}
     * @memberof DatabaseCluster
     */
    isAutobackupsEnabled: boolean;
    /**
     * Включено ли расписание резервного копирования кластера базы данных.
     * @type {boolean}
     * @memberof DatabaseCluster
     */
    isBackupScheduleEnabled: boolean;
    /**
     * 
     * @type {AvailabilityZone}
     * @memberof DatabaseCluster
     */
    availabilityZone: AvailabilityZone;
    /**
     * ID проекта, в котором находится кластер базы данных.
     * @type {number}
     * @memberof DatabaseCluster
     */
    projectId?: number;
    /**
     * Список реплик кластера базы данных.
     * @type {Array<DatabaseClusterReplicaListInner>}
     * @memberof DatabaseCluster
     */
    replicaList: Array<DatabaseClusterReplicaListInner>;
    /**
     * Список доменов кластера базы данных. Если публичная сеть отключена (`is_enabled_public_network: false`), список всегда пустой.
     * @type {Array<DatabaseClusterDomainsInner>}
     * @memberof DatabaseCluster
     */
    domains: Array<DatabaseClusterDomainsInner>;
    /**
     * Список дочерних сервисов кластера базы данных.
     * @type {Array<DatabaseClusterChildServicesInner>}
     * @memberof DatabaseCluster
     */
    childServices: Array<DatabaseClusterChildServicesInner>;
    /**
     * Список родительских сервисов кластера базы данных.
     * @type {Array<DatabaseClusterParentServicesInner>}
     * @memberof DatabaseCluster
     */
    parentServices: Array<DatabaseClusterParentServicesInner>;
    /**
     * 
     * @type {DatabaseClusterMaintenanceSlot}
     * @memberof DatabaseCluster
     */
    maintenanceSlot: DatabaseClusterMaintenanceSlot;
}


/**
 * @export
 */
export const DatabaseClusterLocationEnum = {
    Ru1: 'ru-1',
    Ru3: 'ru-3',
    Pl1: 'pl-1',
    Nl1: 'nl-1',
    De1: 'de-1',
    Us2: 'us-2',
    Us3: 'us-3'
} as const;
export type DatabaseClusterLocationEnum = typeof DatabaseClusterLocationEnum[keyof typeof DatabaseClusterLocationEnum];

/**
 * @export
 */
export const DatabaseClusterTypeEnum = {
    Mysql: 'mysql',
    Mysql5: 'mysql5',
    Mysql84: 'mysql8_4',
    Postgres: 'postgres',
    Postgres14: 'postgres14',
    Postgres15: 'postgres15',
    Postgres16: 'postgres16',
    Postgres17: 'postgres17',
    Postgres18: 'postgres18',
    Redis: 'redis',
    Redis7: 'redis7',
    Redis81: 'redis8_1',
    Valkey: 'valkey',
    Valkey7: 'valkey7',
    Valkey81: 'valkey8_1',
    Valkey91: 'valkey9_1',
    Mongodb: 'mongodb',
    Mongodb4: 'mongodb4',
    Mongodb6: 'mongodb6',
    Mongodb7: 'mongodb7',
    Mongodb80: 'mongodb8_0',
    Opensearch: 'opensearch',
    Opensearch219: 'opensearch2_19',
    Clickhouse: 'clickhouse',
    Clickhouse24: 'clickhouse24',
    Clickhouse25: 'clickhouse25',
    Kafka: 'kafka',
    Rabbitmq: 'rabbitmq',
    Rabbitmq40: 'rabbitmq4_0'
} as const;
export type DatabaseClusterTypeEnum = typeof DatabaseClusterTypeEnum[keyof typeof DatabaseClusterTypeEnum];

/**
 * @export
 */
export const DatabaseClusterHashTypeEnum = {
    CachingSha2: 'caching_sha2',
    MysqlNative: 'mysql_native',
    Null: 'null'
} as const;
export type DatabaseClusterHashTypeEnum = typeof DatabaseClusterHashTypeEnum[keyof typeof DatabaseClusterHashTypeEnum];

/**
 * @export
 */
export const DatabaseClusterStatusEnum = {
    Started: 'started',
    Starting: 'starting',
    Stopped: 'stopped',
    NoPaid: 'no_paid',
    LanTransfer: 'lan_transfer',
    Error: 'error',
    Blocked: 'blocked',
    BackupRecovery: 'backup_recovery',
    Transfer: 'transfer',
    Rebooting: 'rebooting',
    TurningOff: 'turning_off',
    TurningOn: 'turning_on',
    ReadOnly: 'read_only',
    UserTransfer: 'user_transfer'
} as const;
export type DatabaseClusterStatusEnum = typeof DatabaseClusterStatusEnum[keyof typeof DatabaseClusterStatusEnum];


/**
 * Check if a given object implements the DatabaseCluster interface.
 */
export function instanceOfDatabaseCluster(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "location" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "networks" in value;
    isInstance = isInstance && "isEnabledPublicIpv6" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "hashType" in value;
    isInstance = isInstance && "avatarLink" in value;
    isInstance = isInstance && "port" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "presetId" in value;
    isInstance = isInstance && "configuratorId" in value;
    isInstance = isInstance && "cpu" in value;
    isInstance = isInstance && "cpuFrequency" in value;
    isInstance = isInstance && "isDedicatedCpu" in value;
    isInstance = isInstance && "ram" in value;
    isInstance = isInstance && "disk" in value;
    isInstance = isInstance && "hasAdditionalDisk" in value;
    isInstance = isInstance && "diskAutoscaling" in value;
    isInstance = isInstance && "configParameters" in value;
    isInstance = isInstance && "isEnabledPublicNetwork" in value;
    isInstance = isInstance && "isSecureConnectionEnabled" in value;
    isInstance = isInstance && "isAutobackupsEnabled" in value;
    isInstance = isInstance && "isBackupScheduleEnabled" in value;
    isInstance = isInstance && "availabilityZone" in value;
    isInstance = isInstance && "replicaList" in value;
    isInstance = isInstance && "domains" in value;
    isInstance = isInstance && "childServices" in value;
    isInstance = isInstance && "parentServices" in value;
    isInstance = isInstance && "maintenanceSlot" in value;

    return isInstance;
}

export function DatabaseClusterFromJSON(json: any): DatabaseCluster {
    return DatabaseClusterFromJSONTyped(json, false);
}

export function DatabaseClusterFromJSONTyped(json: any, ignoreDiscriminator: boolean): DatabaseCluster {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'createdAt': json['created_at'],
        'location': json['location'],
        'name': json['name'],
        'description': json['description'],
        'networks': ((json['networks'] as Array<any>).map(DatabaseClusterNetworksInnerFromJSON)),
        'isEnabledPublicIpv6': json['is_enabled_public_ipv6'],
        'type': json['type'],
        'hashType': json['hash_type'],
        'avatarLink': json['avatar_link'],
        'port': json['port'],
        'status': json['status'],
        'presetId': json['preset_id'],
        'configuratorId': json['configurator_id'],
        'cpu': json['cpu'],
        'cpuFrequency': json['cpu_frequency'],
        'isDedicatedCpu': json['is_dedicated_cpu'],
        'ram': json['ram'],
        'disk': DatabaseClusterDiskFromJSON(json['disk']),
        'hasAdditionalDisk': json['has_additional_disk'],
        'diskAutoscaling': DatabaseClusterDiskAutoscalingFromJSON(json['disk_autoscaling']),
        'configParameters': MysqlFromJSON(json['config_parameters']),
        'isEnabledPublicNetwork': json['is_enabled_public_network'],
        'isSecureConnectionEnabled': json['is_secure_connection_enabled'],
        'isAutobackupsEnabled': json['is_autobackups_enabled'],
        'isBackupScheduleEnabled': json['is_backup_schedule_enabled'],
        'availabilityZone': AvailabilityZoneFromJSON(json['availability_zone']),
        'projectId': !exists(json, 'project_id') ? undefined : json['project_id'],
        'replicaList': ((json['replica_list'] as Array<any>).map(DatabaseClusterReplicaListInnerFromJSON)),
        'domains': ((json['domains'] as Array<any>).map(DatabaseClusterDomainsInnerFromJSON)),
        'childServices': ((json['child_services'] as Array<any>).map(DatabaseClusterChildServicesInnerFromJSON)),
        'parentServices': ((json['parent_services'] as Array<any>).map(DatabaseClusterParentServicesInnerFromJSON)),
        'maintenanceSlot': DatabaseClusterMaintenanceSlotFromJSON(json['maintenance_slot']),
    };
}

export function DatabaseClusterToJSON(value?: DatabaseCluster | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'created_at': value.createdAt,
        'location': value.location,
        'name': value.name,
        'description': value.description,
        'networks': ((value.networks as Array<any>).map(DatabaseClusterNetworksInnerToJSON)),
        'is_enabled_public_ipv6': value.isEnabledPublicIpv6,
        'type': value.type,
        'hash_type': value.hashType,
        'avatar_link': value.avatarLink,
        'port': value.port,
        'status': value.status,
        'preset_id': value.presetId,
        'configurator_id': value.configuratorId,
        'cpu': value.cpu,
        'cpu_frequency': value.cpuFrequency,
        'is_dedicated_cpu': value.isDedicatedCpu,
        'ram': value.ram,
        'disk': DatabaseClusterDiskToJSON(value.disk),
        'has_additional_disk': value.hasAdditionalDisk,
        'disk_autoscaling': DatabaseClusterDiskAutoscalingToJSON(value.diskAutoscaling),
        'config_parameters': MysqlToJSON(value.configParameters),
        'is_enabled_public_network': value.isEnabledPublicNetwork,
        'is_secure_connection_enabled': value.isSecureConnectionEnabled,
        'is_autobackups_enabled': value.isAutobackupsEnabled,
        'is_backup_schedule_enabled': value.isBackupScheduleEnabled,
        'availability_zone': AvailabilityZoneToJSON(value.availabilityZone),
        'project_id': value.projectId,
        'replica_list': ((value.replicaList as Array<any>).map(DatabaseClusterReplicaListInnerToJSON)),
        'domains': ((value.domains as Array<any>).map(DatabaseClusterDomainsInnerToJSON)),
        'child_services': ((value.childServices as Array<any>).map(DatabaseClusterChildServicesInnerToJSON)),
        'parent_services': ((value.parentServices as Array<any>).map(DatabaseClusterParentServicesInnerToJSON)),
        'maintenance_slot': DatabaseClusterMaintenanceSlotToJSON(value.maintenanceSlot),
    };
}

