package com.colegio.notification_service.client;

import com.colegio.notification_service.dto.UsuarioResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
        name = "enrollment-service",
        url = "http://localhost:8080"
)
public interface AcademicFeignClient {

//    @GetMapping("/internal/courses/{id}/students")
//    List<UsuarioResponseDTO> findStudentsByCourse(@PathVariable Long id);

    @GetMapping("/api/enrollment/enrollments/section/{sectionId}")
    List<UsuarioResponseDTO> findStudentsBySection(@PathVariable Long sectionId);

//    @GetMapping("/internal/grades/{id}/students")
//    List<UsuarioResponseDTO> findStudentsByGrade(@PathVariable Long id);

}
