package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.SectionStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SectionStudentRepository extends JpaRepository<SectionStudent, UUID> {

    List<SectionStudent> findBySectionId(UUID sectionId);

    boolean existsBySectionIdAndStudentCode(UUID sectionId, String studentCode);

    void deleteBySectionIdAndStudentCode(UUID sectionId, String studentCode);

    void deleteBySectionId(UUID sectionId);

    void deleteByStudentCode(String studentCode);
}
