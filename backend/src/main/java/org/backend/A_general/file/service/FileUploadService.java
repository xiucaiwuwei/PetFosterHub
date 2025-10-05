package org.backend.A_general.file.service;

import org.backend.A_general.base.service.BaseService;
import org.backend.entity.User;
import org.backend.A_general.file.entity.FileUpload;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileUploadService extends BaseService<FileUpload, Long> {

    /**
     * 上传文件
     *
     * @param file       文件对象
     * @param entityType 关联实体类型
     * @param entityId   关联实体ID
     * @param isPublic   是否公开
     * @param user       用户对象
     * @return 上传的文件信息
     * @throws IOException IO异常
     */
    FileUpload uploadFile(MultipartFile file, String entityType, Long entityId, boolean isPublic, User user) throws IOException;

    /**
     * 根据用户获取文件列表
     *
     * @param user 用户对象
     * @return 文件列表
     */
    List<FileUpload> getUserFiles(User user);

    /**
     * 根据实体类型和ID获取文件列表
     *
     * @param entityType 实体类型
     * @param entityId   实体ID
     * @return 文件列表
     */
    List<FileUpload> getFilesByEntity(String entityType, Long entityId);

    /**
     * 根据实体类型和ID获取公开的文件列表
     *
     * @param entityType 实体类型
     * @param entityId   实体ID
     * @return 文件列表
     */
    List<FileUpload> getPublicFilesByEntity(String entityType, Long entityId);

    /**
     * 根据ID获取文件信息
     *
     * @param id 文件ID
     * @return 文件信息
     */
    FileUpload getFileById(Long id);

    /**
     * 根据用户获取文件列表
     *
     * @param userId 用户ID
     * @return 文件列表
     */
    List<FileUpload> getUserFiles(Long userId);

    /**
     * 根据实体类型、ID和文件类型获取文件列表
     *
     * @param entityType 实体类型
     * @param entityId   实体ID
     * @param fileType   文件类型
     * @return 文件列表
     */
    List<FileUpload> findByEntityTypeAndEntityIdAndFileType(String entityType, Long entityId, String fileType);

    /**
     * 根据用户ID和文件类型获取文件列表
     *
     * @param userId   用户ID
     * @param fileType 文件类型
     * @return 文件列表
     */
    List<FileUpload> findByUserIdAndFileType(Long userId, String fileType);

    /**
     * 统计用户的文件数量
     *
     * @param user 用户对象
     * @return 文件数量
     */
    long countUserFiles(User user);

    /**
     * 根据实体类型和ID统计文件数量
     *
     * @param entityType 实体类型
     * @param entityId   实体ID
     * @return 文件数量
     */
    long countFilesByEntity(String entityType, Long entityId);

    /**
     * 根据文件名和用户ID查找文件
     *
     * @param fileName 文件名
     * @param userId   用户ID
     * @return 文件信息
     */
    FileUpload findByFileNameAndUserId(String fileName, Long userId);

    /**
     * 带文件类型的文件上传
     *
     * @param file       文件对象
     * @param userId     用户ID
     * @param entityType 关联实体类型
     * @param entityId   关联实体ID
     * @param fileType   文件类型
     * @return 上传的文件信息
     * @throws IOException IO异常
     */
    FileUpload uploadFileWithFileType(MultipartFile file, Long userId, String entityType, Long entityId, String fileType) throws IOException;

    /**
     * 根据ID获取实体文件
     *
     * @param entityType 实体类型
     * @param entityId   实体ID
     * @return 文件列表
     */
    List<FileUpload> getEntityFiles(String entityType, Long entityId);

    /**
     * 获取公开的实体文件
     *
     * @param entityType 实体类型
     * @param entityId   实体ID
     * @return 文件列表
     */
    List<FileUpload> getPublicEntityFiles(String entityType, Long entityId);

    /**
     * 根据ID删除文件
     *
     * @param fileId 文件ID
     * @param user   用户对象
     */
    void deleteFile(Long fileId, User user);

    /**
     * 根据ID和用户ID删除文件
     *
     * @param fileId 文件ID
     * @param userId 用户ID
     */
    void deleteFile(Long fileId, Long userId);

    /**
     * 检查用户是否可以访问文件
     *
     * @param fileId 文件ID
     * @param userId 用户ID
     * @return 是否可以访问
     */
    boolean canAccessFile(Long fileId, Long userId);

    /**
     * 获取文件访问URL
     *
     * @param fileUpload 文件信息
     * @return 文件URL
     */
    String getFileUrl(FileUpload fileUpload);
}