package com.travelmates.backend.service;

import com.travelmates.backend.dto.DestinationDTO;
import com.travelmates.backend.entity.Destination;
import com.travelmates.backend.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public DestinationDTO addDestination(DestinationDTO destinationDTO) {
        Destination destination = new Destination();
        destination.setDestination_name(destinationDTO.getDestination_name());
        destination.setDescription(destinationDTO.getDescription());
        destination.setPrice(destinationDTO.getPrice());
        destination.setImgPath(destinationDTO.getImgPath());
        destination.setCountry(destinationDTO.getCountryCapitalized()); // Use the getter or field
        destination.setStartDate(destinationDTO.getStartDate());
        destination.setEndDate(destinationDTO.getEndDate());
        destination.setRoute(destinationDTO.getRoute());
        destination.setExposure(destinationDTO.getExposure());

        if (destinationDTO.getVariants() != null) {
            List<com.travelmates.backend.entity.TripVariant> variants = destinationDTO.getVariants().stream()
                    .map(vDto -> {
                        com.travelmates.backend.entity.TripVariant variant = new com.travelmates.backend.entity.TripVariant();
                        variant.setSourceCity(vDto.getSourceCity());
                        variant.setTravelMode(vDto.getTravelMode());
                        variant.setRouteDescription(vDto.getRouteDescription());
                        variant.setPrice(vDto.getPrice());
                        variant.setDuration(vDto.getDuration());
                        variant.setDestination(destination);
                        return variant;
                    }).collect(Collectors.toList());
            destination.setVariants(variants);
        }

        Destination saved = destinationRepository.save(destination);
        return convertToDTO(saved);
    }

    public DestinationDTO updateDestination(Long id, DestinationDTO destinationDTO) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destination.setDestination_name(destinationDTO.getDestination_name());
        destination.setDescription(destinationDTO.getDescription());
        destination.setPrice(destinationDTO.getPrice());
        destination.setImgPath(destinationDTO.getImgPath());
        destination.setCountry(destinationDTO.getCountryCapitalized());
        destination.setStartDate(destinationDTO.getStartDate());
        destination.setEndDate(destinationDTO.getEndDate());
        destination.setRoute(destinationDTO.getRoute());
        if (destinationDTO.getVariants() != null) {
            destination.getVariants().clear();
            List<com.travelmates.backend.entity.TripVariant> newVariants = destinationDTO.getVariants().stream()
                    .map(vDto -> {
                        com.travelmates.backend.entity.TripVariant variant = new com.travelmates.backend.entity.TripVariant();
                        variant.setSourceCity(vDto.getSourceCity());
                        variant.setTravelMode(vDto.getTravelMode());
                        variant.setRouteDescription(vDto.getRouteDescription());
                        variant.setPrice(vDto.getPrice());
                        variant.setDuration(vDto.getDuration());
                        variant.setDestination(destination);
                        return variant;
                    }).collect(Collectors.toList());
            destination.getVariants().addAll(newVariants);
        }

        Destination saved = destinationRepository.save(destination);
        return convertToDTO(saved);
    }

    public void deleteDestination(Long id) {
        destinationRepository.deleteById(id);
    }

    private DestinationDTO convertToDTO(Destination destination) {
        DestinationDTO dto = new DestinationDTO();
        dto.setDest_id(destination.getDest_id());
        dto.setDestination_name(destination.getDestination_name());
        dto.setDescription(destination.getDescription());
        dto.setPrice(destination.getPrice());
        dto.setImgPath(destination.getImgPath());
        dto.setCountry(destination.getCountry());
        dto.setStartDate(destination.getStartDate());
        dto.setEndDate(destination.getEndDate());
        dto.setRoute(destination.getRoute());
        dto.setExposure(destination.getExposure());
        if (destination.getVariants() != null) {
            dto.setVariants(destination.getVariants().stream().map(v -> {
                com.travelmates.backend.dto.TripVariantDTO vDto = new com.travelmates.backend.dto.TripVariantDTO();
                vDto.setId(v.getId());
                vDto.setSourceCity(v.getSourceCity());
                vDto.setTravelMode(v.getTravelMode());
                vDto.setRouteDescription(v.getRouteDescription());
                vDto.setPrice(v.getPrice());
                vDto.setDuration(v.getDuration());
                return vDto;
            }).collect(java.util.stream.Collectors.toList()));
        }
        return dto;
    }
}
