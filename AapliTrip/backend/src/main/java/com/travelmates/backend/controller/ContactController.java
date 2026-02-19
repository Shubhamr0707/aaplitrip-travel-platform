package com.travelmates.backend.controller;

import com.travelmates.backend.dto.ContactDTO;
import com.travelmates.backend.dto.ContactResponseDTO;
import com.travelmates.backend.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submitContact(@RequestBody ContactDTO contactDTO) {
        String message = contactService.submitContact(contactDTO);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/admin/contacts")
    public ResponseEntity<List<ContactResponseDTO>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @PutMapping("/admin/contacts/{contactId}/{status}")
    public ResponseEntity<Map<String, String>> updateContactStatus(
            @PathVariable Long contactId,
            @PathVariable String status) {
        String message = contactService.updateContactStatus(contactId, status);
        return ResponseEntity.ok(Map.of("message", message));
    }
}

