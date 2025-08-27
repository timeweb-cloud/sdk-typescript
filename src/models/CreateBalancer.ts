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
import type { Network } from './Network';
import {
    NetworkFromJSON,
    NetworkFromJSONTyped,
    NetworkToJSON,
} from './Network';

/**
 * 
 * @export
 * @interface CreateBalancer
 */
export interface CreateBalancer {
    /**
     * Удобочитаемое имя, установленное для балансировщика. Должно быть уникальным в рамках аккаунта
     * @type {string}
     * @memberof CreateBalancer
     */
    name: string;
    /**
     * Алгоритм переключений балансировщика.
     * @type {string}
     * @memberof CreateBalancer
     */
    algo: CreateBalancerAlgoEnum;
    /**
     * Это логическое значение, которое показывает, сохраняется ли сессия.
     * @type {boolean}
     * @memberof CreateBalancer
     */
    isSticky: boolean;
    /**
     * Это логическое значение, которое показывает, выступает ли балансировщик в качестве прокси.
     * @type {boolean}
     * @memberof CreateBalancer
     */
    isUseProxy: boolean;
    /**
     * Это логическое значение, которое показывает, требуется ли перенаправление на SSL.
     * @type {boolean}
     * @memberof CreateBalancer
     */
    isSsl: boolean;
    /**
     * Это логическое значение, которое показывает, выдает ли балансировщик сигнал о проверке жизнеспособности.
     * @type {boolean}
     * @memberof CreateBalancer
     */
    isKeepalive: boolean;
    /**
     * Протокол.
     * @type {string}
     * @memberof CreateBalancer
     */
    proto: CreateBalancerProtoEnum;
    /**
     * Порт балансировщика.
     * @type {number}
     * @memberof CreateBalancer
     */
    port: number;
    /**
     * Адрес балансировщика.
     * @type {string}
     * @memberof CreateBalancer
     */
    path: string;
    /**
     * Интервал проверки.
     * @type {number}
     * @memberof CreateBalancer
     */
    inter: number;
    /**
     * Таймаут ответа балансировщика.
     * @type {number}
     * @memberof CreateBalancer
     */
    timeout: number;
    /**
     * Порог количества ошибок.
     * @type {number}
     * @memberof CreateBalancer
     */
    fall: number;
    /**
     * Порог количества успешных ответов.
     * @type {number}
     * @memberof CreateBalancer
     */
    rise: number;
    /**
     * Максимальное количество соединений.
     * @type {number}
     * @memberof CreateBalancer
     */
    maxconn?: number;
    /**
     * Таймаут подключения.
     * @type {number}
     * @memberof CreateBalancer
     */
    connectTimeout?: number;
    /**
     * Таймаут клиента.
     * @type {number}
     * @memberof CreateBalancer
     */
    clientTimeout?: number;
    /**
     * Таймаут сервера.
     * @type {number}
     * @memberof CreateBalancer
     */
    serverTimeout?: number;
    /**
     * Таймаут HTTP запроса.
     * @type {number}
     * @memberof CreateBalancer
     */
    httprequestTimeout?: number;
    /**
     * ID тарифа.
     * @type {number}
     * @memberof CreateBalancer
     */
    presetId: number;
    /**
     * 
     * @type {Network}
     * @memberof CreateBalancer
     */
    network?: Network;
    /**
     * 
     * @type {AvailabilityZone}
     * @memberof CreateBalancer
     */
    availabilityZone?: AvailabilityZone;
    /**
     * ID проекта
     * @type {number}
     * @memberof CreateBalancer
     */
    projectId?: number;
}


/**
 * @export
 */
export const CreateBalancerAlgoEnum = {
    Roundrobin: 'roundrobin',
    Leastconn: 'leastconn'
} as const;
export type CreateBalancerAlgoEnum = typeof CreateBalancerAlgoEnum[keyof typeof CreateBalancerAlgoEnum];

/**
 * @export
 */
export const CreateBalancerProtoEnum = {
    Http: 'http',
    Http2: 'http2',
    Https: 'https',
    Tcp: 'tcp'
} as const;
export type CreateBalancerProtoEnum = typeof CreateBalancerProtoEnum[keyof typeof CreateBalancerProtoEnum];


/**
 * Check if a given object implements the CreateBalancer interface.
 */
export function instanceOfCreateBalancer(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "algo" in value;
    isInstance = isInstance && "isSticky" in value;
    isInstance = isInstance && "isUseProxy" in value;
    isInstance = isInstance && "isSsl" in value;
    isInstance = isInstance && "isKeepalive" in value;
    isInstance = isInstance && "proto" in value;
    isInstance = isInstance && "port" in value;
    isInstance = isInstance && "path" in value;
    isInstance = isInstance && "inter" in value;
    isInstance = isInstance && "timeout" in value;
    isInstance = isInstance && "fall" in value;
    isInstance = isInstance && "rise" in value;
    isInstance = isInstance && "presetId" in value;

    return isInstance;
}

export function CreateBalancerFromJSON(json: any): CreateBalancer {
    return CreateBalancerFromJSONTyped(json, false);
}

export function CreateBalancerFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateBalancer {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'algo': json['algo'],
        'isSticky': json['is_sticky'],
        'isUseProxy': json['is_use_proxy'],
        'isSsl': json['is_ssl'],
        'isKeepalive': json['is_keepalive'],
        'proto': json['proto'],
        'port': json['port'],
        'path': json['path'],
        'inter': json['inter'],
        'timeout': json['timeout'],
        'fall': json['fall'],
        'rise': json['rise'],
        'maxconn': !exists(json, 'maxconn') ? undefined : json['maxconn'],
        'connectTimeout': !exists(json, 'connect_timeout') ? undefined : json['connect_timeout'],
        'clientTimeout': !exists(json, 'client_timeout') ? undefined : json['client_timeout'],
        'serverTimeout': !exists(json, 'server_timeout') ? undefined : json['server_timeout'],
        'httprequestTimeout': !exists(json, 'httprequest_timeout') ? undefined : json['httprequest_timeout'],
        'presetId': json['preset_id'],
        'network': !exists(json, 'network') ? undefined : NetworkFromJSON(json['network']),
        'availabilityZone': !exists(json, 'availability_zone') ? undefined : AvailabilityZoneFromJSON(json['availability_zone']),
        'projectId': !exists(json, 'project_id') ? undefined : json['project_id'],
    };
}

export function CreateBalancerToJSON(value?: CreateBalancer | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'algo': value.algo,
        'is_sticky': value.isSticky,
        'is_use_proxy': value.isUseProxy,
        'is_ssl': value.isSsl,
        'is_keepalive': value.isKeepalive,
        'proto': value.proto,
        'port': value.port,
        'path': value.path,
        'inter': value.inter,
        'timeout': value.timeout,
        'fall': value.fall,
        'rise': value.rise,
        'maxconn': value.maxconn,
        'connect_timeout': value.connectTimeout,
        'client_timeout': value.clientTimeout,
        'server_timeout': value.serverTimeout,
        'httprequest_timeout': value.httprequestTimeout,
        'preset_id': value.presetId,
        'network': NetworkToJSON(value.network),
        'availability_zone': AvailabilityZoneToJSON(value.availabilityZone),
        'project_id': value.projectId,
    };
}

