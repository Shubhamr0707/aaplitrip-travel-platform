package com.travelmates.backend.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String ConfirmPassword; // Frontend sends this
}
