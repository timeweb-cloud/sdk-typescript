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


import * as runtime from '../runtime';
import type {
  CreateDatabaseBackup409Response,
  CreateNetworkDrive,
  CreateNetworkDrive201Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances403Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  GetNetworkDrives200Response,
  GetNetworkDrivesAvailableResources200Response,
  GetNetworkDrivesPresets200Response,
  MountNetworkDrive,
  UpdateNetworkDrive,
} from '../models/index';
import {
    CreateDatabaseBackup409ResponseFromJSON,
    CreateDatabaseBackup409ResponseToJSON,
    CreateNetworkDriveFromJSON,
    CreateNetworkDriveToJSON,
    CreateNetworkDrive201ResponseFromJSON,
    CreateNetworkDrive201ResponseToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances403ResponseFromJSON,
    GetFinances403ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    GetImage404ResponseFromJSON,
    GetImage404ResponseToJSON,
    GetNetworkDrives200ResponseFromJSON,
    GetNetworkDrives200ResponseToJSON,
    GetNetworkDrivesAvailableResources200ResponseFromJSON,
    GetNetworkDrivesAvailableResources200ResponseToJSON,
    GetNetworkDrivesPresets200ResponseFromJSON,
    GetNetworkDrivesPresets200ResponseToJSON,
    MountNetworkDriveFromJSON,
    MountNetworkDriveToJSON,
    UpdateNetworkDriveFromJSON,
    UpdateNetworkDriveToJSON,
} from '../models/index';

export interface CreateNetworkDriveRequest {
    createNetworkDrive: CreateNetworkDrive;
}

export interface DeleteNetworkDriveRequest {
    networkDriveId: string;
}

export interface GetNetworkDriveRequest {
    networkDriveId: string;
}

export interface MountNetworkDriveRequest {
    networkDriveId: string;
    mountNetworkDrive: MountNetworkDrive;
}

export interface UnmountNetworkDriveRequest {
    networkDriveId: string;
}

export interface UpdateNetworkDriveRequest {
    networkDriveId: string;
    updateNetworkDrive: UpdateNetworkDrive;
}

/**
 * 
 */
export class NetworkDrivesApi extends runtime.BaseAPI {

    /**
     * Чтобы создать создать сетевой диск, отправьте POST-запрос в `/api/v1/network-drives`, задав необходимые атрибуты.
     * Создание сетевого диска
     */
    async createNetworkDriveRaw(requestParameters: CreateNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateNetworkDrive201Response>> {
        if (requestParameters.createNetworkDrive === null || requestParameters.createNetworkDrive === undefined) {
            throw new runtime.RequiredError('createNetworkDrive','Required parameter requestParameters.createNetworkDrive was null or undefined when calling createNetworkDrive.');
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
            path: `/api/v1/network-drives`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateNetworkDriveToJSON(requestParameters.createNetworkDrive),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateNetworkDrive201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать создать сетевой диск, отправьте POST-запрос в `/api/v1/network-drives`, задав необходимые атрибуты.
     * Создание сетевого диска
     */
    async createNetworkDrive(requestParameters: CreateNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateNetworkDrive201Response> {
        const response = await this.createNetworkDriveRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить сетевой диск, отправьте DELETE-запрос на `/api/v1/network-drives/{network_drive_id}`
     * Удаление сетевого диска по идентификатору
     */
    async deleteNetworkDriveRaw(requestParameters: DeleteNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.networkDriveId === null || requestParameters.networkDriveId === undefined) {
            throw new runtime.RequiredError('networkDriveId','Required parameter requestParameters.networkDriveId was null or undefined when calling deleteNetworkDrive.');
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
            path: `/api/v1/network-drives/{network_drive_id}`.replace(`{${"network-drive-id"}}`, encodeURIComponent(String(requestParameters.networkDriveId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить сетевой диск, отправьте DELETE-запрос на `/api/v1/network-drives/{network_drive_id}`
     * Удаление сетевого диска по идентификатору
     */
    async deleteNetworkDrive(requestParameters: DeleteNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteNetworkDriveRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отобразить информацию об отдельном сетевом диске, отправьте запрос GET на `api/v1/network-drives/{network_drive_id}`.
     * Получение сетевого диска
     */
    async getNetworkDriveRaw(requestParameters: GetNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateNetworkDrive201Response>> {
        if (requestParameters.networkDriveId === null || requestParameters.networkDriveId === undefined) {
            throw new runtime.RequiredError('networkDriveId','Required parameter requestParameters.networkDriveId was null or undefined when calling getNetworkDrive.');
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
            path: `/api/v1/network-drives/{network_drive_id}`.replace(`{${"network-drive-id"}}`, encodeURIComponent(String(requestParameters.networkDriveId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateNetworkDrive201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отобразить информацию об отдельном сетевом диске, отправьте запрос GET на `api/v1/network-drives/{network_drive_id}`.
     * Получение сетевого диска
     */
    async getNetworkDrive(requestParameters: GetNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateNetworkDrive201Response> {
        const response = await this.getNetworkDriveRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список сетевых дисков, отправьте GET-запрос на `/api/v1/network-drives`.
     * Получение списка cетевых дисков
     */
    async getNetworkDrivesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetNetworkDrives200Response>> {
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
            path: `/api/v1/network-drives`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetNetworkDrives200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список сетевых дисков, отправьте GET-запрос на `/api/v1/network-drives`.
     * Получение списка cетевых дисков
     */
    async getNetworkDrives(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetNetworkDrives200Response> {
        const response = await this.getNetworkDrivesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список сервисов, отправьте GET-запрос на `/api/v1/network-drives/available-resources`.
     * Получение списка сервисов доступных для подключения диска
     */
    async getNetworkDrivesAvailableResourcesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetNetworkDrivesAvailableResources200Response>> {
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
            path: `/api/v1/network-drives/available-resources`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetNetworkDrivesAvailableResources200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список сервисов, отправьте GET-запрос на `/api/v1/network-drives/available-resources`.
     * Получение списка сервисов доступных для подключения диска
     */
    async getNetworkDrivesAvailableResources(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetNetworkDrivesAvailableResources200Response> {
        const response = await this.getNetworkDrivesAvailableResourcesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список тарифов, отправьте GET-запрос на `/api/v1/presets/network-drives`.
     * Получение списка доступных тарифов для сетевого диска
     */
    async getNetworkDrivesPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetNetworkDrivesPresets200Response>> {
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
            path: `/api/v1/presets/network-drives`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetNetworkDrivesPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список тарифов, отправьте GET-запрос на `/api/v1/presets/network-drives`.
     * Получение списка доступных тарифов для сетевого диска
     */
    async getNetworkDrivesPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetNetworkDrivesPresets200Response> {
        const response = await this.getNetworkDrivesPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы подключить сетевой диск к сервису, отправьте POST-запрос на `/api/v1/network-drives/{network_drive_id}/mount`.
     * Подключить сетевой диск к сервису
     */
    async mountNetworkDriveRaw(requestParameters: MountNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.networkDriveId === null || requestParameters.networkDriveId === undefined) {
            throw new runtime.RequiredError('networkDriveId','Required parameter requestParameters.networkDriveId was null or undefined when calling mountNetworkDrive.');
        }

        if (requestParameters.mountNetworkDrive === null || requestParameters.mountNetworkDrive === undefined) {
            throw new runtime.RequiredError('mountNetworkDrive','Required parameter requestParameters.mountNetworkDrive was null or undefined when calling mountNetworkDrive.');
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
            path: `/api/v1/network-drives/{network_drive_id}/mount`.replace(`{${"network-drive-id"}}`, encodeURIComponent(String(requestParameters.networkDriveId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MountNetworkDriveToJSON(requestParameters.mountNetworkDrive),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы подключить сетевой диск к сервису, отправьте POST-запрос на `/api/v1/network-drives/{network_drive_id}/mount`.
     * Подключить сетевой диск к сервису
     */
    async mountNetworkDrive(requestParameters: MountNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.mountNetworkDriveRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отключить сетевой диск от сервиса, отправьте POST-запрос на `/api/v1/network-drives/{network_drive_id}/unmount`.
     * Отключить сетевой диск от сервиса
     */
    async unmountNetworkDriveRaw(requestParameters: UnmountNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.networkDriveId === null || requestParameters.networkDriveId === undefined) {
            throw new runtime.RequiredError('networkDriveId','Required parameter requestParameters.networkDriveId was null or undefined when calling unmountNetworkDrive.');
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
            path: `/api/v1/network-drives/{network_drive_id}/unmount`.replace(`{${"network-drive-id"}}`, encodeURIComponent(String(requestParameters.networkDriveId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отключить сетевой диск от сервиса, отправьте POST-запрос на `/api/v1/network-drives/{network_drive_id}/unmount`.
     * Отключить сетевой диск от сервиса
     */
    async unmountNetworkDrive(requestParameters: UnmountNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.unmountNetworkDriveRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы изменить сетевой диск, отправьте PATCH-запрос на `/api/v1/network-drives/{network_drive_id}`
     * Изменение сетевого диска по ID
     */
    async updateNetworkDriveRaw(requestParameters: UpdateNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateNetworkDrive201Response>> {
        if (requestParameters.networkDriveId === null || requestParameters.networkDriveId === undefined) {
            throw new runtime.RequiredError('networkDriveId','Required parameter requestParameters.networkDriveId was null or undefined when calling updateNetworkDrive.');
        }

        if (requestParameters.updateNetworkDrive === null || requestParameters.updateNetworkDrive === undefined) {
            throw new runtime.RequiredError('updateNetworkDrive','Required parameter requestParameters.updateNetworkDrive was null or undefined when calling updateNetworkDrive.');
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
            path: `/api/v1/network-drives/{network_drive_id}`.replace(`{${"network-drive-id"}}`, encodeURIComponent(String(requestParameters.networkDriveId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateNetworkDriveToJSON(requestParameters.updateNetworkDrive),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateNetworkDrive201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить сетевой диск, отправьте PATCH-запрос на `/api/v1/network-drives/{network_drive_id}`
     * Изменение сетевого диска по ID
     */
    async updateNetworkDrive(requestParameters: UpdateNetworkDriveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateNetworkDrive201Response> {
        const response = await this.updateNetworkDriveRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
