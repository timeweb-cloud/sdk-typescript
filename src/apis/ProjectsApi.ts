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
  AddBalancerToProject200Response,
  AddBalancerToProjectRequest,
  AddClusterToProjectRequest,
  AddDatabaseToProjectRequest,
  AddDedicatedServerToProjectRequest,
  AddServerToProjectRequest,
  AddStorageToProjectRequest,
  CreateProject,
  CreateProject201Response,
  GetAccountStatus403Response,
  GetAllProjectResources200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  GetProjectBalancers200Response,
  GetProjectClusters200Response,
  GetProjectDatabases200Response,
  GetProjectDedicatedServers200Response,
  GetProjectServers200Response,
  GetProjectStorages200Response,
  GetProjects200Response,
  ResourceTransfer,
  UpdateProject,
} from '../models/index';
import {
    AddBalancerToProject200ResponseFromJSON,
    AddBalancerToProject200ResponseToJSON,
    AddBalancerToProjectRequestFromJSON,
    AddBalancerToProjectRequestToJSON,
    AddClusterToProjectRequestFromJSON,
    AddClusterToProjectRequestToJSON,
    AddDatabaseToProjectRequestFromJSON,
    AddDatabaseToProjectRequestToJSON,
    AddDedicatedServerToProjectRequestFromJSON,
    AddDedicatedServerToProjectRequestToJSON,
    AddServerToProjectRequestFromJSON,
    AddServerToProjectRequestToJSON,
    AddStorageToProjectRequestFromJSON,
    AddStorageToProjectRequestToJSON,
    CreateProjectFromJSON,
    CreateProjectToJSON,
    CreateProject201ResponseFromJSON,
    CreateProject201ResponseToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAllProjectResources200ResponseFromJSON,
    GetAllProjectResources200ResponseToJSON,
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
    GetProjectBalancers200ResponseFromJSON,
    GetProjectBalancers200ResponseToJSON,
    GetProjectClusters200ResponseFromJSON,
    GetProjectClusters200ResponseToJSON,
    GetProjectDatabases200ResponseFromJSON,
    GetProjectDatabases200ResponseToJSON,
    GetProjectDedicatedServers200ResponseFromJSON,
    GetProjectDedicatedServers200ResponseToJSON,
    GetProjectServers200ResponseFromJSON,
    GetProjectServers200ResponseToJSON,
    GetProjectStorages200ResponseFromJSON,
    GetProjectStorages200ResponseToJSON,
    GetProjects200ResponseFromJSON,
    GetProjects200ResponseToJSON,
    ResourceTransferFromJSON,
    ResourceTransferToJSON,
    UpdateProjectFromJSON,
    UpdateProjectToJSON,
} from '../models/index';

export interface AddBalancerToProjectOperationRequest {
    projectId: number;
    addBalancerToProjectRequest: AddBalancerToProjectRequest;
}

export interface AddClusterToProjectOperationRequest {
    projectId: number;
    addClusterToProjectRequest: AddClusterToProjectRequest;
}

export interface AddDatabaseToProjectOperationRequest {
    projectId: number;
    addDatabaseToProjectRequest: AddDatabaseToProjectRequest;
}

export interface AddDedicatedServerToProjectOperationRequest {
    projectId: number;
    addDedicatedServerToProjectRequest: AddDedicatedServerToProjectRequest;
}

export interface AddServerToProjectOperationRequest {
    projectId: number;
    addServerToProjectRequest: AddServerToProjectRequest;
}

export interface AddStorageToProjectOperationRequest {
    projectId: number;
    addStorageToProjectRequest: AddStorageToProjectRequest;
}

export interface CreateProjectRequest {
    createProject: CreateProject;
}

export interface DeleteProjectRequest {
    projectId: number;
}

export interface GetAllProjectResourcesRequest {
    projectId: number;
}

export interface GetProjectRequest {
    projectId: number;
}

export interface GetProjectBalancersRequest {
    projectId: number;
}

export interface GetProjectClustersRequest {
    projectId: number;
}

export interface GetProjectDatabasesRequest {
    projectId: number;
}

export interface GetProjectDedicatedServersRequest {
    projectId: number;
}

export interface GetProjectServersRequest {
    projectId: number;
}

export interface GetProjectStoragesRequest {
    projectId: number;
}

export interface TransferResourceToAnotherProjectRequest {
    projectId: number;
    resourceTransfer: ResourceTransfer;
}

export interface UpdateProjectRequest {
    projectId: number;
    updateProject: UpdateProject;
}

/**
 * 
 */
export class ProjectsApi extends runtime.BaseAPI {

    /**
     * Чтобы добавить балансировщик в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/balancers`, задав необходимые атрибуты.  Балансировщик будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном балансировщике.
     * Добавление балансировщика в проект
     */
    async addBalancerToProjectRaw(requestParameters: AddBalancerToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddBalancerToProject200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling addBalancerToProject.');
        }

        if (requestParameters.addBalancerToProjectRequest === null || requestParameters.addBalancerToProjectRequest === undefined) {
            throw new runtime.RequiredError('addBalancerToProjectRequest','Required parameter requestParameters.addBalancerToProjectRequest was null or undefined when calling addBalancerToProject.');
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
            path: `/api/v1/projects/{project_id}/resources/balancers`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddBalancerToProjectRequestToJSON(requestParameters.addBalancerToProjectRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddBalancerToProject200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить балансировщик в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/balancers`, задав необходимые атрибуты.  Балансировщик будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном балансировщике.
     * Добавление балансировщика в проект
     */
    async addBalancerToProject(requestParameters: AddBalancerToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddBalancerToProject200Response> {
        const response = await this.addBalancerToProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить кластер в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/clusters`, задав необходимые атрибуты.  Кластер будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном кластере.
     * Добавление кластера в проект
     */
    async addClusterToProjectRaw(requestParameters: AddClusterToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddBalancerToProject200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling addClusterToProject.');
        }

        if (requestParameters.addClusterToProjectRequest === null || requestParameters.addClusterToProjectRequest === undefined) {
            throw new runtime.RequiredError('addClusterToProjectRequest','Required parameter requestParameters.addClusterToProjectRequest was null or undefined when calling addClusterToProject.');
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
            path: `/api/v1/projects/{project_id}/resources/clusters`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddClusterToProjectRequestToJSON(requestParameters.addClusterToProjectRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddBalancerToProject200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить кластер в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/clusters`, задав необходимые атрибуты.  Кластер будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном кластере.
     * Добавление кластера в проект
     */
    async addClusterToProject(requestParameters: AddClusterToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddBalancerToProject200Response> {
        const response = await this.addClusterToProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить базу данных в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/databases`, задав необходимые атрибуты.  База данных будет добавлена в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленной базе данных.
     * Добавление базы данных в проект
     */
    async addDatabaseToProjectRaw(requestParameters: AddDatabaseToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddBalancerToProject200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling addDatabaseToProject.');
        }

        if (requestParameters.addDatabaseToProjectRequest === null || requestParameters.addDatabaseToProjectRequest === undefined) {
            throw new runtime.RequiredError('addDatabaseToProjectRequest','Required parameter requestParameters.addDatabaseToProjectRequest was null or undefined when calling addDatabaseToProject.');
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
            path: `/api/v1/projects/{project_id}/resources/databases`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddDatabaseToProjectRequestToJSON(requestParameters.addDatabaseToProjectRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddBalancerToProject200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить базу данных в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/databases`, задав необходимые атрибуты.  База данных будет добавлена в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленной базе данных.
     * Добавление базы данных в проект
     */
    async addDatabaseToProject(requestParameters: AddDatabaseToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddBalancerToProject200Response> {
        const response = await this.addDatabaseToProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить выделенный сервер в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/dedicated`, задав необходимые атрибуты.  Выделенный сервер будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном выделенном сервере.
     * Добавление выделенного сервера в проект
     */
    async addDedicatedServerToProjectRaw(requestParameters: AddDedicatedServerToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddBalancerToProject200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling addDedicatedServerToProject.');
        }

        if (requestParameters.addDedicatedServerToProjectRequest === null || requestParameters.addDedicatedServerToProjectRequest === undefined) {
            throw new runtime.RequiredError('addDedicatedServerToProjectRequest','Required parameter requestParameters.addDedicatedServerToProjectRequest was null or undefined when calling addDedicatedServerToProject.');
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
            path: `/api/v1/projects/{project_id}/resources/dedicated`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddDedicatedServerToProjectRequestToJSON(requestParameters.addDedicatedServerToProjectRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddBalancerToProject200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить выделенный сервер в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/dedicated`, задав необходимые атрибуты.  Выделенный сервер будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном выделенном сервере.
     * Добавление выделенного сервера в проект
     */
    async addDedicatedServerToProject(requestParameters: AddDedicatedServerToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddBalancerToProject200Response> {
        const response = await this.addDedicatedServerToProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить сервер в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/servers`, задав необходимые атрибуты.  Сервер будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном сервере.
     * Добавление сервера в проект
     */
    async addServerToProjectRaw(requestParameters: AddServerToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddBalancerToProject200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling addServerToProject.');
        }

        if (requestParameters.addServerToProjectRequest === null || requestParameters.addServerToProjectRequest === undefined) {
            throw new runtime.RequiredError('addServerToProjectRequest','Required parameter requestParameters.addServerToProjectRequest was null or undefined when calling addServerToProject.');
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
            path: `/api/v1/projects/{project_id}/resources/servers`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddServerToProjectRequestToJSON(requestParameters.addServerToProjectRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddBalancerToProject200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить сервер в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/servers`, задав необходимые атрибуты.  Сервер будет добавлен в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном сервере.
     * Добавление сервера в проект
     */
    async addServerToProject(requestParameters: AddServerToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddBalancerToProject200Response> {
        const response = await this.addServerToProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы добавить хранилище в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/buckets`, задав необходимые атрибуты.  Хранилище будет добавлено в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном хранилище.
     * Добавление хранилища в проект
     */
    async addStorageToProjectRaw(requestParameters: AddStorageToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddBalancerToProject200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling addStorageToProject.');
        }

        if (requestParameters.addStorageToProjectRequest === null || requestParameters.addStorageToProjectRequest === undefined) {
            throw new runtime.RequiredError('addStorageToProjectRequest','Required parameter requestParameters.addStorageToProjectRequest was null or undefined when calling addStorageToProject.');
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
            path: `/api/v1/projects/{project_id}/resources/buckets`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddStorageToProjectRequestToJSON(requestParameters.addStorageToProjectRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddBalancerToProject200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы добавить хранилище в проект, отправьте POST-запрос на `/api/v1/projects/{project_id}/resources/buckets`, задав необходимые атрибуты.  Хранилище будет добавлено в указанный проект. Тело ответа будет содержать объект JSON с информацией о добавленном хранилище.
     * Добавление хранилища в проект
     */
    async addStorageToProject(requestParameters: AddStorageToProjectOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddBalancerToProject200Response> {
        const response = await this.addStorageToProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать проект, отправьте POST-запрос в `api/v1/projects`, задав необходимые атрибуты.  Проект будет создан с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданном проекте.
     * Создание проекта
     */
    async createProjectRaw(requestParameters: CreateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateProject201Response>> {
        if (requestParameters.createProject === null || requestParameters.createProject === undefined) {
            throw new runtime.RequiredError('createProject','Required parameter requestParameters.createProject was null or undefined when calling createProject.');
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
            path: `/api/v1/projects`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateProjectToJSON(requestParameters.createProject),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateProject201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать проект, отправьте POST-запрос в `api/v1/projects`, задав необходимые атрибуты.  Проект будет создан с использованием предоставленной информации. Тело ответа будет содержать объект JSON с информацией о созданном проекте.
     * Создание проекта
     */
    async createProject(requestParameters: CreateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateProject201Response> {
        const response = await this.createProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить проект, отправьте запрос DELETE в `api/v1/projects/{project_id}`.
     * Удаление проекта
     */
    async deleteProjectRaw(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling deleteProject.');
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
            path: `/api/v1/projects/{project_id}`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить проект, отправьте запрос DELETE в `api/v1/projects/{project_id}`.
     * Удаление проекта
     */
    async deleteProject(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProjectRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить список всех балансировщиков на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/balancers`.
     * Получение списка всех балансировщиков на аккаунте
     */
    async getAccountBalancersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectBalancers200Response>> {
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
            path: `/api/v1/projects/resources/balancers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectBalancers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех балансировщиков на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/balancers`.
     * Получение списка всех балансировщиков на аккаунте
     */
    async getAccountBalancers(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectBalancers200Response> {
        const response = await this.getAccountBalancersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех кластеров на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/clusters`.
     * Получение списка всех кластеров на аккаунте
     */
    async getAccountClustersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectClusters200Response>> {
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
            path: `/api/v1/projects/resources/clusters`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectClusters200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех кластеров на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/clusters`.
     * Получение списка всех кластеров на аккаунте
     */
    async getAccountClusters(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectClusters200Response> {
        const response = await this.getAccountClustersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех баз данных на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/databases`.
     * Получение списка всех баз данных на аккаунте
     */
    async getAccountDatabasesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectDatabases200Response>> {
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
            path: `/api/v1/projects/resources/databases`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectDatabases200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех баз данных на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/databases`.
     * Получение списка всех баз данных на аккаунте
     */
    async getAccountDatabases(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectDatabases200Response> {
        const response = await this.getAccountDatabasesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех выделенных серверов на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/dedicated`.
     * Получение списка всех выделенных серверов на аккаунте
     */
    async getAccountDedicatedServersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectDedicatedServers200Response>> {
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
            path: `/api/v1/projects/resources/dedicated`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectDedicatedServers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех выделенных серверов на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/dedicated`.
     * Получение списка всех выделенных серверов на аккаунте
     */
    async getAccountDedicatedServers(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectDedicatedServers200Response> {
        const response = await this.getAccountDedicatedServersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех серверов на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/servers`.
     * Получение списка всех серверов на аккаунте
     */
    async getAccountServersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectServers200Response>> {
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
            path: `/api/v1/projects/resources/servers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectServers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех серверов на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/servers`.
     * Получение списка всех серверов на аккаунте
     */
    async getAccountServers(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectServers200Response> {
        const response = await this.getAccountServersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех хранилищ на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/buckets`.
     * Получение списка всех хранилищ на аккаунте
     */
    async getAccountStoragesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectStorages200Response>> {
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
            path: `/api/v1/projects/resources/buckets`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectStorages200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех хранилищ на аккаунте, отправьте GET-запрос на `/api/v1/projects/resources/buckets`.
     * Получение списка всех хранилищ на аккаунте
     */
    async getAccountStorages(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectStorages200Response> {
        const response = await this.getAccountStoragesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить все ресурсы проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources`.
     * Получение всех ресурсов проекта
     */
    async getAllProjectResourcesRaw(requestParameters: GetAllProjectResourcesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAllProjectResources200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getAllProjectResources.');
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
            path: `/api/v1/projects/{project_id}/resources`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAllProjectResources200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить все ресурсы проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources`.
     * Получение всех ресурсов проекта
     */
    async getAllProjectResources(requestParameters: GetAllProjectResourcesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAllProjectResources200Response> {
        const response = await this.getAllProjectResourcesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить проект по ID, отправьте GET-запрос на `/api/v1/projects/{project_id}`.
     * Получение проекта по ID
     */
    async getProjectRaw(requestParameters: GetProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateProject201Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProject.');
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
            path: `/api/v1/projects/{project_id}`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateProject201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить проект по ID, отправьте GET-запрос на `/api/v1/projects/{project_id}`.
     * Получение проекта по ID
     */
    async getProject(requestParameters: GetProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateProject201Response> {
        const response = await this.getProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список балансировщиков проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/balancers`.
     * Получение списка балансировщиков проекта
     */
    async getProjectBalancersRaw(requestParameters: GetProjectBalancersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectBalancers200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProjectBalancers.');
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
            path: `/api/v1/projects/{project_id}/resources/balancers`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectBalancers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список балансировщиков проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/balancers`.
     * Получение списка балансировщиков проекта
     */
    async getProjectBalancers(requestParameters: GetProjectBalancersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectBalancers200Response> {
        const response = await this.getProjectBalancersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список кластеров проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/clusters`.
     * Получение списка кластеров проекта
     */
    async getProjectClustersRaw(requestParameters: GetProjectClustersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectClusters200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProjectClusters.');
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
            path: `/api/v1/projects/{project_id}/resources/clusters`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectClusters200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список кластеров проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/clusters`.
     * Получение списка кластеров проекта
     */
    async getProjectClusters(requestParameters: GetProjectClustersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectClusters200Response> {
        const response = await this.getProjectClustersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список баз данных проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/databases`.
     * Получение списка баз данных проекта
     */
    async getProjectDatabasesRaw(requestParameters: GetProjectDatabasesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectDatabases200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProjectDatabases.');
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
            path: `/api/v1/projects/{project_id}/resources/databases`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectDatabases200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список баз данных проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/databases`.
     * Получение списка баз данных проекта
     */
    async getProjectDatabases(requestParameters: GetProjectDatabasesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectDatabases200Response> {
        const response = await this.getProjectDatabasesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список выделенных серверов проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/dedicated`.
     * Получение списка выделенных серверов проекта
     */
    async getProjectDedicatedServersRaw(requestParameters: GetProjectDedicatedServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectDedicatedServers200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProjectDedicatedServers.');
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
            path: `/api/v1/projects/{project_id}/resources/dedicated`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectDedicatedServers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список выделенных серверов проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/dedicated`.
     * Получение списка выделенных серверов проекта
     */
    async getProjectDedicatedServers(requestParameters: GetProjectDedicatedServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectDedicatedServers200Response> {
        const response = await this.getProjectDedicatedServersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список серверов проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/servers`.
     * Получение списка серверов проекта
     */
    async getProjectServersRaw(requestParameters: GetProjectServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectServers200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProjectServers.');
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
            path: `/api/v1/projects/{project_id}/resources/servers`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectServers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список серверов проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/servers`.
     * Получение списка серверов проекта
     */
    async getProjectServers(requestParameters: GetProjectServersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectServers200Response> {
        const response = await this.getProjectServersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список хранилищ проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/buckets`.
     * Получение списка хранилищ проекта
     */
    async getProjectStoragesRaw(requestParameters: GetProjectStoragesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjectStorages200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling getProjectStorages.');
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
            path: `/api/v1/projects/{project_id}/resources/buckets`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjectStorages200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список хранилищ проекта, отправьте GET-запрос на `/api/v1/projects/{project_id}/resources/buckets`.
     * Получение списка хранилищ проекта
     */
    async getProjectStorages(requestParameters: GetProjectStoragesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjectStorages200Response> {
        const response = await this.getProjectStoragesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список всех проектов на вашем аккаунте, отправьте GET-запрос на `/api/v1/projects`.   Тело ответа будет представлять собой объект JSON с ключом `projects`.
     * Получение списка проектов
     */
    async getProjectsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetProjects200Response>> {
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
            path: `/api/v1/projects`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProjects200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список всех проектов на вашем аккаунте, отправьте GET-запрос на `/api/v1/projects`.   Тело ответа будет представлять собой объект JSON с ключом `projects`.
     * Получение списка проектов
     */
    async getProjects(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetProjects200Response> {
        const response = await this.getProjectsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы перенести ресурс в другой проект, отправьте запрос PUT в `api/v1/projects/{project_id}/resources/transfer`. 
     * Перенести ресурс в другой проект
     */
    async transferResourceToAnotherProjectRaw(requestParameters: TransferResourceToAnotherProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AddBalancerToProject200Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling transferResourceToAnotherProject.');
        }

        if (requestParameters.resourceTransfer === null || requestParameters.resourceTransfer === undefined) {
            throw new runtime.RequiredError('resourceTransfer','Required parameter requestParameters.resourceTransfer was null or undefined when calling transferResourceToAnotherProject.');
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
            path: `/api/v1/projects/{project_id}/resources/transfer`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ResourceTransferToJSON(requestParameters.resourceTransfer),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AddBalancerToProject200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы перенести ресурс в другой проект, отправьте запрос PUT в `api/v1/projects/{project_id}/resources/transfer`. 
     * Перенести ресурс в другой проект
     */
    async transferResourceToAnotherProject(requestParameters: TransferResourceToAnotherProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AddBalancerToProject200Response> {
        const response = await this.transferResourceToAnotherProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить проект, отправьте запрос PUT в `api/v1/projects/{project_id}`.
     * Изменение проекта
     */
    async updateProjectRaw(requestParameters: UpdateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateProject201Response>> {
        if (requestParameters.projectId === null || requestParameters.projectId === undefined) {
            throw new runtime.RequiredError('projectId','Required parameter requestParameters.projectId was null or undefined when calling updateProject.');
        }

        if (requestParameters.updateProject === null || requestParameters.updateProject === undefined) {
            throw new runtime.RequiredError('updateProject','Required parameter requestParameters.updateProject was null or undefined when calling updateProject.');
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
            path: `/api/v1/projects/{project_id}`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters.projectId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateProjectToJSON(requestParameters.updateProject),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateProject201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить проект, отправьте запрос PUT в `api/v1/projects/{project_id}`.
     * Изменение проекта
     */
    async updateProject(requestParameters: UpdateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateProject201Response> {
        const response = await this.updateProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
