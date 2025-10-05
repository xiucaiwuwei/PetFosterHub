package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.entity.Pet;
import org.backend.entity.User;
import org.backend.service.PetService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
@Tag(name = "宠物管理", description = "宠物信息管理接口")
public class PetController extends BaseController {

    private final PetService petService;

    @GetMapping
    @Operation(summary = "获取当前用户的宠物列表")
    public ResponseEntity<BaseResponse<List<Pet>>> getCurrentUserPets(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Pet> pets = petService.findByUser(user);
        return super.success("获取成功", pets);
    }

    @GetMapping("/page")
    @Operation(summary = "分页获取当前用户的宠物")
    public ResponseEntity<BaseResponse<Page<Pet>>> getCurrentUserPetsPage(
            Authentication authentication,
            Pageable pageable) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        Page<Pet> pets = petService.findByUser(user, pageable);
        return super.success("获取成功", pets);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取宠物信息")
    public ResponseEntity<BaseResponse<Pet>> getPetById(@PathVariable Long id) {
        Optional<Pet> petOptional = petService.findById(id);
        if (petOptional.isEmpty()) {
            return super.notFound("宠物不存在");
        }
        return super.success("获取成功", petOptional.get());
    }

    @PostMapping
    @Operation(summary = "创建新宠物")
    public ResponseEntity<BaseResponse<Pet>> createPet(
            Authentication authentication,
            @Valid @RequestBody Pet pet) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        Pet savedPet = petService.save(pet, user);
        return super.success("创建成功", savedPet);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新宠物信息")
    public ResponseEntity<BaseResponse<Pet>> updatePet(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody Pet pet) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        pet.setId(id);
        Pet updatedPet = petService.update(pet, user);
        return super.success("更新成功", updatedPet);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除宠物")
    public ResponseEntity<BaseResponse<String>> deletePet(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        petService.delete(id, user);
        return super.success("宠物删除成功");
    }

    @GetMapping("/search")
    @Operation(summary = "搜索宠物")
    public ResponseEntity<BaseResponse<List<Pet>>> searchPets(
            Authentication authentication,
            @RequestParam String keyword) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Pet> pets = petService.findByUserAndNameContaining(user, keyword);
        return super.success("获取成功", pets);
    }
}