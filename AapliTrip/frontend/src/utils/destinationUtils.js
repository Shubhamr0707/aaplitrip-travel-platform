/**
 * High-level utility functions for destination operations
 */

/**
 * Search destinations by name, country, or description
 */
export const searchDestinations = (destinations, searchQuery) => {
  if (!destinations || !Array.isArray(destinations)) {
    return [];
  }
  
  if (!searchQuery || searchQuery.trim() === '') {
    return destinations;
  }

  try {
    const query = searchQuery.toLowerCase().trim();
    
    return destinations.filter(dest => {
      if (!dest) return false;
      const name = (dest.destination_name || '').toLowerCase();
      const country = (dest.Country || '').toLowerCase();
      const description = (dest.description || '').toLowerCase();
      
      return name.includes(query) || 
             country.includes(query) || 
             description.includes(query);
    });
  } catch (error) {
    return destinations;
  }
};

/**
 * Filter destinations by multiple criteria
 */
export const filterDestinations = (destinations, filters) => {
  if (!destinations || !Array.isArray(destinations)) {
    return [];
  }
  
  if (!filters) {
    return destinations;
  }

  try {
    let filtered = [...destinations];

    // Filter by country
    if (filters.country && filters.country !== 'all') {
      filtered = filtered.filter(dest => 
        dest && (dest.Country || '').toLowerCase() === filters.country.toLowerCase()
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      filtered = filtered.filter(dest => {
        if (!dest) return false;
        const price = parseFloat(dest.Price) || 0;
        return price >= parseFloat(filters.minPrice);
      });
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      filtered = filtered.filter(dest => {
        if (!dest) return false;
        const price = parseFloat(dest.Price) || 0;
        return price <= parseFloat(filters.maxPrice);
      });
    }

    // Filter by duration
    if (filters.duration && filters.duration !== 'all') {
      filtered = filtered.filter(dest => {
        if (!dest) return false;
        const days = extractDays(dest.exposure || '');
        switch (filters.duration) {
          case 'short':
            return days <= 3;
          case 'medium':
            return days > 3 && days <= 6;
          case 'long':
            return days > 6;
          default:
            return true;
        }
      });
    }

    // Filter by date availability
    if (filters.startDate) {
      filtered = filtered.filter(dest => {
        if (!dest || !dest.start_date) return false;
        const destStart = new Date(dest.start_date);
        const filterStart = new Date(filters.startDate);
        return destStart >= filterStart;
      });
    }

    return filtered;
  } catch (error) {
    return destinations;
  }
};

/**
 * Sort destinations by various criteria
 */
export const sortDestinations = (destinations, sortBy) => {
  if (!destinations || !Array.isArray(destinations)) {
    return [];
  }
  
  try {
    const sorted = [...destinations];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0;
          const priceA = parseFloat(a.Price) || 0;
          const priceB = parseFloat(b.Price) || 0;
          return priceA - priceB;
        });

      case 'price-high':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0;
          const priceA = parseFloat(a.Price) || 0;
          const priceB = parseFloat(b.Price) || 0;
          return priceB - priceA;
        });

      case 'name-asc':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0;
          return (a.destination_name || '').localeCompare(b.destination_name || '');
        });

      case 'name-desc':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0;
          return (b.destination_name || '').localeCompare(a.destination_name || '');
        });

      case 'duration-short':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0;
          const daysA = extractDays(a.exposure || '');
          const daysB = extractDays(b.exposure || '');
          return daysA - daysB;
        });

      case 'duration-long':
        return sorted.sort((a, b) => {
          if (!a || !b) return 0;
          const daysA = extractDays(a.exposure || '');
          const daysB = extractDays(b.exposure || '');
          return daysB - daysA;
        });

      case 'popularity':
        // Sort by number of variants (more variants = more popular)
        return sorted.sort((a, b) => {
          if (!a || !b) return 0;
          const variantsA = (a.variants || []).length;
          const variantsB = (b.variants || []).length;
          return variantsB - variantsA;
        });

      default:
        return sorted;
    }
  } catch (error) {
    return destinations;
  }
};

/**
 * Extract number of days from duration string
 */
const extractDays = (exposure) => {
  const match = exposure.match(/(\d+)\s*Days?/i);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Calculate total price with variants
 */
export const calculateTotalPrice = (destination, variant, numberOfPersons = 1) => {
  if (variant && variant.price) {
    return parseFloat(variant.price) * numberOfPersons;
  }
  const basePrice = parseFloat(destination.Price) || 0;
  return basePrice * numberOfPersons;
};

/**
 * Get best price variant for a destination
 */
export const getBestPriceVariant = (destination, sourceCity) => {
  if (!destination.variants || destination.variants.length === 0) {
    return null;
  }

  const relevantVariants = destination.variants.filter(v => 
    v.source_city === sourceCity
  );

  if (relevantVariants.length === 0) {
    return destination.variants[0]; // Return first variant if no match
  }

  return relevantVariants.reduce((best, current) => {
    const bestPrice = parseFloat(best.price) || Infinity;
    const currentPrice = parseFloat(current.price) || Infinity;
    return currentPrice < bestPrice ? current : best;
  });
};

/**
 * Compare prices across variants
 */
export const compareVariants = (destination, sourceCity) => {
  if (!destination.variants || destination.variants.length === 0) {
    return { flight: null, train: null, best: null };
  }

  const variants = destination.variants.filter(v => v.source_city === sourceCity);
  
  const flight = variants.find(v => v.travel_mode === 'Flight');
  const train = variants.find(v => v.travel_mode === 'Train');

  let best = null;
  if (flight && train) {
    best = parseFloat(flight.price) < parseFloat(train.price) ? flight : train;
  } else {
    best = flight || train || variants[0];
  }

  return { flight, train, best };
};

/**
 * Validate booking dates
 */
export const validateBookingDates = (startDate, endDate, destination) => {
  const errors = [];

  if (!startDate || !endDate) {
    errors.push('Please select both start and end dates');
    return errors;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if start date is in the past
  if (start < today) {
    errors.push('Start date cannot be in the past');
  }

  // Check if end date is before start date
  if (end < start) {
    errors.push('End date must be after start date');
  }

  // Check if dates are within destination availability
  if (destination.start_date && destination.end_date) {
    const destStart = new Date(destination.start_date);
    const destEnd = new Date(destination.end_date);

    if (start < destStart || end > destEnd) {
      errors.push(`Dates must be between ${destination.start_date} and ${destination.end_date}`);
    }
  }

  // Check minimum duration (at least 1 day)
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 1) {
    errors.push('Trip must be at least 1 day');
  }

  return errors;
};

/**
 * Get unique countries from destinations
 */
export const getUniqueCountries = (destinations) => {
  if (!destinations || !Array.isArray(destinations)) {
    return [];
  }
  
  try {
    const countries = destinations
      .map(dest => dest?.Country)
      .filter(country => country && country.trim() !== '');
    
    return [...new Set(countries)].sort();
  } catch (error) {
    return [];
  }
};

/**
 * Get price range from destinations
 */
export const getPriceRange = (destinations) => {
  if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
    return { min: 0, max: 0 };
  }

  try {
    const prices = destinations
      .map(dest => parseFloat(dest?.Price) || 0)
      .filter(price => price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  } catch (error) {
    return { min: 0, max: 0 };
  }
};

/**
 * Format price with currency
 */
export const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0;
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Calculate days between dates
 */
export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get recommendations based on user preferences
 */
export const getRecommendations = (destinations, userPreferences = {}) => {
  let recommendations = [...destinations];

  // Filter by preferred country
  if (userPreferences.preferredCountry) {
    recommendations = recommendations.filter(dest => 
      dest.Country === userPreferences.preferredCountry
    );
  }

  // Filter by budget
  if (userPreferences.maxBudget) {
    recommendations = recommendations.filter(dest => {
      const price = parseFloat(dest.Price) || 0;
      return price <= userPreferences.maxBudget;
    });
  }

  // Sort by relevance (preferred duration, then price)
  if (userPreferences.preferredDuration) {
    recommendations.sort((a, b) => {
      const daysA = extractDays(a.exposure || '');
      const daysB = extractDays(b.exposure || '');
      const preferredDays = extractDays(userPreferences.preferredDuration);
      
      const diffA = Math.abs(daysA - preferredDays);
      const diffB = Math.abs(daysB - preferredDays);
      
      if (diffA !== diffB) {
        return diffA - diffB;
      }
      
      // If duration difference is same, sort by price
      const priceA = parseFloat(a.Price) || 0;
      const priceB = parseFloat(b.Price) || 0;
      return priceA - priceB;
    });
  }

  return recommendations.slice(0, 6); // Return top 6 recommendations
};

/**
 * Parse route string into structured itinerary
 */
export const parseItinerary = (routeString) => {
  if (!routeString) return [];
  
  // Split by "->" or "Day X:" pattern
  const items = routeString.split(/->|Day \d+:/i).filter(item => item.trim() !== '');
  
  return items.map((item, index) => {
    const trimmed = item.trim();
    // Extract day number if present
    const dayMatch = trimmed.match(/^Day (\d+):?\s*(.+)$/i);
    if (dayMatch) {
      return {
        day: parseInt(dayMatch[1]),
        activity: dayMatch[2].trim()
      };
    }
    return {
      day: index + 1,
      activity: trimmed
    };
  });
};

/**
 * Format itinerary for display
 */
export const formatItinerary = (routeString) => {
  const itinerary = parseItinerary(routeString);
  return itinerary.map(item => `Day ${item.day}: ${item.activity}`).join('\n');
};

/**
 * Extract highlights from description
 */
export const extractHighlights = (description) => {
  if (!description) return [];
  
  // Look for common highlight patterns
  const highlightPatterns = [
    /(?:visit|explore|see|experience|enjoy|discover)\s+([^.!?]+)/gi,
    /(?:featuring|including|with)\s+([^.!?]+)/gi
  ];
  
  const highlights = [];
  highlightPatterns.forEach(pattern => {
    const matches = description.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 10 && match[1].length < 100) {
        highlights.push(match[1].trim());
      }
    }
  });
  
  // If no patterns found, extract first few sentences
  if (highlights.length === 0) {
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).map(s => s.trim());
  }
  
  return highlights.slice(0, 5);
};

/**
 * Check if destination is domestic (India) or international
 */
export const isDomesticDestination = (destination) => {
  if (!destination || !destination.Country) return true; // Default to domestic
  const country = destination.Country.toLowerCase().trim();
  return country === 'india' || country === 'indian';
};

/**
 * Get available travel modes for a destination
 */
export const getAvailableTravelModes = (destination) => {
  if (!destination) return ['Flight'];
  
  const isDomestic = isDomesticDestination(destination);
  
  if (isDomestic) {
    // Domestic: Both Flight and Train available
    return ['Flight', 'Train'];
  } else {
    // International: Only Flight available
    return ['Flight'];
  }
};

/**
 * Fill empty fields with meaningful defaults
 */
export const fillEmptyFields = (destination) => {
  if (!destination) return null;
  
  try {
    const isDomestic = isDomesticDestination(destination);
  const country = destination.Country || (isDomestic ? 'India' : 'International');
  const destinationName = destination.destination_name || 'Amazing Destination';
  
  // Generate default description if empty
  const defaultDescription = destination.description || 
    `Experience the beauty and culture of ${destinationName}, ${country}. This carefully curated trip offers you a perfect blend of adventure, relaxation, and cultural immersion. Explore stunning landscapes, visit iconic landmarks, and create unforgettable memories with our full-service travel package.`;

  // Generate default route/itinerary if empty
  const defaultRoute = destination.route || 
    `Day 1: Arrival and welcome at ${destinationName}. Check-in to hotel and orientation session. Evening leisure time to explore local area.
Day 2: Full day sightseeing tour covering major attractions and landmarks. Guided tour with professional local guide.
Day 3: Continue exploration of ${destinationName}. Visit cultural sites, markets, and enjoy local cuisine experiences.
Day 4: Optional activities and free time for personal exploration. Evening cultural program or entertainment.
Day 5: Final day of exploration. Last minute shopping and sightseeing. Farewell dinner and departure preparation.`;

  // Generate default exposure/duration if empty
  const defaultExposure = destination.exposure || 
    (destination.start_date && destination.end_date 
      ? calculateDuration(destination.start_date, destination.end_date)
      : '5 Days / 4 Nights');

  // Generate default price if empty
  const defaultPrice = destination.Price || 
    (destination.variants && destination.variants.length > 0
      ? Math.min(...destination.variants.map(v => v.price || 0)).toString()
      : '0');

  return {
    ...destination,
    destination_name: destinationName,
    description: defaultDescription,
    route: defaultRoute,
    exposure: defaultExposure,
    Price: defaultPrice,
    Country: country,
    Imgpath: destination.Imgpath || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
    start_date: destination.start_date || getDefaultStartDate(),
    end_date: destination.end_date || getDefaultEndDate(destination.start_date || getDefaultStartDate())
  };
  } catch (error) {
    return destination;
  }
};

/**
 * Calculate duration from start and end dates
 */
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '5 Days / 4 Nights';
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays - 1;
    return `${diffDays} Days / ${nights} Nights`;
  } catch (e) {
    return '5 Days / 4 Nights';
  }
};

/**
 * Get default start date (30 days from now)
 */
const getDefaultStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

/**
 * Get default end date (5 days after start date)
 */
const getDefaultEndDate = (startDate) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 5);
  return date.toISOString().split('T')[0];
};

/**
 * Get trip summary information with filled empty fields
 */
export const getTripSummary = (destination) => {
  // Fill empty fields first
  const filledDestination = fillEmptyFields(destination) || destination;
  
  const days = extractDays(filledDestination.exposure || '');
  const itinerary = parseItinerary(filledDestination.route || '');
  const highlights = extractHighlights(filledDestination.description || '');
  
  // Generate default highlights if none found
  const defaultHighlights = highlights.length === 0 ? [
    'Iconic Landmarks & Monuments',
    'Cultural Experiences',
    'Local Cuisine & Dining',
    'Scenic Views & Photography',
    'Guided Tours & Activities'
  ] : highlights;
  
  return {
    duration: filledDestination.exposure || '5 Days / 4 Nights',
    days: days || 5,
    itinerary: itinerary.length > 0 ? itinerary : generateDefaultItinerary(filledDestination),
    highlights: defaultHighlights,
    startDate: formatDate(filledDestination.start_date),
    endDate: formatDate(filledDestination.end_date),
    isDomestic: isDomesticDestination(filledDestination),
    description: filledDestination.description,
    country: filledDestination.Country || 'India',
    price: filledDestination.Price || '0'
  };
};

/**
 * Generate default itinerary if route is empty
 */
const generateDefaultItinerary = (destination) => {
  const days = extractDays(destination.exposure || '5 Days / 4 Nights') || 5;
  const destinationName = destination.destination_name || 'the destination';
  const country = destination.Country || 'India';
  
  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    let activity = '';
    if (i === 1) {
      activity = `Arrival at ${destinationName}, ${country}. Welcome and hotel check-in. Orientation session and briefing about the trip. Evening free for rest and local exploration.`;
    } else if (i === days) {
      activity = `Final day of exploration. Last minute sightseeing and shopping. Farewell dinner and departure preparation. Check-out and departure.`;
    } else {
      activity = `Full day exploration of ${destinationName}. Visit major attractions, cultural sites, and enjoy local experiences. Guided tours and activities included.`;
    }
    itinerary.push({ day: i, activity });
  }
  return itinerary;
};

/**
 * Reconstruct trip details by merging destination with variant information
 * This ensures all trip details are properly constructed with variant-specific data
 */
export const reconstructTripDetails = (destination, joiningPoint = null, travelMode = null) => {
  if (!destination) return null;

  // Fill empty fields first
  const filledDestination = fillEmptyFields(destination) || destination;

  // If variant information is provided, merge it
  if (joiningPoint && travelMode && filledDestination.variants) {
    const variant = filledDestination.variants.find(
      v => v.source_city === joiningPoint && v.travel_mode === travelMode
    );

    if (variant) {
      // Merge variant-specific information with destination
      return {
        ...filledDestination,
        // Override with variant-specific data
        Price: variant.price ? variant.price.toString() : filledDestination.Price,
        route: variant.route_description || filledDestination.route || '',
        exposure: variant.duration || filledDestination.exposure || '5 Days / 4 Nights',
        // Keep variant reference for later use
        selectedVariant: {
          source_city: variant.source_city,
          travel_mode: variant.travel_mode,
          price: variant.price,
          route_description: variant.route_description,
          duration: variant.duration
        }
      };
    }
  }

  // Return filled destination if no variant match or no variant info provided
  return filledDestination;
};

