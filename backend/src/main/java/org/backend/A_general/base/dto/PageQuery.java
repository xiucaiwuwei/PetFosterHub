package org.backend.A_general.base.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.HashMap;
import java.util.Map;

/**
 * 分页查询条件类
 * 用于封装分页参数和查询条件
 */
@Data
@Schema(description = "分页查询条件")
public class PageQuery {

    /**
     * 当前页码，默认为1
     */
    @Schema(description = "当前页码", example = "1")
    @Min(value = 1, message = "页码必须大于等于1")
    private int pageNum = 1;

    /**
     * 每页记录数，默认为10
     */
    @Schema(description = "每页记录数", example = "10")
    @Min(value = 1, message = "每页记录数必须大于等于1")
    private int pageSize = 10;

    /**
     * 排序字段
     */
    @Schema(description = "排序字段", example = "createdAt")
    private String sortField;

    /**
     * 排序方向：ASC或DESC
     */
    @Schema(description = "排序方向（ASC或DESC）", example = "DESC")
    private String sortOrder = "DESC";

    /**
     * 查询条件参数
     */
    @Schema(description = "查询条件参数")
    private Map<String, Object> params = new HashMap<>();

    /**
     * 获取Spring Data的Pageable对象
     *
     * @return Pageable实例
     */
    public Pageable toPageable() {
        if (sortField != null && !sortField.isEmpty()) {
            Sort.Direction direction = "ASC".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC;
            return PageRequest.of(pageNum - 1, pageSize, Sort.by(direction, sortField));
        }
        return PageRequest.of(pageNum - 1, pageSize);
    }

    /**
     * 添加查询条件
     *
     * @param key 条件键
     * @param value 条件值
     * @return 当前PageQuery实例，支持链式调用
     */
    public PageQuery addParam(String key, Object value) {
        params.put(key, value);
        return this;
    }

    /**
     * 获取查询条件值
     *
     * @param key 条件键
     * @param <T> 值类型
     * @return 条件值
     */
    @SuppressWarnings("unchecked")
    public <T> T getParam(String key) {
        return (T) params.get(key);
    }

    /**
     * 获取查询条件值，如果不存在则返回默认值
     *
     * @param key 条件键
     * @param defaultValue 默认值
     * @param <T> 值类型
     * @return 条件值或默认值
     */
    @SuppressWarnings("unchecked")
    public <T> T getParamOrDefault(String key, T defaultValue) {
        return (T) params.getOrDefault(key, defaultValue);
    }

    /**
     * 检查是否包含指定的查询条件
     *
     * @param key 条件键
     * @return 是否包含
     */
    public boolean containsParam(String key) {
        return params.containsKey(key);
    }

    /**
     * 设置排序参数
     *
     * @param sortField 排序字段
     * @param sortOrder 排序方向
     * @return 当前PageQuery实例，支持链式调用
     */
    public PageQuery withSort(String sortField, String sortOrder) {
        this.sortField = sortField;
        this.sortOrder = sortOrder;
        return this;
    }
}