package com.colegio.notification_service.service;

import com.colegio.notification_service.client.AcademicFeignClient;
import com.colegio.notification_service.client.UserFeignClient;
import com.colegio.notification_service.dto.NotificationRequest;
import com.colegio.notification_service.dto.UsuarioResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipientResolverService {

    @Autowired
    private AcademicFeignClient academicFeignClient;

    @Autowired
    private UserFeignClient userFeignClient;

    public List<UsuarioResponseDTO> resolveRecipients(NotificationRequest request){

        return switch (request.getRecipientType()) {
            case "USER" -> List.of();
            case "ROLE" -> userFeignClient.findByRole(request.getRole());
            case "SECTION" -> academicFeignClient.findStudentsBySection(request.getSectionId())
                    .stream()
                    .map(s -> new UsuarioResponseDTO(s.getStudentId()))
                    .toList();
            case "ALL" -> userFeignClient.findAllUsers();
            default -> List.of();
        };

    }

}