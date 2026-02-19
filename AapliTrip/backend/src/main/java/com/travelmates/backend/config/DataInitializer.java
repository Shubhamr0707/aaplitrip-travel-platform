package com.travelmates.backend.config;

import com.travelmates.backend.entity.Booking;
import com.travelmates.backend.entity.Destination;
import com.travelmates.backend.entity.User;
import com.travelmates.backend.repository.BookingRepository;
import com.travelmates.backend.repository.DestinationRepository;
import com.travelmates.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private DestinationRepository destinationRepository;

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                // 1. Create Admin User
                if (!userRepository.existsByEmail("admin@wanderwings.com")) {
                        User admin = new User();
                        admin.setName("Admin User");
                        admin.setEmail("admin@wanderwings.com");
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        admin.setPhone("9999999999");
                        admin.setAddress("WanderWings HQ, Mumbai");
                        admin.setRole(User.Role.ADMIN);
                        userRepository.save(admin);
                        System.out.println("Default Admin User created.");
                }

                // 2. Create Dummy Users
                List<User> users = new ArrayList<>();
                String[] userNames = { "Rahul Sharma", "Priya Patel", "Amit Singh", "Sneha Gupta", "Vikram Malhotra" };

                for (int i = 0; i < userNames.length; i++) {
                        String email = "user" + (i + 1) + "@wanderwings.com";
                        if (!userRepository.existsByEmail(email)) {
                                User user = new User();
                                user.setName(userNames[i]);
                                user.setEmail(email);
                                user.setPassword(passwordEncoder.encode("user123"));
                                user.setPhone("987654321" + i);
                                user.setAddress("Address " + (i + 1) + ", India");
                                user.setRole(User.Role.USER);
                                users.add(userRepository.save(user));
                        } else {
                                users.add(userRepository.findByEmail(email).get());
                        }
                }

                // 3. Create or Update Destinations with Detailed Info
                createOrUpdateDestination("Paris, France",
                                "Experience the city of love with amazing Eiffel Tower views and delicious cuisine.",
                                "1500",
                                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
                                "France",
                                LocalDate.now().plusDays(30), LocalDate.now().plusDays(35),
                                "Day 1: Arrival in Paris -> Day 2: Eiffel Tower & Louvre -> Day 3: Versailles Palace -> Day 4: Seine Cruise -> Day 5: Departure",
                                "5 Days / 4 Nights");

                createOrUpdateDestination("Bali, Indonesia",
                                "Tropical paradise with beautiful beaches, temples, and vibrant culture.",
                                "1200",
                                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop",
                                "Indonesia",
                                LocalDate.now().plusDays(40), LocalDate.now().plusDays(46),
                                "Day 1: Arrival in Denpasar -> Day 2: Ubud Monkey Forest -> Day 3: Tegalalang Rice Terrace -> Day 4: Kuta Beach -> Day 5: Uluwatu Temple -> Day 6: Departure",
                                "6 Days / 5 Nights");

                createOrUpdateDestination("Kyoto, Japan",
                                "Discover ancient temples, traditional tea houses, and stunning cherry blossoms.",
                                "1800",
                                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
                                "Japan",
                                LocalDate.now().plusDays(50), LocalDate.now().plusDays(55),
                                "Day 1: Arrival in Kyoto -> Day 2: Kinkaku-ji (Golden Pavilion) -> Day 3: Arashiyama Bamboo Grove -> Day 4: Fushimi Inari Shrine -> Day 5: Gion District -> Day 6: Departure",
                                "6 Days / 5 Nights");

                createOrUpdateDestination("Taj Mahal, Agra",
                                "One of the seven wonders of the world, a symbol of love.",
                                "5000",
                                "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(10), LocalDate.now().plusDays(12),
                                "Day 1: Delhi to Agra (Drive) -> Visit Mehtab Bagh -> Day 2: Taj Mahal Sunrise -> Agra Fort -> Shopping -> Return to Delhi",
                                "2 Days / 1 Night");

                createOrUpdateDestination("Jaipur, Rajasthan",
                                "The Pink City known for its palaces and forts.",
                                "4500",
                                "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(15), LocalDate.now().plusDays(18),
                                "Day 1: Arrival in Jaipur -> City Palace -> Day 2: Amber Fort -> Hawa Mahal -> Jantar Mantar -> Day 3: Nahargarh Fort -> Departure",
                                "3 Days / 2 Nights");

                createOrUpdateDestination("Goa Beaches",
                                "Sun, sand, and sea. The perfect party destination.",
                                "7000",
                                "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(20), LocalDate.now().plusDays(25),
                                "Day 1: Arrival -> Calangute Beach -> Day 2: Water Sports at Baga -> Day 3: Old Goa Churches -> Day 4: South Goa Beaches -> Day 5: Departure",
                                "5 Days / 4 Nights");

                createOrUpdateDestination("Kerala Backwaters",
                                "Serene backwaters and houseboats in God's Own Country.",
                                "6000",
                                "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(30), LocalDate.now().plusDays(35),
                                "Day 1: Arrival in Kochi -> Munnar -> Day 2: Munnar Sightseeing -> Day 3: Thekkady -> Day 4: Alleppey Houseboat -> Day 5: Departure",
                                "5 Days / 4 Nights");

                createOrUpdateDestination("Varanasi, UP",
                                "The spiritual capital of India on the banks of the Ganges.",
                                "3000",
                                "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2076&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(40), LocalDate.now().plusDays(42),
                                "Day 1: Arrival -> Ganga Aarti at Dashashwamedh Ghat -> Day 2: Morning Boat Ride -> Kashi Vishwanath Temple -> Sarnath -> Departure",
                                "2 Days / 1 Night");

                createOrUpdateDestination("Ladakh",
                                "Breathtaking landscapes and high-altitude mountain passes.",
                                "12000",
                                "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=2070&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(60), LocalDate.now().plusDays(67),
                                "Day 1: Arrival in Leh (Acclimatization) -> Day 2: Leh Local Sightseeing -> Day 3: Nubra Valley via Khardung La -> Day 4: Turtuk -> Day 5: Pangong Lake -> Day 6: Return to Leh -> Day 7: Departure",
                                "7 Days / 6 Nights");

                createOrUpdateDestination("Manali, Himachal",
                                "Snow-capped mountains and adventure sports.",
                                "5500",
                                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(50), LocalDate.now().plusDays(54),
                                "Day 1: Arrival in Manali -> Local Sightseeing -> Day 2: Solang Valley (Adventure Sports) -> Day 3: Rohtang Pass / Atal Tunnel -> Day 4: Manikaran -> Departure",
                                "4 Days / 3 Nights");

                createOrUpdateDestination("Mysore Palace",
                                "Historical city famous for its royal heritage.",
                                "3500",
                                "https://images.unsplash.com/photo-1582555486776-857508493729?q=80&w=2070&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(25), LocalDate.now().plusDays(27),
                                "Day 1: Arrival in Bangalore -> Drive to Mysore -> Mysore Palace -> Brindavan Gardens -> Day 2: Chamundi Hill -> St. Philomena's Church -> Return to Bangalore",
                                "2 Days / 1 Night");

                createOrUpdateDestination("Rishikesh",
                                "Yoga capital of the world and river rafting hub.",
                                "4000",
                                "https://images.unsplash.com/photo-1592639296346-560c37a23694?q=80&w=2070&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(12), LocalDate.now().plusDays(15),
                                "Day 1: Arrival -> Laxman Jhula -> Ganga Aarti -> Day 2: River Rafting -> Bungee Jumping -> Cafe Hopping -> Day 3: Morning Yoga -> Departure",
                                "3 Days / 2 Nights");

                createOrUpdateDestination("Hampi, Karnataka",
                                "Ancient ruins and temples of the Vijayanagara Empire.",
                                "3800",
                                "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=1989&auto=format&fit=crop",
                                "India",
                                LocalDate.now().plusDays(18), LocalDate.now().plusDays(21),
                                "Day 1: Arrival in Hampi -> Virupaksha Temple -> Hemakuta Hill Sunset -> Day 2: Vijaya Vittala Temple -> Royal Enclosure -> Elephant Stables -> Day 3: Coracle Ride -> Departure",
                                "3 Days / 2 Nights");

                System.out.println("Destinations updated with detailed info.");

                // 4. Create Random Bookings (Only if none exist)
                if (bookingRepository.count() < 5) {
                        List<Destination> destinations = destinationRepository.findAll();
                        Random random = new Random();

                        for (User user : users) {
                                int bookingsCount = random.nextInt(2) + 1;
                                for (int k = 0; k < bookingsCount; k++) {
                                        Destination dest = destinations.get(random.nextInt(destinations.size()));
                                        Booking booking = new Booking();
                                        booking.setUser(user);
                                        booking.setDestination(dest);
                                        booking.setSource(dest.getRoute().split(" -> ")[0]
                                                        .replace("Day 1: Arrival in ", "").replace("Day 1: ", ""));
                                        booking.setStartDate(dest.getStartDate());
                                        booking.setEndDate(dest.getEndDate());
                                        booking.setNoOfPersons(random.nextInt(3) + 1);
                                        booking.setMode(random.nextBoolean() ? "Flight" : "Train");
                                        booking.setBudget(
                                                        Double.parseDouble(dest.getPrice()) * booking.getNoOfPersons());
                                        booking.setBookingStatus(random.nextBoolean() ? Booking.BookingStatus.CONFIRMED
                                                        : Booking.BookingStatus.PENDING);

                                        bookingRepository.save(booking);
                                }
                        }
                        System.out.println("Dummy Bookings created.");
                }
        }

        private void createOrUpdateDestination(String name, String desc, String price, String img, String country,
                        LocalDate start, LocalDate end, String route, String exposure) {
                // Check if exists by name
                Destination d = destinationRepository.findAll().stream()
                                .filter(dest -> dest.getDestination_name().equals(name))
                                .findFirst()
                                .orElse(new Destination());

                d.setDestination_name(name);
                d.setDescription(desc);
                d.setPrice(price);
                d.setImgPath(img);
                d.setCountry(country);
                d.setStartDate(start);
                d.setRoute(route);
                d.setExposure(exposure);

                // Generate Variants if empty
                if (d.getVariants().isEmpty()) {
                        String[] cities = { "Mumbai", "Pune", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
                                        "Ahmedabad" };
                        String[] modes = { "Flight", "Train" };
                        double basePrice = Double.parseDouble(price);

                        for (String city : cities) {
                                for (String mode : modes) {
                                        com.travelmates.backend.entity.TripVariant v = new com.travelmates.backend.entity.TripVariant();
                                        v.setSourceCity(city);
                                        v.setTravelMode(mode);
                                        v.setDestination(d);

                                        // Price Calculation
                                        double variantPrice = basePrice;

                                        // Mode adjustment
                                        if (mode.equals("Flight")) {
                                                variantPrice += 4000;
                                        } else {
                                                variantPrice += 500; // Train base cost
                                        }

                                        // Distance/City adjustment (Simple Logic)
                                        boolean isNorth = city.equals("Delhi");
                                        boolean isSouth = city.equals("Bangalore") || city.equals("Chennai")
                                                        || city.equals("Hyderabad");
                                        boolean isWest = city.equals("Mumbai") || city.equals("Pune")
                                                        || city.equals("Ahmedabad");
                                        boolean isEast = city.equals("Kolkata");

                                        boolean destNorth = name.contains("Ladakh") || name.contains("Manali")
                                                        || name.contains("Rishikesh") || name.contains("Varanasi")
                                                        || name.contains("Taj") || name.contains("Jaipur");
                                        boolean destSouth = name.contains("Kerala") || name.contains("Mysore")
                                                        || name.contains("Hampi");
                                        boolean destWest = name.contains("Goa");

                                        // If far, increase price
                                        if ((isSouth && destNorth) || (isNorth && destSouth) || (isEast && destWest)) {
                                                variantPrice += (mode.equals("Flight") ? 3000 : 1000);
                                        } else if ((isNorth && destNorth) || (isSouth && destSouth)
                                                        || (isWest && destWest)) {
                                                variantPrice -= (mode.equals("Flight") ? 1000 : 500); // Cheaper if
                                                                                                      // close
                                        }

                                        v.setPrice(Math.max(2000, variantPrice)); // Ensure min price

                                        // Route & Duration Logic
                                        if (mode.equals("Flight")) {
                                                v.setRouteDescription(
                                                                "Flight: " + city + " Airport -> Nearest Airport to "
                                                                                + name + " -> Hotel Transfer -> " + name
                                                                                + " Tour -> Return Flight");
                                                v.setDuration(exposure); // Standard duration
                                        } else {
                                                v.setRouteDescription("Train: " + city
                                                                + " Junction -> Nearest Railway Station -> Local Transport to "
                                                                + name + " -> " + name + " Tour -> Return Train");
                                                // Parse duration to add days
                                                try {
                                                        String[] parts = exposure.split(" ");
                                                        int days = Integer.parseInt(parts[0]);
                                                        int nights = Integer.parseInt(parts[3]);
                                                        v.setDuration((days + 2) + " Days / " + (nights + 2)
                                                                        + " Nights (Inc. Travel)");
                                                } catch (Exception e) {
                                                        v.setDuration(exposure + " + 2 Days Travel");
                                                }
                                        }

                                        d.getVariants().add(v);
                                }
                        }
                }

                destinationRepository.save(d);
        }
}
