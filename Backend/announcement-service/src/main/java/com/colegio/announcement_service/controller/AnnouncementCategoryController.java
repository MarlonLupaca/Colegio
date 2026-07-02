package com.colegio.announcement_service.controller;

import com.colegio.announcement_service.model.AnnouncementCategory;
import com.colegio.announcement_service.service.AnnouncementCategoryService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcement/category")
public class AnnouncementCategoryController {

    @Autowired
    private AnnouncementCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<AnnouncementCategory>> getCategories() {
        return ResponseEntity.ok(categoryService.getCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementCategory> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AnnouncementCategory> createCategory(@RequestBody AnnouncementCategory category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PutMapping
    public ResponseEntity<AnnouncementCategory> updateCategory(@RequestBody AnnouncementCategory category) {
        return ResponseEntity.ok(categoryService.updateCategory(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }


}
