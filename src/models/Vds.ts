/* tslint:disable */
/* eslint-disable */
/**
 * Timeweb Cloud API
 * # Введение API Timeweb Cloud позволяет вам управлять ресурсами в облаке программным способом с использованием обычных HTTP-запросов.  Множество функций, которые доступны в панели управления Timeweb Cloud, также доступны через API, что позволяет вам автоматизировать ваши собственные сценарии.  В этой документации сперва будет описан общий дизайн и принципы работы API, а после этого конкретные конечные точки. Также будут приведены примеры запросов к ним.   ## Запросы Запросы должны выполняться по протоколу `HTTPS`, чтобы гарантировать шифрование транзакций. Поддерживаются следующие методы запроса: |Метод|Применение| |--- |--- | |GET|Извлекает данные о коллекциях и отдельных ресурсах.| |POST|Для коллекций создает новый ресурс этого типа. Также используется для выполнения действий с конкретным ресурсом.| |PUT|Обновляет существующий ресурс.| |PATCH|Некоторые ресурсы поддерживают частичное обновление, то есть обновление только части атрибутов ресурса, в этом случае вместо метода PUT будет использован PATCH.| |DELETE|Удаляет ресурс.|  Методы `POST`, `PUT` и `PATCH` могут включать объект в тело запроса с типом содержимого `application/json`.  ### Параметры в запросах Некоторые коллекции поддерживают пагинацию, поиск или сортировку в запросах. В параметрах запроса требуется передать: - `limit` — обозначает количество записей, которое необходимо вернуть  - `offset` — указывает на смещение, относительно начала списка  - `search` — позволяет указать набор символов для поиска  - `sort` — можно задать правило сортировки коллекции  ## Ответы Запросы вернут один из следующих кодов состояния ответа HTTP:  |Статус|Описание| |--- |--- | |200 OK|Действие с ресурсом было выполнено успешно.| |201 Created|Ресурс был успешно создан. При этом ресурс может быть как уже готовым к использованию, так и находиться в процессе запуска.| |204 No Content|Действие с ресурсом было выполнено успешно, и ответ не содержит дополнительной информации в теле.| |400 Bad Request|Был отправлен неверный запрос, например, в нем отсутствуют обязательные параметры и т. д. Тело ответа будет содержать дополнительную информацию об ошибке.| |401 Unauthorized|Ошибка аутентификации.| |403 Forbidden|Аутентификация прошла успешно, но недостаточно прав для выполнения действия.| |404 Not Found|Запрашиваемый ресурс не найден.| |409 Conflict|Запрос конфликтует с текущим состоянием.| |423 Locked|Ресурс из запроса заблокирован от применения к нему указанного метода.| |429 Too Many Requests|Был достигнут лимит по количеству запросов в единицу времени.| |500 Internal Server Error|При выполнении запроса произошла какая-то внутренняя ошибка. Чтобы решить эту проблему, лучше всего создать тикет в панели управления.|  ### Структура успешного ответа Все конечные точки будут возвращать данные в формате `JSON`. Ответы на `GET`-запросы будут иметь на верхнем уровне следующую структуру атрибутов:  |Название поля|Тип|Описание| |--- |--- |--- | |[entity_name]|object, object[], string[], number[], boolean|Динамическое поле, которое будет меняться в зависимости от запрашиваемого ресурса и будет содержать все атрибуты, необходимые для описания этого ресурса. Например, при запросе списка баз данных будет возвращаться поле `dbs`, а при запросе конкретного облачного сервера `server`. Для некоторых конечных точек в ответе может возвращаться сразу несколько ресурсов.| |meta|object|Опционально. Объект, который содержит вспомогательную информацию о ресурсе. Чаще всего будет встречаться при запросе коллекций и содержать поле `total`, которое будет указывать на количество элементов в коллекции.| |response_id|string|Опционально. В большинстве случаев в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее. Также вы можете использовать этот идентификатор, чтобы убедиться, что это новый ответ на запрос и результат не был получен из кэша.|  Пример запроса на получение списка SSH-ключей: ```     HTTP/2.0 200 OK     {       \"ssh_keys\":[           {             \"body\":\"ssh-rsa AAAAB3NzaC1sdfghjkOAsBwWhs= example@device.local\",             \"created_at\":\"2021-09-15T19:52:27Z\",             \"expired_at\":null,             \"id\":5297,             \"is_default\":false,             \"name\":\"example@device.local\",             \"used_at\":null,             \"used_by\":[]           }       ],       \"meta\":{           \"total\":1       },       \"response_id\":\"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ### Структура ответа с ошибкой |Название поля|Тип|Описание| |--- |--- |--- | |status_code|number|Короткий числовой идентификатор ошибки.| |error_code|string|Короткий текстовый идентификатор ошибки, который уточняет числовой идентификатор и удобен для программной обработки. Самый простой пример — это код `not_found` для ошибки 404.| |message|string, string[]|Опционально. В большинстве случаев в ответе будет содержаться человекочитаемое подробное описание ошибки или ошибок, которые помогут понять, что нужно исправить.| |response_id|string|Опционально. В большинстве случае в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее.|  Пример: ```     HTTP/2.0 403 Forbidden     {       \"status_code\": 403,       \"error_code\":  \"forbidden\",       \"message\":     \"You do not have access for the attempted action\",       \"response_id\": \"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ## Статусы ресурсов Важно учесть, что при создании большинства ресурсов внутри платформы вам будет сразу возвращен ответ от сервера со статусом `200 OK` или `201 Created` и идентификатором созданного ресурса в теле ответа, но при этом этот ресурс может быть ещё в *состоянии запуска*.  Для того чтобы понять, в каком состоянии сейчас находится ваш ресурс, мы добавили поле `status` в ответ на получение информации о ресурсе.  Список статусов будет отличаться в зависимости от типа ресурса. Увидеть поддерживаемый список статусов вы сможете в описании каждого конкретного ресурса.     ## Ограничение скорости запросов (Rate Limiting) Чтобы обеспечить стабильность для всех пользователей, Timeweb Cloud защищает API от всплесков входящего трафика, анализируя количество запросов c каждого аккаунта к каждой конечной точке.  Если ваше приложение отправляет более 20 запросов в секунду на одну конечную точку, то для этого запроса API может вернуть код состояния HTTP `429 Too Many Requests`.   ## Аутентификация Доступ к API осуществляется с помощью JWT-токена. Токенами можно управлять внутри панели управления Timeweb Cloud в разделе *API и Terraform*.  Токен необходимо передавать в заголовке каждого запроса в формате: ```   Authorization: Bearer $TIMEWEB_CLOUD_TOKEN ```  ## Формат примеров API Примеры в этой документации описаны с помощью `curl`, HTTP-клиента командной строки. На компьютерах `Linux` и `macOS` обычно по умолчанию установлен `curl`, и он доступен для загрузки на всех популярных платформах, включая `Windows`.  Каждый пример разделен на несколько строк символом `\\`, который совместим с `bash`. Типичный пример выглядит так: ```   curl -X PATCH      -H \"Content-Type: application/json\"      -H \"Authorization: Bearer $TIMEWEB_CLOUD_TOKEN\"      -d \'{\"name\":\"Cute Corvus\",\"comment\":\"Development Server\"}\'      \"https://api.timeweb.cloud/api/v1/dedicated/1051\" ``` - Параметр `-X` задает метод запроса. Для согласованности метод будет указан во всех примерах, даже если он явно не требуется для методов `GET`. - Строки `-H` задают требуемые HTTP-заголовки. - Примеры, для которых требуется объект JSON в теле запроса, передают требуемые данные через параметр `-d`.  Чтобы использовать приведенные примеры, не подставляя каждый раз в них свой токен, вы можете добавить токен один раз в переменные окружения в вашей консоли. Например, на `Linux` это можно сделать с помощью команды:  ``` TIMEWEB_CLOUD_TOKEN=\"token\" ```  После этого токен будет автоматически подставляться в ваши запросы.  Обратите внимание, что все значения в этой документации являются примерами. Не полагайтесь на идентификаторы операционных систем, тарифов и т.д., используемые в примерах. Используйте соответствующую конечную точку для получения значений перед созданием ресурсов.   ## Версионирование API построено согласно принципам [семантического версионирования](https://semver.org/lang/ru). Это значит, что мы гарантируем обратную совместимость всех изменений в пределах одной мажорной версии.  Мажорная версия каждой конечной точки обозначается в пути запроса, например, запрос `/api/v1/servers` указывает, что этот метод имеет версию 1.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: info@timeweb.cloud
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { VdsDisksInner } from './VdsDisksInner';
import {
    VdsDisksInnerFromJSON,
    VdsDisksInnerFromJSONTyped,
    VdsDisksInnerToJSON,
} from './VdsDisksInner';
import type { VdsImage } from './VdsImage';
import {
    VdsImageFromJSON,
    VdsImageFromJSONTyped,
    VdsImageToJSON,
} from './VdsImage';
import type { VdsNetworksInner } from './VdsNetworksInner';
import {
    VdsNetworksInnerFromJSON,
    VdsNetworksInnerFromJSONTyped,
    VdsNetworksInnerToJSON,
} from './VdsNetworksInner';
import type { VdsOs } from './VdsOs';
import {
    VdsOsFromJSON,
    VdsOsFromJSONTyped,
    VdsOsToJSON,
} from './VdsOs';
import type { VdsSoftware } from './VdsSoftware';
import {
    VdsSoftwareFromJSON,
    VdsSoftwareFromJSONTyped,
    VdsSoftwareToJSON,
} from './VdsSoftware';

/**
 * Сервер
 * @export
 * @interface Vds
 */
export interface Vds {
    /**
     * Уникальный идентификатор для каждого экземпляра сервера. Автоматически генерируется при создании.
     * @type {number}
     * @memberof Vds
     */
    id: number;
    /**
     * Удобочитаемое имя, установленное для выделенного сервера.
     * @type {string}
     * @memberof Vds
     */
    name: string;
    /**
     * Комментарий к выделенному серверу.
     * @type {string}
     * @memberof Vds
     */
    comment: string;
    /**
     * Дата создания сервера в формате ISO8061.
     * @type {string}
     * @memberof Vds
     */
    createdAt: string;
    /**
     * 
     * @type {VdsOs}
     * @memberof Vds
     */
    os: VdsOs;
    /**
     * 
     * @type {VdsSoftware}
     * @memberof Vds
     */
    software: VdsSoftware | null;
    /**
     * Уникальный идентификатор тарифа сервера.
     * @type {number}
     * @memberof Vds
     */
    presetId: number | null;
    /**
     * Локация сервера.
     * @type {string}
     * @memberof Vds
     */
    location: VdsLocationEnum;
    /**
     * Уникальный идентификатор конфигуратора сервера.
     * @type {number}
     * @memberof Vds
     */
    configuratorId: number | null;
    /**
     * Режим загрузки ОС сервера.
     * @type {string}
     * @memberof Vds
     */
    bootMode: VdsBootModeEnum;
    /**
     * Статус сервера.
     * @type {string}
     * @memberof Vds
     */
    status: VdsStatusEnum;
    /**
     * Значение времени, указанное в комбинированном формате даты и времени ISO8601, которое представляет, когда был запущен сервер.
     * @type {Date}
     * @memberof Vds
     */
    startAt: Date | null;
    /**
     * Это логическое значение, которое показывает, включена ли защита от DDOS у данного сервера.
     * @type {boolean}
     * @memberof Vds
     */
    isDdosGuard: boolean;
    /**
     * Количество ядер процессора сервера.
     * @type {number}
     * @memberof Vds
     */
    cpu: number;
    /**
     * Частота ядер процессора сервера.
     * @type {string}
     * @memberof Vds
     */
    cpuFrequency: string;
    /**
     * Размер (в Мб) ОЗУ сервера.
     * @type {number}
     * @memberof Vds
     */
    ram: number;
    /**
     * Список дисков сервера.
     * @type {Array<VdsDisksInner>}
     * @memberof Vds
     */
    disks: Array<VdsDisksInner>;
    /**
     * Уникальный идентификатор аватара сервера. Описание методов работы с аватарами появится позднее.
     * @type {string}
     * @memberof Vds
     */
    avatarId: string | null;
    /**
     * Пароль от VNC.
     * @type {string}
     * @memberof Vds
     */
    vncPass: string;
    /**
     * Пароль root сервера или пароль Администратора для серверов Windows.
     * @type {string}
     * @memberof Vds
     */
    rootPass: string | null;
    /**
     * 
     * @type {VdsImage}
     * @memberof Vds
     */
    image: VdsImage | null;
    /**
     * Список сетей диска.
     * @type {Array<VdsNetworksInner>}
     * @memberof Vds
     */
    networks: Array<VdsNetworksInner>;
    /**
     * Cloud-init скрипт
     * @type {string}
     * @memberof Vds
     */
    cloudInit: string | null;
    /**
     * Включен ли QEMU-agent на сервере
     * @type {boolean}
     * @memberof Vds
     */
    qemuAgent: boolean;
}


/**
 * @export
 */
export const VdsLocationEnum = {
    Ru1: 'ru-1',
    Ru2: 'ru-2',
    Pl1: 'pl-1',
    Kz1: 'kz-1'
} as const;
export type VdsLocationEnum = typeof VdsLocationEnum[keyof typeof VdsLocationEnum];

/**
 * @export
 */
export const VdsBootModeEnum = {
    Std: 'std',
    Single: 'single',
    Cd: 'cd'
} as const;
export type VdsBootModeEnum = typeof VdsBootModeEnum[keyof typeof VdsBootModeEnum];

/**
 * @export
 */
export const VdsStatusEnum = {
    Installing: 'installing',
    SoftwareInstall: 'software_install',
    Reinstalling: 'reinstalling',
    On: 'on',
    Off: 'off',
    TurningOn: 'turning_on',
    TurningOff: 'turning_off',
    HardTurningOff: 'hard_turning_off',
    Rebooting: 'rebooting',
    HardRebooting: 'hard_rebooting',
    Removing: 'removing',
    Removed: 'removed',
    Cloning: 'cloning',
    Transfer: 'transfer',
    Blocked: 'blocked',
    Configuring: 'configuring',
    NoPaid: 'no_paid',
    PermanentBlocked: 'permanent_blocked'
} as const;
export type VdsStatusEnum = typeof VdsStatusEnum[keyof typeof VdsStatusEnum];


/**
 * Check if a given object implements the Vds interface.
 */
export function instanceOfVds(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "comment" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "os" in value;
    isInstance = isInstance && "software" in value;
    isInstance = isInstance && "presetId" in value;
    isInstance = isInstance && "location" in value;
    isInstance = isInstance && "configuratorId" in value;
    isInstance = isInstance && "bootMode" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "startAt" in value;
    isInstance = isInstance && "isDdosGuard" in value;
    isInstance = isInstance && "cpu" in value;
    isInstance = isInstance && "cpuFrequency" in value;
    isInstance = isInstance && "ram" in value;
    isInstance = isInstance && "disks" in value;
    isInstance = isInstance && "avatarId" in value;
    isInstance = isInstance && "vncPass" in value;
    isInstance = isInstance && "rootPass" in value;
    isInstance = isInstance && "image" in value;
    isInstance = isInstance && "networks" in value;
    isInstance = isInstance && "cloudInit" in value;
    isInstance = isInstance && "qemuAgent" in value;

    return isInstance;
}

export function VdsFromJSON(json: any): Vds {
    return VdsFromJSONTyped(json, false);
}

export function VdsFromJSONTyped(json: any, ignoreDiscriminator: boolean): Vds {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'comment': json['comment'],
        'createdAt': json['created_at'],
        'os': VdsOsFromJSON(json['os']),
        'software': VdsSoftwareFromJSON(json['software']),
        'presetId': json['preset_id'],
        'location': json['location'],
        'configuratorId': json['configurator_id'],
        'bootMode': json['boot_mode'],
        'status': json['status'],
        'startAt': (json['start_at'] === null ? null : new Date(json['start_at'])),
        'isDdosGuard': json['is_ddos_guard'],
        'cpu': json['cpu'],
        'cpuFrequency': json['cpu_frequency'],
        'ram': json['ram'],
        'disks': ((json['disks'] as Array<any>).map(VdsDisksInnerFromJSON)),
        'avatarId': json['avatar_id'],
        'vncPass': json['vnc_pass'],
        'rootPass': json['root_pass'],
        'image': VdsImageFromJSON(json['image']),
        'networks': ((json['networks'] as Array<any>).map(VdsNetworksInnerFromJSON)),
        'cloudInit': json['cloud_init'],
        'qemuAgent': json['qemu_agent'],
    };
}

export function VdsToJSON(value?: Vds | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'comment': value.comment,
        'created_at': value.createdAt,
        'os': VdsOsToJSON(value.os),
        'software': VdsSoftwareToJSON(value.software),
        'preset_id': value.presetId,
        'location': value.location,
        'configurator_id': value.configuratorId,
        'boot_mode': value.bootMode,
        'status': value.status,
        'start_at': (value.startAt === null ? null : value.startAt.toISOString()),
        'is_ddos_guard': value.isDdosGuard,
        'cpu': value.cpu,
        'cpu_frequency': value.cpuFrequency,
        'ram': value.ram,
        'disks': ((value.disks as Array<any>).map(VdsDisksInnerToJSON)),
        'avatar_id': value.avatarId,
        'vnc_pass': value.vncPass,
        'root_pass': value.rootPass,
        'image': VdsImageToJSON(value.image),
        'networks': ((value.networks as Array<any>).map(VdsNetworksInnerToJSON)),
        'cloud_init': value.cloudInit,
        'qemu_agent': value.qemuAgent,
    };
}

