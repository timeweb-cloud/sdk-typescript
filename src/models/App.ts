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
import type { AppConfiguration } from './AppConfiguration';
import {
    AppConfigurationFromJSON,
    AppConfigurationFromJSONTyped,
    AppConfigurationToJSON,
} from './AppConfiguration';
import type { AppDiskStatus } from './AppDiskStatus';
import {
    AppDiskStatusFromJSON,
    AppDiskStatusFromJSONTyped,
    AppDiskStatusToJSON,
} from './AppDiskStatus';
import type { AppDomainsInner } from './AppDomainsInner';
import {
    AppDomainsInnerFromJSON,
    AppDomainsInnerFromJSONTyped,
    AppDomainsInnerToJSON,
} from './AppDomainsInner';
import type { AppProvider } from './AppProvider';
import {
    AppProviderFromJSON,
    AppProviderFromJSONTyped,
    AppProviderToJSON,
} from './AppProvider';
import type { Frameworks } from './Frameworks';
import {
    FrameworksFromJSON,
    FrameworksFromJSONTyped,
    FrameworksToJSON,
} from './Frameworks';
import type { Repository } from './Repository';
import {
    RepositoryFromJSON,
    RepositoryFromJSONTyped,
    RepositoryToJSON,
} from './Repository';

/**
 * Экземпляр приложения.
 * @export
 * @interface App
 */
export interface App {
    /**
     * ID для каждого экземпляра приложения. Автоматически генерируется при создании.
     * @type {number}
     * @memberof App
     */
    id: number;
    /**
     * Тип приложения.
     * @type {string}
     * @memberof App
     */
    type: AppTypeEnum;
    /**
     * Удобочитаемое имя, установленное для приложения.
     * @type {string}
     * @memberof App
     */
    name: string;
    /**
     * Статус приложения.
     * @type {string}
     * @memberof App
     */
    status: AppStatusEnum;
    /**
     * 
     * @type {AppProvider}
     * @memberof App
     */
    provider: AppProvider;
    /**
     * IPv4-адрес приложения.
     * @type {string}
     * @memberof App
     */
    ip: string;
    /**
     * 
     * @type {Array<AppDomainsInner>}
     * @memberof App
     */
    domains: Array<AppDomainsInner>;
    /**
     * 
     * @type {Frameworks}
     * @memberof App
     */
    framework: Frameworks;
    /**
     * Локация сервера.
     * @type {string}
     * @memberof App
     */
    location: AppLocationEnum;
    /**
     * 
     * @type {Repository}
     * @memberof App
     */
    repository: Repository;
    /**
     * Версия окружения.
     * @type {string}
     * @memberof App
     */
    envVersion: string | null;
    /**
     * Переменные окружения приложения. Объект с ключами и значениями типа string.
     * @type {object}
     * @memberof App
     */
    envs: object;
    /**
     * Название ветки репозитория из которой собрано приложение.
     * @type {string}
     * @memberof App
     */
    branchName: string;
    /**
     * Включен ли автоматический деплой.
     * @type {boolean}
     * @memberof App
     */
    isAutoDeploy: boolean;
    /**
     * Хэш коммита из которого собрано приложеие.
     * @type {string}
     * @memberof App
     */
    commitSha: string;
    /**
     * Комментарий к приложению.
     * @type {string}
     * @memberof App
     */
    comment: string;
    /**
     * ID тарифа.
     * @type {number}
     * @memberof App
     */
    presetId: number;
    /**
     * Путь к директории с индексным файлом. Определен для приложений `type: frontend`. Для приложений `type: backend` всегда null.
     * @type {string}
     * @memberof App
     */
    indexDir: string | null;
    /**
     * Команда сборки приложения.
     * @type {string}
     * @memberof App
     */
    buildCmd: string;
    /**
     * Ссылка на аватар приложения.
     * @type {string}
     * @memberof App
     */
    avatarLink: string | null;
    /**
     * Команда для запуска приложения. Определена для приложений `type: backend`. Для приложений `type: frontend` всегда null.
     * @type {string}
     * @memberof App
     */
    runCmd: string | null;
    /**
     * 
     * @type {AppConfiguration}
     * @memberof App
     */
    _configuration: AppConfiguration | null;
    /**
     * 
     * @type {AppDiskStatus}
     * @memberof App
     */
    diskStatus: AppDiskStatus | null;
    /**
     * Включен ли агент QEMU.
     * @type {boolean}
     * @memberof App
     */
    isQemuAgent: boolean;
    /**
     * Язык программирования приложения.
     * @type {string}
     * @memberof App
     */
    language: string;
    /**
     * Время запуска приложения.
     * @type {Date}
     * @memberof App
     */
    startTime: Date;
}


/**
 * @export
 */
export const AppTypeEnum = {
    Backend: 'backend',
    Frontend: 'frontend'
} as const;
export type AppTypeEnum = typeof AppTypeEnum[keyof typeof AppTypeEnum];

/**
 * @export
 */
export const AppStatusEnum = {
    Active: 'active',
    Paused: 'paused',
    NoPaid: 'no_paid',
    Deploy: 'deploy',
    Failure: 'failure',
    StartupError: 'startup_error',
    New: 'new',
    Reboot: 'reboot'
} as const;
export type AppStatusEnum = typeof AppStatusEnum[keyof typeof AppStatusEnum];

/**
 * @export
 */
export const AppLocationEnum = {
    Ru1: 'ru-1',
    Pl1: 'pl-1',
    Nl1: 'nl-1'
} as const;
export type AppLocationEnum = typeof AppLocationEnum[keyof typeof AppLocationEnum];


/**
 * Check if a given object implements the App interface.
 */
export function instanceOfApp(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "provider" in value;
    isInstance = isInstance && "ip" in value;
    isInstance = isInstance && "domains" in value;
    isInstance = isInstance && "framework" in value;
    isInstance = isInstance && "location" in value;
    isInstance = isInstance && "repository" in value;
    isInstance = isInstance && "envVersion" in value;
    isInstance = isInstance && "envs" in value;
    isInstance = isInstance && "branchName" in value;
    isInstance = isInstance && "isAutoDeploy" in value;
    isInstance = isInstance && "commitSha" in value;
    isInstance = isInstance && "comment" in value;
    isInstance = isInstance && "presetId" in value;
    isInstance = isInstance && "indexDir" in value;
    isInstance = isInstance && "buildCmd" in value;
    isInstance = isInstance && "avatarLink" in value;
    isInstance = isInstance && "runCmd" in value;
    isInstance = isInstance && "_configuration" in value;
    isInstance = isInstance && "diskStatus" in value;
    isInstance = isInstance && "isQemuAgent" in value;
    isInstance = isInstance && "language" in value;
    isInstance = isInstance && "startTime" in value;

    return isInstance;
}

export function AppFromJSON(json: any): App {
    return AppFromJSONTyped(json, false);
}

export function AppFromJSONTyped(json: any, ignoreDiscriminator: boolean): App {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'type': json['type'],
        'name': json['name'],
        'status': json['status'],
        'provider': AppProviderFromJSON(json['provider']),
        'ip': json['ip'],
        'domains': ((json['domains'] as Array<any>).map(AppDomainsInnerFromJSON)),
        'framework': FrameworksFromJSON(json['framework']),
        'location': json['location'],
        'repository': RepositoryFromJSON(json['repository']),
        'envVersion': json['env_version'],
        'envs': json['envs'],
        'branchName': json['branch_name'],
        'isAutoDeploy': json['is_auto_deploy'],
        'commitSha': json['commit_sha'],
        'comment': json['comment'],
        'presetId': json['preset_id'],
        'indexDir': json['index_dir'],
        'buildCmd': json['build_cmd'],
        'avatarLink': json['avatar_link'],
        'runCmd': json['run_cmd'],
        '_configuration': AppConfigurationFromJSON(json['configuration']),
        'diskStatus': AppDiskStatusFromJSON(json['disk_status']),
        'isQemuAgent': json['is_qemu_agent'],
        'language': json['language'],
        'startTime': (new Date(json['start_time'])),
    };
}

export function AppToJSON(value?: App | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'type': value.type,
        'name': value.name,
        'status': value.status,
        'provider': AppProviderToJSON(value.provider),
        'ip': value.ip,
        'domains': ((value.domains as Array<any>).map(AppDomainsInnerToJSON)),
        'framework': FrameworksToJSON(value.framework),
        'location': value.location,
        'repository': RepositoryToJSON(value.repository),
        'env_version': value.envVersion,
        'envs': value.envs,
        'branch_name': value.branchName,
        'is_auto_deploy': value.isAutoDeploy,
        'commit_sha': value.commitSha,
        'comment': value.comment,
        'preset_id': value.presetId,
        'index_dir': value.indexDir,
        'build_cmd': value.buildCmd,
        'avatar_link': value.avatarLink,
        'run_cmd': value.runCmd,
        'configuration': AppConfigurationToJSON(value._configuration),
        'disk_status': AppDiskStatusToJSON(value.diskStatus),
        'is_qemu_agent': value.isQemuAgent,
        'language': value.language,
        'start_time': (value.startTime.toISOString()),
    };
}

