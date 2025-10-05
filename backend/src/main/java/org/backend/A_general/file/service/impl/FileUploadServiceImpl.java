package org.backend.A_general.file.service.impl;

import org.backend.A_general.base.service.impl.BaseServiceImpl;
import org.backend.A_general.file.entity.FileUpload;
import org.backend.A_general.file.repository.FileUploadRepository;
import org.backend.A_general.file.service.FileUploadService;
import org.backend.A_general.file.util.FileRepositoryUtils;
import org.backend.A_general.file.util.FileSecurityUtils;
import org.backend.A_general.file.util.FileUploadUtils;
import org.backend.A_general.file.util.FileUtils;
import org.backend.entity.User;
import org.backend.entity.enums.FileType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;
import java.util.List;

@Service
public class FileUploadServiceImpl extends BaseServiceImpl<FileUpload, Long, FileUploadRepository> implements FileUploadService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public FileUploadServiceImpl(FileUploadRepository fileUploadRepository) {
        super(fileUploadRepository);
    }

    private static final Logger logger = LoggerFactory.getLogger(FileUploadServiceImpl.class);

    @Override
    public FileUpload uploadFile(MultipartFile file, String entityType, Long entityId, boolean isPublic, User user) {
        if (file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }

        // 验证文件类型
        String contentType = file.getContentType();
        if (!FileUploadUtils.isAllowedFileType(contentType)) {
            throw new RuntimeException("不支持的文件类型: " + contentType);
        }

        // 创建上传目录
        FileUtils.createDirectory(uploadDir);

        // 获取原始文件名并生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String uniqueFileName = FileUtils.generateUniqueFileName(originalFilename);
        String safeFileName = FileUploadUtils.generateSafeFilename(uniqueFileName);

        // 构建完整文件路径
        String filePath = Paths.get(uploadDir, safeFileName).toString();

        // 保存文件
        if (!FileUploadUtils.saveMultipartFile(file, filePath)) {
            throw new RuntimeException("文件保存失败");
        }

        // 设置默认文件类型为OTHER（FileType枚举基于文件用途，而非扩展名）
        FileType fileType = FileType.OTHER;

        // 保存文件信息到数据库
        FileUpload fileUpload = new FileUpload();
        fileUpload.setUserId(user.getId());
        fileUpload.setFileName(safeFileName);
        fileUpload.setOriginalName(originalFilename);
        fileUpload.setFilePath(filePath);
        fileUpload.setFileSize(file.getSize());
        fileUpload.setContentType(contentType);
        fileUpload.setFileType(fileType);
        fileUpload.setEntityType(entityType);
        fileUpload.setEntityId(entityId);
        fileUpload.setIsPublic(isPublic);
        fileUpload.setDeleted(false);

        return repository.save(fileUpload);
    }

    // 保持原有方法以向后兼容
    public FileUpload uploadFileWithFileType(MultipartFile file, Long userId, String entityType, Long entityId, String fileType) {
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
    public void deleteFile(Long id, User user) { // 移除throws IOException
        FileUpload fileUpload = repository.findById(id).orElse(null);
        if (fileUpload == null || !fileUpload.getUserId().equals(user.getId())) {
            throw new RuntimeException("文件不存在或无权限删除");
        }

        // 删除物理文件
        String filePath = fileUpload.getFilePath();
        if (filePath != null && !filePath.isEmpty()) {
            FileUtils.deleteFile(filePath);
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

        // 删除物理文件
        String filePath = fileUpload.getFilePath();
        if (filePath != null && !filePath.isEmpty()) {
            FileUtils.deleteFile(filePath);
        }

        // 逻辑删除
        fileUpload.setDeleted(true);
        repository.save(fileUpload);
    }

    @Override
    public FileUpload getFileById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public boolean canAccessFile(Long fileId, Long userId) {
        FileUpload fileUpload = repository.findById(fileId).orElse(null);
        return FileSecurityUtils.hasAccessPermission(fileUpload, userId);
    }

    @Override
    public String getFileUrl(FileUpload fileUpload) {
        // 实现文件URL生成逻辑
        return fileUpload.getFilePath();
    }

    @Override
    public boolean existsById(Long id) { // 重命名为existsById以符合BaseService接口
        return repository.existsById(id);
    }

    @Override
    public long countUserFiles(User user) {
        return FileRepositoryUtils.countUserFiles(repository, user.getId());
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
        return FileRepositoryUtils.findByUserIdAndFileType(repository, userId, fileTypeEnum);
    }

    @Override
    public FileUpload findByFileNameAndUserId(String fileName, Long userId) {
        return FileRepositoryUtils.findByFileNameAndUserId(repository, fileName, userId).orElse(null);
    }
}