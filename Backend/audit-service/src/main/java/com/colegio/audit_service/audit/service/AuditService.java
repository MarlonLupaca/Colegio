package com.colegio.audit_service.audit.service;

import com.colegio.audit_service.audit.dto.AuditEventDTO;
import com.colegio.audit_service.audit.dto.BitacoraResponseDTO;
import com.colegio.audit_service.audit.entity.AccionCritica;
import com.colegio.audit_service.audit.entity.RegistroBitacora;
import com.colegio.audit_service.audit.repository.BitacoraRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final BitacoraRepository bitacoraRepository;

    @Transactional
    public void registrarEvento(AuditEventDTO evento) {
        try {
            AccionCritica accion = AccionCritica.valueOf(evento.getAccion());

            RegistroBitacora registro = RegistroBitacora.builder()
                    .accion(accion)
                    .entidadAfectada(evento.getEntidadAfectada())
                    .idEntidad(evento.getIdEntidad())
                    .realizadoPor(evento.getRealizadoPor())
                    .rolRealizador(evento.getRolRealizador())
                    .detalles(evento.getDetalles())
                    .ipOrigen(evento.getIpOrigen())
                    .timestamp(evento.getTimestamp() != null
                            ? LocalDateTime.parse(evento.getTimestamp())
                            : LocalDateTime.now())
                    .build();

            bitacoraRepository.save(registro);
            log.info("Evento de auditoría registrado: {} por {}", accion, evento.getRealizadoPor());
        } catch (Exception e) {
            log.error("Error al registrar evento de auditoría: {}", e.getMessage());
        }
    }

    public List<BitacoraResponseDTO> listarTodos() {
        return bitacoraRepository.findAllByOrderByTimestampDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BitacoraResponseDTO> filtrarPorAccion(String accion) {
        AccionCritica accionEnum = AccionCritica.valueOf(accion);
        return bitacoraRepository.findByAccion(accionEnum)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BitacoraResponseDTO> filtrarPorUsuario(String codigoUsuario) {
        return bitacoraRepository.findByRealizadoPor(codigoUsuario)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BitacoraResponseDTO> filtrarPorRango(LocalDateTime desde, LocalDateTime hasta) {
        return bitacoraRepository.findByTimestampBetween(desde, hasta)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BitacoraResponseDTO obtenerPorId(Long id) {
        return bitacoraRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado con id: " + id));
    }

    private BitacoraResponseDTO toDTO(RegistroBitacora r) {
        return BitacoraResponseDTO.builder()
                .id(r.getId())
                .accion(r.getAccion())
                .entidadAfectada(r.getEntidadAfectada())
                .idEntidad(r.getIdEntidad())
                .realizadoPor(r.getRealizadoPor())
                .rolRealizador(r.getRolRealizador())
                .detalles(r.getDetalles())
                .ipOrigen(r.getIpOrigen())
                .timestamp(r.getTimestamp())
                .build();
    }
}
