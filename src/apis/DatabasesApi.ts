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
  AutoBackup,
  CreateAdmin,
  CreateCluster,
  CreateDatabase201Response,
  CreateDatabaseBackup201Response,
  CreateDatabaseBackup409Response,
  CreateDatabaseCluster201Response,
  CreateDatabaseInstance201Response,
  CreateDatabaseUser201Response,
  CreateDb,
  CreateInstance,
  DeleteDatabase200Response,
  DeleteDatabaseCluster200Response,
  GetAccountStatus403Response,
  GetDatabaseAutoBackupsSettings200Response,
  GetDatabaseBackups200Response,
  GetDatabaseClusterTypes200Response,
  GetDatabaseClusters200Response,
  GetDatabaseInstances200Response,
  GetDatabaseUsers200Response,
  GetDatabases200Response,
  GetDatabasesPresets200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  UpdateAdmin,
  UpdateCluster,
  UpdateDb,
  UpdateInstance,
} from '../models/index';
import {
    AutoBackupFromJSON,
    AutoBackupToJSON,
    CreateAdminFromJSON,
    CreateAdminToJSON,
    CreateClusterFromJSON,
    CreateClusterToJSON,
    CreateDatabase201ResponseFromJSON,
    CreateDatabase201ResponseToJSON,
    CreateDatabaseBackup201ResponseFromJSON,
    CreateDatabaseBackup201ResponseToJSON,
    CreateDatabaseBackup409ResponseFromJSON,
    CreateDatabaseBackup409ResponseToJSON,
    CreateDatabaseCluster201ResponseFromJSON,
    CreateDatabaseCluster201ResponseToJSON,
    CreateDatabaseInstance201ResponseFromJSON,
    CreateDatabaseInstance201ResponseToJSON,
    CreateDatabaseUser201ResponseFromJSON,
    CreateDatabaseUser201ResponseToJSON,
    CreateDbFromJSON,
    CreateDbToJSON,
    CreateInstanceFromJSON,
    CreateInstanceToJSON,
    DeleteDatabase200ResponseFromJSON,
    DeleteDatabase200ResponseToJSON,
    DeleteDatabaseCluster200ResponseFromJSON,
    DeleteDatabaseCluster200ResponseToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetDatabaseAutoBackupsSettings200ResponseFromJSON,
    GetDatabaseAutoBackupsSettings200ResponseToJSON,
    GetDatabaseBackups200ResponseFromJSON,
    GetDatabaseBackups200ResponseToJSON,
    GetDatabaseClusterTypes200ResponseFromJSON,
    GetDatabaseClusterTypes200ResponseToJSON,
    GetDatabaseClusters200ResponseFromJSON,
    GetDatabaseClusters200ResponseToJSON,
    GetDatabaseInstances200ResponseFromJSON,
    GetDatabaseInstances200ResponseToJSON,
    GetDatabaseUsers200ResponseFromJSON,
    GetDatabaseUsers200ResponseToJSON,
    GetDatabases200ResponseFromJSON,
    GetDatabases200ResponseToJSON,
    GetDatabasesPresets200ResponseFromJSON,
    GetDatabasesPresets200ResponseToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    GetImage404ResponseFromJSON,
    GetImage404ResponseToJSON,
    UpdateAdminFromJSON,
    UpdateAdminToJSON,
    UpdateClusterFromJSON,
    UpdateClusterToJSON,
    UpdateDbFromJSON,
    UpdateDbToJSON,
    UpdateInstanceFromJSON,
    UpdateInstanceToJSON,
} from '../models/index';

export interface CreateDatabaseRequest {
    createDb: CreateDb;
}

export interface CreateDatabaseBackupRequest {
    dbId: number;
    comment?: string;
}

export interface CreateDatabaseClusterRequest {
    createCluster: CreateCluster;
}

export interface CreateDatabaseInstanceRequest {
    dbClusterId: number;
    createInstance: CreateInstance;
}

export interface CreateDatabaseUserRequest {
    dbClusterId: number;
    createAdmin: CreateAdmin;
}

export interface DeleteDatabaseRequest {
    dbId: number;
    hash?: string;
    code?: string;
}

export interface DeleteDatabaseBackupRequest {
    dbId: number;
    backupId: number;
}

export interface DeleteDatabaseClusterRequest {
    dbClusterId: number;
    hash?: string;
    code?: string;
}

export interface DeleteDatabaseInstanceRequest {
    dbClusterId: number;
    instanceId: number;
}

export interface DeleteDatabaseUserRequest {
    dbClusterId: number;
    adminId: number;
}

export interface GetDatabaseRequest {
    dbId: number;
}

export interface GetDatabaseAutoBackupsSettingsRequest {
    dbId: number;
}

export interface GetDatabaseBackupRequest {
    dbId: number;
    backupId: number;
}

export interface GetDatabaseBackupsRequest {
    dbId: number;
    limit?: number;
    offset?: number;
}

export interface GetDatabaseClusterRequest {
    dbClusterId: number;
}

export interface GetDatabaseClustersRequest {
    limit?: number;
    offset?: number;
}

export interface GetDatabaseInstanceRequest {
    dbClusterId: number;
    instanceId: number;
}

export interface GetDatabaseInstancesRequest {
    dbClusterId: number;
}

export interface GetDatabaseUserRequest {
    dbClusterId: number;
    adminId: number;
}

export interface GetDatabaseUsersRequest {
    dbClusterId: number;
}

export interface GetDatabasesRequest {
    limit?: number;
    offset?: number;
}

export interface RestoreDatabaseFromBackupRequest {
    dbId: number;
    backupId: number;
}

export interface UpdateDatabaseRequest {
    dbId: number;
    updateDb: UpdateDb;
}

export interface UpdateDatabaseAutoBackupsSettingsRequest {
    dbId: number;
    autoBackup?: AutoBackup;
}

export interface UpdateDatabaseClusterRequest {
    dbClusterId: number;
    updateCluster: UpdateCluster;
}

export interface UpdateDatabaseInstanceRequest {
    dbClusterId: number;
    updateInstance: UpdateInstance;
}

export interface UpdateDatabaseUserRequest {
    dbClusterId: number;
    adminId: number;
    updateAdmin: UpdateAdmin;
}

/**
 * 
 */
export class DatabasesApi extends runtime.BaseAPI {

    /**
     * Чтобы создать базу данных на вашем аккаунте, отправьте POST-запрос на `/api/v1/dbs`, задав необходимые атрибуты.  База данных будет создана с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданной базе данных.
     * Создание базы данных
     */
    async createDatabaseRaw(requestParameters: CreateDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabase201Response>> {
        if (requestParameters.createDb === null || requestParameters.createDb === undefined) {
            throw new runtime.RequiredError('createDb','Required parameter requestParameters.createDb was null or undefined when calling createDatabase.');
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
            path: `/api/v1/dbs`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateDbToJSON(requestParameters.createDb),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabase201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать базу данных на вашем аккаунте, отправьте POST-запрос на `/api/v1/dbs`, задав необходимые атрибуты.  База данных будет создана с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданной базе данных.
     * Создание базы данных
     */
    async createDatabase(requestParameters: CreateDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabase201Response> {
        const response = await this.createDatabaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать бэкап базы данных, отправьте запрос POST в `api/v1/dbs/{db_id}/backups`. 
     * Создание бэкапа базы данных
     */
    async createDatabaseBackupRaw(requestParameters: CreateDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseBackup201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling createDatabaseBackup.');
        }

        const queryParameters: any = {};

        if (requestParameters.comment !== undefined) {
            queryParameters['comment'] = requestParameters.comment;
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
            path: `/api/v1/dbs/{db_id}/backups`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseBackup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать бэкап базы данных, отправьте запрос POST в `api/v1/dbs/{db_id}/backups`. 
     * Создание бэкапа базы данных
     */
    async createDatabaseBackup(requestParameters: CreateDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseBackup201Response> {
        const response = await this.createDatabaseBackupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать кластер базы данных на вашем аккаунте, отправьте POST-запрос на `/api/v1/databases`.   Вместе с кластером будет создан один инстанс базы данных и один пользователь.
     * Создание кластера базы данных
     */
    async createDatabaseClusterRaw(requestParameters: CreateDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseCluster201Response>> {
        if (requestParameters.createCluster === null || requestParameters.createCluster === undefined) {
            throw new runtime.RequiredError('createCluster','Required parameter requestParameters.createCluster was null or undefined when calling createDatabaseCluster.');
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
            path: `/api/v1/databases`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateClusterToJSON(requestParameters.createCluster),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseCluster201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать кластер базы данных на вашем аккаунте, отправьте POST-запрос на `/api/v1/databases`.   Вместе с кластером будет создан один инстанс базы данных и один пользователь.
     * Создание кластера базы данных
     */
    async createDatabaseCluster(requestParameters: CreateDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseCluster201Response> {
        const response = await this.createDatabaseClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать инстанс базы данных, отправьте POST-запрос на `/api/v1/databases/{db_cluster_id}/instances`.\\    Существующие пользователи не будут иметь доступа к новой базе данных после создания. Вы можете изменить привилегии для пользователя через <a href=\'#tag/Bazy-dannyh/operation/updateDatabaseUser\'>метод изменения пользователя</a> 
     * Создание инстанса базы данных
     */
    async createDatabaseInstanceRaw(requestParameters: CreateDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseInstance201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling createDatabaseInstance.');
        }

        if (requestParameters.createInstance === null || requestParameters.createInstance === undefined) {
            throw new runtime.RequiredError('createInstance','Required parameter requestParameters.createInstance was null or undefined when calling createDatabaseInstance.');
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
            path: `/api/v1/databases/{db_cluster_id}/instances`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateInstanceToJSON(requestParameters.createInstance),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseInstance201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать инстанс базы данных, отправьте POST-запрос на `/api/v1/databases/{db_cluster_id}/instances`.\\    Существующие пользователи не будут иметь доступа к новой базе данных после создания. Вы можете изменить привилегии для пользователя через <a href=\'#tag/Bazy-dannyh/operation/updateDatabaseUser\'>метод изменения пользователя</a> 
     * Создание инстанса базы данных
     */
    async createDatabaseInstance(requestParameters: CreateDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseInstance201Response> {
        const response = await this.createDatabaseInstanceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать пользователя базы данных, отправьте POST-запрос на `/api/v1/databases/{db_cluster_id}/admins`.
     * Создание пользователя базы данных
     */
    async createDatabaseUserRaw(requestParameters: CreateDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseUser201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling createDatabaseUser.');
        }

        if (requestParameters.createAdmin === null || requestParameters.createAdmin === undefined) {
            throw new runtime.RequiredError('createAdmin','Required parameter requestParameters.createAdmin was null or undefined when calling createDatabaseUser.');
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
            path: `/api/v1/databases/{db_cluster_id}/admins`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAdminToJSON(requestParameters.createAdmin),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseUser201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать пользователя базы данных, отправьте POST-запрос на `/api/v1/databases/{db_cluster_id}/admins`.
     * Создание пользователя базы данных
     */
    async createDatabaseUser(requestParameters: CreateDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseUser201Response> {
        const response = await this.createDatabaseUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить базу данных, отправьте запрос DELETE в `api/v1/dbs/{db_id}`. 
     * Удаление базы данных
     */
    async deleteDatabaseRaw(requestParameters: DeleteDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteDatabase200Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling deleteDatabase.');
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
            path: `/api/v1/dbs/{db_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteDatabase200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить базу данных, отправьте запрос DELETE в `api/v1/dbs/{db_id}`. 
     * Удаление базы данных
     */
    async deleteDatabase(requestParameters: DeleteDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteDatabase200Response> {
        const response = await this.deleteDatabaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить бэкап базы данных, отправьте запрос DELETE в `api/v1/dbs/{db_id}/backups/{backup_id}`. 
     * Удаление бэкапа базы данных
     */
    async deleteDatabaseBackupRaw(requestParameters: DeleteDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling deleteDatabaseBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling deleteDatabaseBackup.');
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
            path: `/api/v1/dbs/{db_id}/backups/{backup_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить бэкап базы данных, отправьте запрос DELETE в `api/v1/dbs/{db_id}/backups/{backup_id}`. 
     * Удаление бэкапа базы данных
     */
    async deleteDatabaseBackup(requestParameters: DeleteDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDatabaseBackupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить кластер базы данных, отправьте DELETE-запрос на `/api/v1/databases/{db_cluster_id}`.
     * Удаление кластера базы данных
     */
    async deleteDatabaseClusterRaw(requestParameters: DeleteDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteDatabaseCluster200Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling deleteDatabaseCluster.');
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
            path: `/api/v1/databases/{db_cluster_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteDatabaseCluster200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить кластер базы данных, отправьте DELETE-запрос на `/api/v1/databases/{db_cluster_id}`.
     * Удаление кластера базы данных
     */
    async deleteDatabaseCluster(requestParameters: DeleteDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteDatabaseCluster200Response> {
        const response = await this.deleteDatabaseClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить инстанс базы данных, отправьте DELETE-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.
     * Удаление инстанса базы данных
     */
    async deleteDatabaseInstanceRaw(requestParameters: DeleteDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling deleteDatabaseInstance.');
        }

        if (requestParameters.instanceId === null || requestParameters.instanceId === undefined) {
            throw new runtime.RequiredError('instanceId','Required parameter requestParameters.instanceId was null or undefined when calling deleteDatabaseInstance.');
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
            path: `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))).replace(`{${"instance_id"}}`, encodeURIComponent(String(requestParameters.instanceId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить инстанс базы данных, отправьте DELETE-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.
     * Удаление инстанса базы данных
     */
    async deleteDatabaseInstance(requestParameters: DeleteDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDatabaseInstanceRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить пользователя базы данных на вашем аккаунте, отправьте DELETE-запрос на `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.
     * Удаление пользователя базы данных
     */
    async deleteDatabaseUserRaw(requestParameters: DeleteDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling deleteDatabaseUser.');
        }

        if (requestParameters.adminId === null || requestParameters.adminId === undefined) {
            throw new runtime.RequiredError('adminId','Required parameter requestParameters.adminId was null or undefined when calling deleteDatabaseUser.');
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
            path: `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))).replace(`{${"admin_id"}}`, encodeURIComponent(String(requestParameters.adminId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить пользователя базы данных на вашем аккаунте, отправьте DELETE-запрос на `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.
     * Удаление пользователя базы данных
     */
    async deleteDatabaseUser(requestParameters: DeleteDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDatabaseUserRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отобразить информацию об отдельной базе данных, отправьте запрос GET на `api/v1/dbs/{db_id}`. 
     * Получение базы данных
     */
    async getDatabaseRaw(requestParameters: GetDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabase201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling getDatabase.');
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
            path: `/api/v1/dbs/{db_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabase201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы отобразить информацию об отдельной базе данных, отправьте запрос GET на `api/v1/dbs/{db_id}`. 
     * Получение базы данных
     */
    async getDatabase(requestParameters: GetDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabase201Response> {
        const response = await this.getDatabaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список настроек автобэкапов базы данных, отправьте запрос GET в `api/v1/dbs/{db_id}/auto-backups`
     * Получение настроек автобэкапов базы данных
     */
    async getDatabaseAutoBackupsSettingsRaw(requestParameters: GetDatabaseAutoBackupsSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseAutoBackupsSettings200Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling getDatabaseAutoBackupsSettings.');
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
            path: `/api/v1/dbs/{db_id}/auto-backups`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseAutoBackupsSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список настроек автобэкапов базы данных, отправьте запрос GET в `api/v1/dbs/{db_id}/auto-backups`
     * Получение настроек автобэкапов базы данных
     */
    async getDatabaseAutoBackupsSettings(requestParameters: GetDatabaseAutoBackupsSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseAutoBackupsSettings200Response> {
        const response = await this.getDatabaseAutoBackupsSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить бэкап базы данных, отправьте запрос GET в `api/v1/dbs/{db_id}/backups/{backup_id}`. 
     * Получение бэкапа базы данных
     */
    async getDatabaseBackupRaw(requestParameters: GetDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseBackup201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling getDatabaseBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling getDatabaseBackup.');
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
            path: `/api/v1/dbs/{db_id}/backups/{backup_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseBackup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить бэкап базы данных, отправьте запрос GET в `api/v1/dbs/{db_id}/backups/{backup_id}`. 
     * Получение бэкапа базы данных
     */
    async getDatabaseBackup(requestParameters: GetDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseBackup201Response> {
        const response = await this.getDatabaseBackupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список бэкапов базы данных, отправьте запрос GET в `api/v1/dbs/{db_id}/backups`. 
     * Список бэкапов базы данных
     */
    async getDatabaseBackupsRaw(requestParameters: GetDatabaseBackupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseBackups200Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling getDatabaseBackups.');
        }

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
            path: `/api/v1/dbs/{db_id}/backups`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseBackups200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список бэкапов базы данных, отправьте запрос GET в `api/v1/dbs/{db_id}/backups`. 
     * Список бэкапов базы данных
     */
    async getDatabaseBackups(requestParameters: GetDatabaseBackupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseBackups200Response> {
        const response = await this.getDatabaseBackupsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить кластер базы данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}`.
     * Получение кластера базы данных
     */
    async getDatabaseClusterRaw(requestParameters: GetDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseCluster201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling getDatabaseCluster.');
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
            path: `/api/v1/databases/{db_cluster_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseCluster201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить кластер базы данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}`.
     * Получение кластера базы данных
     */
    async getDatabaseCluster(requestParameters: GetDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseCluster201Response> {
        const response = await this.getDatabaseClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список типов баз данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/database-types`.
     * Получение списка типов кластеров баз данных
     */
    async getDatabaseClusterTypesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseClusterTypes200Response>> {
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
            path: `/api/v1/database-types`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseClusterTypes200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список типов баз данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/database-types`.
     * Получение списка типов кластеров баз данных
     */
    async getDatabaseClusterTypes(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseClusterTypes200Response> {
        const response = await this.getDatabaseClusterTypesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список кластеров баз данных, отправьте GET-запрос на `/api/v1/databases`.   Тело ответа будет представлять собой объект JSON с ключом `dbs`.
     * Получение списка кластеров баз данных
     */
    async getDatabaseClustersRaw(requestParameters: GetDatabaseClustersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseClusters200Response>> {
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
            path: `/api/v1/databases`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseClusters200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список кластеров баз данных, отправьте GET-запрос на `/api/v1/databases`.   Тело ответа будет представлять собой объект JSON с ключом `dbs`.
     * Получение списка кластеров баз данных
     */
    async getDatabaseClusters(requestParameters: GetDatabaseClustersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseClusters200Response> {
        const response = await this.getDatabaseClustersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить инстанс базы данных, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.
     * Получение инстанса базы данных
     */
    async getDatabaseInstanceRaw(requestParameters: GetDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseInstance201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling getDatabaseInstance.');
        }

        if (requestParameters.instanceId === null || requestParameters.instanceId === undefined) {
            throw new runtime.RequiredError('instanceId','Required parameter requestParameters.instanceId was null or undefined when calling getDatabaseInstance.');
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
            path: `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))).replace(`{${"instance_id"}}`, encodeURIComponent(String(requestParameters.instanceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseInstance201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить инстанс базы данных, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.
     * Получение инстанса базы данных
     */
    async getDatabaseInstance(requestParameters: GetDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseInstance201Response> {
        const response = await this.getDatabaseInstanceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список баз данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/instances`.
     * Получение списка инстансов баз данных
     */
    async getDatabaseInstancesRaw(requestParameters: GetDatabaseInstancesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseInstances200Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling getDatabaseInstances.');
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
            path: `/api/v1/databases/{db_cluster_id}/instances`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseInstances200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список баз данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/instances`.
     * Получение списка инстансов баз данных
     */
    async getDatabaseInstances(requestParameters: GetDatabaseInstancesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseInstances200Response> {
        const response = await this.getDatabaseInstancesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список параметров баз данных, отправьте GET-запрос на `/api/v1/dbs/parameters`.
     * Получение списка параметров баз данных
     */
    async getDatabaseParametersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<{ [key: string]: Array<string>; }>> {
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
            path: `/api/v1/dbs/parameters`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Чтобы получить список параметров баз данных, отправьте GET-запрос на `/api/v1/dbs/parameters`.
     * Получение списка параметров баз данных
     */
    async getDatabaseParameters(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<{ [key: string]: Array<string>; }> {
        const response = await this.getDatabaseParametersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить пользователя базы данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.
     * Получение пользователя базы данных
     */
    async getDatabaseUserRaw(requestParameters: GetDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseUser201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling getDatabaseUser.');
        }

        if (requestParameters.adminId === null || requestParameters.adminId === undefined) {
            throw new runtime.RequiredError('adminId','Required parameter requestParameters.adminId was null or undefined when calling getDatabaseUser.');
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
            path: `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))).replace(`{${"admin_id"}}`, encodeURIComponent(String(requestParameters.adminId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseUser201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить пользователя базы данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.
     * Получение пользователя базы данных
     */
    async getDatabaseUser(requestParameters: GetDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseUser201Response> {
        const response = await this.getDatabaseUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список пользователей базы данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/admins`.
     * Получение списка пользователей базы данных
     */
    async getDatabaseUsersRaw(requestParameters: GetDatabaseUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseUsers200Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling getDatabaseUsers.');
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
            path: `/api/v1/databases/{db_cluster_id}/admins`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseUsers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список пользователей базы данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/admins`.
     * Получение списка пользователей базы данных
     */
    async getDatabaseUsers(requestParameters: GetDatabaseUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseUsers200Response> {
        const response = await this.getDatabaseUsersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех баз данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/dbs`.   Тело ответа будет представлять собой объект JSON с ключом `dbs`.
     * Получение списка всех баз данных
     */
    async getDatabasesRaw(requestParameters: GetDatabasesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabases200Response>> {
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
            path: `/api/v1/dbs`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabases200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех баз данных на вашем аккаунте, отправьте GET-запрос на `/api/v1/dbs`.   Тело ответа будет представлять собой объект JSON с ключом `dbs`.
     * Получение списка всех баз данных
     */
    async getDatabases(requestParameters: GetDatabasesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabases200Response> {
        const response = await this.getDatabasesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список тарифов для баз данных, отправьте GET-запрос на `/api/v1/presets/dbs`.   Тело ответа будет представлять собой объект JSON с ключом `databases_presets`.
     * Получение списка тарифов для баз данных
     */
    async getDatabasesPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabasesPresets200Response>> {
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
            path: `/api/v1/presets/dbs`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabasesPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список тарифов для баз данных, отправьте GET-запрос на `/api/v1/presets/dbs`.   Тело ответа будет представлять собой объект JSON с ключом `databases_presets`.
     * Получение списка тарифов для баз данных
     */
    async getDatabasesPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabasesPresets200Response> {
        const response = await this.getDatabasesPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы восстановить базу данных из бэкапа, отправьте запрос PUT в `api/v1/dbs/{db_id}/backups/{backup_id}`. 
     * Восстановление базы данных из бэкапа
     */
    async restoreDatabaseFromBackupRaw(requestParameters: RestoreDatabaseFromBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling restoreDatabaseFromBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling restoreDatabaseFromBackup.');
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
            path: `/api/v1/dbs/{db_id}/backups/{backup_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы восстановить базу данных из бэкапа, отправьте запрос PUT в `api/v1/dbs/{db_id}/backups/{backup_id}`. 
     * Восстановление базы данных из бэкапа
     */
    async restoreDatabaseFromBackup(requestParameters: RestoreDatabaseFromBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.restoreDatabaseFromBackupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы обновить только определенные атрибуты базы данных, отправьте запрос PATCH в `api/v1/dbs/{db_id}`. 
     * Обновление базы данных
     */
    async updateDatabaseRaw(requestParameters: UpdateDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabase201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling updateDatabase.');
        }

        if (requestParameters.updateDb === null || requestParameters.updateDb === undefined) {
            throw new runtime.RequiredError('updateDb','Required parameter requestParameters.updateDb was null or undefined when calling updateDatabase.');
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
            path: `/api/v1/dbs/{db_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateDbToJSON(requestParameters.updateDb),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabase201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить только определенные атрибуты базы данных, отправьте запрос PATCH в `api/v1/dbs/{db_id}`. 
     * Обновление базы данных
     */
    async updateDatabase(requestParameters: UpdateDatabaseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabase201Response> {
        const response = await this.updateDatabaseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить список настроек автобэкапов базы данных, отправьте запрос PATCH в `api/v1/dbs/{db_id}/auto-backups`
     * Изменение настроек автобэкапов базы данных
     */
    async updateDatabaseAutoBackupsSettingsRaw(requestParameters: UpdateDatabaseAutoBackupsSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseAutoBackupsSettings200Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling updateDatabaseAutoBackupsSettings.');
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
            path: `/api/v1/dbs/{db_id}/auto-backups`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: AutoBackupToJSON(requestParameters.autoBackup),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseAutoBackupsSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить список настроек автобэкапов базы данных, отправьте запрос PATCH в `api/v1/dbs/{db_id}/auto-backups`
     * Изменение настроек автобэкапов базы данных
     */
    async updateDatabaseAutoBackupsSettings(requestParameters: UpdateDatabaseAutoBackupsSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseAutoBackupsSettings200Response> {
        const response = await this.updateDatabaseAutoBackupsSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить кластер базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}`.
     * Изменение кластера базы данных
     */
    async updateDatabaseClusterRaw(requestParameters: UpdateDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseCluster201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling updateDatabaseCluster.');
        }

        if (requestParameters.updateCluster === null || requestParameters.updateCluster === undefined) {
            throw new runtime.RequiredError('updateCluster','Required parameter requestParameters.updateCluster was null or undefined when calling updateDatabaseCluster.');
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
            path: `/api/v1/databases/{db_cluster_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateClusterToJSON(requestParameters.updateCluster),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseCluster201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить кластер базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}`.
     * Изменение кластера базы данных
     */
    async updateDatabaseCluster(requestParameters: UpdateDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseCluster201Response> {
        const response = await this.updateDatabaseClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить инстанс базы данных, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.
     * Изменение инстанса базы данных
     */
    async updateDatabaseInstanceRaw(requestParameters: UpdateDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseInstance201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling updateDatabaseInstance.');
        }

        if (requestParameters.updateInstance === null || requestParameters.updateInstance === undefined) {
            throw new runtime.RequiredError('updateInstance','Required parameter requestParameters.updateInstance was null or undefined when calling updateDatabaseInstance.');
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
            path: `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateInstanceToJSON(requestParameters.updateInstance),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseInstance201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить инстанс базы данных, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.
     * Изменение инстанса базы данных
     */
    async updateDatabaseInstance(requestParameters: UpdateDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseInstance201Response> {
        const response = await this.updateDatabaseInstanceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить пользователя базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.
     * Изменение пользователя базы данных
     */
    async updateDatabaseUserRaw(requestParameters: UpdateDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseUser201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling updateDatabaseUser.');
        }

        if (requestParameters.adminId === null || requestParameters.adminId === undefined) {
            throw new runtime.RequiredError('adminId','Required parameter requestParameters.adminId was null or undefined when calling updateDatabaseUser.');
        }

        if (requestParameters.updateAdmin === null || requestParameters.updateAdmin === undefined) {
            throw new runtime.RequiredError('updateAdmin','Required parameter requestParameters.updateAdmin was null or undefined when calling updateDatabaseUser.');
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
            path: `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))).replace(`{${"admin_id"}}`, encodeURIComponent(String(requestParameters.adminId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAdminToJSON(requestParameters.updateAdmin),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseUser201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить пользователя базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}/admins/{admin_id}`.
     * Изменение пользователя базы данных
     */
    async updateDatabaseUser(requestParameters: UpdateDatabaseUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseUser201Response> {
        const response = await this.updateDatabaseUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
