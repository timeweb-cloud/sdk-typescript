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
import type { DomainPaymentPeriod } from './DomainPaymentPeriod';
import {
    DomainPaymentPeriodFromJSON,
    DomainPaymentPeriodFromJSONTyped,
    DomainPaymentPeriodToJSON,
} from './DomainPaymentPeriod';
import type { DomainPrimeType } from './DomainPrimeType';
import {
    DomainPrimeTypeFromJSON,
    DomainPrimeTypeFromJSONTyped,
    DomainPrimeTypeToJSON,
} from './DomainPrimeType';

/**
 * Заявка на продление/регистрацию/трансфер домена.
 * @export
 * @interface DomainRequest
 */
export interface DomainRequest {
    /**
     * ID пользователя
     * @type {string}
     * @memberof DomainRequest
     */
    accountId: string;
    /**
     * Код авторизации для переноса домена.
     * @type {string}
     * @memberof DomainRequest
     */
    authCode: string | null;
    /**
     * Дата создания заявки.
     * @type {Date}
     * @memberof DomainRequest
     */
    date: Date;
    /**
     * Идентификационный номер бандла, в который входит данная заявка (null - если заявка не входит ни в один бандл).
     * @type {string}
     * @memberof DomainRequest
     */
    domainBundleId: string | null;
    /**
     * Код ошибки трансфера домена.
     * @type {string}
     * @memberof DomainRequest
     */
    errorCodeTransfer: string | null;
    /**
     * Полное имя домена.
     * @type {string}
     * @memberof DomainRequest
     */
    fqdn: string;
    /**
     * ID группы доменных зон.
     * @type {number}
     * @memberof DomainRequest
     */
    groupId: number;
    /**
     * ID заявки.
     * @type {number}
     * @memberof DomainRequest
     */
    id: number;
    /**
     * Это логическое значение, которое показывает включена ли услуга "Антиспам" для домена
     * @type {boolean}
     * @memberof DomainRequest
     */
    isAntispamEnabled: boolean;
    /**
     * Это логическое значение, которое показывает, включено ли автопродление домена.
     * @type {boolean}
     * @memberof DomainRequest
     */
    isAutoprolongEnabled: boolean;
    /**
     * Это логическое значение, которое показывает, включено ли скрытие данных администратора домена для whois. Опция недоступна для доменов в зонах .ru и .рф.
     * @type {boolean}
     * @memberof DomainRequest
     */
    isWhoisPrivacyEnabled: boolean;
    /**
     * Информационное сообщение о заявке.
     * @type {string}
     * @memberof DomainRequest
     */
    message: string | null;
    /**
     * Источник (способ) оплаты заявки.
     * @type {string}
     * @memberof DomainRequest
     */
    moneySource: DomainRequestMoneySourceEnum;
    /**
     * 
     * @type {DomainPaymentPeriod}
     * @memberof DomainRequest
     */
    period: DomainPaymentPeriod;
    /**
     * Идентификационный номер персоны для заявки на регистрацию.
     * @type {number}
     * @memberof DomainRequest
     */
    personId: number;
    /**
     * 
     * @type {DomainPrimeType}
     * @memberof DomainRequest
     */
    prime: DomainPrimeType;
    /**
     * Количество дней до конца регистрации домена, за которые мы уведомим о необходимости продления.
     * @type {number}
     * @memberof DomainRequest
     */
    soonExpire: number;
    /**
     * Это значение используется для сортировки доменных зон в панели управления.
     * @type {number}
     * @memberof DomainRequest
     */
    sortOrder: number;
    /**
     * Тип заявки.
     * @type {string}
     * @memberof DomainRequest
     */
    type: DomainRequestTypeEnum;
}


/**
 * @export
 */
export const DomainRequestMoneySourceEnum = {
    Use: 'use',
    Bonus: 'bonus',
    Invoice: 'invoice'
} as const;
export type DomainRequestMoneySourceEnum = typeof DomainRequestMoneySourceEnum[keyof typeof DomainRequestMoneySourceEnum];

/**
 * @export
 */
export const DomainRequestTypeEnum = {
    Request: 'request',
    Prolong: 'prolong',
    Transfer: 'transfer'
} as const;
export type DomainRequestTypeEnum = typeof DomainRequestTypeEnum[keyof typeof DomainRequestTypeEnum];


/**
 * Check if a given object implements the DomainRequest interface.
 */
export function instanceOfDomainRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "accountId" in value;
    isInstance = isInstance && "authCode" in value;
    isInstance = isInstance && "date" in value;
    isInstance = isInstance && "domainBundleId" in value;
    isInstance = isInstance && "errorCodeTransfer" in value;
    isInstance = isInstance && "fqdn" in value;
    isInstance = isInstance && "groupId" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "isAntispamEnabled" in value;
    isInstance = isInstance && "isAutoprolongEnabled" in value;
    isInstance = isInstance && "isWhoisPrivacyEnabled" in value;
    isInstance = isInstance && "message" in value;
    isInstance = isInstance && "moneySource" in value;
    isInstance = isInstance && "period" in value;
    isInstance = isInstance && "personId" in value;
    isInstance = isInstance && "prime" in value;
    isInstance = isInstance && "soonExpire" in value;
    isInstance = isInstance && "sortOrder" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function DomainRequestFromJSON(json: any): DomainRequest {
    return DomainRequestFromJSONTyped(json, false);
}

export function DomainRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): DomainRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accountId': json['account_id'],
        'authCode': json['auth_code'],
        'date': (new Date(json['date'])),
        'domainBundleId': json['domain_bundle_id'],
        'errorCodeTransfer': json['error_code_transfer'],
        'fqdn': json['fqdn'],
        'groupId': json['group_id'],
        'id': json['id'],
        'isAntispamEnabled': json['is_antispam_enabled'],
        'isAutoprolongEnabled': json['is_autoprolong_enabled'],
        'isWhoisPrivacyEnabled': json['is_whois_privacy_enabled'],
        'message': json['message'],
        'moneySource': json['money_source'],
        'period': DomainPaymentPeriodFromJSON(json['period']),
        'personId': json['person_id'],
        'prime': DomainPrimeTypeFromJSON(json['prime']),
        'soonExpire': json['soon_expire'],
        'sortOrder': json['sort_order'],
        'type': json['type'],
    };
}

export function DomainRequestToJSON(value?: DomainRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'account_id': value.accountId,
        'auth_code': value.authCode,
        'date': (value.date.toISOString()),
        'domain_bundle_id': value.domainBundleId,
        'error_code_transfer': value.errorCodeTransfer,
        'fqdn': value.fqdn,
        'group_id': value.groupId,
        'id': value.id,
        'is_antispam_enabled': value.isAntispamEnabled,
        'is_autoprolong_enabled': value.isAutoprolongEnabled,
        'is_whois_privacy_enabled': value.isWhoisPrivacyEnabled,
        'message': value.message,
        'money_source': value.moneySource,
        'period': DomainPaymentPeriodToJSON(value.period),
        'person_id': value.personId,
        'prime': DomainPrimeTypeToJSON(value.prime),
        'soon_expire': value.soonExpire,
        'sort_order': value.sortOrder,
        'type': value.type,
    };
}

