package org.backend.service.impl;

import org.backend.base.service.BaseServiceImpl;
import org.backend.entity.FileUpload;
import org.backend.entity.User;
import org.backend.entity.enums.FileType;
import org.backend.repository.FileUploadRepository;
import org.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadServiceImpl extends BaseServiceImpl<FileUpload, Long, FileUploadRepository> implements FileUploadService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public FileUploadServiceImpl(FileUploadRepository fileUploadRepository) {
        super(fileUploadRepository);
    }

    @Override
    public FileUpload uploadFile(MultipartFile file, String entityType, Long entityId, boolean isPublic, User user) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }

        // 创建上传目录
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        // 保存文件
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // 保存文件信息到数据库
        FileUpload fileUpload = new FileUpload();
        fileUpload.setUserId(user.getId());
        fileUpload.setFileName(uniqueFileName);
        fileUpload.setOriginalName(originalFilename);
        fileUpload.setFilePath(filePath.toString());
        fileUpload.setFileSize(file.getSize());
        fileUpload.setContentType(file.getContentType());
        fileUpload.setEntityType(entityType);
        fileUpload.setEntityId(entityId);
        fileUpload.setIsPublic(isPublic);
        fileUpload.setDeleted(false);

        return repository.save(fileUpload);
    }

    // 保持原有方法以向后兼容
    public FileUpload uploadFileWithFileType(MultipartFile file, Long userId, String entityType, Long entityId, String fileType) throws IOException {
        User user = new User();
        user.setId(userId);
        return uploadFile(file, entityType, entityId, false, user);
    }

    @Override
    public List<FileUpload> getUserFiles(User user) {
        return repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(user.getId());
    }

    // 保持原有方法以向后兼容
    public List<FileUpload> getUserFiles(Long userId) {
        return repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<FileUpload> getFilesByEntity(String entityType, Long entityId) {
        return repository.findByEntityTypeAndEntityIdAndDeletedFalseOrderByCreatedAtDesc(entityType, entityId);
    }

    // 保持原有方法以向后兼容
    public List<FileUpload> getEntityFiles(String entityType, Long entityId) {
        return repository.findByEntityTypeAndEntityIdAndDeletedFalseOrderByCreatedAtDesc(entityType, entityId);
    }

    @Override
    public List<FileUpload> getPublicFilesByEntity(String entityType, Long entityId) {
        return repository.findPublicFilesByEntity(entityType, entityId);
    }

    // 保持原有方法以向后兼容
    public List<FileUpload> getPublicEntityFiles(String entityType, Long entityId) {
        return getPublicFilesByEntity(entityType, entityId);
    }

    @Override
    public void deleteFile(Long id, User user) throws IOException {
        FileUpload fileUpload = repository.findById(id).orElse(null);
        if (fileUpload == null || !fileUpload.getUserId().equals(user.getId())) {
            throw new RuntimeException("文件不存在或无权限删除");
        }

        try {
            // 删除物理文件
            Path filePath = Paths.get(fileUpload.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            throw new IOException("删除文件失败", e);
        }

        // 逻辑删除
        fileUpload.setDeleted(true);
        repository.save(fileUpload);
    }

    // 保持原有方法以向后兼容
    public void deleteFile(Long fileId, Long userId) {
        FileUpload fileUpload = repository.findById(fileId).orElse(null);
        if (fileUpload == null || !fileUpload.getUserId().equals(userId)) {
            throw new RuntimeException("文件不存在或无权限删除");
        }

        try {
            // 删除物理文件
            Path filePath = Paths.get(fileUpload.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("删除文件失败");
        }

        // 逻辑删除
        fileUpload.setDeleted(true);
        repository.save(fileUpload);
    }

    @Override
    public FileUpload getFileById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public boolean canAccessFile(Long fileId, Long userId) {
        FileUpload fileUpload = repository.findById(fileId).orElse(null);
        return fileUpload != null &&
                !fileUpload.getDeleted() &&
                (fileUpload.getUserId().equals(userId) || fileUpload.getIsPublic());
    }

    @Override
    public String getFileUrl(String filePath) {
        // 实现文件URL生成逻辑
        return filePath;
    }

    @Override
    public boolean fileExists(Long id) {
        return repository.existsById(id);
    }

    @Override
    public long countUserFiles(User user) {
        return repository.countByUserIdAndDeletedFalse(user.getId());
    }

    @Override
    public long countFilesByEntity(String entityType, Long entityId) {
        // 实现按实体类型和ID统计文件数量的逻辑
        return repository.countByEntityTypeAndEntityIdAndDeletedFalse(entityType, entityId);
    }

    // 保持原有方法以向后兼容
    public long getUserFileCount(Long userId) {
        User user = new User();
        user.setId(userId);
        return countUserFiles(user);
    }

    @Override
    public List<FileUpload> findByEntityTypeAndEntityIdAndFileType(String entityType, Long entityId, String fileType) {
        // 将String类型的fileType转换为FileType枚举
        FileType fileTypeEnum;
        try {
            fileTypeEnum = FileType.valueOf(fileType.toUpperCase());
        } catch (IllegalArgumentException e) {
            // 如果传入的fileType不匹配任何枚举值，返回空列表
            return List.of();
        }
        return repository.findByEntityTypeAndEntityIdAndFileTypeAndDeletedFalseOrderByCreatedAtDesc(entityType, entityId, fileTypeEnum);
    }

    @Override
    public List<FileUpload> findByUserIdAndFileType(Long userId, String fileType) {
        // 将String类型的fileType转换为FileType枚举
        FileType fileTypeEnum;
        try {
            fileTypeEnum = FileType.valueOf(fileType.toUpperCase());
        } catch (IllegalArgumentException e) {
            // 如果传入的fileType不匹配任何枚举值，返回空列表
            return List.of();
        }
        return repository.findByUserIdAndFileType(userId, fileTypeEnum);
    }
}