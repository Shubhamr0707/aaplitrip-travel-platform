package com.travelmates.backend.service;

import com.travelmates.backend.dto.ContactDTO;
import com.travelmates.backend.dto.ContactResponseDTO;
import com.travelmates.backend.entity.Contact;
import com.travelmates.backend.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public String submitContact(ContactDTO contactDTO) {
        Contact contact = new Contact();
        contact.setName(contactDTO.getName());
        contact.setEmail(contactDTO.getEmail());
        contact.setIssueType(contactDTO.getIssueType());
        contact.setMessage(contactDTO.getMessage());
        contact.setStatus(Contact.Status.PENDING);
        
        contactRepository.save(contact);
        return "Contact form submitted successfully. We'll get back to you within 24 hours.";
    }

    public List<ContactResponseDTO> getAllContacts() {
        return contactRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public String updateContactStatus(Long contactId, String status) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        try {
            contact.setStatus(Contact.Status.valueOf(status.toUpperCase()));
            contactRepository.save(contact);
            return "Contact status updated successfully";
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    private ContactResponseDTO convertToDTO(Contact contact) {
        ContactResponseDTO dto = new ContactResponseDTO();
        dto.setId(contact.getId());
        dto.setName(contact.getName());
        dto.setEmail(contact.getEmail());
        dto.setIssueType(contact.getIssueType());
        dto.setMessage(contact.getMessage());
        dto.setStatus(contact.getStatus().toString());
        dto.setCreatedAt(contact.getCreatedAt());
        return dto;
    }
}

