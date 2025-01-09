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
import type { ImageStatus } from './ImageStatus';
import {
    ImageStatusFromJSON,
    ImageStatusFromJSONTyped,
    ImageStatusToJSON,
} from './ImageStatus';
import type { OS } from './OS';
import {
    OSFromJSON,
    OSFromJSONTyped,
    OSToJSON,
} from './OS';

/**
 * 
 * @export
 * @interface Image
 */
export interface Image {
    /**
     * ID образа.
     * @type {string}
     * @memberof Image
     */
    id: string;
    /**
     * 
     * @type {ImageStatus}
     * @memberof Image
     */
    status: ImageStatus;
    /**
     * Значение времени, указанное в комбинированном формате даты и времени ISO8601, которое представляет, когда был создан образ.
     * @type {string}
     * @memberof Image
     */
    createdAt: string;
    /**
     * Значение времени, указанное в комбинированном формате даты и времени ISO8601, которое представляет, когда был удален образ.
     * @type {string}
     * @memberof Image
     */
    deletedAt: string;
    /**
     * Размер физического диска в мегабайтах.
     * @type {number}
     * @memberof Image
     */
    size: number;
    /**
     * Размер виртуального диска в мегабайтах.
     * @type {number}
     * @memberof Image
     */
    virtualSize: number;
    /**
     * Имя образа.
     * @type {string}
     * @memberof Image
     */
    name: string;
    /**
     * Описание образа.
     * @type {string}
     * @memberof Image
     */
    description: string;
    /**
     * ID связанного с образом диска.
     * @type {number}
     * @memberof Image
     */
    diskId: number;
    /**
     * Локация образа.
     * @type {string}
     * @memberof Image
     */
    location: ImageLocationEnum;
    /**
     * 
     * @type {OS}
     * @memberof Image
     */
    os: OS;
    /**
     * Процент создания образа.
     * @type {number}
     * @memberof Image
     */
    progress: number;
    /**
     * Логическое значение, которое показывает, является ли образ кастомным.
     * @type {boolean}
     * @memberof Image
     */
    isCustom: boolean;
    /**
     * Тип образа.
     * @type {string}
     * @memberof Image
     */
    type: ImageTypeEnum;
}


/**
 * @export
 */
export const ImageLocationEnum = {
    Ru1: 'ru-1',
    Ru2: 'ru-2',
    Pl1: 'pl-1',
    Kz1: 'kz-1',
    Nl1: 'nl-1'
} as const;
export type ImageLocationEnum = typeof ImageLocationEnum[keyof typeof ImageLocationEnum];

/**
 * @export
 */
export const ImageTypeEnum = {
    Qcow2: 'qcow2',
    Iso: 'iso'
} as const;
export type ImageTypeEnum = typeof ImageTypeEnum[keyof typeof ImageTypeEnum];


/**
 * Check if a given object implements the Image interface.
 */
export function instanceOfImage(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "deletedAt" in value;
    isInstance = isInstance && "size" in value;
    isInstance = isInstance && "virtualSize" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "diskId" in value;
    isInstance = isInstance && "location" in value;
    isInstance = isInstance && "os" in value;
    isInstance = isInstance && "progress" in value;
    isInstance = isInstance && "isCustom" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function ImageFromJSON(json: any): Image {
    return ImageFromJSONTyped(json, false);
}

export function ImageFromJSONTyped(json: any, ignoreDiscriminator: boolean): Image {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'status': ImageStatusFromJSON(json['status']),
        'createdAt': json['created_at'],
        'deletedAt': json['deleted_at'],
        'size': json['size'],
        'virtualSize': json['virtual_size'],
        'name': json['name'],
        'description': json['description'],
        'diskId': json['disk_id'],
        'location': json['location'],
        'os': OSFromJSON(json['os']),
        'progress': json['progress'],
        'isCustom': json['is_custom'],
        'type': json['type'],
    };
}

export function ImageToJSON(value?: Image | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'status': ImageStatusToJSON(value.status),
        'created_at': value.createdAt,
        'deleted_at': value.deletedAt,
        'size': value.size,
        'virtual_size': value.virtualSize,
        'name': value.name,
        'description': value.description,
        'disk_id': value.diskId,
        'location': value.location,
        'os': OSToJSON(value.os),
        'progress': value.progress,
        'is_custom': value.isCustom,
        'type': value.type,
    };
}
