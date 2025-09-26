package org.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.backend.base.entity.BaseEntity;
import org.backend.entity.enums.UserRole;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = {"phone", "role"}),
       indexes = {@Index(columnList = "phone"), @Index(columnList = "role")})
@Schema(description = "用户实体")
public class User extends BaseEntity {

    @Column(nullable = false)
    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "头像")
    private String avatar;

    @Column(nullable = true)
    @Schema(description = "昵称")
    private String nickname;

    @Column(nullable = false)
    @Schema(description = "密码")
    private String password;

    @Schema(description = "角色")
    private UserRole role;

    @Column(nullable = false)
    @Schema(description = "身份证号")
    private String idCard;

    @Schema(description = "姓名")
    private String fullName;

    @Schema(description = "地址")
    private String address;

    @Schema(description = "个人简介")
    private String bio;

    @Schema(description = "评分")
    private BigDecimal rating;

    @Schema(description = "评价数量")
    private Integer reviewCount;

    @Schema(description = "逻辑删除")
    private Integer deleted;
}