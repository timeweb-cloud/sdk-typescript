/* tslint:disable */
/* eslint-disable */
/**
 * Timeweb Cloud API
 * # Введение API Timeweb Cloud позволяет вам управлять ресурсами в облаке программным способом с использованием обычных HTTP-запросов.  Множество функций, которые доступны в панели управления Timeweb Cloud, также доступны через API, что позволяет вам автоматизировать ваши собственные сценарии.  В этой документации сперва будет описан общий дизайн и принципы работы API, а после этого конкретные конечные точки. Также будут приведены примеры запросов к ним.   ## Запросы Запросы должны выполняться по протоколу `HTTPS`, чтобы гарантировать шифрование транзакций. Поддерживаются следующие методы запроса: |Метод|Применение| |--- |--- | |GET|Извлекает данные о коллекциях и отдельных ресурсах.| |POST|Для коллекций создает новый ресурс этого типа. Также используется для выполнения действий с конкретным ресурсом.| |PUT|Обновляет существующий ресурс.| |PATCH|Некоторые ресурсы поддерживают частичное обновление, то есть обновление только части атрибутов ресурса, в этом случае вместо метода PUT будет использован PATCH.| |DELETE|Удаляет ресурс.|  Методы `POST`, `PUT` и `PATCH` могут включать объект в тело запроса с типом содержимого `application/json`.  ### Параметры в запросах Некоторые коллекции поддерживают пагинацию, поиск или сортировку в запросах. В параметрах запроса требуется передать: - `limit` — обозначает количество записей, которое необходимо вернуть  - `offset` — указывает на смещение, относительно начала списка  - `search` — позволяет указать набор символов для поиска  - `sort` — можно задать правило сортировки коллекции  ## Ответы Запросы вернут один из следующих кодов состояния ответа HTTP:  |Статус|Описание| |--- |--- | |200 OK|Действие с ресурсом было выполнено успешно.| |201 Created|Ресурс был успешно создан. При этом ресурс может быть как уже готовым к использованию, так и находиться в процессе запуска.| |204 No Content|Действие с ресурсом было выполнено успешно, и ответ не содержит дополнительной информации в теле.| |400 Bad Request|Был отправлен неверный запрос, например, в нем отсутствуют обязательные параметры и т. д. Тело ответа будет содержать дополнительную информацию об ошибке.| |401 Unauthorized|Ошибка аутентификации.| |403 Forbidden|Аутентификация прошла успешно, но недостаточно прав для выполнения действия.| |404 Not Found|Запрашиваемый ресурс не найден.| |409 Conflict|Запрос конфликтует с текущим состоянием.| |423 Locked|Ресурс из запроса заблокирован от применения к нему указанного метода.| |429 Too Many Requests|Был достигнут лимит по количеству запросов в единицу времени.| |500 Internal Server Error|При выполнении запроса произошла какая-то внутренняя ошибка. Чтобы решить эту проблему, лучше всего создать тикет в панели управления.|  ### Структура успешного ответа Все конечные точки будут возвращать данные в формате `JSON`. Ответы на `GET`-запросы будут иметь на верхнем уровне следующую структуру атрибутов:  |Название поля|Тип|Описание| |--- |--- |--- | |[entity_name]|object, object[], string[], number[], boolean|Динамическое поле, которое будет меняться в зависимости от запрашиваемого ресурса и будет содержать все атрибуты, необходимые для описания этого ресурса. Например, при запросе списка баз данных будет возвращаться поле `dbs`, а при запросе конкретного облачного сервера `server`. Для некоторых конечных точек в ответе может возвращаться сразу несколько ресурсов.| |meta|object|Опционально. Объект, который содержит вспомогательную информацию о ресурсе. Чаще всего будет встречаться при запросе коллекций и содержать поле `total`, которое будет указывать на количество элементов в коллекции.| |response_id|string|Опционально. В большинстве случаев в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее. Также вы можете использовать этот идентификатор, чтобы убедиться, что это новый ответ на запрос и результат не был получен из кэша.|  Пример запроса на получение списка SSH-ключей: ```     HTTP/2.0 200 OK     {       \"ssh_keys\":[           {             \"body\":\"ssh-rsa AAAAB3NzaC1sdfghjkOAsBwWhs= example@device.local\",             \"created_at\":\"2021-09-15T19:52:27Z\",             \"expired_at\":null,             \"id\":5297,             \"is_default\":false,             \"name\":\"example@device.local\",             \"used_at\":null,             \"used_by\":[]           }       ],       \"meta\":{           \"total\":1       },       \"response_id\":\"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ### Структура ответа с ошибкой |Название поля|Тип|Описание| |--- |--- |--- | |status_code|number|Короткий числовой идентификатор ошибки.| |error_code|string|Короткий текстовый идентификатор ошибки, который уточняет числовой идентификатор и удобен для программной обработки. Самый простой пример — это код `not_found` для ошибки 404.| |message|string, string[]|Опционально. В большинстве случаев в ответе будет содержаться человекочитаемое подробное описание ошибки или ошибок, которые помогут понять, что нужно исправить.| |response_id|string|Опционально. В большинстве случае в ответе будет содержаться уникальный идентификатор ответа в формате UUIDv4, который однозначно указывает на ваш запрос внутри нашей системы. Если вам потребуется задать вопрос нашей поддержке, приложите к вопросу этот идентификатор — так мы сможем найти ответ на него намного быстрее.|  Пример: ```     HTTP/2.0 403 Forbidden     {       \"status_code\": 403,       \"error_code\":  \"forbidden\",       \"message\":     \"You do not have access for the attempted action\",       \"response_id\": \"94608d15-8672-4eed-8ab6-28bd6fa3cdf7\"     } ```  ## Статусы ресурсов Важно учесть, что при создании большинства ресурсов внутри платформы вам будет сразу возвращен ответ от сервера со статусом `200 OK` или `201 Created` и идентификатором созданного ресурса в теле ответа, но при этом этот ресурс может быть ещё в *состоянии запуска*.  Для того чтобы понять, в каком состоянии сейчас находится ваш ресурс, мы добавили поле `status` в ответ на получение информации о ресурсе.  Список статусов будет отличаться в зависимости от типа ресурса. Увидеть поддерживаемый список статусов вы сможете в описании каждого конкретного ресурса.     ## Ограничение скорости запросов (Rate Limiting) Чтобы обеспечить стабильность для всех пользователей, Timeweb Cloud защищает API от всплесков входящего трафика, анализируя количество запросов c каждого аккаунта к каждой конечной точке.  Если ваше приложение отправляет более 20 запросов в секунду на одну конечную точку, то для этого запроса API может вернуть код состояния HTTP `429 Too Many Requests`.   ## Аутентификация Доступ к API осуществляется с помощью JWT-токена. Токенами можно управлять внутри панели управления Timeweb Cloud в разделе *API и Terraform*.  Токен необходимо передавать в заголовке каждого запроса в формате: ```   Authorization: Bearer $TIMEWEB_CLOUD_TOKEN ```  ## Формат примеров API Примеры в этой документации описаны с помощью `curl`, HTTP-клиента командной строки. На компьютерах `Linux` и `macOS` обычно по умолчанию установлен `curl`, и он доступен для загрузки на всех популярных платформах, включая `Windows`.  Каждый пример разделен на несколько строк символом `\\`, который совместим с `bash`. Типичный пример выглядит так: ```   curl -X PATCH      -H \"Content-Type: application/json\"      -H \"Authorization: Bearer $TIMEWEB_CLOUD_TOKEN\"      -d \'{\"name\":\"Cute Corvus\",\"comment\":\"Development Server\"}\'      \"https://api.timeweb.cloud/api/v1/dedicated/1051\" ``` - Параметр `-X` задает метод запроса. Для согласованности метод будет указан во всех примерах, даже если он явно не требуется для методов `GET`. - Строки `-H` задают требуемые HTTP-заголовки. - Примеры, для которых требуется объект JSON в теле запроса, передают требуемые данные через параметр `-d`.  Чтобы использовать приведенные примеры, не подставляя каждый раз в них свой токен, вы можете добавить токен один раз в переменные окружения в вашей консоли. Например, на `Linux` это можно сделать с помощью команды:  ``` TIMEWEB_CLOUD_TOKEN=\"token\" ```  После этого токен будет автоматически подставляться в ваши запросы.  Обратите внимание, что все значения в этой документации являются примерами. Не полагайтесь на идентификаторы операционных систем, тарифов и т.д., используемые в примерах. Используйте соответствующую конечную точку для получения значений перед созданием ресурсов.   ## Версионирование API построено согласно принципам [семантического версионирования](https://semver.org/lang/ru). Это значит, что мы гарантируем обратную совместимость всех изменений в пределах одной мажорной версии.  Мажорная версия каждой конечной точки обозначается в пути запроса, например, запрос `/api/v1/servers` указывает, что этот метод имеет версию 1.
 *
 * The version of the OpenAPI document: 
 * Contact: info@timeweb.cloud
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Выделенный сервер
 * @export
 * @interface DedicatedServer
 */
export interface DedicatedServer {
    /**
     * Уникальный идентификатор для каждого экземпляра выделенного сервера. Автоматически генерируется при создании.
     * @type {number}
     * @memberof DedicatedServer
     */
    id: number;
    /**
     * Описание параметров процессора выделенного сервера.
     * @type {string}
     * @memberof DedicatedServer
     */
    cpuDescription: string;
    /**
     * Описание параметров жёсткого диска выделенного сервера.
     * @type {string}
     * @memberof DedicatedServer
     */
    hddDescription: string;
    /**
     * Описание ОЗУ выделенного сервера.
     * @type {string}
     * @memberof DedicatedServer
     */
    ramDescription: string;
    /**
     * Значение времени, указанное в комбинированном формате даты и времени ISO8601, которое представляет, когда был создан выделенный сервер.
     * @type {Date}
     * @memberof DedicatedServer
     */
    createdAt: Date;
    /**
     * IP-адрес сетевого интерфейса IPv4.
     * @type {string}
     * @memberof DedicatedServer
     */
    ip: string | null;
    /**
     * IP-адрес сетевого интерфейса IPMI.
     * @type {string}
     * @memberof DedicatedServer
     */
    ipmiIp: string | null;
    /**
     * Логин, используемый для входа в IPMI-консоль.
     * @type {string}
     * @memberof DedicatedServer
     */
    ipmiLogin: string | null;
    /**
     * Пароль, используемый для входа в IPMI-консоль.
     * @type {string}
     * @memberof DedicatedServer
     */
    ipmiPassword: string | null;
    /**
     * IP-адрес сетевого интерфейса IPv6.
     * @type {string}
     * @memberof DedicatedServer
     */
    ipv6: string | null;
    /**
     * Внутренний дополнительный идентификатор сервера.
     * @type {number}
     * @memberof DedicatedServer
     */
    nodeId: number | null;
    /**
     * Удобочитаемое имя, установленное для выделенного сервера.
     * @type {string}
     * @memberof DedicatedServer
     */
    name: string;
    /**
     * Комментарий к выделенному серверу.
     * @type {string}
     * @memberof DedicatedServer
     */
    comment: string;
    /**
     * Пароль для подключения к VNC-консоли выделенного сервера.
     * @type {string}
     * @memberof DedicatedServer
     */
    vncPass: string | null;
    /**
     * Строка состояния, указывающая состояние выделенного сервера. Может быть «installing», «installed», «on» или «off».
     * @type {string}
     * @memberof DedicatedServer
     */
    status: DedicatedServerStatusEnum;
    /**
     * Уникальный идентификатор операционной системы, установленной на выделенный сервер.
     * @type {number}
     * @memberof DedicatedServer
     */
    osId: number | null;
    /**
     * Уникальный идентификатор панели управления, установленной на выделенный сервер.
     * @type {number}
     * @memberof DedicatedServer
     */
    cpId: number | null;
    /**
     * Уникальный идентификатор интернет-канала, установленного на выделенный сервер.
     * @type {number}
     * @memberof DedicatedServer
     */
    bandwidthId: number | null;
    /**
     * Массив уникальных идентификаторов сетевых дисков, подключенных к выделенному серверу.
     * @type {Array<number>}
     * @memberof DedicatedServer
     */
    networkDriveId: Array<number> | null;
    /**
     * Массив уникальных идентификаторов дополнительных IP-адресов, подключенных к выделенному серверу.
     * @type {Array<number>}
     * @memberof DedicatedServer
     */
    additionalIpAddrId: Array<number> | null;
    /**
     * Уникальный идентификатор списка дополнительных услуг выделенного сервера.
     * @type {number}
     * @memberof DedicatedServer
     */
    planId: number | null;
    /**
     * Стоимость выделенного сервера.
     * @type {number}
     * @memberof DedicatedServer
     */
    price: number;
    /**
     * Локация сервера.
     * @type {string}
     * @memberof DedicatedServer
     */
    location: DedicatedServerLocationEnum;
    /**
     * Количество готовых к автоматической выдаче серверов. Если значение равно 0, сервер будет установлен через инженеров.
     * @type {number}
     * @memberof DedicatedServer
     */
    autoinstallReady: number;
}


/**
 * @export
 */
export const DedicatedServerStatusEnum = {
    Installing: 'installing',
    Installed: 'installed',
    On: 'on',
    Off: 'off'
} as const;
export type DedicatedServerStatusEnum = typeof DedicatedServerStatusEnum[keyof typeof DedicatedServerStatusEnum];

/**
 * @export
 */
export const DedicatedServerLocationEnum = {
    Ru1: 'ru-1',
    Pl1: 'pl-1',
    Kz1: 'kz-1'
} as const;
export type DedicatedServerLocationEnum = typeof DedicatedServerLocationEnum[keyof typeof DedicatedServerLocationEnum];


/**
 * Check if a given object implements the DedicatedServer interface.
 */
export function instanceOfDedicatedServer(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "cpuDescription" in value;
    isInstance = isInstance && "hddDescription" in value;
    isInstance = isInstance && "ramDescription" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "ip" in value;
    isInstance = isInstance && "ipmiIp" in value;
    isInstance = isInstance && "ipmiLogin" in value;
    isInstance = isInstance && "ipmiPassword" in value;
    isInstance = isInstance && "ipv6" in value;
    isInstance = isInstance && "nodeId" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "comment" in value;
    isInstance = isInstance && "vncPass" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "osId" in value;
    isInstance = isInstance && "cpId" in value;
    isInstance = isInstance && "bandwidthId" in value;
    isInstance = isInstance && "networkDriveId" in value;
    isInstance = isInstance && "additionalIpAddrId" in value;
    isInstance = isInstance && "planId" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "location" in value;
    isInstance = isInstance && "autoinstallReady" in value;

    return isInstance;
}

export function DedicatedServerFromJSON(json: any): DedicatedServer {
    return DedicatedServerFromJSONTyped(json, false);
}

export function DedicatedServerFromJSONTyped(json: any, ignoreDiscriminator: boolean): DedicatedServer {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'cpuDescription': json['cpu_description'],
        'hddDescription': json['hdd_description'],
        'ramDescription': json['ram_description'],
        'createdAt': (new Date(json['created_at'])),
        'ip': json['ip'],
        'ipmiIp': json['ipmi_ip'],
        'ipmiLogin': json['ipmi_login'],
        'ipmiPassword': json['ipmi_password'],
        'ipv6': json['ipv6'],
        'nodeId': json['node_id'],
        'name': json['name'],
        'comment': json['comment'],
        'vncPass': json['vnc_pass'],
        'status': json['status'],
        'osId': json['os_id'],
        'cpId': json['cp_id'],
        'bandwidthId': json['bandwidth_id'],
        'networkDriveId': json['network_drive_id'],
        'additionalIpAddrId': json['additional_ip_addr_id'],
        'planId': json['plan_id'],
        'price': json['price'],
        'location': json['location'],
        'autoinstallReady': json['autoinstall_ready'],
    };
}

export function DedicatedServerToJSON(value?: DedicatedServer | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'cpu_description': value.cpuDescription,
        'hdd_description': value.hddDescription,
        'ram_description': value.ramDescription,
        'created_at': (value.createdAt.toISOString()),
        'ip': value.ip,
        'ipmi_ip': value.ipmiIp,
        'ipmi_login': value.ipmiLogin,
        'ipmi_password': value.ipmiPassword,
        'ipv6': value.ipv6,
        'node_id': value.nodeId,
        'name': value.name,
        'comment': value.comment,
        'vnc_pass': value.vncPass,
        'status': value.status,
        'os_id': value.osId,
        'cp_id': value.cpId,
        'bandwidth_id': value.bandwidthId,
        'network_drive_id': value.networkDriveId,
        'additional_ip_addr_id': value.additionalIpAddrId,
        'plan_id': value.planId,
        'price': value.price,
        'location': value.location,
        'autoinstall_ready': value.autoinstallReady,
    };
}

