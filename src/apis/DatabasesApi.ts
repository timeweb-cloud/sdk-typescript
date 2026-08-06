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
  BackupDownloadUrlRequest,
  ClusterAction,
  CreateAdmin,
  CreateCluster,
  CreateDatabaseBackup201Response,
  CreateDatabaseBackupDownloadUrl201Response,
  CreateDatabaseCluster201Response,
  CreateDatabaseInstance201Response,
  CreateDatabaseS3Backup201Response,
  CreateDatabaseUser201Response,
  CreateInstance,
  CreateS3Backup,
  DbParametersByType,
  DbsCreateBackup,
  DbsUpdateBackup,
  DeleteDatabaseCluster200Response,
  GetAccountStatus403Response,
  GetDatabaseAutoBackupsSettings200Response,
  GetDatabaseBackup200Response,
  GetDatabaseBackups200Response,
  GetDatabaseClusterReplicas200Response,
  GetDatabaseClusterTypes200Response,
  GetDatabaseClusters200Response,
  GetDatabaseConfigurators200Response,
  GetDatabaseDefaultParameters200Response,
  GetDatabaseInstances200Response,
  GetDatabasePreset200Response,
  GetDatabasePrivileges200Response,
  GetDatabaseS3Backups200Response,
  GetDatabaseUsers200Response,
  GetDatabasesPresets200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  UpdateAdmin,
  UpdateAutoBackup,
  UpdateCluster,
  UpdateClusterV2,
  UpdateDatabaseCluster200Response,
  UpdateDatabaseInstance409Response,
  UpdateInstance,
  UpdateS3Backup,
} from '../models/index';
import {
    BackupDownloadUrlRequestFromJSON,
    BackupDownloadUrlRequestToJSON,
    ClusterActionFromJSON,
    ClusterActionToJSON,
    CreateAdminFromJSON,
    CreateAdminToJSON,
    CreateClusterFromJSON,
    CreateClusterToJSON,
    CreateDatabaseBackup201ResponseFromJSON,
    CreateDatabaseBackup201ResponseToJSON,
    CreateDatabaseBackupDownloadUrl201ResponseFromJSON,
    CreateDatabaseBackupDownloadUrl201ResponseToJSON,
    CreateDatabaseCluster201ResponseFromJSON,
    CreateDatabaseCluster201ResponseToJSON,
    CreateDatabaseInstance201ResponseFromJSON,
    CreateDatabaseInstance201ResponseToJSON,
    CreateDatabaseS3Backup201ResponseFromJSON,
    CreateDatabaseS3Backup201ResponseToJSON,
    CreateDatabaseUser201ResponseFromJSON,
    CreateDatabaseUser201ResponseToJSON,
    CreateInstanceFromJSON,
    CreateInstanceToJSON,
    CreateS3BackupFromJSON,
    CreateS3BackupToJSON,
    DbParametersByTypeFromJSON,
    DbParametersByTypeToJSON,
    DbsCreateBackupFromJSON,
    DbsCreateBackupToJSON,
    DbsUpdateBackupFromJSON,
    DbsUpdateBackupToJSON,
    DeleteDatabaseCluster200ResponseFromJSON,
    DeleteDatabaseCluster200ResponseToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetDatabaseAutoBackupsSettings200ResponseFromJSON,
    GetDatabaseAutoBackupsSettings200ResponseToJSON,
    GetDatabaseBackup200ResponseFromJSON,
    GetDatabaseBackup200ResponseToJSON,
    GetDatabaseBackups200ResponseFromJSON,
    GetDatabaseBackups200ResponseToJSON,
    GetDatabaseClusterReplicas200ResponseFromJSON,
    GetDatabaseClusterReplicas200ResponseToJSON,
    GetDatabaseClusterTypes200ResponseFromJSON,
    GetDatabaseClusterTypes200ResponseToJSON,
    GetDatabaseClusters200ResponseFromJSON,
    GetDatabaseClusters200ResponseToJSON,
    GetDatabaseConfigurators200ResponseFromJSON,
    GetDatabaseConfigurators200ResponseToJSON,
    GetDatabaseDefaultParameters200ResponseFromJSON,
    GetDatabaseDefaultParameters200ResponseToJSON,
    GetDatabaseInstances200ResponseFromJSON,
    GetDatabaseInstances200ResponseToJSON,
    GetDatabasePreset200ResponseFromJSON,
    GetDatabasePreset200ResponseToJSON,
    GetDatabasePrivileges200ResponseFromJSON,
    GetDatabasePrivileges200ResponseToJSON,
    GetDatabaseS3Backups200ResponseFromJSON,
    GetDatabaseS3Backups200ResponseToJSON,
    GetDatabaseUsers200ResponseFromJSON,
    GetDatabaseUsers200ResponseToJSON,
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
    UpdateAutoBackupFromJSON,
    UpdateAutoBackupToJSON,
    UpdateClusterFromJSON,
    UpdateClusterToJSON,
    UpdateClusterV2FromJSON,
    UpdateClusterV2ToJSON,
    UpdateDatabaseCluster200ResponseFromJSON,
    UpdateDatabaseCluster200ResponseToJSON,
    UpdateDatabaseInstance409ResponseFromJSON,
    UpdateDatabaseInstance409ResponseToJSON,
    UpdateInstanceFromJSON,
    UpdateInstanceToJSON,
    UpdateS3BackupFromJSON,
    UpdateS3BackupToJSON,
} from '../models/index';

export interface CreateDatabaseBackupRequest {
    dbId: number;
    dbsCreateBackup?: DbsCreateBackup;
}

export interface CreateDatabaseBackupDownloadUrlRequest {
    dbId: number;
    backupId: number;
    backupDownloadUrlRequest: BackupDownloadUrlRequest;
}

export interface CreateDatabaseClusterRequest {
    createCluster: CreateCluster;
}

export interface CreateDatabaseInstanceRequest {
    dbClusterId: number;
    createInstance: CreateInstance;
}

export interface CreateDatabaseS3BackupRequest {
    dbId: number;
    createS3Backup?: CreateS3Backup;
}

export interface CreateDatabaseUserRequest {
    dbClusterId: number;
    createAdmin: CreateAdmin;
}

export interface DeleteDatabaseBackupRequest {
    dbId: number;
    backupId: number;
}

export interface DeleteDatabaseClusterRequest {
    dbClusterId: number;
}

export interface DeleteDatabaseInstanceRequest {
    dbClusterId: number;
    instanceId: number;
}

export interface DeleteDatabaseS3BackupRequest {
    dbId: number;
    backupId: string;
}

export interface DeleteDatabaseUserRequest {
    dbClusterId: number;
    adminId: number;
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

export interface GetDatabaseClusterReplicasRequest {
    dbClusterId: number;
}

export interface GetDatabaseClustersRequest {
    limit?: number;
    offset?: number;
}

export interface GetDatabaseConfiguratorsRequest {
    clusterId?: number;
    withUnavailable?: boolean;
}

export interface GetDatabaseDefaultParametersRequest {
    type: GetDatabaseDefaultParametersTypeEnum;
    ram: number;
    replicaCount?: number;
}

export interface GetDatabaseInstanceRequest {
    dbClusterId: number;
    instanceId: number;
}

export interface GetDatabaseInstancesRequest {
    dbClusterId: number;
}

export interface GetDatabasePresetRequest {
    presetId: number;
}

export interface GetDatabasePrivilegesRequest {
    dbClusterId: number;
}

export interface GetDatabaseS3BackupRequest {
    dbId: number;
    backupId: string;
}

export interface GetDatabaseS3BackupsRequest {
    dbId: number;
}

export interface GetDatabaseUserRequest {
    dbClusterId: number;
    adminId: number;
}

export interface GetDatabaseUsersRequest {
    dbClusterId: number;
}

export interface GetDatabasesPresetsRequest {
    clusterId?: number;
    withUnavailable?: boolean;
}

export interface PerformDatabaseClusterActionRequest {
    dbClusterId: number;
    clusterAction: ClusterAction;
}

export interface RestoreDatabaseFromBackupRequest {
    dbId: number;
    backupId: number;
}

export interface RestoreDatabaseFromS3BackupRequest {
    dbId: number;
    backupId: string;
}

export interface UpdateDatabaseAutoBackupsSettingsRequest {
    dbId: number;
    updateAutoBackup: UpdateAutoBackup;
}

export interface UpdateDatabaseBackupRequest {
    dbId: number;
    backupId: number;
    dbsUpdateBackup: DbsUpdateBackup;
}

export interface UpdateDatabaseClusterRequest {
    dbClusterId: number;
    updateCluster: UpdateCluster;
}

export interface UpdateDatabaseClusterV2Request {
    dbClusterId: number;
    updateClusterV2: UpdateClusterV2;
}

export interface UpdateDatabaseInstanceRequest {
    dbClusterId: number;
    instanceId: number;
    updateInstance: UpdateInstance;
}

export interface UpdateDatabaseS3BackupRequest {
    dbId: number;
    backupId: string;
    updateS3Backup?: UpdateS3Backup;
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
     * Чтобы создать бэкап базы данных, отправьте запрос POST в `api/v1/dbs/{db_id}/backups`. 
     * Создание бэкапа базы данных
     */
    async createDatabaseBackupRaw(requestParameters: CreateDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseBackup201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling createDatabaseBackup.');
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
            path: `/api/v1/dbs/{db_id}/backups`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DbsCreateBackupToJSON(requestParameters.dbsCreateBackup),
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
     * Чтобы получить ссылку для скачивания резервной копии базы данных, отправьте POST-запрос на `/api/v1/dbs/{db_id}/backups/{backup_id}/download-url`.   Скачивание резервных копий доступно не для всех кластеров. Если для вашего кластера оно недоступно, метод вернет ошибку со статусом `400`.   Тело ответа будет представлять собой объект JSON с ключом `backup_url`.
     * Получение ссылки для скачивания бэкапа базы данных
     */
    async createDatabaseBackupDownloadUrlRaw(requestParameters: CreateDatabaseBackupDownloadUrlRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseBackupDownloadUrl201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling createDatabaseBackupDownloadUrl.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling createDatabaseBackupDownloadUrl.');
        }

        if (requestParameters.backupDownloadUrlRequest === null || requestParameters.backupDownloadUrlRequest === undefined) {
            throw new runtime.RequiredError('backupDownloadUrlRequest','Required parameter requestParameters.backupDownloadUrlRequest was null or undefined when calling createDatabaseBackupDownloadUrl.');
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
            path: `/api/v1/dbs/{db_id}/backups/{backup_id}/download-url`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: BackupDownloadUrlRequestToJSON(requestParameters.backupDownloadUrlRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseBackupDownloadUrl201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить ссылку для скачивания резервной копии базы данных, отправьте POST-запрос на `/api/v1/dbs/{db_id}/backups/{backup_id}/download-url`.   Скачивание резервных копий доступно не для всех кластеров. Если для вашего кластера оно недоступно, метод вернет ошибку со статусом `400`.   Тело ответа будет представлять собой объект JSON с ключом `backup_url`.
     * Получение ссылки для скачивания бэкапа базы данных
     */
    async createDatabaseBackupDownloadUrl(requestParameters: CreateDatabaseBackupDownloadUrlRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseBackupDownloadUrl201Response> {
        const response = await this.createDatabaseBackupDownloadUrlRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать кластер базы данных на вашем аккаунте, отправьте POST-запрос на `/api/v1/databases`.   Вместе с кластером будет создан один инстанс базы данных и один пользователь.   Размер кластера задается либо тарифом (`preset_id`), либо конфигуратором (`configuration`). Эти поля взаимоисключающие, но одно из них передать обязательно — запрос без обоих вернется с ошибкой.
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
     * Чтобы создать кластер базы данных на вашем аккаунте, отправьте POST-запрос на `/api/v1/databases`.   Вместе с кластером будет создан один инстанс базы данных и один пользователь.   Размер кластера задается либо тарифом (`preset_id`), либо конфигуратором (`configuration`). Эти поля взаимоисключающие, но одно из них передать обязательно — запрос без обоих вернется с ошибкой.
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
     * Чтобы создать резервную копию кластера базы данных в объектном хранилище, отправьте POST-запрос на `/api/v2/databases/{db_id}/backups`.   Тело запроса необязательно: единственное поле `comment` можно не передавать. Тело ответа будет представлять собой объект JSON с ключом `backup`.   Копия создается асинхронно. Пока она создается, ее статус — `running`, и восстановиться из нее нельзя. Дождитесь статуса `success`, опрашивая `/api/v2/databases/{db_id}/backups/{backup_id}`.
     * Создание S3-бэкапа базы данных
     */
    async createDatabaseS3BackupRaw(requestParameters: CreateDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseS3Backup201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling createDatabaseS3Backup.');
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
            path: `/api/v2/databases/{db_id}/backups`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateS3BackupToJSON(requestParameters.createS3Backup),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseS3Backup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать резервную копию кластера базы данных в объектном хранилище, отправьте POST-запрос на `/api/v2/databases/{db_id}/backups`.   Тело запроса необязательно: единственное поле `comment` можно не передавать. Тело ответа будет представлять собой объект JSON с ключом `backup`.   Копия создается асинхронно. Пока она создается, ее статус — `running`, и восстановиться из нее нельзя. Дождитесь статуса `success`, опрашивая `/api/v2/databases/{db_id}/backups/{backup_id}`.
     * Создание S3-бэкапа базы данных
     */
    async createDatabaseS3Backup(requestParameters: CreateDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseS3Backup201Response> {
        const response = await this.createDatabaseS3BackupRaw(requestParameters, initOverrides);
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
     * Чтобы удалить резервную копию кластера базы данных из объектного хранилища, отправьте DELETE-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}`.   Копия удаляется безвозвратно, тело ответа пустое. На резервные копии из `/api/v1/dbs/{db_id}/backups/{backup_id}` этот метод не действует — они удаляются отдельным запросом.
     * Удаление S3-бэкапа базы данных
     */
    async deleteDatabaseS3BackupRaw(requestParameters: DeleteDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling deleteDatabaseS3Backup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling deleteDatabaseS3Backup.');
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
            path: `/api/v2/databases/{db_id}/backups/{backup_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить резервную копию кластера базы данных из объектного хранилища, отправьте DELETE-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}`.   Копия удаляется безвозвратно, тело ответа пустое. На резервные копии из `/api/v1/dbs/{db_id}/backups/{backup_id}` этот метод не действует — они удаляются отдельным запросом.
     * Удаление S3-бэкапа базы данных
     */
    async deleteDatabaseS3Backup(requestParameters: DeleteDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDatabaseS3BackupRaw(requestParameters, initOverrides);
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
    async getDatabaseBackupRaw(requestParameters: GetDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseBackup200Response>> {
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

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseBackup200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить бэкап базы данных, отправьте запрос GET в `api/v1/dbs/{db_id}/backups/{backup_id}`. 
     * Получение бэкапа базы данных
     */
    async getDatabaseBackup(requestParameters: GetDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseBackup200Response> {
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
     * Чтобы получить список реплик кластера базы данных, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/replicas`.   Тело ответа будет представлять собой объект JSON с ключом `replicas`.
     * Получение списка реплик кластера базы данных
     */
    async getDatabaseClusterReplicasRaw(requestParameters: GetDatabaseClusterReplicasRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseClusterReplicas200Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling getDatabaseClusterReplicas.');
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
            path: `/api/v1/databases/{db_cluster_id}/replicas`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseClusterReplicas200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список реплик кластера базы данных, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/replicas`.   Тело ответа будет представлять собой объект JSON с ключом `replicas`.
     * Получение списка реплик кластера базы данных
     */
    async getDatabaseClusterReplicas(requestParameters: GetDatabaseClusterReplicasRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseClusterReplicas200Response> {
        const response = await this.getDatabaseClusterReplicasRaw(requestParameters, initOverrides);
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
     * Чтобы получить список конфигураторов баз данных, отправьте GET-запрос на `/api/v1/configurator/databases`.   Конфигуратор позволяет создать кластер с произвольным количеством ресурсов вместо готового тарифа: его ID передается при создании кластера в поле `configuration.configurator_id`, а допустимые значения ресурсов ограничены объектом `requirements`.   Тело ответа будет представлять собой объект JSON с ключом `database_configurators`.
     * Получение списка конфигураторов баз данных
     */
    async getDatabaseConfiguratorsRaw(requestParameters: GetDatabaseConfiguratorsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseConfigurators200Response>> {
        const queryParameters: any = {};

        if (requestParameters.clusterId !== undefined) {
            queryParameters['cluster_id'] = requestParameters.clusterId;
        }

        if (requestParameters.withUnavailable !== undefined) {
            queryParameters['with_unavailable'] = requestParameters.withUnavailable;
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
            path: `/api/v1/configurator/databases`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseConfigurators200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список конфигураторов баз данных, отправьте GET-запрос на `/api/v1/configurator/databases`.   Конфигуратор позволяет создать кластер с произвольным количеством ресурсов вместо готового тарифа: его ID передается при создании кластера в поле `configuration.configurator_id`, а допустимые значения ресурсов ограничены объектом `requirements`.   Тело ответа будет представлять собой объект JSON с ключом `database_configurators`.
     * Получение списка конфигураторов баз данных
     */
    async getDatabaseConfigurators(requestParameters: GetDatabaseConfiguratorsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseConfigurators200Response> {
        const response = await this.getDatabaseConfiguratorsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить рекомендуемые значения параметров базы данных, отправьте GET-запрос на `/api/v1/dbs/default-parameters`.   Значения рассчитываются для указанного типа кластера, объема оперативной памяти и количества реплик — их можно передать при создании кластера в поле `config_parameters`. Список имен параметров, доступных для каждого типа кластера, возвращает `GET /api/v1/dbs/parameters`.   Тело ответа будет представлять собой объект JSON с ключом `config_params`. Рекомендуемые значения рассчитываются только для кластеров MySQL, PostgreSQL и Valkey — для остальных типов возвращается пустой объект.
     * Получение рекомендуемых значений параметров баз данных
     */
    async getDatabaseDefaultParametersRaw(requestParameters: GetDatabaseDefaultParametersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseDefaultParameters200Response>> {
        if (requestParameters.type === null || requestParameters.type === undefined) {
            throw new runtime.RequiredError('type','Required parameter requestParameters.type was null or undefined when calling getDatabaseDefaultParameters.');
        }

        if (requestParameters.ram === null || requestParameters.ram === undefined) {
            throw new runtime.RequiredError('ram','Required parameter requestParameters.ram was null or undefined when calling getDatabaseDefaultParameters.');
        }

        const queryParameters: any = {};

        if (requestParameters.type !== undefined) {
            queryParameters['type'] = requestParameters.type;
        }

        if (requestParameters.ram !== undefined) {
            queryParameters['ram'] = requestParameters.ram;
        }

        if (requestParameters.replicaCount !== undefined) {
            queryParameters['replica_count'] = requestParameters.replicaCount;
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
            path: `/api/v1/dbs/default-parameters`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseDefaultParameters200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить рекомендуемые значения параметров базы данных, отправьте GET-запрос на `/api/v1/dbs/default-parameters`.   Значения рассчитываются для указанного типа кластера, объема оперативной памяти и количества реплик — их можно передать при создании кластера в поле `config_parameters`. Список имен параметров, доступных для каждого типа кластера, возвращает `GET /api/v1/dbs/parameters`.   Тело ответа будет представлять собой объект JSON с ключом `config_params`. Рекомендуемые значения рассчитываются только для кластеров MySQL, PostgreSQL и Valkey — для остальных типов возвращается пустой объект.
     * Получение рекомендуемых значений параметров баз данных
     */
    async getDatabaseDefaultParameters(requestParameters: GetDatabaseDefaultParametersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseDefaultParameters200Response> {
        const response = await this.getDatabaseDefaultParametersRaw(requestParameters, initOverrides);
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
     * Чтобы получить список параметров баз данных, отправьте GET-запрос на `/api/v1/dbs/parameters`.   Ответ содержит только имена параметров, доступных для каждого типа кластера. Рекомендуемые значения этих параметров для конкретной конфигурации возвращает `GET /api/v1/dbs/default-parameters`.
     * Получение списка параметров баз данных
     */
    async getDatabaseParametersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DbParametersByType>> {
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

        return new runtime.JSONApiResponse(response, (jsonValue) => DbParametersByTypeFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список параметров баз данных, отправьте GET-запрос на `/api/v1/dbs/parameters`.   Ответ содержит только имена параметров, доступных для каждого типа кластера. Рекомендуемые значения этих параметров для конкретной конфигурации возвращает `GET /api/v1/dbs/default-parameters`.
     * Получение списка параметров баз данных
     */
    async getDatabaseParameters(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DbParametersByType> {
        const response = await this.getDatabaseParametersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить тариф для базы данных, отправьте GET-запрос на `/api/v2/dbs/presets/{preset_id}`.   Тело ответа будет представлять собой объект JSON с ключом `databases_preset`.
     * Получение тарифа для базы данных
     */
    async getDatabasePresetRaw(requestParameters: GetDatabasePresetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabasePreset200Response>> {
        if (requestParameters.presetId === null || requestParameters.presetId === undefined) {
            throw new runtime.RequiredError('presetId','Required parameter requestParameters.presetId was null or undefined when calling getDatabasePreset.');
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
            path: `/api/v2/dbs/presets/{preset_id}`.replace(`{${"preset_id"}}`, encodeURIComponent(String(requestParameters.presetId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabasePreset200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить тариф для базы данных, отправьте GET-запрос на `/api/v2/dbs/presets/{preset_id}`.   Тело ответа будет представлять собой объект JSON с ключом `databases_preset`.
     * Получение тарифа для базы данных
     */
    async getDatabasePreset(requestParameters: GetDatabasePresetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabasePreset200Response> {
        const response = await this.getDatabasePresetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список привилегий, которые можно выдать пользователям кластера базы данных, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/privileges`.\\    Список зависит от типа СУБД кластера и определяется сервером автоматически: возвращаются только те привилегии, которые допустимы для этого кластера. Используйте его, чтобы заполнить поле `privileges` при <a href=\'#tag/Bazy-dannyh/operation/createDatabaseUser\'>создании</a> или <a href=\'#tag/Bazy-dannyh/operation/updateDatabaseUser\'>изменении</a> пользователя базы данных.
     * Получение привилегий кластера базы данных
     */
    async getDatabasePrivilegesRaw(requestParameters: GetDatabasePrivilegesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabasePrivileges200Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling getDatabasePrivileges.');
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
            path: `/api/v1/databases/{db_cluster_id}/privileges`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabasePrivileges200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список привилегий, которые можно выдать пользователям кластера базы данных, отправьте GET-запрос на `/api/v1/databases/{db_cluster_id}/privileges`.\\    Список зависит от типа СУБД кластера и определяется сервером автоматически: возвращаются только те привилегии, которые допустимы для этого кластера. Используйте его, чтобы заполнить поле `privileges` при <a href=\'#tag/Bazy-dannyh/operation/createDatabaseUser\'>создании</a> или <a href=\'#tag/Bazy-dannyh/operation/updateDatabaseUser\'>изменении</a> пользователя базы данных.
     * Получение привилегий кластера базы данных
     */
    async getDatabasePrivileges(requestParameters: GetDatabasePrivilegesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabasePrivileges200Response> {
        const response = await this.getDatabasePrivilegesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о резервной копии кластера базы данных в объектном хранилище, отправьте GET-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}`.   Тело ответа будет представлять собой объект JSON с ключом `backup`. Обратите внимание, что `backup_id` здесь — строка в формате UUID, а не число, как в `/api/v1/dbs/{db_id}/backups/{backup_id}`.
     * Получение S3-бэкапа базы данных
     */
    async getDatabaseS3BackupRaw(requestParameters: GetDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseS3Backup201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling getDatabaseS3Backup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling getDatabaseS3Backup.');
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
            path: `/api/v2/databases/{db_id}/backups/{backup_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseS3Backup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о резервной копии кластера базы данных в объектном хранилище, отправьте GET-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}`.   Тело ответа будет представлять собой объект JSON с ключом `backup`. Обратите внимание, что `backup_id` здесь — строка в формате UUID, а не число, как в `/api/v1/dbs/{db_id}/backups/{backup_id}`.
     * Получение S3-бэкапа базы данных
     */
    async getDatabaseS3Backup(requestParameters: GetDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseS3Backup201Response> {
        const response = await this.getDatabaseS3BackupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список резервных копий кластера базы данных в объектном хранилище, отправьте GET-запрос на `/api/v2/databases/{db_id}/backups`.   Тело ответа будет представлять собой объект JSON с ключом `backups`. Копии отсортированы по дате создания по убыванию — сначала самые свежие.   Резервное копирование в объектное хранилище доступно для кластеров MySQL и PostgreSQL. Идентификатор такой копии — строка в формате UUID; это отдельный от `/api/v1/dbs/{db_id}/backups` механизм, и идентификаторы копий между ними не взаимозаменяемы.
     * Список S3-бэкапов базы данных
     */
    async getDatabaseS3BackupsRaw(requestParameters: GetDatabaseS3BackupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseS3Backups200Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling getDatabaseS3Backups.');
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
            path: `/api/v2/databases/{db_id}/backups`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseS3Backups200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список резервных копий кластера базы данных в объектном хранилище, отправьте GET-запрос на `/api/v2/databases/{db_id}/backups`.   Тело ответа будет представлять собой объект JSON с ключом `backups`. Копии отсортированы по дате создания по убыванию — сначала самые свежие.   Резервное копирование в объектное хранилище доступно для кластеров MySQL и PostgreSQL. Идентификатор такой копии — строка в формате UUID; это отдельный от `/api/v1/dbs/{db_id}/backups` механизм, и идентификаторы копий между ними не взаимозаменяемы.
     * Список S3-бэкапов базы данных
     */
    async getDatabaseS3Backups(requestParameters: GetDatabaseS3BackupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseS3Backups200Response> {
        const response = await this.getDatabaseS3BackupsRaw(requestParameters, initOverrides);
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
     * Чтобы получить список тарифов для баз данных, отправьте GET-запрос на `/api/v2/presets/dbs`.   Без параметров возвращаются тарифы, доступные к заказу — этот список используется при создании кластера. Если передать `cluster_id`, вернутся тарифы группы, в пределах которой можно сменить тариф указанного кластера.   Тело ответа будет представлять собой объект JSON с ключом `databases_presets`.
     * Получение списка тарифов для баз данных
     */
    async getDatabasesPresetsRaw(requestParameters: GetDatabasesPresetsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabasesPresets200Response>> {
        const queryParameters: any = {};

        if (requestParameters.clusterId !== undefined) {
            queryParameters['cluster_id'] = requestParameters.clusterId;
        }

        if (requestParameters.withUnavailable !== undefined) {
            queryParameters['with_unavailable'] = requestParameters.withUnavailable;
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
            path: `/api/v2/presets/dbs`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabasesPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список тарифов для баз данных, отправьте GET-запрос на `/api/v2/presets/dbs`.   Без параметров возвращаются тарифы, доступные к заказу — этот список используется при создании кластера. Если передать `cluster_id`, вернутся тарифы группы, в пределах которой можно сменить тариф указанного кластера.   Тело ответа будет представлять собой объект JSON с ключом `databases_presets`.
     * Получение списка тарифов для баз данных
     */
    async getDatabasesPresets(requestParameters: GetDatabasesPresetsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabasesPresets200Response> {
        const response = await this.getDatabasesPresetsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы выполнить действие над кластером базы данных, отправьте POST-запрос на `/api/v1/databases/{db_cluster_id}/action`.   Доступные действия: `reboot` — перезагрузка кластера, `shutdown` — выключение кластера, `start` — включение кластера.
     * Выполнение действия над кластером базы данных
     */
    async performDatabaseClusterActionRaw(requestParameters: PerformDatabaseClusterActionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling performDatabaseClusterAction.');
        }

        if (requestParameters.clusterAction === null || requestParameters.clusterAction === undefined) {
            throw new runtime.RequiredError('clusterAction','Required parameter requestParameters.clusterAction was null or undefined when calling performDatabaseClusterAction.');
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
            path: `/api/v1/databases/{db_cluster_id}/action`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ClusterActionToJSON(requestParameters.clusterAction),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы выполнить действие над кластером базы данных, отправьте POST-запрос на `/api/v1/databases/{db_cluster_id}/action`.   Доступные действия: `reboot` — перезагрузка кластера, `shutdown` — выключение кластера, `start` — включение кластера.
     * Выполнение действия над кластером базы данных
     */
    async performDatabaseClusterAction(requestParameters: PerformDatabaseClusterActionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.performDatabaseClusterActionRaw(requestParameters, initOverrides);
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
     * Чтобы восстановить кластер базы данных из резервной копии в объектном хранилище, отправьте POST-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}/restore`.   Тела запроса нет, тело ответа пустое. Восстановиться можно только из копии со статусом `success`.   Сразу после запуска кластер переходит в статус `backup_recovery`. Пока восстановление не завершится, создание, изменение и удаление резервных копий, а также повторный запуск восстановления недоступны.
     * Восстановление базы данных из S3-бэкапа
     */
    async restoreDatabaseFromS3BackupRaw(requestParameters: RestoreDatabaseFromS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling restoreDatabaseFromS3Backup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling restoreDatabaseFromS3Backup.');
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
            path: `/api/v2/databases/{db_id}/backups/{backup_id}/restore`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы восстановить кластер базы данных из резервной копии в объектном хранилище, отправьте POST-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}/restore`.   Тела запроса нет, тело ответа пустое. Восстановиться можно только из копии со статусом `success`.   Сразу после запуска кластер переходит в статус `backup_recovery`. Пока восстановление не завершится, создание, изменение и удаление резервных копий, а также повторный запуск восстановления недоступны.
     * Восстановление базы данных из S3-бэкапа
     */
    async restoreDatabaseFromS3Backup(requestParameters: RestoreDatabaseFromS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.restoreDatabaseFromS3BackupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы изменить список настроек автобэкапов базы данных, отправьте запрос PATCH в `api/v1/dbs/{db_id}/auto-backups`
     * Изменение настроек автобэкапов базы данных
     */
    async updateDatabaseAutoBackupsSettingsRaw(requestParameters: UpdateDatabaseAutoBackupsSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseAutoBackupsSettings200Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling updateDatabaseAutoBackupsSettings.');
        }

        if (requestParameters.updateAutoBackup === null || requestParameters.updateAutoBackup === undefined) {
            throw new runtime.RequiredError('updateAutoBackup','Required parameter requestParameters.updateAutoBackup was null or undefined when calling updateDatabaseAutoBackupsSettings.');
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
            body: UpdateAutoBackupToJSON(requestParameters.updateAutoBackup),
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
     * Чтобы изменить комментарий к бэкапу базы данных, отправьте PATCH-запрос на `/api/v1/dbs/{db_id}/backups/{backup_id}`.  Тело ответа будет представлять собой объект JSON с ключом `backup`. 
     * Изменение комментария к бэкапу базы данных
     */
    async updateDatabaseBackupRaw(requestParameters: UpdateDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDatabaseBackup200Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling updateDatabaseBackup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling updateDatabaseBackup.');
        }

        if (requestParameters.dbsUpdateBackup === null || requestParameters.dbsUpdateBackup === undefined) {
            throw new runtime.RequiredError('dbsUpdateBackup','Required parameter requestParameters.dbsUpdateBackup was null or undefined when calling updateDatabaseBackup.');
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
            path: `/api/v1/dbs/{db_id}/backups/{backup_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: DbsUpdateBackupToJSON(requestParameters.dbsUpdateBackup),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDatabaseBackup200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить комментарий к бэкапу базы данных, отправьте PATCH-запрос на `/api/v1/dbs/{db_id}/backups/{backup_id}`.  Тело ответа будет представлять собой объект JSON с ключом `backup`. 
     * Изменение комментария к бэкапу базы данных
     */
    async updateDatabaseBackup(requestParameters: UpdateDatabaseBackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDatabaseBackup200Response> {
        const response = await this.updateDatabaseBackupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить кластер базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}`.   Размер кластера задается либо тарифом (`preset_id`), либо конфигуратором (`configuration`) — эти поля взаимоисключающие.
     * Изменение кластера базы данных
     */
    async updateDatabaseClusterRaw(requestParameters: UpdateDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateDatabaseCluster200Response>> {
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

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateDatabaseCluster200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить кластер базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}`.   Размер кластера задается либо тарифом (`preset_id`), либо конфигуратором (`configuration`) — эти поля взаимоисключающие.
     * Изменение кластера базы данных
     */
    async updateDatabaseCluster(requestParameters: UpdateDatabaseClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateDatabaseCluster200Response> {
        const response = await this.updateDatabaseClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить кластер базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v2/databases/{db_cluster_id}`.   В отличие от `/api/v1/databases/{db_cluster_id}`, эта версия дополнительно позволяет привязать плавающий IP-адрес (`floating_ip`).   Размер кластера задается либо тарифом (`preset_id`), либо конфигуратором (`configuration`) — эти поля взаимоисключающие.
     * Изменение кластера базы данных (v2)
     */
    async updateDatabaseClusterV2Raw(requestParameters: UpdateDatabaseClusterV2Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateDatabaseCluster200Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling updateDatabaseClusterV2.');
        }

        if (requestParameters.updateClusterV2 === null || requestParameters.updateClusterV2 === undefined) {
            throw new runtime.RequiredError('updateClusterV2','Required parameter requestParameters.updateClusterV2 was null or undefined when calling updateDatabaseClusterV2.');
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
            path: `/api/v2/databases/{db_cluster_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateClusterV2ToJSON(requestParameters.updateClusterV2),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateDatabaseCluster200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить кластер базы данных на вашем аккаунте, отправьте PATCH-запрос на `/api/v2/databases/{db_cluster_id}`.   В отличие от `/api/v1/databases/{db_cluster_id}`, эта версия дополнительно позволяет привязать плавающий IP-адрес (`floating_ip`).   Размер кластера задается либо тарифом (`preset_id`), либо конфигуратором (`configuration`) — эти поля взаимоисключающие.
     * Изменение кластера базы данных (v2)
     */
    async updateDatabaseClusterV2(requestParameters: UpdateDatabaseClusterV2Request, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateDatabaseCluster200Response> {
        const response = await this.updateDatabaseClusterV2Raw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить инстанс базы данных, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.   Изменить название базы данных (`name`) и ее владельца (`owner_id`) можно только в кластере PostgreSQL, а настройки топика (`config_parameters`) — только в кластере Kafka. Если один из этих трех параметров передан для неподходящего типа кластера, запрос вернется с ошибкой 409.   Расширения (`extensions`) применимы к кластерам PostgreSQL и RabbitMQ.
     * Изменение инстанса базы данных
     */
    async updateDatabaseInstanceRaw(requestParameters: UpdateDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseInstance201Response>> {
        if (requestParameters.dbClusterId === null || requestParameters.dbClusterId === undefined) {
            throw new runtime.RequiredError('dbClusterId','Required parameter requestParameters.dbClusterId was null or undefined when calling updateDatabaseInstance.');
        }

        if (requestParameters.instanceId === null || requestParameters.instanceId === undefined) {
            throw new runtime.RequiredError('instanceId','Required parameter requestParameters.instanceId was null or undefined when calling updateDatabaseInstance.');
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
            path: `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.replace(`{${"db_cluster_id"}}`, encodeURIComponent(String(requestParameters.dbClusterId))).replace(`{${"instance_id"}}`, encodeURIComponent(String(requestParameters.instanceId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateInstanceToJSON(requestParameters.updateInstance),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseInstance201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить инстанс базы данных, отправьте PATCH-запрос на `/api/v1/databases/{db_cluster_id}/instances/{instance_id}`.   Изменить название базы данных (`name`) и ее владельца (`owner_id`) можно только в кластере PostgreSQL, а настройки топика (`config_parameters`) — только в кластере Kafka. Если один из этих трех параметров передан для неподходящего типа кластера, запрос вернется с ошибкой 409.   Расширения (`extensions`) применимы к кластерам PostgreSQL и RabbitMQ.
     * Изменение инстанса базы данных
     */
    async updateDatabaseInstance(requestParameters: UpdateDatabaseInstanceRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseInstance201Response> {
        const response = await this.updateDatabaseInstanceRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить комментарий к резервной копии кластера базы данных, отправьте PATCH-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}`.   Изменить можно только комментарий: других полей метод не принимает, сама резервная копия при этом не пересоздается. Тело ответа будет представлять собой объект JSON с ключом `backup`.
     * Изменение комментария S3-бэкапа базы данных
     */
    async updateDatabaseS3BackupRaw(requestParameters: UpdateDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDatabaseS3Backup201Response>> {
        if (requestParameters.dbId === null || requestParameters.dbId === undefined) {
            throw new runtime.RequiredError('dbId','Required parameter requestParameters.dbId was null or undefined when calling updateDatabaseS3Backup.');
        }

        if (requestParameters.backupId === null || requestParameters.backupId === undefined) {
            throw new runtime.RequiredError('backupId','Required parameter requestParameters.backupId was null or undefined when calling updateDatabaseS3Backup.');
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
            path: `/api/v2/databases/{db_id}/backups/{backup_id}`.replace(`{${"db_id"}}`, encodeURIComponent(String(requestParameters.dbId))).replace(`{${"backup_id"}}`, encodeURIComponent(String(requestParameters.backupId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateS3BackupToJSON(requestParameters.updateS3Backup),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDatabaseS3Backup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить комментарий к резервной копии кластера базы данных, отправьте PATCH-запрос на `/api/v2/databases/{db_id}/backups/{backup_id}`.   Изменить можно только комментарий: других полей метод не принимает, сама резервная копия при этом не пересоздается. Тело ответа будет представлять собой объект JSON с ключом `backup`.
     * Изменение комментария S3-бэкапа базы данных
     */
    async updateDatabaseS3Backup(requestParameters: UpdateDatabaseS3BackupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDatabaseS3Backup201Response> {
        const response = await this.updateDatabaseS3BackupRaw(requestParameters, initOverrides);
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

/**
 * @export
 */
export const GetDatabaseDefaultParametersTypeEnum = {
    Mysql5: 'mysql5',
    Mysql: 'mysql',
    Mysql84: 'mysql8_4',
    Postgres: 'postgres',
    Postgres14: 'postgres14',
    Postgres15: 'postgres15',
    Postgres16: 'postgres16',
    Postgres17: 'postgres17',
    Postgres18: 'postgres18',
    Redis: 'redis',
    Redis7: 'redis7',
    Redis81: 'redis8_1',
    Valkey: 'valkey',
    Valkey7: 'valkey7',
    Valkey81: 'valkey8_1',
    Valkey91: 'valkey9_1',
    Mongodb4: 'mongodb4',
    Mongodb: 'mongodb',
    Mongodb6: 'mongodb6',
    Mongodb7: 'mongodb7',
    Mongodb80: 'mongodb8_0',
    Opensearch: 'opensearch',
    Opensearch219: 'opensearch2_19',
    Clickhouse: 'clickhouse',
    Clickhouse24: 'clickhouse24',
    Clickhouse25: 'clickhouse25',
    Kafka: 'kafka',
    Rabbitmq: 'rabbitmq',
    Rabbitmq40: 'rabbitmq4_0'
} as const;
export type GetDatabaseDefaultParametersTypeEnum = typeof GetDatabaseDefaultParametersTypeEnum[keyof typeof GetDatabaseDefaultParametersTypeEnum];
