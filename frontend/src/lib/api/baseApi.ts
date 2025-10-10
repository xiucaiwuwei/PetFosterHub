import type { BaseResponse } from '@/types/dto/baseDto';
import { get, post, put, del } from './axios';

/**
 * 基础API选项配置
 */
export interface BaseApiOptions {
    endpoint: string;
    idField?: string;
}

/**
 * 基础API接口定义
 * 提供通用的CRUD操作方法
 */
export interface BaseApi<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
    getAll: (params?: Record<string, any>) => Promise<BaseResponse<T[]>>;
    getById: (id: string | number) => Promise<BaseResponse<T>>;
    create: (data: CreateDTO) => Promise<BaseResponse<T>>;
    update: (id: string | number, data: UpdateDTO) => Promise<BaseResponse<T>>;
    delete: (id: string | number) => Promise<BaseResponse<void>>;
}

/**
 * 创建基础API客户端
 * 统一处理CRUD操作，减少重复代码
 */
export function createBaseApi<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>(
    options: BaseApiOptions
): BaseApi<T, CreateDTO, UpdateDTO> {
    const { endpoint } = options;
    const basePath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    if (process.env.NODE_ENV === 'development') {
        console.debug(`创建基础API: ${basePath}`);
    }

    return {
        getAll: (params?: Record<string, any>) =>
            get<BaseResponse<T[]>>(basePath, { params }),

        getById: (id: string | number) =>
            get<BaseResponse<T>>(`${basePath}/${id}`),

        create: (data: CreateDTO) =>
            post<BaseResponse<T>>(basePath, data),

        update: (id: string | number, data: UpdateDTO) =>
            put<BaseResponse<T>>(`${basePath}/${id}`, data),

        delete: (id: string | number) =>
            del<BaseResponse<void>>(`${basePath}/${id}`),
    };
}

/**
 * 分页响应数据结构
 */
export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

/**
 * 带分页的API接口定义
 */
export interface PaginatedApi<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> extends Omit<BaseApi<T, CreateDTO, UpdateDTO>, 'getAll'> {
    getAll: (params?: {
        page?: number;
        size?: number;
        [key: string]: any
    }) => Promise<BaseResponse<PaginatedResponse<T>>>;
}

/**
 * 创建带分页的API客户端
 */
export function createPaginatedApi<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>(options: BaseApiOptions): PaginatedApi<T, CreateDTO, UpdateDTO> {
    const basePath = options.endpoint.startsWith('/') ? options.endpoint : `/${options.endpoint}`;

    if (process.env.NODE_ENV === 'development') {
        console.debug(`创建分页API: ${basePath}`);
    }

    return {
        ...createBaseApi<T, CreateDTO, UpdateDTO>(options),
        getAll: (params?: { page?: number; size?: number;[key: string]: any }) =>
            get<BaseResponse<PaginatedResponse<T>>>(basePath, { params }),
    };
}

// 工具函数：处理endpoint前缀
function normalizeEndpoint(endpoint: string): string {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

/**
 * 创建状态更新API辅助函数
 */
export function createStatusApi<T, S = any>(endpoint: string) {
    const basePath = normalizeEndpoint(endpoint);

    if (process.env.NODE_ENV === 'development') {
        console.debug(`创建状态API: ${basePath}`);
    }

    return {
        updateStatus: (id: string | number, status: S, statusField = 'status') =>
            put<BaseResponse<T>>(`${basePath}/${id}/${statusField}`, { [statusField]: status }),
    };
}

/**
 * 创建带查询参数的API客户端
 */
export function createQueryApi<T>(endpoint: string) {
    const basePath = normalizeEndpoint(endpoint);

    if (process.env.NODE_ENV === 'development') {
        console.debug(`创建查询API: ${basePath}`);
    }

    return {
        getByQuery: (params?: Record<string, any>) =>
            get<BaseResponse<T[]>>(basePath, { params }),
    };
}