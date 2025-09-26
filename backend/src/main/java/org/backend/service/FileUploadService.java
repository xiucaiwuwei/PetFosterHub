package org.backend.service;

import org.backend.base.service.BaseService;
import org.backend.entity.FileUpload;
import org.backend.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileUploadService extends BaseService<FileUpload, Long> {

    FileUpload uploadFile(MultipartFile file, String entityType, Long entityId, boolean isPublic, User user) throws IOException;

    List<FileUpload> getUserFiles(User user);

    List<FileUpload> getFilesByEntity(String entityType, Long entityId);

    List<FileUpload> getPublicFilesByEntity(String entityType, Long entityId);

    FileUpload getFileById(Long id);

    void deleteFile(Long id, User user) throws IOException;

    String getFileUrl(String filePath);

    boolean fileExists(Long id);

    long countUserFiles(User user);

    long countFilesByEntity(String entityType, Long entityId);

    // 按实体类型、ID和文件类型查询文件
    List<FileUpload> findByEntityTypeAndEntityIdAndFileType(String entityType, Long entityId, String fileType);

    // 按用户ID和文件类型查询文件
    List<FileUpload> findByUserIdAndFileType(Long userId, String fileType);
}