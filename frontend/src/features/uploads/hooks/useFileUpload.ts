/*
 * 文件上传Hook
 * 提供文件上传的React Hooks接口
 */
import {useCallback, useRef} from 'react';
import type { AxiosProgressEvent } from 'axios';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '@/app/store/store';
import {
    addUploadTask,
    updateUploadProgress,
    uploadSuccess,
    uploadFailure,
    UploadTask,
    startUploadTask,
    pauseUploadTask,
    removeUploadTask,
    clearUploadQueue,
    updateUploadConfig,
    handleChunkProgress,
    incrementRetries,
    UploadConfig
} from '../slice/uploadSlice';
import {handleFileUpload} from '../services/uploadService';
import {handleChunkUpload} from '../services/chunkUploadService';
import {UploadFileRequest} from '../types/dto/A_index';
import {FileTypes} from '../types/enums/A_index';

/**
 * 文件上传Hook返回类型
 */
export interface UseFileUploadReturn {
    /** 上传任务队列 */
    uploadTasks: UploadTask[];
    /** 添加文件到上传队列 */
    addFile: (file: File, fileType: FileTypes, useChunkUpload?: boolean) => void;
    /** 开始上传任务 */
    startUpload: (taskId: string) => void;
    /** 暂停上传任务 */
    pauseUpload: (taskId: string) => void;
    /** 移除上传任务 */
    removeUpload: (taskId: string) => void;
    /** 清空上传队列 */
    clearQueue: () => void;
    /** 更新上传配置 */
    updateConfig: (config: Partial<UploadConfig>) => void;
    /** 上传进度回调函数 */
    onUploadProgress: (taskId: string) => (progressEvent: AxiosProgressEvent) => void;
}

/**
 * 自定义文件上传Hook
 * 提供文件上传的状态管理和操作方法
 */
export const useFileUpload = (): UseFileUploadReturn => {
    const dispatch = useAppDispatch();
    const {currentTasks, config} = useSelector(
        (state: RootState) => state.uploads
    );

    // 上传控制器引用，用于取消上传
    const abortControllersRef = useRef<Record<string, AbortController>>({});

    /**
     * 添加文件到上传队列
     */
    const addFile = useCallback((file: File, fileType: FileTypes, useChunkUpload?: boolean) => {
        dispatch(addUploadTask({
            file,
            fileType,
            useChunkUpload: useChunkUpload !== undefined ? useChunkUpload : false
        }));
    }, [dispatch]);

    /**
     * 开始上传任务
     */
    const startUpload = useCallback(async (taskId: string) => {
        const task = currentTasks.find((t: UploadTask) => t.id === taskId);

        if (!task || task.status !== 'idle') {
            return;
        }

        // 创建AbortController用于取消上传
        const controller = new AbortController();
        abortControllersRef.current[taskId] = controller;

        try {
            // 分发开始上传的action
            dispatch(startUploadTask(taskId));

            // 根据任务类型选择上传方式
            if (task.useChunkUpload) {
                // 使用分块上传
                const response = await handleChunkUpload(
                    {
                        file: task.file,
                        fileType: task.fileType,
                        operationType: 'file_upload',
                        operationContent: `Uploading ${task.file.name}`
                    },
                    {
                        onProgress: (chunkIndex: number, progress: number) => {
                            // 在实际应用中，可能需要额外的状态管理来跟踪已上传的块数
                            // 这里为了演示，我们使用进度百分比来估算已上传的块数
                            // 实际项目中应该有更精确的实现方式
                            const task = currentTasks.find(t => t.id === taskId);
                            if (task && task.totalChunks) {
                                const uploadedChunks = Math.ceil((progress / 100) * task.totalChunks);
                                dispatch(handleChunkProgress({
                                    taskId,
                                    chunkIndex,
                                    totalChunks: task.totalChunks,
                                    uploadedChunks
                                }));
                            }
                        },
                        chunkSize: config.chunkSize,
                        concurrentChunks: config.concurrentChunks,
                        enableResume: config.enableResumeUpload,
                        retryCount: config.retryLimit
                    }
                );

                // 上传成功
                dispatch(uploadSuccess({taskId, response}));
            } else {
                // 使用普通上传
                // 准备上传数据
                const uploadDto: UploadFileRequest = {
                    file: task.file,
                    fileType: task.fileType,
                    operationType: 'file_upload',
                    operationContent: `Uploading ${task.file.name}`
                };

                // 定义进度回调
                const onProgress = (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        dispatch(updateUploadProgress({taskId, progress: percentCompleted}));
                    }
                };

                // 执行上传（支持重试）
                let retries = 0;
                let response;

                while (true) {
                    try {
                        response = await handleFileUpload(uploadDto, onProgress, controller.signal);
                        break;
                    } catch (error) {
                        retries++;
                        dispatch(incrementRetries(taskId));

                        if (retries > config.retryLimit) {
                            throw error;
                        }

                        // 等待一段时间后重试
                        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
                    }
                }

                // 上传成功
                dispatch(uploadSuccess({taskId, response}));
            }
        } catch (error) {
            // 上传失败
            const errorMessage = error instanceof Error ? error.message : '上传失败';
            dispatch(uploadFailure({taskId, error: errorMessage}));
        } finally {
            // 清理AbortController
            delete abortControllersRef.current[taskId];
        }
    }, [currentTasks, dispatch, config]);

    /**
     * 暂停上传任务
     */
    const pauseUpload = useCallback((taskId: string) => {
        // 取消上传请求
        const controller = abortControllersRef.current[taskId];
        if (controller) {
            controller.abort();
            delete abortControllersRef.current[taskId];
        }

        // 分发暂停上传的action
        dispatch(pauseUploadTask(taskId));
    }, [dispatch]);

    /**
     * 移除上传任务
     */
    const removeUpload = useCallback((taskId: string) => {
        // 取消可能正在进行的上传
        const controller = abortControllersRef.current[taskId];
        if (controller) {
            controller.abort();
            delete abortControllersRef.current[taskId];
        }

        // 分发移除上传任务的action
        dispatch(removeUploadTask(taskId));
    }, [dispatch]);

    /**
     * 清空上传队列
     */
    const clearQueue = useCallback(() => {
        // 取消所有正在进行的上传
        Object.values(abortControllersRef.current).forEach(controller => controller.abort());
        abortControllersRef.current = {};

        // 分发清空队列的action
        dispatch(clearUploadQueue());
    }, [dispatch]);

    /**
     * 更新上传配置
     */
    const updateConfig = useCallback((newConfig: Partial<UploadConfig>) => {
        dispatch(updateUploadConfig(newConfig));
    }, [dispatch]);

    /**
     * 上传进度回调函数生成器
     */
    const onUploadProgress = useCallback((taskId: string) => {
        return (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch(updateUploadProgress({taskId, progress: percentCompleted}));
            }
        };
    }, [dispatch]);

    return {
        uploadTasks: currentTasks,
        addFile,
        startUpload,
        pauseUpload,
        removeUpload,
        clearQueue,
        updateConfig,
        onUploadProgress
    };
};