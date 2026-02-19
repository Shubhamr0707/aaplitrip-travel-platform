package com.travelmates.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContactResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String issueType;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}

