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
import type { AppV2Configuration } from './AppV2Configuration';
import {
    AppV2ConfigurationFromJSON,
    AppV2ConfigurationFromJSONTyped,
    AppV2ConfigurationToJSON,
} from './AppV2Configuration';
import type { AppV2DiskStatus } from './AppV2DiskStatus';
import {
    AppV2DiskStatusFromJSON,
    AppV2DiskStatusFromJSONTyped,
    AppV2DiskStatusToJSON,
} from './AppV2DiskStatus';
import type { AppV2DomainsInner } from './AppV2DomainsInner';
import {
    AppV2DomainsInnerFromJSON,
    AppV2DomainsInnerFromJSONTyped,
    AppV2DomainsInnerToJSON,
} from './AppV2DomainsInner';
import type { AppV2Provider } from './AppV2Provider';
import {
    AppV2ProviderFromJSON,
    AppV2ProviderFromJSONTyped,
    AppV2ProviderToJSON,
} from './AppV2Provider';
import type { Repository } from './Repository';
import {
    RepositoryFromJSON,
    RepositoryFromJSONTyped,
    RepositoryToJSON,
} from './Repository';

/**
 * Приложение v2. Создание и первый деплой выполняются асинхронно. Поля сервера и инфраструктуры могут отсутствовать, пока соответствующие ресурсы не созданы.
 * @export
 * @interface AppV2
 */
export interface AppV2 {
    /**
     * ID для каждого экземпляра приложения. Автоматически генерируется при создании.
     * @type {number}
     * @memberof AppV2
     */
    id: number;
    /**
     * Тип приложения.
     * @type {string}
     * @memberof AppV2
     */
    type: AppV2TypeEnum;
    /**
     * Удобочитаемое имя, установленное для приложения.
     * @type {string}
     * @memberof AppV2
     */
    name: string;
    /**
     * Текущее состояние приложения. После принятия запроса на создание — new. Ответ 201 не означает завершение развёртывания.
     * @type {string}
     * @memberof AppV2
     */
    status: AppV2StatusEnum;
    /**
     * 
     * @type {AppV2Provider}
     * @memberof AppV2
     */
    provider: AppV2Provider;
    /**
     * Публичный IPv4-адрес. Отсутствует, пока сервер и IP-адрес не созданы.
     * @type {string}
     * @memberof AppV2
     */
    ip?: string;
    /**
     * Домены приложения. В начальном ответе на создание массив пуст.
     * @type {Array<AppV2DomainsInner>}
     * @memberof AppV2
     */
    domains: Array<AppV2DomainsInner>;
    /**
     * Фреймворк приложения. Поле может отсутствовать до создания инфраструктуры.
     * @type {string}
     * @memberof AppV2
     */
    framework?: AppV2FrameworkEnum;
    /**
     * Локация сервера. Может отсутствовать до создания сервера.
     * @type {string}
     * @memberof AppV2
     */
    location?: AppV2LocationEnum;
    /**
     * 
     * @type {Repository}
     * @memberof AppV2
     */
    repository?: Repository;
    /**
     * Версия окружения. Поле может отсутствовать до создания инфраструктуры.
     * @type {string}
     * @memberof AppV2
     */
    envVersion?: string | null;
    /**
     * Переменные окружения приложения. Объект с ключами и значениями типа string. Поле может отсутствовать до создания инфраструктуры.
     * @type {{ [key: string]: string; }}
     * @memberof AppV2
     */
    envs?: { [key: string]: string; };
    /**
     * Включен ли автоматический деплой.
     * @type {boolean}
     * @memberof AppV2
     */
    isAutoDeploy: boolean;
    /**
     * Хэш коммита, из которого собрано приложение.
     * @type {string}
     * @memberof AppV2
     */
    commitSha?: string;
    /**
     * Комментарий к приложению.
     * @type {string}
     * @memberof AppV2
     */
    comment?: string;
    /**
     * ID тарифа приложения; 0 при использовании конфигуратора.
     * @type {number}
     * @memberof AppV2
     */
    presetId: number;
    /**
     * Каталог со статическими файлами frontend-приложения. До создания инфраструктуры поле отсутствует. Для backend — null.
     * @type {string}
     * @memberof AppV2
     */
    indexDir?: string | null;
    /**
     * Команда сборки приложения. Поле может отсутствовать до создания инфраструктуры.
     * @type {string}
     * @memberof AppV2
     */
    buildCmd?: string;
    /**
     * Ссылка на аватар приложения.
     * @type {string}
     * @memberof AppV2
     */
    avatarLink: string | null;
    /**
     * Команда запуска backend-приложения. До создания инфраструктуры поле отсутствует. Для frontend — null.
     * @type {string}
     * @memberof AppV2
     */
    runCmd?: string | null;
    /**
     * 
     * @type {AppV2Configuration}
     * @memberof AppV2
     */
    _configuration?: AppV2Configuration | null;
    /**
     * 
     * @type {AppV2DiskStatus}
     * @memberof AppV2
     */
    diskStatus?: AppV2DiskStatus | null;
    /**
     * Включён ли агент QEMU. Для frontend — null. Для backend поле отсутствует до создания сервера.
     * @type {boolean}
     * @memberof AppV2
     */
    isQemuAgent?: boolean | null;
    /**
     * Язык или способ развёртывания. Может отсутствовать до создания инфраструктуры. Поле может отсутствовать до создания инфраструктуры.
     * @type {string}
     * @memberof AppV2
     */
    language?: AppV2LanguageEnum;
    /**
     * Время последнего изменения записи приложения.
     * @type {Date}
     * @memberof AppV2
     */
    startTime: Date;
    /**
     * Ветка Git-репозитория. В ответе v2 поле называется branch.
     * @type {string}
     * @memberof AppV2
     */
    branch?: string;
    /**
     * ID конфигуратора приложения; null при использовании готового тарифа.
     * @type {number}
     * @memberof AppV2
     */
    configuratorId: number | null;
    /**
     * ID проекта приложения. Может отсутствовать, если проект не задан.
     * @type {number}
     * @memberof AppV2
     */
    projectId?: number;
    /**
     * Системные пакеты приложения. Поле отсутствует, если зависимости не заданы.
     * @type {Array<string>}
     * @memberof AppV2
     */
    systemDependencies?: Array<string>;
    /**
     * Время создания записи приложения.
     * @type {Date}
     * @memberof AppV2
     */
    createdAt: Date;
    /**
     * Зона доступности сервера. Может быть null или отсутствовать до создания сервера.
     * @type {string}
     * @memberof AppV2
     */
    availabilityZone?: AppV2AvailabilityZoneEnum;
    /**
     * Ограничение количества запросов; null, если индивидуальный лимит не задан.
     * @type {number}
     * @memberof AppV2
     */
    requestsLimit: number | null;
    /**
     * Каталог приложения в Git-репозитории, относительно которого выполняется сборка. Может отсутствовать до создания инфраструктуры.
     * @type {string}
     * @memberof AppV2
     */
    buildEntryPath?: string;
    /**
     * HTTP-путь для проверки работоспособности backend-приложения. Может отсутствовать до создания инфраструктуры.
     * @type {string}
     * @memberof AppV2
     */
    healthCheck?: string | null;
    /**
     * Имя готового Docker-образа без тега. Присутствует для backend из готового Docker-образа.
     * @type {string}
     * @memberof AppV2
     */
    dockerImage?: string;
    /**
     * Тег готового Docker-образа. Присутствует для backend из готового Docker-образа.
     * @type {string}
     * @memberof AppV2
     */
    dockerImageTag?: string;
    /**
     * Добавлены ли доверенные корневые сертификаты Минцифры в окружение backend-приложения. Поле возвращается в российском регионе после создания инфраструктуры.
     * @type {boolean}
     * @memberof AppV2
     */
    isRussianTrustedCa?: boolean;
    /**
     * Добавлены ли доверенные корневые сертификаты ТЦИ в окружение backend-приложения. Поле возвращается в российском регионе после создания инфраструктуры.
     * @type {boolean}
     * @memberof AppV2
     */
    isTciTrustedCa?: boolean;
    /**
     * Заблокированные порты backend-приложения. Поле может отсутствовать до создания сервера.
     * @type {Array<number>}
     * @memberof AppV2
     */
    blockedPorts?: Array<number> | null;
    /**
     * Настройки обратного прокси. В начальном ответе на создание — null.
     * @type {object}
     * @memberof AppV2
     */
    reverseProxy: object | null;
}


/**
 * @export
 */
export const AppV2TypeEnum = {
    Backend: 'backend',
    Frontend: 'frontend'
} as const;
export type AppV2TypeEnum = typeof AppV2TypeEnum[keyof typeof AppV2TypeEnum];

/**
 * @export
 */
export const AppV2StatusEnum = {
    Active: 'active',
    Paused: 'paused',
    NoPaid: 'no_paid',
    Deploy: 'deploy',
    Failure: 'failure',
    StartupError: 'startup_error',
    New: 'new',
    Reboot: 'reboot',
    Blocked: 'blocked',
    RequestLimitExceeded: 'request_limit_exceeded'
} as const;
export type AppV2StatusEnum = typeof AppV2StatusEnum[keyof typeof AppV2StatusEnum];

/**
 * @export
 */
export const AppV2FrameworkEnum = {
    Django: 'django',
    Express: 'express',
    Phoenix: 'phoenix',
    Spring: 'Spring',
    Laravel: 'laravel',
    Beego: 'beego',
    Fastapi: 'fastapi',
    AspNetCore: 'ASP.NET Core',
    Hapi: 'hapi',
    Celery: 'celery',
    Flask: 'flask',
    Gin: 'gin',
    Docker: 'docker',
    DockerCompose: 'docker-compose',
    Fastify: 'fastify',
    Nest: 'nest',
    Symfony: 'symfony',
    Yii: 'yii',
    NextJs: 'next.js',
    Nuxt: 'nuxt',
    Astro: 'astro',
    TanstackStart: 'tanstack-start',
    SolidStart: 'solid-start',
    Ktor: 'ktor',
    Axum: 'axum',
    Actix: 'actix',
    Tornado: 'tornado',
    Aiohttp: 'aiohttp',
    Fiber: 'fiber',
    Echo: 'echo',
    Micronaut: 'Micronaut',
    Quarkus: 'Quarkus',
    Remix: 'remix',
    Sveltekit: 'sveltekit',
    Angular: 'angular',
    Ember: 'ember',
    Preact: 'preact',
    React: 'react',
    Solid: 'solid',
    Svelte: 'svelte',
    Vue: 'vue',
    StaticNobuild: 'static-nobuild',
    Another: 'another'
} as const;
export type AppV2FrameworkEnum = typeof AppV2FrameworkEnum[keyof typeof AppV2FrameworkEnum];

/**
 * @export
 */
export const AppV2LocationEnum = {
    Ru1: 'ru-1',
    Ru2: 'ru-2',
    Ru3: 'ru-3',
    Pl1: 'pl-1',
    Kz1: 'kz-1',
    Nl1: 'nl-1',
    Us1: 'us-1',
    Us2: 'us-2',
    De1: 'de-1'
} as const;
export type AppV2LocationEnum = typeof AppV2LocationEnum[keyof typeof AppV2LocationEnum];

/**
 * @export
 */
export const AppV2LanguageEnum = {
    Javascript: 'javascript',
    Node: 'node',
    Elixir: 'elixir',
    Go: 'go',
    Php: 'php',
    Python: 'python',
    Ruby: 'ruby',
    Docker: 'docker',
    DockerCompose: 'docker-compose',
    Dotnet: 'dotnet',
    Java: 'java',
    Kotlin: 'kotlin',
    Rust: 'rust',
    Bun: 'bun',
    Deno: 'deno',
    CustomImage: 'custom-image'
} as const;
export type AppV2LanguageEnum = typeof AppV2LanguageEnum[keyof typeof AppV2LanguageEnum];

/**
 * @export
 */
export const AppV2AvailabilityZoneEnum = {
    Spb1: 'spb-1',
    Spb2: 'spb-2',
    Spb3: 'spb-3',
    Spb4: 'spb-4',
    Nsk1: 'nsk-1',
    Ams1: 'ams-1',
    Gdn1: 'gdn-1',
    Ala1: 'ala-1',
    Nyc1: 'nyc-1',
    Msk1: 'msk-1'
} as const;
export type AppV2AvailabilityZoneEnum = typeof AppV2AvailabilityZoneEnum[keyof typeof AppV2AvailabilityZoneEnum];


/**
 * Check if a given object implements the AppV2 interface.
 */
export function instanceOfAppV2(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "provider" in value;
    isInstance = isInstance && "domains" in value;
    isInstance = isInstance && "isAutoDeploy" in value;
    isInstance = isInstance && "presetId" in value;
    isInstance = isInstance && "avatarLink" in value;
    isInstance = isInstance && "startTime" in value;
    isInstance = isInstance && "configuratorId" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "requestsLimit" in value;
    isInstance = isInstance && "reverseProxy" in value;

    return isInstance;
}

export function AppV2FromJSON(json: any): AppV2 {
    return AppV2FromJSONTyped(json, false);
}

export function AppV2FromJSONTyped(json: any, ignoreDiscriminator: boolean): AppV2 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'type': json['type'],
        'name': json['name'],
        'status': json['status'],
        'provider': AppV2ProviderFromJSON(json['provider']),
        'ip': !exists(json, 'ip') ? undefined : json['ip'],
        'domains': ((json['domains'] as Array<any>).map(AppV2DomainsInnerFromJSON)),
        'framework': !exists(json, 'framework') ? undefined : json['framework'],
        'location': !exists(json, 'location') ? undefined : json['location'],
        'repository': !exists(json, 'repository') ? undefined : RepositoryFromJSON(json['repository']),
        'envVersion': !exists(json, 'env_version') ? undefined : json['env_version'],
        'envs': !exists(json, 'envs') ? undefined : json['envs'],
        'isAutoDeploy': json['is_auto_deploy'],
        'commitSha': !exists(json, 'commit_sha') ? undefined : json['commit_sha'],
        'comment': !exists(json, 'comment') ? undefined : json['comment'],
        'presetId': json['preset_id'],
        'indexDir': !exists(json, 'index_dir') ? undefined : json['index_dir'],
        'buildCmd': !exists(json, 'build_cmd') ? undefined : json['build_cmd'],
        'avatarLink': json['avatar_link'],
        'runCmd': !exists(json, 'run_cmd') ? undefined : json['run_cmd'],
        '_configuration': !exists(json, 'configuration') ? undefined : AppV2ConfigurationFromJSON(json['configuration']),
        'diskStatus': !exists(json, 'disk_status') ? undefined : AppV2DiskStatusFromJSON(json['disk_status']),
        'isQemuAgent': !exists(json, 'is_qemu_agent') ? undefined : json['is_qemu_agent'],
        'language': !exists(json, 'language') ? undefined : json['language'],
        'startTime': (new Date(json['start_time'])),
        'branch': !exists(json, 'branch') ? undefined : json['branch'],
        'configuratorId': json['configurator_id'],
        'projectId': !exists(json, 'project_id') ? undefined : json['project_id'],
        'systemDependencies': !exists(json, 'system_dependencies') ? undefined : json['system_dependencies'],
        'createdAt': (new Date(json['created_at'])),
        'availabilityZone': !exists(json, 'availability_zone') ? undefined : json['availability_zone'],
        'requestsLimit': json['requests_limit'],
        'buildEntryPath': !exists(json, 'build_entry_path') ? undefined : json['build_entry_path'],
        'healthCheck': !exists(json, 'health_check') ? undefined : json['health_check'],
        'dockerImage': !exists(json, 'docker_image') ? undefined : json['docker_image'],
        'dockerImageTag': !exists(json, 'docker_image_tag') ? undefined : json['docker_image_tag'],
        'isRussianTrustedCa': !exists(json, 'is_russian_trusted_ca') ? undefined : json['is_russian_trusted_ca'],
        'isTciTrustedCa': !exists(json, 'is_tci_trusted_ca') ? undefined : json['is_tci_trusted_ca'],
        'blockedPorts': !exists(json, 'blocked_ports') ? undefined : json['blocked_ports'],
        'reverseProxy': json['reverse_proxy'],
    };
}

export function AppV2ToJSON(value?: AppV2 | null): any {
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
        'provider': AppV2ProviderToJSON(value.provider),
        'ip': value.ip,
        'domains': ((value.domains as Array<any>).map(AppV2DomainsInnerToJSON)),
        'framework': value.framework,
        'location': value.location,
        'repository': RepositoryToJSON(value.repository),
        'env_version': value.envVersion,
        'envs': value.envs,
        'is_auto_deploy': value.isAutoDeploy,
        'commit_sha': value.commitSha,
        'comment': value.comment,
        'preset_id': value.presetId,
        'index_dir': value.indexDir,
        'build_cmd': value.buildCmd,
        'avatar_link': value.avatarLink,
        'run_cmd': value.runCmd,
        'configuration': AppV2ConfigurationToJSON(value._configuration),
        'disk_status': AppV2DiskStatusToJSON(value.diskStatus),
        'is_qemu_agent': value.isQemuAgent,
        'language': value.language,
        'start_time': (value.startTime.toISOString()),
        'branch': value.branch,
        'configurator_id': value.configuratorId,
        'project_id': value.projectId,
        'system_dependencies': value.systemDependencies,
        'created_at': (value.createdAt.toISOString()),
        'availability_zone': value.availabilityZone,
        'requests_limit': value.requestsLimit,
        'build_entry_path': value.buildEntryPath,
        'health_check': value.healthCheck,
        'docker_image': value.dockerImage,
        'docker_image_tag': value.dockerImageTag,
        'is_russian_trusted_ca': value.isRussianTrustedCa,
        'is_tci_trusted_ca': value.isTciTrustedCa,
        'blocked_ports': value.blockedPorts,
        'reverse_proxy': value.reverseProxy,
    };
}

