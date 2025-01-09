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
import type { TopLevelDomainAllowedBuyPeriodsInner } from './TopLevelDomainAllowedBuyPeriodsInner';
import {
    TopLevelDomainAllowedBuyPeriodsInnerFromJSON,
    TopLevelDomainAllowedBuyPeriodsInnerFromJSONTyped,
    TopLevelDomainAllowedBuyPeriodsInnerToJSON,
} from './TopLevelDomainAllowedBuyPeriodsInner';

/**
 * Доменная зона.
 * @export
 * @interface TopLevelDomain
 */
export interface TopLevelDomain {
    /**
     * Список доступных периодов для регистрации/продления доменов со стоимостью.
     * @type {Array<TopLevelDomainAllowedBuyPeriodsInner>}
     * @memberof TopLevelDomain
     */
    allowedBuyPeriods: Array<TopLevelDomainAllowedBuyPeriodsInner>;
    /**
     * Количество дней до истечение срока регистрации, когда можно продлять домен.
     * @type {number}
     * @memberof TopLevelDomain
     */
    earlyRenewPeriod: number | null;
    /**
     * Количество дней, которые действует льготный период когда вы ещё можете продлить домен, после окончания его регистрации
     * @type {number}
     * @memberof TopLevelDomain
     */
    gracePeriod: number;
    /**
     * ID доменной зоны.
     * @type {number}
     * @memberof TopLevelDomain
     */
    id: number;
    /**
     * Это логическое значение, которое показывает, опубликована ли доменная зона.
     * @type {boolean}
     * @memberof TopLevelDomain
     */
    isPublished: boolean;
    /**
     * Это логическое значение, которое показывает, зарегистрирована ли доменная зона.
     * @type {boolean}
     * @memberof TopLevelDomain
     */
    isRegistered: boolean;
    /**
     * Это логическое значение, которое показывает, включено ли по умолчанию скрытие данных администратора для доменной зоны.
     * @type {boolean}
     * @memberof TopLevelDomain
     */
    isWhoisPrivacyDefaultEnabled: boolean;
    /**
     * Это логическое значение, которое показывает, доступно ли управление скрытием данных администратора для доменной зоны.
     * @type {boolean}
     * @memberof TopLevelDomain
     */
    isWhoisPrivacyEnabled: boolean;
    /**
     * Имя доменной зоны.
     * @type {string}
     * @memberof TopLevelDomain
     */
    name: string;
    /**
     * Цена регистрации домена
     * @type {number}
     * @memberof TopLevelDomain
     */
    price: number;
    /**
     * Цена продления домена.
     * @type {number}
     * @memberof TopLevelDomain
     */
    prolongPrice: number;
    /**
     * Регистратор доменной зоны.
     * @type {string}
     * @memberof TopLevelDomain
     */
    registrar: TopLevelDomainRegistrarEnum;
    /**
     * Цена услуги трансфера домена.
     * @type {number}
     * @memberof TopLevelDomain
     */
    transfer: number;
    /**
     * Цена услуги скрытия данных администратора для доменной зоны.
     * @type {number}
     * @memberof TopLevelDomain
     */
    whoisPrivacyPrice: number;
}


/**
 * @export
 */
export const TopLevelDomainRegistrarEnum = {
    Nic: 'NIC',
    Pdr: 'PDR',
    R01: 'R01',
    Timeweb: 'timeweb',
    TimewebVirtreg: 'TimewebVirtreg',
    Webnames: 'Webnames',
    Unknown: 'unknown'
} as const;
export type TopLevelDomainRegistrarEnum = typeof TopLevelDomainRegistrarEnum[keyof typeof TopLevelDomainRegistrarEnum];


/**
 * Check if a given object implements the TopLevelDomain interface.
 */
export function instanceOfTopLevelDomain(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "allowedBuyPeriods" in value;
    isInstance = isInstance && "earlyRenewPeriod" in value;
    isInstance = isInstance && "gracePeriod" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "isPublished" in value;
    isInstance = isInstance && "isRegistered" in value;
    isInstance = isInstance && "isWhoisPrivacyDefaultEnabled" in value;
    isInstance = isInstance && "isWhoisPrivacyEnabled" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "prolongPrice" in value;
    isInstance = isInstance && "registrar" in value;
    isInstance = isInstance && "transfer" in value;
    isInstance = isInstance && "whoisPrivacyPrice" in value;

    return isInstance;
}

export function TopLevelDomainFromJSON(json: any): TopLevelDomain {
    return TopLevelDomainFromJSONTyped(json, false);
}

export function TopLevelDomainFromJSONTyped(json: any, ignoreDiscriminator: boolean): TopLevelDomain {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'allowedBuyPeriods': ((json['allowed_buy_periods'] as Array<any>).map(TopLevelDomainAllowedBuyPeriodsInnerFromJSON)),
        'earlyRenewPeriod': json['early_renew_period'],
        'gracePeriod': json['grace_period'],
        'id': json['id'],
        'isPublished': json['is_published'],
        'isRegistered': json['is_registered'],
        'isWhoisPrivacyDefaultEnabled': json['is_whois_privacy_default_enabled'],
        'isWhoisPrivacyEnabled': json['is_whois_privacy_enabled'],
        'name': json['name'],
        'price': json['price'],
        'prolongPrice': json['prolong_price'],
        'registrar': json['registrar'],
        'transfer': json['transfer'],
        'whoisPrivacyPrice': json['whois_privacy_price'],
    };
}

export function TopLevelDomainToJSON(value?: TopLevelDomain | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'allowed_buy_periods': ((value.allowedBuyPeriods as Array<any>).map(TopLevelDomainAllowedBuyPeriodsInnerToJSON)),
        'early_renew_period': value.earlyRenewPeriod,
        'grace_period': value.gracePeriod,
        'id': value.id,
        'is_published': value.isPublished,
        'is_registered': value.isRegistered,
        'is_whois_privacy_default_enabled': value.isWhoisPrivacyDefaultEnabled,
        'is_whois_privacy_enabled': value.isWhoisPrivacyEnabled,
        'name': value.name,
        'price': value.price,
        'prolong_price': value.prolongPrice,
        'registrar': value.registrar,
        'transfer': value.transfer,
        'whois_privacy_price': value.whoisPrivacyPrice,
    };
}

