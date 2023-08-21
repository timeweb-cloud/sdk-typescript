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


import * as runtime from '../runtime';
import type {
  ClusterEdit,
  ClusterIn,
  CreateCluster201Response,
  CreateClusterNodeGroup201Response,
  DeleteCluster200Response,
  GetClusterNodeGroups200Response,
  GetClusterNodesFromGroup200Response,
  GetClusterResources200Response,
  GetClusters200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances403Response,
  GetFinances404Response,
  GetFinances429Response,
  GetFinances500Response,
  GetK8SNetworkDrivers200Response,
  GetK8SVersions200Response,
  GetKubernetesPresets200Response,
  NodeCount,
  NodeGroupIn,
} from '../models/index';
import {
    ClusterEditFromJSON,
    ClusterEditToJSON,
    ClusterInFromJSON,
    ClusterInToJSON,
    CreateCluster201ResponseFromJSON,
    CreateCluster201ResponseToJSON,
    CreateClusterNodeGroup201ResponseFromJSON,
    CreateClusterNodeGroup201ResponseToJSON,
    DeleteCluster200ResponseFromJSON,
    DeleteCluster200ResponseToJSON,
    GetClusterNodeGroups200ResponseFromJSON,
    GetClusterNodeGroups200ResponseToJSON,
    GetClusterNodesFromGroup200ResponseFromJSON,
    GetClusterNodesFromGroup200ResponseToJSON,
    GetClusterResources200ResponseFromJSON,
    GetClusterResources200ResponseToJSON,
    GetClusters200ResponseFromJSON,
    GetClusters200ResponseToJSON,
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
    GetK8SNetworkDrivers200ResponseFromJSON,
    GetK8SNetworkDrivers200ResponseToJSON,
    GetK8SVersions200ResponseFromJSON,
    GetK8SVersions200ResponseToJSON,
    GetKubernetesPresets200ResponseFromJSON,
    GetKubernetesPresets200ResponseToJSON,
    NodeCountFromJSON,
    NodeCountToJSON,
    NodeGroupInFromJSON,
    NodeGroupInToJSON,
} from '../models/index';

export interface CreateClusterRequest {
    clusterIn: ClusterIn;
}

export interface CreateClusterNodeGroupRequest {
    clusterId: number;
    nodeGroupIn: NodeGroupIn;
}

export interface DeleteClusterRequest {
    clusterId: number;
    hash?: string;
    code?: string;
}

export interface DeleteClusterNodeRequest {
    clusterId: number;
    nodeId: number;
}

export interface DeleteClusterNodeGroupRequest {
    clusterId: number;
    groupId: number;
}

export interface GetClusterRequest {
    clusterId: number;
}

export interface GetClusterKubeconfigRequest {
    clusterId: number;
}

export interface GetClusterNodeGroupRequest {
    clusterId: number;
    groupId: number;
}

export interface GetClusterNodeGroupsRequest {
    clusterId: number;
}

export interface GetClusterNodesRequest {
    clusterId: number;
}

export interface GetClusterNodesFromGroupRequest {
    clusterId: number;
    groupId: number;
    limit?: number;
    offset?: number;
}

export interface GetClusterResourcesRequest {
    clusterId: number;
}

export interface GetClustersRequest {
    limit?: number;
    offset?: number;
}

export interface IncreaseCountOfNodesInGroupRequest {
    clusterId: number;
    groupId: number;
    nodeCount: NodeCount;
}

export interface ReduceCountOfNodesInGroupRequest {
    clusterId: number;
    groupId: number;
    nodeCount: NodeCount;
}

export interface UpdateClusterRequest {
    clusterId: number;
    clusterEdit: ClusterEdit;
}

/**
 * 
 */
export class KubernetesApi extends runtime.BaseAPI {

    /**
     * Чтобы создать кластер, отправьте POST-запрос на `/api/v1/k8s/clusters`.
     * Создание кластера
     */
    async createClusterRaw(requestParameters: CreateClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCluster201Response>> {
        if (requestParameters.clusterIn === null || requestParameters.clusterIn === undefined) {
            throw new runtime.RequiredError('clusterIn','Required parameter requestParameters.clusterIn was null or undefined when calling createCluster.');
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
            path: `/api/v1/k8s/clusters`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ClusterInToJSON(requestParameters.clusterIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCluster201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать кластер, отправьте POST-запрос на `/api/v1/k8s/clusters`.
     * Создание кластера
     */
    async createCluster(requestParameters: CreateClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCluster201Response> {
        const response = await this.createClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать группу нод кластера, отправьте POST-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups`.
     * Создание группы нод
     */
    async createClusterNodeGroupRaw(requestParameters: CreateClusterNodeGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateClusterNodeGroup201Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling createClusterNodeGroup.');
        }

        if (requestParameters.nodeGroupIn === null || requestParameters.nodeGroupIn === undefined) {
            throw new runtime.RequiredError('nodeGroupIn','Required parameter requestParameters.nodeGroupIn was null or undefined when calling createClusterNodeGroup.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/groups`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NodeGroupInToJSON(requestParameters.nodeGroupIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateClusterNodeGroup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать группу нод кластера, отправьте POST-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups`.
     * Создание группы нод
     */
    async createClusterNodeGroup(requestParameters: CreateClusterNodeGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateClusterNodeGroup201Response> {
        const response = await this.createClusterNodeGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить кластер, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}`
     * Удаление кластера
     */
    async deleteClusterRaw(requestParameters: DeleteClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeleteCluster200Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling deleteCluster.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeleteCluster200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы удалить кластер, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}`
     * Удаление кластера
     */
    async deleteCluster(requestParameters: DeleteClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeleteCluster200Response> {
        const response = await this.deleteClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить ноду, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}/nodes/{node_id}`.
     * Удаление ноды
     */
    async deleteClusterNodeRaw(requestParameters: DeleteClusterNodeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling deleteClusterNode.');
        }

        if (requestParameters.nodeId === null || requestParameters.nodeId === undefined) {
            throw new runtime.RequiredError('nodeId','Required parameter requestParameters.nodeId was null or undefined when calling deleteClusterNode.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/nodes/{node_id}`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))).replace(`{${"node_id"}}`, encodeURIComponent(String(requestParameters.nodeId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить ноду, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}/nodes/{node_id}`.
     * Удаление ноды
     */
    async deleteClusterNode(requestParameters: DeleteClusterNodeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteClusterNodeRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить группу нод, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}`.
     * Удаление группы нод
     */
    async deleteClusterNodeGroupRaw(requestParameters: DeleteClusterNodeGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling deleteClusterNodeGroup.');
        }

        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling deleteClusterNodeGroup.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))).replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить группу нод, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}`.
     * Удаление группы нод
     */
    async deleteClusterNodeGroup(requestParameters: DeleteClusterNodeGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteClusterNodeGroupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить информацию о кластере, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}`
     * Получение информации о кластере
     */
    async getClusterRaw(requestParameters: GetClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCluster201Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling getCluster.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCluster201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о кластере, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}`
     * Получение информации о кластере
     */
    async getCluster(requestParameters: GetClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCluster201Response> {
        const response = await this.getClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить файл kubeconfig, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/kubeconfig`.
     * Получение файла kubeconfig
     */
    async getClusterKubeconfigRaw(requestParameters: GetClusterKubeconfigRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling getClusterKubeconfig.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/kubeconfig`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Чтобы получить файл kubeconfig, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/kubeconfig`.
     * Получение файла kubeconfig
     */
    async getClusterKubeconfig(requestParameters: GetClusterKubeconfigRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getClusterKubeconfigRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о группе нод, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}`.
     * Получение информации о группе нод
     */
    async getClusterNodeGroupRaw(requestParameters: GetClusterNodeGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateClusterNodeGroup201Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling getClusterNodeGroup.');
        }

        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling getClusterNodeGroup.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))).replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateClusterNodeGroup201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о группе нод, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}`.
     * Получение информации о группе нод
     */
    async getClusterNodeGroup(requestParameters: GetClusterNodeGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateClusterNodeGroup201Response> {
        const response = await this.getClusterNodeGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить группы нод кластера, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups`.
     * Получение групп нод кластера
     */
    async getClusterNodeGroupsRaw(requestParameters: GetClusterNodeGroupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetClusterNodeGroups200Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling getClusterNodeGroups.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/groups`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetClusterNodeGroups200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить группы нод кластера, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups`.
     * Получение групп нод кластера
     */
    async getClusterNodeGroups(requestParameters: GetClusterNodeGroupsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetClusterNodeGroups200Response> {
        const response = await this.getClusterNodeGroupsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список нод, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/nodes`.
     * Получение списка нод
     */
    async getClusterNodesRaw(requestParameters: GetClusterNodesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetClusterNodesFromGroup200Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling getClusterNodes.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/nodes`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetClusterNodesFromGroup200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список нод, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/nodes`.
     * Получение списка нод
     */
    async getClusterNodes(requestParameters: GetClusterNodesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetClusterNodesFromGroup200Response> {
        const response = await this.getClusterNodesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список нод принадлежащих группе, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`.
     * Получение списка нод, принадлежащих группе
     */
    async getClusterNodesFromGroupRaw(requestParameters: GetClusterNodesFromGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetClusterNodesFromGroup200Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling getClusterNodesFromGroup.');
        }

        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling getClusterNodesFromGroup.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))).replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetClusterNodesFromGroup200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список нод принадлежащих группе, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`.
     * Получение списка нод, принадлежащих группе
     */
    async getClusterNodesFromGroup(requestParameters: GetClusterNodesFromGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetClusterNodesFromGroup200Response> {
        const response = await this.getClusterNodesFromGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить ресурсы кластера, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/resources`.
     * Получение ресурсов кластера
     */
    async getClusterResourcesRaw(requestParameters: GetClusterResourcesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetClusterResources200Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling getClusterResources.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/resources`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetClusterResources200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить ресурсы кластера, отправьте GET-запрос в `/api/v1/k8s/clusters/{cluster_id}/resources`.
     * Получение ресурсов кластера
     */
    async getClusterResources(requestParameters: GetClusterResourcesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetClusterResources200Response> {
        const response = await this.getClusterResourcesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список кластеров, отправьте GET-запрос на `/api/v1/k8s/clusters`.
     * Получение списка кластеров
     */
    async getClustersRaw(requestParameters: GetClustersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetClusters200Response>> {
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
            path: `/api/v1/k8s/clusters`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetClusters200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список кластеров, отправьте GET-запрос на `/api/v1/k8s/clusters`.
     * Получение списка кластеров
     */
    async getClusters(requestParameters: GetClustersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetClusters200Response> {
        const response = await this.getClustersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список сетевых драйверов k8s, отправьте GET-запрос в `/api/v1/k8s/network_drivers`.
     * Получение списка сетевых драйверов k8s
     */
    async getK8SNetworkDriversRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetK8SNetworkDrivers200Response>> {
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
            path: `/api/v1/k8s/network_drivers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetK8SNetworkDrivers200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список сетевых драйверов k8s, отправьте GET-запрос в `/api/v1/k8s/network_drivers`.
     * Получение списка сетевых драйверов k8s
     */
    async getK8SNetworkDrivers(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetK8SNetworkDrivers200Response> {
        const response = await this.getK8SNetworkDriversRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список версий k8s, отправьте GET-запрос в `/api/v1/k8s/k8s_versions`.
     * Получение списка версий k8s
     */
    async getK8SVersionsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetK8SVersions200Response>> {
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
            path: `/api/v1/k8s/k8s_versions`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetK8SVersions200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список версий k8s, отправьте GET-запрос в `/api/v1/k8s/k8s_versions`.
     * Получение списка версий k8s
     */
    async getK8SVersions(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetK8SVersions200Response> {
        const response = await this.getK8SVersionsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список тарифов, отправьте GET-запрос в `/api/v1/presets/k8s`.
     * Получение списка тарифов
     */
    async getKubernetesPresetsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetKubernetesPresets200Response>> {
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
            path: `/api/v1/presets/k8s`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetKubernetesPresets200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список тарифов, отправьте GET-запрос в `/api/v1/presets/k8s`.
     * Получение списка тарифов
     */
    async getKubernetesPresets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetKubernetesPresets200Response> {
        const response = await this.getKubernetesPresetsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы увеличить количество нод в группе на указанное значение, отправьте POST-запрос на `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`
     * Увеличение количества нод в группе на указанное количество
     */
    async increaseCountOfNodesInGroupRaw(requestParameters: IncreaseCountOfNodesInGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetClusterNodesFromGroup200Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling increaseCountOfNodesInGroup.');
        }

        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling increaseCountOfNodesInGroup.');
        }

        if (requestParameters.nodeCount === null || requestParameters.nodeCount === undefined) {
            throw new runtime.RequiredError('nodeCount','Required parameter requestParameters.nodeCount was null or undefined when calling increaseCountOfNodesInGroup.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))).replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NodeCountToJSON(requestParameters.nodeCount),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetClusterNodesFromGroup200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы увеличить количество нод в группе на указанное значение, отправьте POST-запрос на `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`
     * Увеличение количества нод в группе на указанное количество
     */
    async increaseCountOfNodesInGroup(requestParameters: IncreaseCountOfNodesInGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetClusterNodesFromGroup200Response> {
        const response = await this.increaseCountOfNodesInGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы уменьшить количество нод в группе на указанное значение, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`.
     * Уменьшение количества нод в группе на указанное количество
     */
    async reduceCountOfNodesInGroupRaw(requestParameters: ReduceCountOfNodesInGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling reduceCountOfNodesInGroup.');
        }

        if (requestParameters.groupId === null || requestParameters.groupId === undefined) {
            throw new runtime.RequiredError('groupId','Required parameter requestParameters.groupId was null or undefined when calling reduceCountOfNodesInGroup.');
        }

        if (requestParameters.nodeCount === null || requestParameters.nodeCount === undefined) {
            throw new runtime.RequiredError('nodeCount','Required parameter requestParameters.nodeCount was null or undefined when calling reduceCountOfNodesInGroup.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))).replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.groupId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: NodeCountToJSON(requestParameters.nodeCount),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы уменьшить количество нод в группе на указанное значение, отправьте DELETE-запрос в `/api/v1/k8s/clusters/{cluster_id}/groups/{group_id}/nodes`.
     * Уменьшение количества нод в группе на указанное количество
     */
    async reduceCountOfNodesInGroup(requestParameters: ReduceCountOfNodesInGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.reduceCountOfNodesInGroupRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы обновить информацию о кластере, отправьте PATCH-запрос в `/api/v1/k8s/clusters/{cluster_id}`
     * Обновление информации о кластере
     */
    async updateClusterRaw(requestParameters: UpdateClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCluster201Response>> {
        if (requestParameters.clusterId === null || requestParameters.clusterId === undefined) {
            throw new runtime.RequiredError('clusterId','Required parameter requestParameters.clusterId was null or undefined when calling updateCluster.');
        }

        if (requestParameters.clusterEdit === null || requestParameters.clusterEdit === undefined) {
            throw new runtime.RequiredError('clusterEdit','Required parameter requestParameters.clusterEdit was null or undefined when calling updateCluster.');
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
            path: `/api/v1/k8s/clusters/{cluster_id}`.replace(`{${"cluster_id"}}`, encodeURIComponent(String(requestParameters.clusterId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ClusterEditToJSON(requestParameters.clusterEdit),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCluster201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить информацию о кластере, отправьте PATCH-запрос в `/api/v1/k8s/clusters/{cluster_id}`
     * Обновление информации о кластере
     */
    async updateCluster(requestParameters: UpdateClusterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCluster201Response> {
        const response = await this.updateClusterRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
