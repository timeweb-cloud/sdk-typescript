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
  AddGithub,
  AddProvider201Response,
  AppsPresets,
  AvailableFrameworks,
  CreateApp,
  CreateApp201Response,
  CreateDatabaseBackup409Response,
  CreateDeploy201Response,
  CreateDeployRequest,
  GetAppDeploys200Response,
  GetAppLogs200Response,
  GetApps200Response,
  GetBranches200Response,
  GetCommits200Response,
  GetDeployLogs200Response,
  GetDeploySettings200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances403Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  GetProviders200Response,
  GetRepositories200Response,
  GetServerStatistics200Response,
  UpdateAppSettings200Response,
  UpdeteSettings,
} from '../models/index';
import {
    AddGithubFromJSON,
    AddGithubToJSON,
    AddProvider201ResponseFromJSON,
    AddProvider201ResponseToJSON,
    AppsPresetsFromJSON,
    AppsPresetsToJSON,
    AvailableFrameworksFromJSON,
    AvailableFrameworksToJSON,
    CreateAppFromJSON,
    CreateAppToJSON,
    CreateApp201ResponseFromJSON,
    CreateApp201ResponseToJSON,
    CreateDatabaseBackup409ResponseFromJSON,
    CreateDatabaseBackup409ResponseToJSON,
    CreateDeploy201ResponseFromJSON,
    CreateDeploy201ResponseToJSON,
    CreateDeployRequestFromJSON,
    CreateDeployRequestToJSON,
    GetAppDeploys200ResponseFromJSON,
    GetAppDeploys200ResponseToJSON,
    GetAppLogs200ResponseFromJSON,
    GetAppLogs200ResponseToJSON,
    GetApps200ResponseFromJSON,
    GetApps200ResponseToJSON,
    GetBranches200ResponseFromJSON,
    GetBranches200ResponseToJSON,
    GetCommits200ResponseFromJSON,
    GetCommits200ResponseToJSON,
    GetDeployLogs200ResponseFromJSON,
    GetDeployLogs200ResponseToJSON,
    GetDeploySettings200ResponseFromJSON,
    GetDeploySettings200ResponseToJSON,
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
    GetProviders200ResponseFromJSON,
    GetProviders200ResponseToJSON,
    GetRepositories200ResponseFromJSON,
    GetRepositories200ResponseToJSON,
    GetServerStatistics200ResponseFromJSON,
    GetServerStatistics200ResponseToJSON,
    UpdateAppSettings200ResponseFromJSON,
    UpdateAppSettings200ResponseToJSON,
    UpdeteSettingsFromJSON,
    UpdeteSettingsToJSON,
} from '../models/index';

export interface AddProviderRequest {
    addGithub: AddGithub;
}

export interface CreateAppRequest {
    createApp: CreateApp;
}

export interface CreateDeployOperationRequest {
    appId: string;
    createDeployRequest: CreateDeployRequest;
}

export interface DeleteAppRequest {
    appId: string;
}

export interface DeleteProviderRequest {
    providerId: string;
}

export interface DeployActionRequest {
    appId: string;
    deployId: string;
}

export interface GetAppRequest {
    appId: string;
}

export interface GetAppDeploysRequest {
    appId: string;
    limit?: number;
    offset?: number;
}

export interface GetAppLogsRequest {
    appId: string;
}

export interface GetAppStatisticsRequest {
    appId: string;
    dateFrom: string;
    dateTo: string;
}

export interface GetAppsPresetsRequest {
    appId: string;
}

export interface GetBranchesRequest {
    providerId: string;
    repositoryId: string;
}

export interface GetCommitsRequest {
    accountId: string;
    providerId: string;
    repositoryId: string;
    name: string;
}

export interface GetDeployLogsRequest {
    appId: string;
    deployId: string;
    debug?: boolean;
}

export interface GetDeploySettingsRequest {
    appId: string;
}

export interface GetFrameworksRequest {
    appId: string;
}

export interface GetRepositoriesRequest {
    providerId: string;
}

export interface UpdateAppSettingsRequest {
    appId: string;
    updeteSettings: UpdeteSettings;
}

export interface UpdateAppStateRequest {
    appId: string;
    action: UpdateAppStateActionEnum;
}

/**
 * 
 */
export class AppsApi extends runtime.BaseAPI {

    /**
     * Чтобы привязать аккаунт провайдера отправьте POST-запрос в `/api/v1/vcs-provider`, задав необходимые атрибуты.
     * Привязка vcs провайдера
     */
    async addProviderRaw(requestParameters: AddProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddProvider201Response>> {
        if (requestParameters.addGithub === null || requestParameters.addGithub === undefined) {
            throw new runtime.RequiredError('addGithub','Required parameter requestParameters.addGithub was null or undefined when calling addProvider.');
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
            path: `/api/v1/vcs-provider`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddGithubToJSON(requestParameters.addGithub),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddProvider201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы привязать аккаунт провайдера отправьте POST-запрос в `/api/v1/vcs-provider`, задав необходимые атрибуты.
     * Привязка vcs провайдера
     */
    async addProvider(requestParameters: AddProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddProvider201Response> {
        const response = await this.addProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать приложение, отправьте POST-запрос в `/api/v1/apps`, задав необходимые атрибуты.
     * Создание приложения
     */
    async createAppRaw(requestParameters: CreateAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateApp201Response>> {
        if (requestParameters.createApp === null || requestParameters.createApp === undefined) {
            throw new runtime.RequiredError('createApp','Required parameter requestParameters.createApp was null or undefined when calling createApp.');
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
            path: `/api/v1/apps`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAppToJSON(requestParameters.createApp),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateApp201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать приложение, отправьте POST-запрос в `/api/v1/apps`, задав необходимые атрибуты.
     * Создание приложения
     */
    async createApp(requestParameters: CreateAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateApp201Response> {
        const response = await this.createAppRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы запустить деплой приложения, отправьте POST-запрос в `/api/v1/apps/{app_id}/deploy`, задав необходимые атрибуты.
     * Запуск деплоя приложения
     */
    async createDeployRaw(requestParameters: CreateDeployOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDeploy201Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling createDeploy.');
        }

        if (requestParameters.createDeployRequest === null || requestParameters.createDeployRequest === undefined) {
            throw new runtime.RequiredError('createDeployRequest','Required parameter requestParameters.createDeployRequest was null or undefined when calling createDeploy.');
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
            path: `/api/v1/apps/{app_id}/deploy`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateDeployRequestToJSON(requestParameters.createDeployRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDeploy201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы запустить деплой приложения, отправьте POST-запрос в `/api/v1/apps/{app_id}/deploy`, задав необходимые атрибуты.
     * Запуск деплоя приложения
     */
    async createDeploy(requestParameters: CreateDeployOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDeploy201Response> {
        const response = await this.createDeployRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить приложение, отправьте DELETE-запрос в `/api/v1/apps/{app_id}`.
     * Удаление приложения
     */
    async deleteAppRaw(requestParameters: DeleteAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling deleteApp.');
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
            path: `/api/v1/apps/{app_id}`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить приложение, отправьте DELETE-запрос в `/api/v1/apps/{app_id}`.
     * Удаление приложения
     */
    async deleteApp(requestParameters: DeleteAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAppRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы отвязать vcs провайдера от аккаунта, отправьте DELETE-запрос в `/api/v1/vcs-provider/{provider_id}`.
     * Отвязка vcs провайдера от аккаунта
     */
    async deleteProviderRaw(requestParameters: DeleteProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.providerId === null || requestParameters.providerId === undefined) {
            throw new runtime.RequiredError('providerId','Required parameter requestParameters.providerId was null or undefined when calling deleteProvider.');
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
            path: `/api/v1/vcs-provider/{provider_id}`.replace(`{${"provider_id"}}`, encodeURIComponent(String(requestParameters.providerId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы отвязать vcs провайдера от аккаунта, отправьте DELETE-запрос в `/api/v1/vcs-provider/{provider_id}`.
     * Отвязка vcs провайдера от аккаунта
     */
    async deleteProvider(requestParameters: DeleteProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProviderRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы остановить деплой приложения, отправьте POST-запрос в `api/v1/apps/{app_id}/deploy/{deploy_id}/stop`.
     * Остановка деплоя приложения
     */
    async deployActionRaw(requestParameters: DeployActionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateDeploy201Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling deployAction.');
        }

        if (requestParameters.deployId === null || requestParameters.deployId === undefined) {
            throw new runtime.RequiredError('deployId','Required parameter requestParameters.deployId was null or undefined when calling deployAction.');
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
            path: `/api/v1/apps/{app_id}/deploy/{deploy_id}/stop`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))).replace(`{${"deploy_id"}}`, encodeURIComponent(String(requestParameters.deployId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateDeploy201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы остановить деплой приложения, отправьте POST-запрос в `api/v1/apps/{app_id}/deploy/{deploy_id}/stop`.
     * Остановка деплоя приложения
     */
    async deployAction(requestParameters: DeployActionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateDeploy201Response> {
        const response = await this.deployActionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить приложение по id, отправьте GET-запрос на `/api/v1/apps/{app_id}`.
     * Получение приложения по id
     */
    async getAppRaw(requestParameters: GetAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateApp201Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getApp.');
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
            path: `/api/v1/apps/{app_id}`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateApp201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить приложение по id, отправьте GET-запрос на `/api/v1/apps/{app_id}`.
     * Получение приложения по id
     */
    async getApp(requestParameters: GetAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateApp201Response> {
        const response = await this.getAppRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список деплоев приложения, отправьте GET-запрос на `/api/v1/apps/{app_id}/deploys`.
     * Получение списка деплоев приложения
     */
    async getAppDeploysRaw(requestParameters: GetAppDeploysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAppDeploys200Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getAppDeploys.');
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
            path: `/api/v1/apps/{app_id}/deploys`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAppDeploys200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список деплоев приложения, отправьте GET-запрос на `/api/v1/apps/{app_id}/deploys`.
     * Получение списка деплоев приложения
     */
    async getAppDeploys(requestParameters: GetAppDeploysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAppDeploys200Response> {
        const response = await this.getAppDeploysRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить логи приложения, отправьте GET-запрос на `/api/v1/apps/{app_id}/logs`.
     * Получение логов приложения
     */
    async getAppLogsRaw(requestParameters: GetAppLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAppLogs200Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getAppLogs.');
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
            path: `/api/v1/apps/{app_id}/logs`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAppLogs200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить логи приложения, отправьте GET-запрос на `/api/v1/apps/{app_id}/logs`.
     * Получение логов приложения
     */
    async getAppLogs(requestParameters: GetAppLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAppLogs200Response> {
        const response = await this.getAppLogsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить статистику сервера, отправьте GET-запрос на `/api/v1/apps/{app_id}/statistics`. Метод поддерживает только приложения `type: backend`.
     * Получение статистики приложения
     */
    async getAppStatisticsRaw(requestParameters: GetAppStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetServerStatistics200Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getAppStatistics.');
        }

        if (requestParameters.dateFrom === null || requestParameters.dateFrom === undefined) {
            throw new runtime.RequiredError('dateFrom','Required parameter requestParameters.dateFrom was null or undefined when calling getAppStatistics.');
        }

        if (requestParameters.dateTo === null || requestParameters.dateTo === undefined) {
            throw new runtime.RequiredError('dateTo','Required parameter requestParameters.dateTo was null or undefined when calling getAppStatistics.');
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
            path: `/api/v1/apps/{app_id}/statistics`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetServerStatistics200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить статистику сервера, отправьте GET-запрос на `/api/v1/apps/{app_id}/statistics`. Метод поддерживает только приложения `type: backend`.
     * Получение статистики приложения
     */
    async getAppStatistics(requestParameters: GetAppStatisticsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetServerStatistics200Response> {
        const response = await this.getAppStatisticsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список приложений, отправьте GET-запрос на `/api/v1/apps`.
     * Получение списка приложений
     */
    async getAppsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetApps200Response>> {
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
            path: `/api/v1/apps`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetApps200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список приложений, отправьте GET-запрос на `/api/v1/apps`.
     * Получение списка приложений
     */
    async getApps(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetApps200Response> {
        const response = await this.getAppsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список доступных тарифов, отправьте GET-запрос на `/api/v1/presets/apps`.
     * Получение списка доступных тарифов для приложения
     */
    async getAppsPresetsRaw(requestParameters: GetAppsPresetsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AppsPresets>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getAppsPresets.');
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
            path: `/api/v1/presets/apps`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AppsPresetsFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список доступных тарифов, отправьте GET-запрос на `/api/v1/presets/apps`.
     * Получение списка доступных тарифов для приложения
     */
    async getAppsPresets(requestParameters: GetAppsPresetsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AppsPresets> {
        const response = await this.getAppsPresetsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список веток репозитория, отправьте GET-запрос на `/api/v1/vcs-provider/{provider_id}/repository/{repository_id}`.
     * Получение списка веток репозитория
     */
    async getBranchesRaw(requestParameters: GetBranchesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetBranches200Response>> {
        if (requestParameters.providerId === null || requestParameters.providerId === undefined) {
            throw new runtime.RequiredError('providerId','Required parameter requestParameters.providerId was null or undefined when calling getBranches.');
        }

        if (requestParameters.repositoryId === null || requestParameters.repositoryId === undefined) {
            throw new runtime.RequiredError('repositoryId','Required parameter requestParameters.repositoryId was null or undefined when calling getBranches.');
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
            path: `/api/v1/vcs-provider/{provider_id}/repository/{repository_id}`.replace(`{${"provider_id"}}`, encodeURIComponent(String(requestParameters.providerId))).replace(`{${"repository_id"}}`, encodeURIComponent(String(requestParameters.repositoryId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetBranches200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список веток репозитория, отправьте GET-запрос на `/api/v1/vcs-provider/{provider_id}/repository/{repository_id}`.
     * Получение списка веток репозитория
     */
    async getBranches(requestParameters: GetBranchesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetBranches200Response> {
        const response = await this.getBranchesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список коммитов ветки репозитория, отправьте GET-запрос на `/api/v1/vcs-provider/{provider_id}/repository/{repository_id}/branch`.
     * Получение списка коммитов ветки репозитория
     */
    async getCommitsRaw(requestParameters: GetCommitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCommits200Response>> {
        if (requestParameters.accountId === null || requestParameters.accountId === undefined) {
            throw new runtime.RequiredError('accountId','Required parameter requestParameters.accountId was null or undefined when calling getCommits.');
        }

        if (requestParameters.providerId === null || requestParameters.providerId === undefined) {
            throw new runtime.RequiredError('providerId','Required parameter requestParameters.providerId was null or undefined when calling getCommits.');
        }

        if (requestParameters.repositoryId === null || requestParameters.repositoryId === undefined) {
            throw new runtime.RequiredError('repositoryId','Required parameter requestParameters.repositoryId was null or undefined when calling getCommits.');
        }

        if (requestParameters.name === null || requestParameters.name === undefined) {
            throw new runtime.RequiredError('name','Required parameter requestParameters.name was null or undefined when calling getCommits.');
        }

        const queryParameters: any = {};

        if (requestParameters.name !== undefined) {
            queryParameters['name'] = requestParameters.name;
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
            path: `/api/v1/vcs-provider/{provider_id}/repository/{repository_id}/branch`.replace(`{${"account_id"}}`, encodeURIComponent(String(requestParameters.accountId))).replace(`{${"provider_id"}}`, encodeURIComponent(String(requestParameters.providerId))).replace(`{${"repository_id"}}`, encodeURIComponent(String(requestParameters.repositoryId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCommits200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список коммитов ветки репозитория, отправьте GET-запрос на `/api/v1/vcs-provider/{provider_id}/repository/{repository_id}/branch`.
     * Получение списка коммитов ветки репозитория
     */
    async getCommits(requestParameters: GetCommitsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCommits200Response> {
        const response = await this.getCommitsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о деплое, отправьте GET-запрос на `api/v1/apps/{app_id}/deploy/{deploy_id}/logs`.
     * Получение логов деплоя приложения
     */
    async getDeployLogsRaw(requestParameters: GetDeployLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDeployLogs200Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getDeployLogs.');
        }

        if (requestParameters.deployId === null || requestParameters.deployId === undefined) {
            throw new runtime.RequiredError('deployId','Required parameter requestParameters.deployId was null or undefined when calling getDeployLogs.');
        }

        const queryParameters: any = {};

        if (requestParameters.debug !== undefined) {
            queryParameters['debug'] = requestParameters.debug;
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
            path: `/api/v1/apps/{app_id}/deploy/{deploy_id}/logs`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))).replace(`{${"deploy_id"}}`, encodeURIComponent(String(requestParameters.deployId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDeployLogs200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о деплое, отправьте GET-запрос на `api/v1/apps/{app_id}/deploy/{deploy_id}/logs`.
     * Получение логов деплоя приложения
     */
    async getDeployLogs(requestParameters: GetDeployLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDeployLogs200Response> {
        const response = await this.getDeployLogsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список настроек деплоя, отправьте GET-запрос на `/api/v1/deploy-settings/apps`.
     * Получение списка дефолтных настроек деплоя для приложения
     */
    async getDeploySettingsRaw(requestParameters: GetDeploySettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetDeploySettings200Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getDeploySettings.');
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
            path: `/api/v1/deploy-settings/apps`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetDeploySettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список настроек деплоя, отправьте GET-запрос на `/api/v1/deploy-settings/apps`.
     * Получение списка дефолтных настроек деплоя для приложения
     */
    async getDeploySettings(requestParameters: GetDeploySettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetDeploySettings200Response> {
        const response = await this.getDeploySettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список доступных фреймворков, отправьте GET-запрос на `/api/v1/frameworks/apps`.
     * Получение списка доступных фреймворков для приложения
     */
    async getFrameworksRaw(requestParameters: GetFrameworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AvailableFrameworks>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling getFrameworks.');
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
            path: `/api/v1/frameworks/apps`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AvailableFrameworksFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список доступных фреймворков, отправьте GET-запрос на `/api/v1/frameworks/apps`.
     * Получение списка доступных фреймворков для приложения
     */
    async getFrameworks(requestParameters: GetFrameworksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AvailableFrameworks> {
        const response = await this.getFrameworksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список vcs провайдеров, отправьте GET-запрос на `/api/v1/vcs-provider`.
     * Получение списка vcs провайдеров
     */
    async getProvidersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProviders200Response>> {
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
            path: `/api/v1/vcs-provider`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProviders200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список vcs провайдеров, отправьте GET-запрос на `/api/v1/vcs-provider`.
     * Получение списка vcs провайдеров
     */
    async getProviders(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProviders200Response> {
        const response = await this.getProvidersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список репозиториев vcs провайдера, отправьте GET-запрос на `/api/v1/vcs-provider/{provider_id}`.
     * Получение списка репозиториев vcs провайдера
     */
    async getRepositoriesRaw(requestParameters: GetRepositoriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetRepositories200Response>> {
        if (requestParameters.providerId === null || requestParameters.providerId === undefined) {
            throw new runtime.RequiredError('providerId','Required parameter requestParameters.providerId was null or undefined when calling getRepositories.');
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
            path: `/api/v1/vcs-provider/{provider_id}`.replace(`{${"provider_id"}}`, encodeURIComponent(String(requestParameters.providerId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetRepositories200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список репозиториев vcs провайдера, отправьте GET-запрос на `/api/v1/vcs-provider/{provider_id}`.
     * Получение списка репозиториев vcs провайдера
     */
    async getRepositories(requestParameters: GetRepositoriesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetRepositories200Response> {
        const response = await this.getRepositoriesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить настройки приложения отправьте PATCH-запрос в `/api/v1/apps/{app_id}`, задав необходимые атрибуты.
     * Изменение настроек приложения
     */
    async updateAppSettingsRaw(requestParameters: UpdateAppSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UpdateAppSettings200Response>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling updateAppSettings.');
        }

        if (requestParameters.updeteSettings === null || requestParameters.updeteSettings === undefined) {
            throw new runtime.RequiredError('updeteSettings','Required parameter requestParameters.updeteSettings was null or undefined when calling updateAppSettings.');
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
            path: `/api/v1/apps/{app_id}`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdeteSettingsToJSON(requestParameters.updeteSettings),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UpdateAppSettings200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить настройки приложения отправьте PATCH-запрос в `/api/v1/apps/{app_id}`, задав необходимые атрибуты.
     * Изменение настроек приложения
     */
    async updateAppSettings(requestParameters: UpdateAppSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UpdateAppSettings200Response> {
        const response = await this.updateAppSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить состояние приложения отправьте PATCH-запрос в `/api/v1/apps/{app_id}/action/{action}`, задав необходимые атрибуты.
     * Изменение состояния приложения
     */
    async updateAppStateRaw(requestParameters: UpdateAppStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.appId === null || requestParameters.appId === undefined) {
            throw new runtime.RequiredError('appId','Required parameter requestParameters.appId was null or undefined when calling updateAppState.');
        }

        if (requestParameters.action === null || requestParameters.action === undefined) {
            throw new runtime.RequiredError('action','Required parameter requestParameters.action was null or undefined when calling updateAppState.');
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
            path: `/api/v1/apps/{app_id}/action/{action}`.replace(`{${"app_id"}}`, encodeURIComponent(String(requestParameters.appId))).replace(`{${"action"}}`, encodeURIComponent(String(requestParameters.action))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы изменить состояние приложения отправьте PATCH-запрос в `/api/v1/apps/{app_id}/action/{action}`, задав необходимые атрибуты.
     * Изменение состояния приложения
     */
    async updateAppState(requestParameters: UpdateAppStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateAppStateRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const UpdateAppStateActionEnum = {
    Reboot: 'reboot',
    Pause: 'pause',
    Resume: 'resume'
} as const;
export type UpdateAppStateActionEnum = typeof UpdateAppStateActionEnum[keyof typeof UpdateAppStateActionEnum];
