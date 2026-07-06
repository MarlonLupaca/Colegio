package com.colegio.notification_service.service;

import com.colegio.notification_service.dto.NotificationRequest;
import com.colegio.notification_service.dto.UsuarioResponseDTO;
import com.colegio.notification_service.model.Notification;
import com.colegio.notification_service.model.NotificationType;
import com.colegio.notification_service.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private RecipientResolverService recipientResolverService;

    public List<Notification> getNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findAllByUser(userId);
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public Notification createNotification(Notification notification) {
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public Notification updateNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long id) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }

//    public int markAllAsReadByUser(Long userId) {
//        List<Notification> notifications = notificationRepository.findAllByUserAndReadFalse(userId);
//        notifications.forEach(notification -> notification.setRead(true));
//        notificationRepository.saveAll(notifications);
//        return notifications.size();
//    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public void deleteAllNotificationsByUser(Long userId) {
        List<Notification> notifications = notificationRepository.findAllByUser(userId);
        notificationRepository.deleteAll(notifications);
    }

    public void processNotification(NotificationRequest request) {

        List<UsuarioResponseDTO> users = recipientResolverService.resolveRecipients(request);

        List<Notification> notifications = users.stream()
                .map(user -> Notification.builder()
                        .user(user.getId())  // ← Cambio: user.getId() en lugar de userId
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .type(NotificationType.valueOf(request.getType()))
                        .read(false)
                        .build())
                .toList();

        notificationRepository.saveAll(notifications);
    }



}
