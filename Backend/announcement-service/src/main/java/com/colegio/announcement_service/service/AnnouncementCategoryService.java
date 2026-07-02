package com.colegio.announcement_service.service;

import com.colegio.announcement_service.model.AnnouncementCategory;
import com.colegio.announcement_service.repository.AnnouncementCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementCategoryService {

    @Autowired
    private AnnouncementCategoryRepository categoryRepository;

    public List<AnnouncementCategory> getCategories(){return categoryRepository.findAll();}

    public Optional<AnnouncementCategory> getCategoryById(Long id){return categoryRepository.findById(id);}

    public AnnouncementCategory createCategory(AnnouncementCategory category){return categoryRepository.save(category);}

    public AnnouncementCategory updateCategory(AnnouncementCategory category){return categoryRepository.save(category);}

    public void deleteCategory(Long id){categoryRepository.deleteById(id);}

}
