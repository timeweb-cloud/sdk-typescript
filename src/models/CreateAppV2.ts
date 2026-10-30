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
import type { CreateAppV2Configuration } from './CreateAppV2Configuration';
import {
    CreateAppV2ConfigurationFromJSON,
    CreateAppV2ConfigurationFromJSONTyped,
    CreateAppV2ConfigurationToJSON,
} from './CreateAppV2Configuration';
import type { CreateAppV2Network } from './CreateAppV2Network';
import {
    CreateAppV2NetworkFromJSON,
    CreateAppV2NetworkFromJSONTyped,
    CreateAppV2NetworkToJSON,
} from './CreateAppV2Network';

/**
 * Параметры создания приложения. Для Git-репозитория обязательны provider_id, repository_id, branch_name, commit_sha, build_cmd, is_auto_deploy и framework. Для frontend также обязательны index_dir и preset_id. Для backend из Git обязателен run_cmd. Для backend из готового Docker-образа передайте docker_image и docker_image_tag; Git-параметры не требуются. Для любого backend передайте либо preset_id, либо configuration. Эти поля нельзя передавать одновременно.
 * @export
 * @interface CreateAppV2
 */
export interface CreateAppV2 {
    /**
     * ID провайдера. Обязателен при создании из Git-репозитория. Не требуется для готового Docker-образа.
     * @type {string}
     * @memberof CreateAppV2
     */
    providerId?: string;
    /**
     * Тип приложения: frontend — статический сайт, backend — серверное приложение или Docker-образ.
     * @type {string}
     * @memberof CreateAppV2
     */
    type: CreateAppV2TypeEnum;
    /**
     * ID репозитория. Обязателен при создании из Git-репозитория. Не требуется для готового Docker-образа.
     * @type {string}
     * @memberof CreateAppV2
     */
    repositoryId?: string;
    /**
     * Команда сборки приложения из Git-репозитория. Обязательна для Git; можно передать пустую строку, если сборка не нужна.
     * @type {string}
     * @memberof CreateAppV2
     */
    buildCmd?: string;
    /**
     * Переменные окружения приложения. Ключи и значения — строки. Длина ключа — не более 255 символов, значения — не более 10240. По умолчанию пустой объект.
     * @type {{ [key: string]: string; }}
     * @memberof CreateAppV2
     */
    envs?: { [key: string]: string; };
    /**
     * Ветка Git-репозитория, из которой необходимо собрать приложение. Обязательна при создании из Git.
     * @type {string}
     * @memberof CreateAppV2
     */
    branchName?: string;
    /**
     * Автоматически запускать деплой при изменении Git-репозитория. Поле обязательно при создании из Git. Для провайдера git и готового Docker-образа автодеплой выключен.
     * @type {boolean}
     * @memberof CreateAppV2
     */
    isAutoDeploy?: boolean;
    /**
     * Хэш коммита для первого деплоя. Обязателен при создании из Git.
     * @type {string}
     * @memberof CreateAppV2
     */
    commitSha?: string;
    /**
     * Имя приложения, от 1 до 255 символов. Допустимы латинские и русские буквы, цифры, пробелы и символы - . ( ) , & # [ ] _.
     * @type {string}
     * @memberof CreateAppV2
     */
    name: string;
    /**
     * Комментарий к приложению. Обязательное поле; можно передать пустую строку. Допустимы те же символы, что и в имени приложения.
     * @type {string}
     * @memberof CreateAppV2
     */
    comment: string;
    /**
     * ID тарифа приложения. Обязателен для frontend. Для backend передайте либо preset_id, либо configuration. Нельзя передавать вместе с configuration. Доступные тарифы: GET /api/v1/presets/apps.
     * @type {number}
     * @memberof CreateAppV2
     */
    presetId?: number;
    /**
     * Версия окружения для сборки и запуска, например версия Node.js. Можно передать null.
     * @type {string}
     * @memberof CreateAppV2
     */
    envVersion?: string | null;
    /**
     * Фреймворк приложения, строка с учётом регистра. Обязателен при создании из Git. Для frontend: `angular`, `astro`, `ember`, `next.js`, `nuxt`, `preact`, `react`, `remix`, `solid`, `solid-start`, `svelte`, `sveltekit`, `tanstack-start`, `vue`, `static-nobuild`, `another`. Для backend: `django`, `express`, `phoenix`, `Spring`, `laravel`, `beego`, `fastapi`, `ASP.NET Core`, `hapi`, `celery`, `flask`, `gin`, `docker`, `docker-compose`, `fastify`, `nest`, `symfony`, `yii`, `next.js`, `nuxt`, `astro`, `tanstack-start`, `solid-start`, `ktor`, `axum`, `actix`, `tornado`, `aiohttp`, `fiber`, `echo`, `Micronaut`, `Quarkus`, `remix`, `sveltekit`. Для готового Docker-образа не требуется.
     * @type {string}
     * @memberof CreateAppV2
     */
    framework?: CreateAppV2FrameworkEnum;
    /**
     * Путь к каталогу с собранными статическими файлами, например /dist. Обязателен для frontend. Не используется для backend.
     * @type {string}
     * @memberof CreateAppV2
     */
    indexDir?: string;
    /**
     * Команда запуска backend-приложения из Git. Обязательна для backend из Git. Не требуется для готового Docker-образа и frontend.
     * @type {string}
     * @memberof CreateAppV2
     */
    runCmd?: string;
    /**
     * Системные пакеты для установки в окружение приложения. Допустимы строчные латинские буквы, цифры и символы . + - =. По умолчанию пустой массив.
     * @type {Array<string>}
     * @memberof CreateAppV2
     */
    systemDependencies?: Array<string>;
    /**
     * ID проекта, в который необходимо добавить приложение. Проект должен принадлежать аккаунту.
     * @type {number}
     * @memberof CreateAppV2
     */
    projectId?: number;
    /**
     * 
     * @type {CreateAppV2Configuration}
     * @memberof CreateAppV2
     */
    _configuration?: CreateAppV2Configuration;
    /**
     * Язык или способ развёртывания. Обязателен в v2. Для frontend: `javascript`. Для backend: `node`, `elixir`, `go`, `php`, `python`, `ruby`, `docker`, `docker-compose`, `dotnet`, `java`, `kotlin`, `rust`, `bun`, `deno`, `custom-image`. Для SSR-приложений из Git используйте node, для готового Docker-образа — custom-image.
     * @type {string}
     * @memberof CreateAppV2
     */
    language: CreateAppV2LanguageEnum;
    /**
     * Каталог приложения в Git-репозитории, относительно которого выполняется сборка. Непустой путь начинается с /, не содержит .. или двойной начальный /. Допустимы латинские буквы, цифры, . - _ /. Можно передать пустую строку.
     * @type {string}
     * @memberof CreateAppV2
     */
    buildEntryPath?: string;
    /**
     * 
     * @type {CreateAppV2Network}
     * @memberof CreateAppV2
     */
    network?: CreateAppV2Network;
    /**
     * HTTP-путь для проверки работоспособности backend-приложения.
     * @type {string}
     * @memberof CreateAppV2
     */
    healthCheck?: string;
    /**
     * ID глобальных переменных окружения аккаунта, которые необходимо связать с приложением.
     * @type {Array<number>}
     * @memberof CreateAppV2
     */
    globalEnvIds?: Array<number>;
    /**
     * Имя готового Docker-образа для backend, без тега. Передавайте вместе с docker_image_tag. При указании обоих полей Git-параметры не требуются.
     * @type {string}
     * @memberof CreateAppV2
     */
    dockerImage?: string;
    /**
     * Тег готового Docker-образа. Передавайте вместе с docker_image.
     * @type {string}
     * @memberof CreateAppV2
     */
    dockerImageTag?: string;
    /**
     * Добавить доверенные корневые сертификаты Минцифры в окружение backend-приложения. Применяется в российском регионе.
     * @type {boolean}
     * @memberof CreateAppV2
     */
    isRussianTrustedCa?: boolean;
    /**
     * Добавить доверенные корневые сертификаты ТЦИ в окружение backend-приложения. Применяется в российском регионе.
     * @type {boolean}
     * @memberof CreateAppV2
     */
    isTciTrustedCa?: boolean;
}


/**
 * @export
 */
export const CreateAppV2TypeEnum = {
    Frontend: 'frontend',
    Backend: 'backend'
} as const;
export type CreateAppV2TypeEnum = typeof CreateAppV2TypeEnum[keyof typeof CreateAppV2TypeEnum];

/**
 * @export
 */
export const CreateAppV2FrameworkEnum = {
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
export type CreateAppV2FrameworkEnum = typeof CreateAppV2FrameworkEnum[keyof typeof CreateAppV2FrameworkEnum];

/**
 * @export
 */
export const CreateAppV2LanguageEnum = {
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
export type CreateAppV2LanguageEnum = typeof CreateAppV2LanguageEnum[keyof typeof CreateAppV2LanguageEnum];


/**
 * Check if a given object implements the CreateAppV2 interface.
 */
export function instanceOfCreateAppV2(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "comment" in value;
    isInstance = isInstance && "language" in value;

    return isInstance;
}

export function CreateAppV2FromJSON(json: any): CreateAppV2 {
    return CreateAppV2FromJSONTyped(json, false);
}

export function CreateAppV2FromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateAppV2 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'providerId': !exists(json, 'provider_id') ? undefined : json['provider_id'],
        'type': json['type'],
        'repositoryId': !exists(json, 'repository_id') ? undefined : json['repository_id'],
        'buildCmd': !exists(json, 'build_cmd') ? undefined : json['build_cmd'],
        'envs': !exists(json, 'envs') ? undefined : json['envs'],
        'branchName': !exists(json, 'branch_name') ? undefined : json['branch_name'],
        'isAutoDeploy': !exists(json, 'is_auto_deploy') ? undefined : json['is_auto_deploy'],
        'commitSha': !exists(json, 'commit_sha') ? undefined : json['commit_sha'],
        'name': json['name'],
        'comment': json['comment'],
        'presetId': !exists(json, 'preset_id') ? undefined : json['preset_id'],
        'envVersion': !exists(json, 'env_version') ? undefined : json['env_version'],
        'framework': !exists(json, 'framework') ? undefined : json['framework'],
        'indexDir': !exists(json, 'index_dir') ? undefined : json['index_dir'],
        'runCmd': !exists(json, 'run_cmd') ? undefined : json['run_cmd'],
        'systemDependencies': !exists(json, 'system_dependencies') ? undefined : json['system_dependencies'],
        'projectId': !exists(json, 'project_id') ? undefined : json['project_id'],
        '_configuration': !exists(json, 'configuration') ? undefined : CreateAppV2ConfigurationFromJSON(json['configuration']),
        'language': json['language'],
        'buildEntryPath': !exists(json, 'build_entry_path') ? undefined : json['build_entry_path'],
        'network': !exists(json, 'network') ? undefined : CreateAppV2NetworkFromJSON(json['network']),
        'healthCheck': !exists(json, 'health_check') ? undefined : json['health_check'],
        'globalEnvIds': !exists(json, 'global_env_ids') ? undefined : json['global_env_ids'],
        'dockerImage': !exists(json, 'docker_image') ? undefined : json['docker_image'],
        'dockerImageTag': !exists(json, 'docker_image_tag') ? undefined : json['docker_image_tag'],
        'isRussianTrustedCa': !exists(json, 'is_russian_trusted_ca') ? undefined : json['is_russian_trusted_ca'],
        'isTciTrustedCa': !exists(json, 'is_tci_trusted_ca') ? undefined : json['is_tci_trusted_ca'],
    };
}

export function CreateAppV2ToJSON(value?: CreateAppV2 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'provider_id': value.providerId,
        'type': value.type,
        'repository_id': value.repositoryId,
        'build_cmd': value.buildCmd,
        'envs': value.envs,
        'branch_name': value.branchName,
        'is_auto_deploy': value.isAutoDeploy,
        'commit_sha': value.commitSha,
        'name': value.name,
        'comment': value.comment,
        'preset_id': value.presetId,
        'env_version': value.envVersion,
        'framework': value.framework,
        'index_dir': value.indexDir,
        'run_cmd': value.runCmd,
        'system_dependencies': value.systemDependencies,
        'project_id': value.projectId,
        'configuration': CreateAppV2ConfigurationToJSON(value._configuration),
        'language': value.language,
        'build_entry_path': value.buildEntryPath,
        'network': CreateAppV2NetworkToJSON(value.network),
        'health_check': value.healthCheck,
        'global_env_ids': value.globalEnvIds,
        'docker_image': value.dockerImage,
        'docker_image_tag': value.dockerImageTag,
        'is_russian_trusted_ca': value.isRussianTrustedCa,
        'is_tci_trusted_ca': value.isTciTrustedCa,
    };
}

