package com.colegio.section_service.prueba.service;

import com.colegio.section_service.prueba.entity.AnnualSections;
import com.colegio.section_service.prueba.entity.SectionStudent;
import com.colegio.section_service.prueba.repository.AnnualSectionsRepository;
import com.colegio.section_service.prueba.repository.SectionStudentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Service
public class SectionStudentService {

    @Autowired
    private SectionStudentRepository sectionStudentRepository;

    @Autowired
    private AnnualSectionsRepository annualSectionsRepository;

    @Autowired
    private RestTemplate restTemplate;

    private void populateDetails(SectionStudent sectionStudent) {
        if (sectionStudent.getStudentCode() == null) {
            sectionStudent.setStudentName("Sin alumno");
        } else {
            try {
                String url = "http://localhost:8082/api/user/usuarios/" + sectionStudent.getStudentCode();
                java.util.Map<?, ?> response = restTemplate.getForObject(url, java.util.Map.class);
                if (response != null && response.get("nombres") != null && response.get("apellidos") != null) {
                    sectionStudent.setStudentName(response.get("nombres") + " " + response.get("apellidos"));
                } else {
                    sectionStudent.setStudentName("Alumno: " + sectionStudent.getStudentCode());
                }
            } catch (Exception e) {
                sectionStudent.setStudentName("Alumno: " + sectionStudent.getStudentCode());
            }
        }
    }

    private void populateListDetails(List<SectionStudent> list) {
        if (list != null) {
            list.forEach(this::populateDetails);
        }
    }

    public List<SectionStudent> getStudentsBySection(UUID sectionId) {
        List<SectionStudent> list = sectionStudentRepository.findBySectionId(sectionId);
        populateListDetails(list);
        return list;
    }

    public List<SectionStudent> getAllSectionStudents() {
        return sectionStudentRepository.findAll();
    }

    @Transactional
    public List<SectionStudent> addStudentsToSectionBatch(UUID sectionId, List<String> studentCodes) {
        AnnualSections section = annualSectionsRepository.findById(sectionId)
                .orElseThrow(() -> new EntityNotFoundException("Sección no encontrada con ID: " + sectionId));

        return studentCodes.stream()
                .filter(code -> code != null && !code.trim().isEmpty())
                .map(code -> {
                    // Remueve de cualquier otra sección anterior para que un estudiante pertenezca solo a una sección
                    sectionStudentRepository.deleteByStudentCode(code);

                    SectionStudent ss = new SectionStudent();
                    ss.setSection(section);
                    ss.setStudentCode(code);
                    SectionStudent saved = sectionStudentRepository.save(ss);
                    populateDetails(saved);
                    return saved;
                })
                .toList();
    }

    @Transactional
    public void removeStudentFromSection(UUID sectionId, String studentCode) {
        sectionStudentRepository.deleteBySectionIdAndStudentCode(sectionId, studentCode);
    }
}
