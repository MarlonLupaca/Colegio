package com.colegio.section_service.prueba.controller;

import com.colegio.section_service.prueba.entity.AnnualSections;
import com.colegio.section_service.prueba.entity.EducationLevel;
import com.colegio.section_service.prueba.service.AnnualSectionsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/annual-sections")
public class AnnualSectionsController {

    @Autowired
    private AnnualSectionsService annualSectionsService;

    @PostMapping
    public AnnualSections createAnnualSection(@Valid @RequestBody AnnualSections annualSection) {
        return annualSectionsService.createAnnualSection(annualSection);
    }

    @GetMapping
    public List<AnnualSections> getAllAnnualSections() {
        return annualSectionsService.getAllAnnualSections();
    }

    @GetMapping("/{id}")
    public AnnualSections getAnnualSectionById(@PathVariable UUID id) {
        return annualSectionsService.getAnnualSectionById(id);
    }

    @GetMapping("/year/{academicYear}")
    public List<AnnualSections> getByAcademicYear(@PathVariable Integer academicYear) {
        return annualSectionsService.getByAcademicYear(academicYear);
    }

    // Cambiado el Path y el tipo de dato a EducationLevel
    @GetMapping("/education-level/{educationLevel}")
    public List<AnnualSections> getByEducationLevel(@PathVariable EducationLevel educationLevel) {
        return annualSectionsService.getByEducationLevel(educationLevel);
    }

    // Cambiado el RequestParam a EducationLevel
    @GetMapping("/filter")
    public List<AnnualSections> getByYearAndEducationLevel(
            @RequestParam Integer academicYear,
            @RequestParam EducationLevel educationLevel) {
        return annualSectionsService.getByAcademicYearAndEducationLevel(academicYear, educationLevel);
    }

    @PutMapping("/{id}")
    public AnnualSections updateAnnualSection(
            @PathVariable UUID id,
            @Valid @RequestBody AnnualSections details) {
        return annualSectionsService.updateAnnualSection(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteAnnualSection(@PathVariable UUID id) {
        annualSectionsService.deleteAnnualSection(id);
    }

    @PostMapping("/clone")
    public List<AnnualSections> cloneFromYear(
            @RequestParam Integer fromYear,
            @RequestParam Integer toYear) {
        return annualSectionsService.cloneFromYear(fromYear, toYear);
    }
}