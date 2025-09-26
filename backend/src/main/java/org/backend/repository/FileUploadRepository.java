package org.backend.repository;

import org.backend.base.repository.BaseRepository;
import org.backend.entity.FileUpload;
import org.backend.entity.enums.FileType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileUploadRepository extends BaseRepository<FileUpload, Long> {

    List<FileUpload> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

    Page<FileUpload> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<FileUpload> findByEntityTypeAndEntityIdAndDeletedFalseOrderByCreatedAtDesc(String entityType, Long entityId);

    // 修改参数类型从String到FileType枚举，解决类型不匹配问题
    List<FileUpload> findByEntityTypeAndEntityIdAndFileTypeAndDeletedFalseOrderByCreatedAtDesc(String entityType, Long entityId, FileType fileType);

    @Query("SELECT f FROM FileUpload f WHERE f.entityType = :entityType AND f.entityId = :entityId AND f.isPublic = true AND f.deleted = false ORDER BY f.createdAt DESC")
    List<FileUpload> findPublicFilesByEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId);

    @Query("SELECT f FROM FileUpload f WHERE f.userId = :userId AND f.fileType = :fileType AND f.deleted = false ORDER BY f.createdAt DESC")
    List<FileUpload> findByUserIdAndFileType(@Param("userId") Long userId, @Param("fileType") FileType fileType);

    @Query("SELECT f FROM FileUpload f WHERE f.fileName = :fileName AND f.userId = :userId AND f.deleted = false")
    FileUpload findByFileNameAndUserId(@Param("fileName") String fileName, @Param("userId") Long userId);

    long countByUserIdAndDeletedFalse(Long userId);

    long countByEntityTypeAndEntityIdAndDeletedFalse(String entityType, Long entityId);
}