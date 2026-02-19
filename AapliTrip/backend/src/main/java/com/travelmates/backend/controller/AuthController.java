package com.travelmates.backend.controller;

import com.travelmates.backend.dto.AuthResponse;
import com.travelmates.backend.dto.LoginDTO;
import com.travelmates.backend.dto.UserDTO;
import com.travelmates.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/UserRegistration")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        String response = userService.registerUser(userDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginDTO loginDTO) {
        AuthResponse response = userService.loginUser(loginDTO);
        return ResponseEntity.ok(response);
    }
}
