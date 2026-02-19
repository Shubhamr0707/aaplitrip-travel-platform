package com.travelmates.backend.controller;

import com.travelmates.backend.dto.DestinationDTO;
import com.travelmates.backend.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping("/getDestination")
    public ResponseEntity<List<DestinationDTO>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    @PostMapping("/AddDestination")
    public ResponseEntity<DestinationDTO> addDestination(@RequestBody DestinationDTO destinationDTO) {
        return ResponseEntity.ok(destinationService.addDestination(destinationDTO));
    }

    @PutMapping("/UpdateDestination/{id}")
    public ResponseEntity<DestinationDTO> updateDestination(@PathVariable Long id,
            @RequestBody DestinationDTO destinationDTO) {
        return ResponseEntity.ok(destinationService.updateDestination(id, destinationDTO));
    }

    @DeleteMapping("/DeleteDestinationById/{id}")
    public ResponseEntity<String> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok("Destination Deleted Successfully");
    }
}
