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


import * as runtime from '../runtime';
import type {
  AddServerIP201Response,
  AddServerIPRequest,
  AutoBackup,
  CreateDatabaseBackup409Response,
  CreateServer,
  CreateServer201Response,
  CreateServerDisk201Response,
  CreateServerDiskBackup201Response,
  CreateServerDiskBackupRequest,
  CreateServerDiskRequest,
  DeleteServer200Response,
  DeleteServerIPRequest,
  GetConfigurators200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances403Response,
  GetFinances404Response,
  GetFinances429Response,
  GetFinances500Response,
  GetOsList200Response,
  GetServerDiskAutoBackupSettings200Response,
  GetServerDiskBackup200Response,
  GetServerDiskBackups200Response,
  GetServerDisks200Response,
  GetServerIPs200Response,
  GetServerLogs200Response,
  GetServerStatistics200Response,
  GetServers200Response,
  GetServersPresets200Response,
  GetSoftware200Response,
  PerformActionOnBackupRequest,
  PerformActionOnServerRequest,
  UpdateServer,
  UpdateServerDiskBackupRequest,
  UpdateServerDiskRequest,
  UpdateServerIPRequest,
  UpdateServerNATRequest,
  UpdateServerOSBootModeRequest,
} from '../models/index';
import {
    AddServerIP201ResponseFromJSON,
    AddServerIP201ResponseToJSON,
    AddServerIPRequestFromJSON,
    AddServerIPRequestToJSON,
    AutoBackupFromJSON,
    AutoBackupToJSON,
    CreateDatabaseBackup409ResponseFromJSON,
    CreateDatabaseBackup409ResponseToJSON,
    CreateServerFromJSON,
    CreateServerToJSON,
    CreateServer201ResponseFromJSON,
    CreateServer201ResponseToJSON,
    CreateServerDisk201ResponseFromJSON,
    CreateServerDisk201ResponseToJSON,
    CreateServerDiskBackup201ResponseFromJSON,
    CreateServerDiskBackup201ResponseToJSON,
    CreateServerDiskBackupRequestFromJSON,
    CreateServerDiskBackupRequestToJSON,
    CreateServerDiskRequestFromJSON,
    CreateServerDiskRequestToJSON,
    DeleteServer200ResponseFromJSON,
    DeleteServer200ResponseToJSON,
    DeleteServerIPRequestFromJSON,
    DeleteServerIPRequestToJSON,
    GetConfigurators200ResponseFromJSON,
    GetConfigurators200ResponseToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances403ResponseFromJSON,
    GetFinances403ResponseToJSON,
    GetFinances404ResponseFromJSON,
    GetFinances404ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    GetOsList200ResponseFromJSON,
    GetOsList200ResponseToJSON,
    GetServerDiskAutoBackupSettings200ResponseFromJSON,
    GetServerDiskAutoBackupSettings200ResponseToJSON,
    GetServerDiskBackup200ResponseFromJSON,
    GetServerDiskBackup200ResponseToJSON,
    GetServerDiskBackups200ResponseFromJSON,
    GetServerDiskBackups200ResponseToJSON,
    GetServerDisks200ResponseFromJSON,
    GetServerDisks200ResponseToJSON,
    GetServerIPs200ResponseFromJSON,
    GetServerIPs200ResponseToJSON,
    GetServerLogs200ResponseFromJSON,
    GetServerLogs200ResponseToJSON,
    GetServerStatistics200ResponseFromJSON,
    GetServerStatistics200ResponseToJSON,
    GetServers200ResponseFromJSON,
    GetServers200ResponseToJSON,
    GetServersPresets200ResponseFromJSON,
    GetServersPresets200ResponseToJSON,
    GetSoftware200ResponseFromJSON,
    GetSoftware200ResponseToJSON,
    PerformActionOnBackupRequestFromJSON,
    PerformActionOnBackupRequestToJSON,
    PerformActionOnServerRequestFromJSON,
    PerformActionOnServerRequestToJSON,
    UpdateServerFromJSON,
    UpdateServerToJSON,
    UpdateServerDiskBackupRequestFromJSON,
    UpdateServerDiskBackupRequestToJSON,
    UpdateServerDiskRequestFromJSON,
    UpdateServerDiskRequestToJSON,
    UpdateServerIPRequestFromJSON,
    UpdateServerIPRequestToJSON,
    UpdateServerNATRequestFromJSON,
    UpdateServerNATRequestToJSON,
    UpdateServerOSBootModeRequestFromJSON,
    UpdateServerOSBootModeRequestToJSON,
} from '../models/index';

export interface AddServerIPOperationRequest {
    serverId: number;
    addServerIPRequest: AddServerIPRequest;
}

export interface CloneServerRequest {
    serverId: number;
}

export interface CreateServerRequest {
    createServer: CreateServer;
}

export interface CreateServerDiskOperationRequest {
    serverId: number;
    createServerDiskRequest?: CreateServerDiskRequest;
}

export interface CreateServerDiskBackupOperationRequest {
    serverId: number;
    diskId: number;
    createServerDiskBackupRequest?: CreateServerDiskBackupRequest;
}

export interface DeleteServerRequest {
    serverId: number;
    hash?: string;
    code?: string;
}

export interface DeleteServerDiskRequest {
    serverId: number;
    diskId: number;
}

export interface DeleteServerDiskBackupRequest {
    serverId: number;
    diskId: number;
    backupId: number;
}

export interface DeleteServerIPOperationRequest {
    serverId: number;
    deleteServerIPRequest: DeleteServerIPRequest;
}

export interface GetServerRequest {
    serverId: number;
}

export interface GetServerDiskRequest {
    serverId: number;
    diskId: number;
}

export interface GetServerDiskAutoBackupSettingsRequest {
    serverId: number;
    diskId: number;
}

export interface GetServerDiskBackupRequest {
    serverId: number;
    diskId: number;
    backupId: number;
}

export interface GetServerDiskBackupsRequest {
    serverId: number;
    diskId: number;
}

export interface GetServerDisksRequest {
    serverId: number;
}

export interface GetServerIPsRequest {
    serverId: number;
}

export interface GetServerLogsRequest {
    serverId: number;
    limit?: number;
    offset?: number;
    order?: GetServerLogsOrderEnum;
}

export interface GetServerStatisticsRequest {
    serverId: number;
    dateFrom: string;
    dateTo: string;
}

export interface GetServersRequest {
    limit?: number;
    offset?: number;
}

export interface HardShutdownServerRequest {
    serverId: number;
}

export interface ImageUnmountAndServerReloadRequest {
    serverId: number;
}

export interface InstallServerRequest {
    serverId: number;
}

export interface PerformActionOnBackupOperationRequest {
    serverId: number;
    diskId: number;
    backupId: number;
    performActionOnBackupRequest?: PerformActionOnBackupRequest;
}

export interface PerformActionOnServerOperationRequest {
    serverId: number;
    performActionOnServerRequest?: PerformActionOnServerRequest;
}

export interface RebootServerRequest {
    serverId: number;
}

export interface ResetServerPasswordRequest {
    serverId: number;
}

export interface ShutdownServerRequest {
    serverId: number;
}

export interface StartServerRequest {
    serverId: number;
}

export interface UpdateServerRequest {
    serverId: number;
    updateServer: UpdateServer;
}

export interface UpdateServerDiskOperationRequest {
    serverId: number;
    diskId: number;
    updateServerDiskRequest?: UpdateServerDiskRequest;
}

export interface UpdateServerDiskAutoBackupSettingsRequest {
    serverId: number;
    diskId: number;
    autoBackup?: AutoBackup;
}

export interface UpdateServerDiskBackupOperationRequest {
    serverId: number;
    diskId: number;
    backupId: number;
    updateServerDiskBackupRequest?: UpdateServerDiskBackupRequest;
}

export interface UpdateServerIPOperationRequest {
    serverId: number;
    updateServerIPRequest: UpdateServerIPRequest;
}

export interface UpdateServerNATOperationRequest {
    serverId: number;
    updateServerNATRequest?: UpdateServerNATRequest;
}

export interface UpdateServerOSBootModeOperationRequest {
    serverId: number;
    updateServerOSBootModeRequest?: UpdateServerOSBootModeRequest;
}

/**
 * 
 */
export class ServersApi extends runtime.BaseAPI {

    /**
     * Чтобы добавить IP-адрес сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/ips`. \\  На данный момент IPv6 доступны только для серверов с локацией `ru-1`.
     * Добавление IP-адреса сервера
     */
    async addServerIPRaw(requestParameters: AddServerIPOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddServerIP201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling addServerIP.');
        }

        if (requestParameters.addServerIPRequest === null || requestParameters.addServerIPRequest === undefined) {
            throw new runtime.RequiredError('addServerIPRequest','Required parameter requestParameters.addServerIPRequest was null or undefined when calling addServerIP.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/ips`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddServerIPRequestToJSON(requestParameters.addServerIPRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddServerIP201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить IP-адрес сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/ips`. \\  На данный момент IPv6 доступны только для серверов с локацией `ru-1`.
     * Добавление IP-адреса сервера
     */
    async addServerIP(requestParameters: AddServerIPOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddServerIP201Response> {
        const response = await this.addServerIPRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы клонировать сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/clone`.
     * Клонирование сервера
     */
    async cloneServerRaw(requestParameters: CloneServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServer201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling cloneServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/clone`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServer201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы клонировать сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/clone`.
     * Клонирование сервера
     */
    async cloneServer(requestParameters: CloneServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServer201Response> {
        const response = await this.cloneServerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать сервер, отправьте POST-запрос в `api/v1/servers`, задав необходимые атрибуты. Обязательно должен присутствовать один из параметров `configuration` или `preset_id`, а также `image_id` или `os_id`.  Cервер будет создан с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданном сервере.
     * Создание сервера
     */
    async createServerRaw(requestParameters: CreateServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServer201Response>> {
        if (requestParameters.createServer === null || requestParameters.createServer === undefined) {
            throw new runtime.RequiredError('createServer','Required parameter requestParameters.createServer was null or undefined when calling createServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateServerToJSON(requestParameters.createServer),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServer201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать сервер, отправьте POST-запрос в `api/v1/servers`, задав необходимые атрибуты. Обязательно должен присутствовать один из параметров `configuration` или `preset_id`, а также `image_id` или `os_id`.  Cервер будет создан с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданном сервере.
     * Создание сервера
     */
    async createServer(requestParameters: CreateServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServer201Response> {
        const response = await this.createServerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать диск сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/disks`. Системный диск создать нельзя.
     * Создание диска сервера
     */
    async createServerDiskRaw(requestParameters: CreateServerDiskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServerDisk201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling createServerDisk.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateServerDiskRequestToJSON(requestParameters.createServerDiskRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServerDisk201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать диск сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/disks`. Системный диск создать нельзя.
     * Создание диска сервера
     */
    async createServerDisk(requestParameters: CreateServerDiskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServerDisk201Response> {
        const response = await this.createServerDiskRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать бэкап диска сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups`.   Тело ответа будет представлять собой объект JSON с ключом `backup`.
     * Создание бэкапа диска сервера
     */
    async createServerDiskBackupRaw(requestParameters: CreateServerDiskBackupOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServerDiskBackup201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling createServerDiskBackup.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling createServerDiskBackup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/backups`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateServerDiskBackupRequestToJSON(requestParameters.createServerDiskBackupRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServerDiskBackup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать бэкап диска сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups`.   Тело ответа будет представлять собой объект JSON с ключом `backup`.
     * Создание бэкапа диска сервера
     */
    async createServerDiskBackup(requestParameters: CreateServerDiskBackupOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServerDiskBackup201Response> {
        const response = await this.createServerDiskBackupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить сервер, отправьте запрос DELETE в `/api/v1/servers/{server_id}`.\\  Обратите внимание, если на аккаунте включено удаление серверов по смс, то вернется ошибка 423.
     * Удаление сервера
     */
    async deleteServerRaw(requestParameters: DeleteServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteServer200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling deleteServer.');
        }

        const queryParameters: any = {};

        if (requestParameters.hash !== undefined) {
            queryParameters['hash'] = requestParameters.hash;
        }

        if (requestParameters.code !== undefined) {
            queryParameters['code'] = requestParameters.code;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteServer200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить сервер, отправьте запрос DELETE в `/api/v1/servers/{server_id}`.\\  Обратите внимание, если на аккаунте включено удаление серверов по смс, то вернется ошибка 423.
     * Удаление сервера
     */
    async deleteServer(requestParameters: DeleteServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteServer200Response> {
        const response = await this.deleteServerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить диск сервера, отправьте DELETE-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}`. Нельзя удалять системный диск.
     * Удаление диска сервера
     */
    async deleteServerDiskRaw(requestParameters: DeleteServerDiskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling deleteServerDisk.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling deleteServerDisk.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить диск сервера, отправьте DELETE-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}`. Нельзя удалять системный диск.
     * Удаление диска сервера
     */
    async deleteServerDisk(requestParameters: DeleteServerDiskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteServerDiskRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить бэкап диска сервера, отправьте DELETE-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.
     * Удаление бэкапа диска сервера
     */
    async deleteServerDiskBackupRaw(requestParameters: DeleteServerDiskBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling deleteServerDiskBackup.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling deleteServerDiskBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling deleteServerDiskBackup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить бэкап диска сервера, отправьте DELETE-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.
     * Удаление бэкапа диска сервера
     */
    async deleteServerDiskBackup(requestParameters: DeleteServerDiskBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteServerDiskBackupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить IP-адрес сервера, отправьте DELETE-запрос на `/api/v1/servers/{server_id}/ips`. Нельзя удалить основной IP-адрес
     * Удаление IP-адреса сервера
     */
    async deleteServerIPRaw(requestParameters: DeleteServerIPOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling deleteServerIP.');
        }

        if (requestParameters.deleteServerIPRequest === null || requestParameters.deleteServerIPRequest === undefined) {
            throw new runtime.RequiredError('deleteServerIPRequest','Required parameter requestParameters.deleteServerIPRequest was null or undefined when calling deleteServerIP.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/ips`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteServerIPRequestToJSON(requestParameters.deleteServerIPRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить IP-адрес сервера, отправьте DELETE-запрос на `/api/v1/servers/{server_id}/ips`. Нельзя удалить основной IP-адрес
     * Удаление IP-адреса сервера
     */
    async deleteServerIP(requestParameters: DeleteServerIPOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteServerIPRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить список всех конфигураторов серверов, отправьте GET-запрос на `/api/v1/configurator/servers`.   Тело ответа будет представлять собой объект JSON с ключом `server_configurators`.
     * Получение списка конфигураторов серверов
     */
    async getConfiguratorsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetConfigurators200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/configurator/servers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetConfigurators200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех конфигураторов серверов, отправьте GET-запрос на `/api/v1/configurator/servers`.   Тело ответа будет представлять собой объект JSON с ключом `server_configurators`.
     * Получение списка конфигураторов серверов
     */
    async getConfigurators(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetConfigurators200Response> {
        const response = await this.getConfiguratorsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех операционных систем, отправьте GET-запрос на `/api/v1/os/servers`.   Тело ответа будет представлять собой объект JSON с ключом `servers_os`.
     * Получение списка операционных систем
     */
    async getOsListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetOsList200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/os/servers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetOsList200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех операционных систем, отправьте GET-запрос на `/api/v1/os/servers`.   Тело ответа будет представлять собой объект JSON с ключом `servers_os`.
     * Получение списка операционных систем
     */
    async getOsList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetOsList200Response> {
        const response = await this.getOsListRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить сервер, отправьте запрос GET в `/api/v1/servers/{server_id}`.
     * Получение сервера
     */
    async getServerRaw(requestParameters: GetServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServer201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServer201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить сервер, отправьте запрос GET в `/api/v1/servers/{server_id}`.
     * Получение сервера
     */
    async getServer(requestParameters: GetServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServer201Response> {
        const response = await this.getServerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить диск сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}`.
     * Получение диска сервера
     */
    async getServerDiskRaw(requestParameters: GetServerDiskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServerDisk201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerDisk.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling getServerDisk.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServerDisk201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить диск сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}`.
     * Получение диска сервера
     */
    async getServerDisk(requestParameters: GetServerDiskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServerDisk201Response> {
        const response = await this.getServerDiskRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы полученить настройки автобэкапов диска сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/auto-backups`.
     * Получить настройки автобэкапов диска сервера
     */
    async getServerDiskAutoBackupSettingsRaw(requestParameters: GetServerDiskAutoBackupSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerDiskAutoBackupSettings200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerDiskAutoBackupSettings.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling getServerDiskAutoBackupSettings.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/auto-backups`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerDiskAutoBackupSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы полученить настройки автобэкапов диска сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/auto-backups`.
     * Получить настройки автобэкапов диска сервера
     */
    async getServerDiskAutoBackupSettings(requestParameters: GetServerDiskAutoBackupSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerDiskAutoBackupSettings200Response> {
        const response = await this.getServerDiskAutoBackupSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить бэкап диска сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.   Тело ответа будет представлять собой объект JSON с ключом `backup`.
     * Получение бэкапа диска сервера
     */
    async getServerDiskBackupRaw(requestParameters: GetServerDiskBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerDiskBackup200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerDiskBackup.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling getServerDiskBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling getServerDiskBackup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerDiskBackup200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить бэкап диска сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.   Тело ответа будет представлять собой объект JSON с ключом `backup`.
     * Получение бэкапа диска сервера
     */
    async getServerDiskBackup(requestParameters: GetServerDiskBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerDiskBackup200Response> {
        const response = await this.getServerDiskBackupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список бэкапов диска сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups`.   Тело ответа будет представлять собой объект JSON с ключом `backups`.
     * Получение списка бэкапов диска сервера
     */
    async getServerDiskBackupsRaw(requestParameters: GetServerDiskBackupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerDiskBackups200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerDiskBackups.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling getServerDiskBackups.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/backups`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerDiskBackups200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список бэкапов диска сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups`.   Тело ответа будет представлять собой объект JSON с ключом `backups`.
     * Получение списка бэкапов диска сервера
     */
    async getServerDiskBackups(requestParameters: GetServerDiskBackupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerDiskBackups200Response> {
        const response = await this.getServerDiskBackupsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список дисков сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks`.
     * Получение списка дисков сервера
     */
    async getServerDisksRaw(requestParameters: GetServerDisksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerDisks200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerDisks.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerDisks200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список дисков сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/disks`.
     * Получение списка дисков сервера
     */
    async getServerDisks(requestParameters: GetServerDisksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerDisks200Response> {
        const response = await this.getServerDisksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список IP-адресов сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/ips`. \\  На данный момент IPv6 доступны только для локации `ru-1`.
     * Получение списка IP-адресов сервера
     */
    async getServerIPsRaw(requestParameters: GetServerIPsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerIPs200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerIPs.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/ips`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerIPs200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список IP-адресов сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/ips`. \\  На данный момент IPv6 доступны только для локации `ru-1`.
     * Получение списка IP-адресов сервера
     */
    async getServerIPs(requestParameters: GetServerIPsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerIPs200Response> {
        const response = await this.getServerIPsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список логов сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/logs`.
     * Получение списка логов сервера
     */
    async getServerLogsRaw(requestParameters: GetServerLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerLogs200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerLogs.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.order !== undefined) {
            queryParameters['order'] = requestParameters.order;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/logs`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerLogs200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список логов сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/logs`.
     * Получение списка логов сервера
     */
    async getServerLogs(requestParameters: GetServerLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerLogs200Response> {
        const response = await this.getServerLogsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статистику сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/statistics`.
     * Получение статистики сервера
     */
    async getServerStatisticsRaw(requestParameters: GetServerStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerStatistics200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling getServerStatistics.');
        }

        if (requestParameters.dateFrom === null || requestParameters.dateFrom === undefined) {
            throw new runtime.RequiredError('dateFrom','Required parameter requestParameters.dateFrom was null or undefined when calling getServerStatistics.');
        }

        if (requestParameters.dateTo === null || requestParameters.dateTo === undefined) {
            throw new runtime.RequiredError('dateTo','Required parameter requestParameters.dateTo was null or undefined when calling getServerStatistics.');
        }

        const queryParameters: any = {};

        if (requestParameters.dateFrom !== undefined) {
            queryParameters['date_from'] = requestParameters.dateFrom;
        }

        if (requestParameters.dateTo !== undefined) {
            queryParameters['date_to'] = requestParameters.dateTo;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/statistics`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerStatistics200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статистику сервера, отправьте GET-запрос на `/api/v1/servers/{server_id}/statistics`.
     * Получение статистики сервера
     */
    async getServerStatistics(requestParameters: GetServerStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerStatistics200Response> {
        const response = await this.getServerStatisticsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список серверов, отправьте GET-запрос на `/api/v1/servers`.   Тело ответа будет представлять собой объект JSON с ключом `servers`.
     * Получение списка серверов
     */
    async getServersRaw(requestParameters: GetServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServers200Response>> {
        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список серверов, отправьте GET-запрос на `/api/v1/servers`.   Тело ответа будет представлять собой объект JSON с ключом `servers`.
     * Получение списка серверов
     */
    async getServers(requestParameters: GetServersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServers200Response> {
        const response = await this.getServersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех тарифов серверов, отправьте GET-запрос на `/api/v1/presets/servers`.   Тело ответа будет представлять собой объект JSON с ключом `server_presets`.
     * Получение списка тарифов серверов
     */
    async getServersPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServersPresets200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/presets/servers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServersPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех тарифов серверов, отправьте GET-запрос на `/api/v1/presets/servers`.   Тело ответа будет представлять собой объект JSON с ключом `server_presets`.
     * Получение списка тарифов серверов
     */
    async getServersPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServersPresets200Response> {
        const response = await this.getServersPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список ПО из маркетплейса, отправьте GET-запрос на `/api/v1/software/servers`.   Тело ответа будет представлять собой объект JSON с ключом `servers_software`.
     * Получение списка ПО из маркетплейса
     */
    async getSoftwareRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetSoftware200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/software/servers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetSoftware200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список ПО из маркетплейса, отправьте GET-запрос на `/api/v1/software/servers`.   Тело ответа будет представлять собой объект JSON с ключом `servers_software`.
     * Получение списка ПО из маркетплейса
     */
    async getSoftware(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetSoftware200Response> {
        const response = await this.getSoftwareRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы выполнить принудительное выключение сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/hard-shutdown`.
     * Принудительное выключение сервера
     */
    async hardShutdownServerRaw(requestParameters: HardShutdownServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling hardShutdownServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/hard-shutdown`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы выполнить принудительное выключение сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/hard-shutdown`.
     * Принудительное выключение сервера
     */
    async hardShutdownServer(requestParameters: HardShutdownServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.hardShutdownServerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отмонтировать ISO образ и перезагрузить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/image-unmount`.
     * Отмонтирование ISO образа и перезагрузка сервера
     */
    async imageUnmountAndServerReloadRaw(requestParameters: ImageUnmountAndServerReloadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling imageUnmountAndServerReload.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/image-unmount`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отмонтировать ISO образ и перезагрузить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/image-unmount`.
     * Отмонтирование ISO образа и перезагрузка сервера
     */
    async imageUnmountAndServerReload(requestParameters: ImageUnmountAndServerReloadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.imageUnmountAndServerReloadRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы установить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/install`.
     * Установка сервера
     */
    async installServerRaw(requestParameters: InstallServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling installServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/install`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы установить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/install`.
     * Установка сервера
     */
    async installServer(requestParameters: InstallServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.installServerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы выполнить действие над бэкапом диска сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}/action`.
     * Выполнение действия над бэкапом диска сервера
     */
    async performActionOnBackupRaw(requestParameters: PerformActionOnBackupOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling performActionOnBackup.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling performActionOnBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling performActionOnBackup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}/action`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PerformActionOnBackupRequestToJSON(requestParameters.performActionOnBackupRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы выполнить действие над бэкапом диска сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}/action`.
     * Выполнение действия над бэкапом диска сервера
     */
    async performActionOnBackup(requestParameters: PerformActionOnBackupOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.performActionOnBackupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы выполнить действие над сервером, отправьте POST-запрос на `/api/v1/servers/{server_id}/action`.
     * Выполнение действия над сервером
     */
    async performActionOnServerRaw(requestParameters: PerformActionOnServerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling performActionOnServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/action`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PerformActionOnServerRequestToJSON(requestParameters.performActionOnServerRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы выполнить действие над сервером, отправьте POST-запрос на `/api/v1/servers/{server_id}/action`.
     * Выполнение действия над сервером
     */
    async performActionOnServer(requestParameters: PerformActionOnServerOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.performActionOnServerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы перезагрузить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/reboot`.
     * Перезагрузка сервера
     */
    async rebootServerRaw(requestParameters: RebootServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling rebootServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/reboot`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы перезагрузить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/reboot`.
     * Перезагрузка сервера
     */
    async rebootServer(requestParameters: RebootServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.rebootServerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы сбросить пароль сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/reset-password`.
     * Сброс пароля сервера
     */
    async resetServerPasswordRaw(requestParameters: ResetServerPasswordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling resetServerPassword.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/reset-password`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы сбросить пароль сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/reset-password`.
     * Сброс пароля сервера
     */
    async resetServerPassword(requestParameters: ResetServerPasswordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.resetServerPasswordRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы выключить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/shutdown`.
     * Выключение сервера
     */
    async shutdownServerRaw(requestParameters: ShutdownServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling shutdownServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/shutdown`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы выключить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/shutdown`.
     * Выключение сервера
     */
    async shutdownServer(requestParameters: ShutdownServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.shutdownServerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы запустить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/start`.
     * Запуск сервера
     */
    async startServerRaw(requestParameters: StartServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling startServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/start`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы запустить сервер, отправьте POST-запрос на `/api/v1/servers/{server_id}/start`.
     * Запуск сервера
     */
    async startServer(requestParameters: StartServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.startServerRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы обновить только определенные атрибуты сервера, отправьте запрос PATCH в `/api/v1/servers/{server_id}`.
     * Изменение сервера
     */
    async updateServerRaw(requestParameters: UpdateServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServer201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling updateServer.');
        }

        if (requestParameters.updateServer === null || requestParameters.updateServer === undefined) {
            throw new runtime.RequiredError('updateServer','Required parameter requestParameters.updateServer was null or undefined when calling updateServer.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateServerToJSON(requestParameters.updateServer),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServer201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить только определенные атрибуты сервера, отправьте запрос PATCH в `/api/v1/servers/{server_id}`.
     * Изменение сервера
     */
    async updateServer(requestParameters: UpdateServerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServer201Response> {
        const response = await this.updateServerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить параметры диска сервера, отправьте PATCH-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}`.
     * Изменение параметров диска сервера
     */
    async updateServerDiskRaw(requestParameters: UpdateServerDiskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateServerDisk201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling updateServerDisk.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling updateServerDisk.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateServerDiskRequestToJSON(requestParameters.updateServerDiskRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateServerDisk201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить параметры диска сервера, отправьте PATCH-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}`.
     * Изменение параметров диска сервера
     */
    async updateServerDisk(requestParameters: UpdateServerDiskOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateServerDisk201Response> {
        const response = await this.updateServerDiskRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить настройки автобэкапов диска сервера, отправьте PATCH-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/auto-backups`.
     * Изменение настроек автобэкапов диска сервера
     */
    async updateServerDiskAutoBackupSettingsRaw(requestParameters: UpdateServerDiskAutoBackupSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerDiskAutoBackupSettings200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling updateServerDiskAutoBackupSettings.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling updateServerDiskAutoBackupSettings.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/auto-backups`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: AutoBackupToJSON(requestParameters.autoBackup),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerDiskAutoBackupSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить настройки автобэкапов диска сервера, отправьте PATCH-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/auto-backups`.
     * Изменение настроек автобэкапов диска сервера
     */
    async updateServerDiskAutoBackupSettings(requestParameters: UpdateServerDiskAutoBackupSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerDiskAutoBackupSettings200Response> {
        const response = await this.updateServerDiskAutoBackupSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить бэкап диска сервера, отправьте PATCH-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.
     * Изменение бэкапа диска сервера
     */
    async updateServerDiskBackupRaw(requestParameters: UpdateServerDiskBackupOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerDiskBackup200Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling updateServerDiskBackup.');
        }

        if (requestParameters.diskId === null || requestParameters.diskId === undefined) {
            throw new runtime.RequiredError('diskId','Required parameter requestParameters.diskId was null or undefined when calling updateServerDiskBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling updateServerDiskBackup.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))).replace(`{${"disk_id"}}`, encodeURIComponent(String(requestParameters.diskId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateServerDiskBackupRequestToJSON(requestParameters.updateServerDiskBackupRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerDiskBackup200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить бэкап диска сервера, отправьте PATCH-запрос на `/api/v1/servers/{server_id}/disks/{disk_id}/backups/{backup_id}`.
     * Изменение бэкапа диска сервера
     */
    async updateServerDiskBackup(requestParameters: UpdateServerDiskBackupOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerDiskBackup200Response> {
        const response = await this.updateServerDiskBackupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить IP-адрес сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/ips`.
     * Изменение IP-адреса сервера
     */
    async updateServerIPRaw(requestParameters: UpdateServerIPOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddServerIP201Response>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling updateServerIP.');
        }

        if (requestParameters.updateServerIPRequest === null || requestParameters.updateServerIPRequest === undefined) {
            throw new runtime.RequiredError('updateServerIPRequest','Required parameter requestParameters.updateServerIPRequest was null or undefined when calling updateServerIP.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/ips`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateServerIPRequestToJSON(requestParameters.updateServerIPRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddServerIP201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить IP-адрес сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/ips`.
     * Изменение IP-адреса сервера
     */
    async updateServerIP(requestParameters: UpdateServerIPOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddServerIP201Response> {
        const response = await this.updateServerIPRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы измененить правила маршрутизации трафика сервера (NAT), отправьте PATCH-запрос на `/api/v1/servers/{server_id}/local-networks/nat-mode`.
     * Изменение правил маршрутизации трафика сервера (NAT)
     */
    async updateServerNATRaw(requestParameters: UpdateServerNATOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling updateServerNAT.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/local-networks/nat-mode`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateServerNATRequestToJSON(requestParameters.updateServerNATRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы измененить правила маршрутизации трафика сервера (NAT), отправьте PATCH-запрос на `/api/v1/servers/{server_id}/local-networks/nat-mode`.
     * Изменение правил маршрутизации трафика сервера (NAT)
     */
    async updateServerNAT(requestParameters: UpdateServerNATOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateServerNATRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы изменить тип загрузки операционной системы сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/boot-mode`. \\  После смены типа загрузки сервер будет перезапущен.
     * Выбор типа загрузки операционной системы сервера
     */
    async updateServerOSBootModeRaw(requestParameters: UpdateServerOSBootModeOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.serverId === null || requestParameters.serverId === undefined) {
            throw new runtime.RequiredError('serverId','Required parameter requestParameters.serverId was null or undefined when calling updateServerOSBootMode.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/servers/{server_id}/boot-mode`.replace(`{${"server_id"}}`, encodeURIComponent(String(requestParameters.serverId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateServerOSBootModeRequestToJSON(requestParameters.updateServerOSBootModeRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы изменить тип загрузки операционной системы сервера, отправьте POST-запрос на `/api/v1/servers/{server_id}/boot-mode`. \\  После смены типа загрузки сервер будет перезапущен.
     * Выбор типа загрузки операционной системы сервера
     */
    async updateServerOSBootMode(requestParameters: UpdateServerOSBootModeOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateServerOSBootModeRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const GetServerLogsOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetServerLogsOrderEnum = typeof GetServerLogsOrderEnum[keyof typeof GetServerLogsOrderEnum];
