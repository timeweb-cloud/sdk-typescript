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
  BaseError,
  GetFinances400Response,
  GetFinances401Response,
  GetFinances404Response,
  GetFinances429Response,
  GetFinances500Response,
  ImageDownloadResponse,
  ImageDownloadsResponse,
  ImageInAPI,
  ImageOutResponse,
  ImageUpdateAPI,
  ImageUrlIn,
  ImagesOutResponse,
  UploadSuccessfulResponse,
} from '../models/index';
import {
    BaseErrorFromJSON,
    BaseErrorToJSON,
    GetFinances400ResponseFromJSON,
    GetFinances400ResponseToJSON,
    GetFinances401ResponseFromJSON,
    GetFinances401ResponseToJSON,
    GetFinances404ResponseFromJSON,
    GetFinances404ResponseToJSON,
    GetFinances429ResponseFromJSON,
    GetFinances429ResponseToJSON,
    GetFinances500ResponseFromJSON,
    GetFinances500ResponseToJSON,
    ImageDownloadResponseFromJSON,
    ImageDownloadResponseToJSON,
    ImageDownloadsResponseFromJSON,
    ImageDownloadsResponseToJSON,
    ImageInAPIFromJSON,
    ImageInAPIToJSON,
    ImageOutResponseFromJSON,
    ImageOutResponseToJSON,
    ImageUpdateAPIFromJSON,
    ImageUpdateAPIToJSON,
    ImageUrlInFromJSON,
    ImageUrlInToJSON,
    ImagesOutResponseFromJSON,
    ImagesOutResponseToJSON,
    UploadSuccessfulResponseFromJSON,
    UploadSuccessfulResponseToJSON,
} from '../models/index';

export interface CreateImageRequest {
    imageInAPI: ImageInAPI;
}

export interface CreateImageDownloadUrlRequest {
    imageId: string;
    imageUrlIn: ImageUrlIn;
}

export interface DeleteImageRequest {
    imageId: string;
}

export interface DeleteImageDownloadURLRequest {
    imageId: string;
    imageUrlId: string;
}

export interface GetImageRequest {
    imageId: string;
}

export interface GetImageDownloadURLRequest {
    imageId: string;
    imageUrlId: string;
}

export interface GetImageDownloadURLsRequest {
    imageId: string;
    limit?: number;
    offset?: number;
}

export interface GetImagesRequest {
    limit?: number;
    offset?: number;
}

export interface UpdateImageRequest {
    imageId: string;
    imageUpdateAPI: ImageUpdateAPI;
}

export interface UploadImageRequest {
    imageId: string;
    contentDisposition?: string;
}

/**
 * 
 */
export class ImagesApi extends runtime.BaseAPI {

    /**
     * Чтобы создать образ, отправьте POST запрос в `/api/v1/images`, задав необходимые атрибуты.   Для загрузки собственного образа вам нужно отправить параметры `location`, `os` и не указывать `disk_id`. Поддерживается два способа загрузки:  1. По ссылке. Для этого укажите `upload_url` с ссылкой на загрузку образа 2. Из файла. Для этого воспользуйтесь методом POST `/api/v1/images/{image_id}` Образ будет создан с использованием предоставленной информации.    Тело ответа будет содержать объект JSON с информацией о созданном образе.
     * Создание образа
     */
    async createImageRaw(requestParameters: CreateImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageOutResponse>> {
        if (requestParameters.imageInAPI === null || requestParameters.imageInAPI === undefined) {
            throw new runtime.RequiredError('imageInAPI','Required parameter requestParameters.imageInAPI was null or undefined when calling createImage.');
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
            path: `/api/v1/images`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ImageInAPIToJSON(requestParameters.imageInAPI),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать образ, отправьте POST запрос в `/api/v1/images`, задав необходимые атрибуты.   Для загрузки собственного образа вам нужно отправить параметры `location`, `os` и не указывать `disk_id`. Поддерживается два способа загрузки:  1. По ссылке. Для этого укажите `upload_url` с ссылкой на загрузку образа 2. Из файла. Для этого воспользуйтесь методом POST `/api/v1/images/{image_id}` Образ будет создан с использованием предоставленной информации.    Тело ответа будет содержать объект JSON с информацией о созданном образе.
     * Создание образа
     */
    async createImage(requestParameters: CreateImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageOutResponse> {
        const response = await this.createImageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы создать ссылку на скачивание образа, отправьте запрос POST в `/api/v1/images/{image_id}/download-url`.
     * Создание ссылки на скачивание образа
     */
    async createImageDownloadUrlRaw(requestParameters: CreateImageDownloadUrlRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageDownloadResponse>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling createImageDownloadUrl.');
        }

        if (requestParameters.imageUrlIn === null || requestParameters.imageUrlIn === undefined) {
            throw new runtime.RequiredError('imageUrlIn','Required parameter requestParameters.imageUrlIn was null or undefined when calling createImageDownloadUrl.');
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
            path: `/api/v1/images/{image_id}/download-url`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ImageUrlInToJSON(requestParameters.imageUrlIn),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageDownloadResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы создать ссылку на скачивание образа, отправьте запрос POST в `/api/v1/images/{image_id}/download-url`.
     * Создание ссылки на скачивание образа
     */
    async createImageDownloadUrl(requestParameters: CreateImageDownloadUrlRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageDownloadResponse> {
        const response = await this.createImageDownloadUrlRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы удалить образ, отправьте запрос DELETE в `/api/v1/images/{image_id}`.
     * Удаление образа
     */
    async deleteImageRaw(requestParameters: DeleteImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling deleteImage.');
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
            path: `/api/v1/images/{image_id}`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить образ, отправьте запрос DELETE в `/api/v1/images/{image_id}`.
     * Удаление образа
     */
    async deleteImage(requestParameters: DeleteImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteImageRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы удалить ссылку на образ, отправьте DELETE запрос в `/api/v1/images/{image_id}/download-url/{image_url_id}`.
     * Удаление ссылки на образ
     */
    async deleteImageDownloadURLRaw(requestParameters: DeleteImageDownloadURLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling deleteImageDownloadURL.');
        }

        if (requestParameters.imageUrlId === null || requestParameters.imageUrlId === undefined) {
            throw new runtime.RequiredError('imageUrlId','Required parameter requestParameters.imageUrlId was null or undefined when calling deleteImageDownloadURL.');
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
            path: `/api/v1/images/{image_id}/download-url/{image_url_id}`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))).replace(`{${"image_url_id"}}`, encodeURIComponent(String(requestParameters.imageUrlId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Чтобы удалить ссылку на образ, отправьте DELETE запрос в `/api/v1/images/{image_id}/download-url/{image_url_id}`.
     * Удаление ссылки на образ
     */
    async deleteImageDownloadURL(requestParameters: DeleteImageDownloadURLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteImageDownloadURLRaw(requestParameters, initOverrides);
    }

    /**
     * Чтобы получить образ, отправьте запрос GET в `/api/v1/images/{image_id}`.
     * Получение информации о образе
     */
    async getImageRaw(requestParameters: GetImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageOutResponse>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling getImage.');
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
            path: `/api/v1/images/{image_id}`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить образ, отправьте запрос GET в `/api/v1/images/{image_id}`.
     * Получение информации о образе
     */
    async getImage(requestParameters: GetImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageOutResponse> {
        const response = await this.getImageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о ссылке на скачивание образа, отправьте запрос GET в `/api/v1/images/{image_id}/download-url/{image_url_id}`.
     * Получение информации о ссылке на скачивание образа
     */
    async getImageDownloadURLRaw(requestParameters: GetImageDownloadURLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageDownloadResponse>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling getImageDownloadURL.');
        }

        if (requestParameters.imageUrlId === null || requestParameters.imageUrlId === undefined) {
            throw new runtime.RequiredError('imageUrlId','Required parameter requestParameters.imageUrlId was null or undefined when calling getImageDownloadURL.');
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
            path: `/api/v1/images/{image_id}/download-url/{image_url_id}`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))).replace(`{${"image_url_id"}}`, encodeURIComponent(String(requestParameters.imageUrlId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageDownloadResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о ссылке на скачивание образа, отправьте запрос GET в `/api/v1/images/{image_id}/download-url/{image_url_id}`.
     * Получение информации о ссылке на скачивание образа
     */
    async getImageDownloadURL(requestParameters: GetImageDownloadURLRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageDownloadResponse> {
        const response = await this.getImageDownloadURLRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить информацию о ссылках на скачивание образов, отправьте запрос GET в `/api/v1/images/{image_id}/download-url`.
     * Получение информации о ссылках на скачивание образов
     */
    async getImageDownloadURLsRaw(requestParameters: GetImageDownloadURLsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageDownloadsResponse>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling getImageDownloadURLs.');
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
            path: `/api/v1/images/{image_id}/download-url`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageDownloadsResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить информацию о ссылках на скачивание образов, отправьте запрос GET в `/api/v1/images/{image_id}/download-url`.
     * Получение информации о ссылках на скачивание образов
     */
    async getImageDownloadURLs(requestParameters: GetImageDownloadURLsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageDownloadsResponse> {
        const response = await this.getImageDownloadURLsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы получить список образов, отправьте GET запрос на `/api/v1/images`
     * Получение списка образов
     */
    async getImagesRaw(requestParameters: GetImagesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImagesOutResponse>> {
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
            path: `/api/v1/images`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImagesOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы получить список образов, отправьте GET запрос на `/api/v1/images`
     * Получение списка образов
     */
    async getImages(requestParameters: GetImagesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImagesOutResponse> {
        const response = await this.getImagesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы обновить только определенные атрибуты образа, отправьте запрос PATCH в `/api/v1/images/{image_id}`.
     * Обновление информации о образе
     */
    async updateImageRaw(requestParameters: UpdateImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageOutResponse>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling updateImage.');
        }

        if (requestParameters.imageUpdateAPI === null || requestParameters.imageUpdateAPI === undefined) {
            throw new runtime.RequiredError('imageUpdateAPI','Required parameter requestParameters.imageUpdateAPI was null or undefined when calling updateImage.');
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
            path: `/api/v1/images/{image_id}`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ImageUpdateAPIToJSON(requestParameters.imageUpdateAPI),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageOutResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы обновить только определенные атрибуты образа, отправьте запрос PATCH в `/api/v1/images/{image_id}`.
     * Обновление информации о образе
     */
    async updateImage(requestParameters: UpdateImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageOutResponse> {
        const response = await this.updateImageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Чтобы загрузить свой образ, отправьте POST запрос в `/api/v1/images/{image_id}`, отправив файл как `multipart/form-data`, указав имя файла в заголовке `Content-Disposition`.   Перед загрузкой, нужно создать образ используя POST `/api/v1/images`, указав параметры `location`, `os`   Тело ответа будет содержать объект JSON с информацией о загруженном образе.
     * Загрузка образа
     */
    async uploadImageRaw(requestParameters: UploadImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UploadSuccessfulResponse>> {
        if (requestParameters.imageId === null || requestParameters.imageId === undefined) {
            throw new runtime.RequiredError('imageId','Required parameter requestParameters.imageId was null or undefined when calling uploadImage.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.contentDisposition !== undefined && requestParameters.contentDisposition !== null) {
            headerParameters['content-disposition'] = String(requestParameters.contentDisposition);
        }

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/v1/images/{image_id}`.replace(`{${"image_id"}}`, encodeURIComponent(String(requestParameters.imageId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UploadSuccessfulResponseFromJSON(jsonValue));
    }

    /**
     * Чтобы загрузить свой образ, отправьте POST запрос в `/api/v1/images/{image_id}`, отправив файл как `multipart/form-data`, указав имя файла в заголовке `Content-Disposition`.   Перед загрузкой, нужно создать образ используя POST `/api/v1/images`, указав параметры `location`, `os`   Тело ответа будет содержать объект JSON с информацией о загруженном образе.
     * Загрузка образа
     */
    async uploadImage(requestParameters: UploadImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UploadSuccessfulResponse> {
        const response = await this.uploadImageRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
