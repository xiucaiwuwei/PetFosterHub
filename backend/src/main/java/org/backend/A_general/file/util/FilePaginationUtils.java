package org.backend.A_general.file.util;

import org.backend.A_general.file.entity.FileUpload;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 文件分页工具类
 * 提供文件列表分页、排序等相关功能
 */
public class FilePaginationUtils {
    
    /**
     * 默认分页大小
     */
    public static final int DEFAULT_PAGE_SIZE = 10;
    
    /**
     * 最大分页大小
     */
    public static final int MAX_PAGE_SIZE = 100;
    
    /**
     * 为文件列表应用分页
     * 
     * @param files 文件列表
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @return 分页后的文件列表
     */
    public static List<FileUpload> paginateFiles(List<FileUpload> files, int page, int size) {
        if (files == null || files.isEmpty()) {
            return Collections.emptyList();
        }
        
        // 验证页码和每页大小
        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        
        int startIndex = page * size;
        if (startIndex >= files.size()) {
            return Collections.emptyList();
        }
        
        int endIndex = Math.min(startIndex + size, files.size());
        return files.subList(startIndex, endIndex);
    }
    
    /**
     * 创建Pageable对象
     * 
     * @param page 页码（从0开始）
     * @param size 每页大小
     * @param sortField 排序字段
     * @param sortDirection 排序方向（ASC或DESC）
     * @return Pageable对象
     */
    public static Pageable createPageable(int page, int size, String sortField, String sortDirection) {
        // 验证页码和每页大小
        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        
        // 设置排序
        Sort.Direction direction = Sort.Direction.ASC;
        if (sortDirection != null && sortDirection.equalsIgnoreCase("desc")) {
            direction = Sort.Direction.DESC;
        }
        
        // 默认按创建时间排序
        String field = sortField != null && !sortField.trim().isEmpty() ? sortField : "createdAt";
        Sort sort = Sort.by(direction, field);
        
        return PageRequest.of(page, size, sort);
    }
    
    /**
     * 排序文件列表
     * 
     * @param files 文件列表
     * @param sortField 排序字段
     * @param sortDirection 排序方向（ASC或DESC）
     * @return 排序后的文件列表
     */
    public static List<FileUpload> sortFiles(List<FileUpload> files, String sortField, String sortDirection) {
        if (files == null || files.isEmpty()) {
            return Collections.emptyList();
        }
        
        // 创建排序后的列表副本
        List<FileUpload> sortedFiles = new java.util.ArrayList<>(files);
        
        // 确定比较器
        Comparator<FileUpload> comparator = getFileComparator(sortField);
        
        // 确定排序方向
        if (sortDirection != null && sortDirection.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }
        
        // 执行排序
        sortedFiles.sort(comparator);
        
        return sortedFiles;
    }
    
    /**
     * 根据字段名获取文件比较器
     * 
     * @param fieldName 字段名
     * @return 文件比较器
     */
    private static Comparator<FileUpload> getFileComparator(String fieldName) {
        if (fieldName == null || fieldName.trim().isEmpty()) {
            return Comparator.comparing(FileUpload::getCreatedAt).reversed();
        }
        
        switch (fieldName.toLowerCase()) {
            case "filename":
            case "originalname":
                return Comparator.comparing(FileUpload::getOriginalName, String.CASE_INSENSITIVE_ORDER);
            case "filesize":
            case "size":
                return Comparator.comparingLong(FileUpload::getFileSize);
            case "contenttype":
                return Comparator.comparing(FileUpload::getContentType, String.CASE_INSENSITIVE_ORDER);
            case "createdat":
            case "uploadtime":
                return Comparator.comparing(FileUpload::getCreatedAt);
            case "filetype":
                return Comparator.comparing(FileUpload::getFileType);
            default:
                // 默认按创建时间倒序
                return Comparator.comparing(FileUpload::getCreatedAt).reversed();
        }
    }
    
    /**
     * 创建Page对象
     * 
     * @param files 文件列表
     * @param pageable 分页请求
     * @return Page对象
     */
    public static Page<FileUpload> createPage(List<FileUpload> files, Pageable pageable) {
        if (files == null || files.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        
        // 排序文件列表
        List<FileUpload> sortedFiles = sortFiles(files, 
                pageable.getSort().toString().split(" ")[0], 
                pageable.getSort().toString().contains("DESC") ? "desc" : "asc");
        
        // 应用分页
        List<FileUpload> pagedFiles = paginateFiles(sortedFiles, pageable.getPageNumber(), pageable.getPageSize());
        
        return new PageImpl<>(pagedFiles, pageable, sortedFiles.size());
    }
    
    /**
     * 从请求参数构建Pageable对象
     * 
     * @param page 页码参数
     * @param size 每页大小参数
     * @param sort 排序参数
     * @return Pageable对象
     */
    public static Pageable buildPageableFromParams(Integer page, Integer size, String sort) {
        // 设置默认值
        int pageNum = page != null ? Math.max(0, page) : 0;
        int pageSize = size != null ? Math.max(1, Math.min(size, MAX_PAGE_SIZE)) : DEFAULT_PAGE_SIZE;
        
        // 解析排序参数
        String sortField = "createdAt";
        String sortDirection = "desc";
        
        if (sort != null && !sort.trim().isEmpty()) {
            String[] parts = sort.split(",");
            if (parts.length > 0) {
                sortField = parts[0];
            }
            if (parts.length > 1) {
                sortDirection = parts[1];
            }
        }
        
        return createPageable(pageNum, pageSize, sortField, sortDirection);
    }
    
    /**
     * 检查分页参数是否有效
     * 
     * @param page 页码
     * @param size 每页大小
     * @return 是否有效
     */
    public static boolean isValidPageParams(Integer page, Integer size) {
        return page != null && page >= 0 && 
               size != null && size >= 1 && size <= MAX_PAGE_SIZE;
    }
}