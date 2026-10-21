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
  ConnectSkills,
  CreateAgentSkill201Response,
  CreateSkill,
  GetAccountStatus403Response,
  GetAgentSkill200Response,
  GetAgentSkillCatalog200Response,
  GetAgentSkillLibrary200Response,
  GetAgentSkillVersion200Response,
  GetAgentSkillVersions200Response,
  GetAgentSkillsForAgent200Response,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances429Response,
  GetFinances500Response,
  GetImage404Response,
  InstallAgentSkillFromCatalog200Response,
  InstallAndConnectAgentSkill200Response,
  InstallAndConnectSkill,
  SetAgentSkill,
  SetAgentSkillForAgent200Response,
  SyncAgentSkillAgentsVersions200Response,
  SyncAgentSkillVersionsForAgent200Response,
  UpdateDatabaseInstance409Response,
  UpdateSkill,
} from '../models/index';
import {
    ConnectSkillsFromJSON,
    ConnectSkillsToJSON,
    CreateAgentSkill201ResponseFromJSON,
    CreateAgentSkill201ResponseToJSON,
    CreateSkillFromJSON,
    CreateSkillToJSON,
    GetAccountStatus403ResponseFromJSON,
    GetAccountStatus403ResponseToJSON,
    GetAgentSkill200ResponseFromJSON,
    GetAgentSkill200ResponseToJSON,
    GetAgentSkillCatalog200ResponseFromJSON,
    GetAgentSkillCatalog200ResponseToJSON,
    GetAgentSkillLibrary200ResponseFromJSON,
    GetAgentSkillLibrary200ResponseToJSON,
    GetAgentSkillVersion200ResponseFromJSON,
    GetAgentSkillVersion200ResponseToJSON,
    GetAgentSkillVersions200ResponseFromJSON,
    GetAgentSkillVersions200ResponseToJSON,
    GetAgentSkillsForAgent200ResponseFromJSON,
    GetAgentSkillsForAgent200ResponseToJSON,
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
    InstallAgentSkillFromCatalog200ResponseFromJSON,
    InstallAgentSkillFromCatalog200ResponseToJSON,
    InstallAndConnectAgentSkill200ResponseFromJSON,
    InstallAndConnectAgentSkill200ResponseToJSON,
    InstallAndConnectSkillFromJSON,
    InstallAndConnectSkillToJSON,
    SetAgentSkillFromJSON,
    SetAgentSkillToJSON,
    SetAgentSkillForAgent200ResponseFromJSON,
    SetAgentSkillForAgent200ResponseToJSON,
    SyncAgentSkillAgentsVersions200ResponseFromJSON,
    SyncAgentSkillAgentsVersions200ResponseToJSON,
    SyncAgentSkillVersionsForAgent200ResponseFromJSON,
    SyncAgentSkillVersionsForAgent200ResponseToJSON,
    UpdateDatabaseInstance409ResponseFromJSON,
    UpdateDatabaseInstance409ResponseToJSON,
    UpdateSkillFromJSON,
    UpdateSkillToJSON,
} from '../models/index';

export interface ApplyAgentSkillCatalogUpdateRequest {
    skillId: number;
}

export interface ConnectAgentSkillsToAgentRequest {
    agentId: number;
    connectSkills: ConnectSkills;
}

export interface CreateAgentSkillRequest {
    createSkill: CreateSkill;
}

export interface DeleteAgentSkillRequest {
    skillId: number;
}

export interface DisconnectAgentSkillFromAgentRequest {
    agentId: number;
    skillId: number;
}

export interface DuplicateAgentSkillRequest {
    skillId: number;
}

export interface GetAgentSkillRequest {
    skillId: number;
}

export interface GetAgentSkillLibraryRequest {
    search?: string;
}

export interface GetAgentSkillVersionRequest {
    skillId: number;
    version: number;
}

export interface GetAgentSkillVersionsRequest {
    skillId: number;
}

export interface GetAgentSkillsForAgentRequest {
    agentId: number;
}

export interface InstallAgentSkillFromCatalogRequest {
    catalogItemId: number;
}

export interface InstallAndConnectAgentSkillRequest {
    agentId: number;
    installAndConnectSkill: InstallAndConnectSkill;
}

export interface RollbackAgentSkillVersionRequest {
    skillId: number;
    version: number;
}

export interface SetAgentSkillForAgentRequest {
    agentId: number;
    skillId: number;
    setAgentSkill: SetAgentSkill;
}

export interface SyncAgentSkillAgentsVersionsRequest {
    skillId: number;
}

export interface SyncAgentSkillVersionsForAgentRequest {
    agentId: number;
}

export interface UpdateAgentSkillRequest {
    skillId: number;
    updateSkill: UpdateSkill;
}

export interface UpdateAgentSkillVersionForAgentRequest {
    agentId: number;
    skillId: number;
}

/**
 * 
 */
export class AIAgentSkillsApi extends runtime.BaseAPI {

    /**
     * Чтобы применить к установленному навыку новую версию из каталога, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/apply-catalog-update`.  Текст «когда применять» и инструкция заменяются каталожными, при этом создаётся новая версия: прежний текст, в том числе ваши правки, остаётся в истории. Название навыка не меняется. Если обновления нет, ничего не меняется (`meta.version_created` — `false`).  Для навыка, установленного не из каталога, вернётся 409 с `error_code` `skill_is_not_installed_from_catalog`.
     * Применение обновления навыка из каталога
     */
    async applyAgentSkillCatalogUpdateRaw(requestParameters: ApplyAgentSkillCatalogUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentSkill201Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling applyAgentSkillCatalogUpdate.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}/apply-catalog-update`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentSkill201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы применить к установленному навыку новую версию из каталога, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/apply-catalog-update`.  Текст «когда применять» и инструкция заменяются каталожными, при этом создаётся новая версия: прежний текст, в том числе ваши правки, остаётся в истории. Название навыка не меняется. Если обновления нет, ничего не меняется (`meta.version_created` — `false`).  Для навыка, установленного не из каталога, вернётся 409 с `error_code` `skill_is_not_installed_from_catalog`.
     * Применение обновления навыка из каталога
     */
    async applyAgentSkillCatalogUpdate(requestParameters: ApplyAgentSkillCatalogUpdateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentSkill201Response> {
        const response = await this.applyAgentSkillCatalogUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы подключить и сразу включить у агента несколько навыков, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/connect`.  Навыки, которых нет в аккаунте, пропускаются без ошибки. Уже подключённые навыки включаются; если для них передана версия, агент закрепляется на ней. В ответе — только навыки, которые удалось подключить.
     * Подключение нескольких навыков к агенту
     */
    async connectAgentSkillsToAgentRaw(requestParameters: ConnectAgentSkillsToAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentSkillsForAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling connectAgentSkillsToAgent.');
        }

        if (requestParameters.connectSkills === null || requestParameters.connectSkills === undefined) {
            throw new runtime.RequiredError('connectSkills','Required parameter requestParameters.connectSkills was null or undefined when calling connectAgentSkillsToAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/skills/connect`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ConnectSkillsToJSON(requestParameters.connectSkills),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentSkillsForAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы подключить и сразу включить у агента несколько навыков, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/connect`.  Навыки, которых нет в аккаунте, пропускаются без ошибки. Уже подключённые навыки включаются; если для них передана версия, агент закрепляется на ней. В ответе — только навыки, которые удалось подключить.
     * Подключение нескольких навыков к агенту
     */
    async connectAgentSkillsToAgent(requestParameters: ConnectAgentSkillsToAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentSkillsForAgent200Response> {
        const response = await this.connectAgentSkillsToAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать навык, отправьте POST-запрос на `/api/v1/cloud-ai/skills`.  Навык создаётся с версией 1 и ни к одному агенту не подключается. Предупреждения о качестве текста приходят в `meta.warnings` и не мешают сохранению. Скрипты передаются в теле запроса. Их общий размер — до 10 МБ, а всё тело запроса — до 16 МБ; запрос с телом больше отклоняется до проверки.  Если навык с таким названием уже есть, вернётся 409 с `error_code` `skill_name_already_exists`. Если скрипты не прошли проверку (больше 20 файлов, повторяющиеся имена, общий размер больше 10 МБ, файл без содержимого), вернётся 400 с `error_code` `skill_scripts_invalid`.
     * Создание навыка
     */
    async createAgentSkillRaw(requestParameters: CreateAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentSkill201Response>> {
        if (requestParameters.createSkill === null || requestParameters.createSkill === undefined) {
            throw new runtime.RequiredError('createSkill','Required parameter requestParameters.createSkill was null or undefined when calling createAgentSkill.');
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
            path: `/api/v1/cloud-ai/skills`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateSkillToJSON(requestParameters.createSkill),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentSkill201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать навык, отправьте POST-запрос на `/api/v1/cloud-ai/skills`.  Навык создаётся с версией 1 и ни к одному агенту не подключается. Предупреждения о качестве текста приходят в `meta.warnings` и не мешают сохранению. Скрипты передаются в теле запроса. Их общий размер — до 10 МБ, а всё тело запроса — до 16 МБ; запрос с телом больше отклоняется до проверки.  Если навык с таким названием уже есть, вернётся 409 с `error_code` `skill_name_already_exists`. Если скрипты не прошли проверку (больше 20 файлов, повторяющиеся имена, общий размер больше 10 МБ, файл без содержимого), вернётся 400 с `error_code` `skill_scripts_invalid`.
     * Создание навыка
     */
    async createAgentSkill(requestParameters: CreateAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentSkill201Response> {
        const response = await this.createAgentSkillRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить навык, отправьте DELETE-запрос на `/api/v1/cloud-ai/skills/{skill_id}`.  Навык отключается от всех агентов, история версий и скрипты удаляются. Срабатывания навыка под старыми ответами агентов сохраняются.
     * Удаление навыка
     */
    async deleteAgentSkillRaw(requestParameters: DeleteAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling deleteAgentSkill.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить навык, отправьте DELETE-запрос на `/api/v1/cloud-ai/skills/{skill_id}`.  Навык отключается от всех агентов, история версий и скрипты удаляются. Срабатывания навыка под старыми ответами агентов сохраняются.
     * Удаление навыка
     */
    async deleteAgentSkill(requestParameters: DeleteAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteAgentSkillRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы полностью отключить навык от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}`.  Закреплённая версия при этом не сохраняется. Чтобы выключить навык на время, используйте PUT-запрос с `is_enabled: false`. Если навык не подключён к агенту, вернётся 404 с `error_code` `agent_skill_link_not_found`.
     * Отключение навыка от агента
     */
    async disconnectAgentSkillFromAgentRaw(requestParameters: DisconnectAgentSkillFromAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling disconnectAgentSkillFromAgent.');
        }

        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling disconnectAgentSkillFromAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))).replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы полностью отключить навык от агента, отправьте DELETE-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}`.  Закреплённая версия при этом не сохраняется. Чтобы выключить навык на время, используйте PUT-запрос с `is_enabled: false`. Если навык не подключён к агенту, вернётся 404 с `error_code` `agent_skill_link_not_found`.
     * Отключение навыка от агента
     */
    async disconnectAgentSkillFromAgent(requestParameters: DisconnectAgentSkillFromAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.disconnectAgentSkillFromAgentRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы создать копию навыка, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/duplicate`.  Копия получает свободное название вида «Название (копия)» или «Название (копия 2)», текст и скрипты текущей версии оригинала и собственную историю с версии 1. К агентам копия не подключается. Копия навыка из каталога становится обычным навыком аккаунта.
     * Копирование навыка
     */
    async duplicateAgentSkillRaw(requestParameters: DuplicateAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentSkill201Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling duplicateAgentSkill.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}/duplicate`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentSkill201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать копию навыка, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/duplicate`.  Копия получает свободное название вида «Название (копия)» или «Название (копия 2)», текст и скрипты текущей версии оригинала и собственную историю с версии 1. К агентам копия не подключается. Копия навыка из каталога становится обычным навыком аккаунта.
     * Копирование навыка
     */
    async duplicateAgentSkill(requestParameters: DuplicateAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentSkill201Response> {
        const response = await this.duplicateAgentSkillRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить карточку навыка, отправьте GET-запрос на `/api/v1/cloud-ai/skills/{skill_id}`.  В карточке есть скрипты текущей версии (без содержимого), счётчик версий и агенты, к которым подключён навык.
     * Получение навыка
     */
    async getAgentSkillRaw(requestParameters: GetAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentSkill200Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling getAgentSkill.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentSkill200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить карточку навыка, отправьте GET-запрос на `/api/v1/cloud-ai/skills/{skill_id}`.  В карточке есть скрипты текущей версии (без содержимого), счётчик версий и агенты, к которым подключён навык.
     * Получение навыка
     */
    async getAgentSkill(requestParameters: GetAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentSkill200Response> {
        const response = await this.getAgentSkillRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить каталог готовых навыков Timeweb Cloud, отправьте GET-запрос на `/api/v1/cloud-ai/skill-catalog`.  Навыки приходят в порядке показа, сгруппированные по `category`. Инструкция возвращается полностью, чтобы её можно было прочитать до установки. Для установленных навыков заполнены `is_installed`, `installed_skill_id`, `is_modified` и `has_catalog_update`.
     * Получение каталога навыков
     */
    async getAgentSkillCatalogRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentSkillCatalog200Response>> {
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
            path: `/api/v1/cloud-ai/skill-catalog`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentSkillCatalog200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить каталог готовых навыков Timeweb Cloud, отправьте GET-запрос на `/api/v1/cloud-ai/skill-catalog`.  Навыки приходят в порядке показа, сгруппированные по `category`. Инструкция возвращается полностью, чтобы её можно было прочитать до установки. Для установленных навыков заполнены `is_installed`, `installed_skill_id`, `is_modified` и `has_catalog_update`.
     * Получение каталога навыков
     */
    async getAgentSkillCatalog(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentSkillCatalog200Response> {
        const response = await this.getAgentSkillCatalogRaw(initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить навыки аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/skills`.  Сначала идут недавно изменённые. Параметр `search` ищет по названию и по тексту инструкции.
     * Получение списка навыков
     */
    async getAgentSkillLibraryRaw(requestParameters: GetAgentSkillLibraryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentSkillLibrary200Response>> {
        const queryParameters: any = {};

        if (requestParameters.search !== undefined) {
            queryParameters['search'] = requestParameters.search;
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
            path: `/api/v1/cloud-ai/skills`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentSkillLibrary200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить навыки аккаунта, отправьте GET-запрос на `/api/v1/cloud-ai/skills`.  Сначала идут недавно изменённые. Параметр `search` ищет по названию и по тексту инструкции.
     * Получение списка навыков
     */
    async getAgentSkillLibrary(requestParameters: GetAgentSkillLibraryRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentSkillLibrary200Response> {
        const response = await this.getAgentSkillLibraryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить текст конкретной версии навыка, отправьте GET-запрос на `/api/v1/cloud-ai/skills/{skill_id}/versions/{version}`.  Номер версии сработавшего навыка есть в срабатываниях под ответами агента.
     * Получение версии навыка
     */
    async getAgentSkillVersionRaw(requestParameters: GetAgentSkillVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentSkillVersion200Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling getAgentSkillVersion.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling getAgentSkillVersion.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}/versions/{version}`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))).replace(`{${"version"}}`, encodeURIComponent(String(requestParameters.version))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentSkillVersion200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить текст конкретной версии навыка, отправьте GET-запрос на `/api/v1/cloud-ai/skills/{skill_id}/versions/{version}`.  Номер версии сработавшего навыка есть в срабатываниях под ответами агента.
     * Получение версии навыка
     */
    async getAgentSkillVersion(requestParameters: GetAgentSkillVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentSkillVersion200Response> {
        const response = await this.getAgentSkillVersionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить историю версий навыка, отправьте GET-запрос на `/api/v1/cloud-ai/skills/{skill_id}/versions`.
     * Получение истории версий навыка
     */
    async getAgentSkillVersionsRaw(requestParameters: GetAgentSkillVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentSkillVersions200Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling getAgentSkillVersions.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}/versions`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentSkillVersions200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить историю версий навыка, отправьте GET-запрос на `/api/v1/cloud-ai/skills/{skill_id}/versions`.
     * Получение истории версий навыка
     */
    async getAgentSkillVersions(requestParameters: GetAgentSkillVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentSkillVersions200Response> {
        const response = await this.getAgentSkillVersionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить навыки агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills`.  В ответе все навыки аккаунта: неподключённые приходят с `is_connected: false`. `has_newer_version: true` означает, что агент закреплён на устаревшей версии.
     * Получение навыков агента
     */
    async getAgentSkillsForAgentRaw(requestParameters: GetAgentSkillsForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgentSkillsForAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling getAgentSkillsForAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/skills`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgentSkillsForAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить навыки агента, отправьте GET-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills`.  В ответе все навыки аккаунта: неподключённые приходят с `is_connected: false`. `has_newer_version: true` означает, что агент закреплён на устаревшей версии.
     * Получение навыков агента
     */
    async getAgentSkillsForAgent(requestParameters: GetAgentSkillsForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgentSkillsForAgent200Response> {
        const response = await this.getAgentSkillsForAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы установить навык из каталога в библиотеку аккаунта, отправьте POST-запрос на `/api/v1/cloud-ai/skill-catalog/{catalog_item_id}/install`.  Повторная установка не создаёт копию, а возвращает уже установленный навык с `meta.already_installed: true`. Если название занято вашим навыком, к нему добавляется «(копия)». Чтобы сразу включить навык у агента, используйте `POST /api/v1/cloud-ai/agents/{agent_id}/skills/install-and-connect`.
     * Установка навыка из каталога
     */
    async installAgentSkillFromCatalogRaw(requestParameters: InstallAgentSkillFromCatalogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<InstallAgentSkillFromCatalog200Response>> {
        if (requestParameters.catalogItemId === null || requestParameters.catalogItemId === undefined) {
            throw new runtime.RequiredError('catalogItemId','Required parameter requestParameters.catalogItemId was null or undefined when calling installAgentSkillFromCatalog.');
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
            path: `/api/v1/cloud-ai/skill-catalog/{catalog_item_id}/install`.replace(`{${"catalog_item_id"}}`, encodeURIComponent(String(requestParameters.catalogItemId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => InstallAgentSkillFromCatalog200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы установить навык из каталога в библиотеку аккаунта, отправьте POST-запрос на `/api/v1/cloud-ai/skill-catalog/{catalog_item_id}/install`.  Повторная установка не создаёт копию, а возвращает уже установленный навык с `meta.already_installed: true`. Если название занято вашим навыком, к нему добавляется «(копия)». Чтобы сразу включить навык у агента, используйте `POST /api/v1/cloud-ai/agents/{agent_id}/skills/install-and-connect`.
     * Установка навыка из каталога
     */
    async installAgentSkillFromCatalog(requestParameters: InstallAgentSkillFromCatalogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<InstallAgentSkillFromCatalog200Response> {
        const response = await this.installAgentSkillFromCatalogRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы установить навык из каталога и сразу включить его у агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/install-and-connect`.  Если навык уже установлен, копия не создаётся (`meta.already_installed: true`), навык просто включается у агента.
     * Установка навыка из каталога и включение у агента
     */
    async installAndConnectAgentSkillRaw(requestParameters: InstallAndConnectAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<InstallAndConnectAgentSkill200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling installAndConnectAgentSkill.');
        }

        if (requestParameters.installAndConnectSkill === null || requestParameters.installAndConnectSkill === undefined) {
            throw new runtime.RequiredError('installAndConnectSkill','Required parameter requestParameters.installAndConnectSkill was null or undefined when calling installAndConnectAgentSkill.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/skills/install-and-connect`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: InstallAndConnectSkillToJSON(requestParameters.installAndConnectSkill),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => InstallAndConnectAgentSkill200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы установить навык из каталога и сразу включить его у агента, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/install-and-connect`.  Если навык уже установлен, копия не создаётся (`meta.already_installed: true`), навык просто включается у агента.
     * Установка навыка из каталога и включение у агента
     */
    async installAndConnectAgentSkill(requestParameters: InstallAndConnectAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<InstallAndConnectAgentSkill200Response> {
        const response = await this.installAndConnectAgentSkillRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы сделать версию из истории текущей, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/versions/{version}/rollback`.  Новая версия не создаётся (`meta.version_created` — `false`), название навыка не меняется. Агенты остаются на своих закреплённых версиях. Если выбранная версия уже текущая, ничего не меняется.
     * Переключение навыка на версию из истории
     */
    async rollbackAgentSkillVersionRaw(requestParameters: RollbackAgentSkillVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentSkill201Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling rollbackAgentSkillVersion.');
        }

        if (requestParameters.version === null || requestParameters.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter requestParameters.version was null or undefined when calling rollbackAgentSkillVersion.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}/versions/{version}/rollback`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))).replace(`{${"version"}}`, encodeURIComponent(String(requestParameters.version))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentSkill201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы сделать версию из истории текущей, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/versions/{version}/rollback`.  Новая версия не создаётся (`meta.version_created` — `false`), название навыка не меняется. Агенты остаются на своих закреплённых версиях. Если выбранная версия уже текущая, ничего не меняется.
     * Переключение навыка на версию из истории
     */
    async rollbackAgentSkillVersion(requestParameters: RollbackAgentSkillVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentSkill201Response> {
        const response = await this.rollbackAgentSkillVersionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы включить или выключить навык у агента, отправьте PUT-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}`.  Первое включение подключает навык и закрепляет агента на текущей версии навыка или на версии из `version`. Выключение сохраняет закреплённую версию, поэтому повторное включение вернёт то же поведение. Изменения действуют сразу. Выключение неподключённого навыка ничего не меняет.
     * Включение и выключение навыка у агента
     */
    async setAgentSkillForAgentRaw(requestParameters: SetAgentSkillForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SetAgentSkillForAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling setAgentSkillForAgent.');
        }

        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling setAgentSkillForAgent.');
        }

        if (requestParameters.setAgentSkill === null || requestParameters.setAgentSkill === undefined) {
            throw new runtime.RequiredError('setAgentSkill','Required parameter requestParameters.setAgentSkill was null or undefined when calling setAgentSkillForAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))).replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SetAgentSkillToJSON(requestParameters.setAgentSkill),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SetAgentSkillForAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы включить или выключить навык у агента, отправьте PUT-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}`.  Первое включение подключает навык и закрепляет агента на текущей версии навыка или на версии из `version`. Выключение сохраняет закреплённую версию, поэтому повторное включение вернёт то же поведение. Изменения действуют сразу. Выключение неподключённого навыка ничего не меняет.
     * Включение и выключение навыка у агента
     */
    async setAgentSkillForAgent(requestParameters: SetAgentSkillForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SetAgentSkillForAgent200Response> {
        const response = await this.setAgentSkillForAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы перевести всех агентов, у которых включён навык, на его текущую версию, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/agents/sync-versions`.  Агенты, у которых навык выключен, остаются на своих версиях. Сколько агентов переведено, видно в `meta.updated_count`.
     * Перевод всех агентов навыка на текущую версию
     */
    async syncAgentSkillAgentsVersionsRaw(requestParameters: SyncAgentSkillAgentsVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SyncAgentSkillAgentsVersions200Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling syncAgentSkillAgentsVersions.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}/agents/sync-versions`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SyncAgentSkillAgentsVersions200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы перевести всех агентов, у которых включён навык, на его текущую версию, отправьте POST-запрос на `/api/v1/cloud-ai/skills/{skill_id}/agents/sync-versions`.  Агенты, у которых навык выключен, остаются на своих версиях. Сколько агентов переведено, видно в `meta.updated_count`.
     * Перевод всех агентов навыка на текущую версию
     */
    async syncAgentSkillAgentsVersions(requestParameters: SyncAgentSkillAgentsVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SyncAgentSkillAgentsVersions200Response> {
        const response = await this.syncAgentSkillAgentsVersionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы перевести все включённые у агента навыки на их текущие версии, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/sync-versions`.  В ответе все навыки аккаунта с состоянием у агента, как в списке навыков агента. Сколько навыков переведено, видно в `updated_count` в корне ответа.
     * Перевод всех навыков агента на текущие версии
     */
    async syncAgentSkillVersionsForAgentRaw(requestParameters: SyncAgentSkillVersionsForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SyncAgentSkillVersionsForAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling syncAgentSkillVersionsForAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/skills/sync-versions`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SyncAgentSkillVersionsForAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы перевести все включённые у агента навыки на их текущие версии, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/sync-versions`.  В ответе все навыки аккаунта с состоянием у агента, как в списке навыков агента. Сколько навыков переведено, видно в `updated_count` в корне ответа.
     * Перевод всех навыков агента на текущие версии
     */
    async syncAgentSkillVersionsForAgent(requestParameters: SyncAgentSkillVersionsForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SyncAgentSkillVersionsForAgent200Response> {
        const response = await this.syncAgentSkillVersionsForAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы изменить навык, отправьте PATCH-запрос на `/api/v1/cloud-ai/skills/{skill_id}`, передав только изменяемые поля.  Изменение «когда применять», инструкции или скриптов создаёт новую версию. Переименование и сохранение без изменений версию не создают (`meta.version_created`). Подключённые агенты остаются на своих версиях. Сколько агентов затронуто, видно в `meta.affected_agents_count`. Если в истории уже 50 версий, самая старая свободная версия удаляется (`meta.pruned_versions`). Скрипты передаются в теле запроса. Их общий размер — до 10 МБ, а всё тело запроса — до 16 МБ; запрос с телом больше отклоняется до проверки.  Возможные ошибки 409: `skill_name_already_exists` — название занято; `skill_versions_limit_exceeded` — все 50 версий заняты текущей и закреплёнными за агентами; `skill_was_modified_concurrently` — навык одновременно изменён другим запросом, повторите сохранение.
     * Изменение навыка
     */
    async updateAgentSkillRaw(requestParameters: UpdateAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateAgentSkill201Response>> {
        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling updateAgentSkill.');
        }

        if (requestParameters.updateSkill === null || requestParameters.updateSkill === undefined) {
            throw new runtime.RequiredError('updateSkill','Required parameter requestParameters.updateSkill was null or undefined when calling updateAgentSkill.');
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
            path: `/api/v1/cloud-ai/skills/{skill_id}`.replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateSkillToJSON(requestParameters.updateSkill),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateAgentSkill201ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы изменить навык, отправьте PATCH-запрос на `/api/v1/cloud-ai/skills/{skill_id}`, передав только изменяемые поля.  Изменение «когда применять», инструкции или скриптов создаёт новую версию. Переименование и сохранение без изменений версию не создают (`meta.version_created`). Подключённые агенты остаются на своих версиях. Сколько агентов затронуто, видно в `meta.affected_agents_count`. Если в истории уже 50 версий, самая старая свободная версия удаляется (`meta.pruned_versions`). Скрипты передаются в теле запроса. Их общий размер — до 10 МБ, а всё тело запроса — до 16 МБ; запрос с телом больше отклоняется до проверки.  Возможные ошибки 409: `skill_name_already_exists` — название занято; `skill_versions_limit_exceeded` — все 50 версий заняты текущей и закреплёнными за агентами; `skill_was_modified_concurrently` — навык одновременно изменён другим запросом, повторите сохранение.
     * Изменение навыка
     */
    async updateAgentSkill(requestParameters: UpdateAgentSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateAgentSkill201Response> {
        const response = await this.updateAgentSkillRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы перевести агента на текущую версию навыка, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}/update-version`.  Если навык не подключён к агенту, вернётся 404 с `error_code` `agent_skill_link_not_found`.
     * Перевод агента на текущую версию навыка
     */
    async updateAgentSkillVersionForAgentRaw(requestParameters: UpdateAgentSkillVersionForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SetAgentSkillForAgent200Response>> {
        if (requestParameters.agentId === null || requestParameters.agentId === undefined) {
            throw new runtime.RequiredError('agentId','Required parameter requestParameters.agentId was null or undefined when calling updateAgentSkillVersionForAgent.');
        }

        if (requestParameters.skillId === null || requestParameters.skillId === undefined) {
            throw new runtime.RequiredError('skillId','Required parameter requestParameters.skillId was null or undefined when calling updateAgentSkillVersionForAgent.');
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
            path: `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}/update-version`.replace(`{${"agent_id"}}`, encodeURIComponent(String(requestParameters.agentId))).replace(`{${"skill_id"}}`, encodeURIComponent(String(requestParameters.skillId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SetAgentSkillForAgent200ResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы перевести агента на текущую версию навыка, отправьте POST-запрос на `/api/v1/cloud-ai/agents/{agent_id}/skills/{skill_id}/update-version`.  Если навык не подключён к агенту, вернётся 404 с `error_code` `agent_skill_link_not_found`.
     * Перевод агента на текущую версию навыка
     */
    async updateAgentSkillVersionForAgent(requestParameters: UpdateAgentSkillVersionForAgentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SetAgentSkillForAgent200Response> {
        const response = await this.updateAgentSkillVersionForAgentRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
