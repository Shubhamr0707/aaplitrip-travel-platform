package com.travelmates.backend.dto;

import lombok.Data;

@Data
public class ContactDTO {
    private String name;
    private String email;
    private String issueType;
    private String message;
}

