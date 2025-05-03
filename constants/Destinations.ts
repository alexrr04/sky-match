interface Destination {
  city: string;
  country: string;
  description: string;
  characteristics: string[];
  imageUrl: string;
  flight: {
    airline: string;
    duration: string;
    price: string;
  };
}

export const destinations: Record<string, Destination> = {
  adventureHotModern: {
    city: 'Dubai',
    country: 'United Arab Emirates',
    description: 'A modern oasis where luxury meets adventure. Experience the thrill of desert safaris and world-class shopping.',
    characteristics: ['Hot climate', 'Modern architecture', 'Adventure activities', 'Luxury dining'],
    imageUrl: 'https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg',
    flight: {
      airline: 'Emirates',
      duration: '6h 45m',
      price: '€750'
    }
  },
  relaxBeachCulinary: {
    city: 'Santorini',
    country: 'Greece',
    description: 'A paradise of white-washed buildings, crystal-clear waters, and legendary sunsets. Enjoy world-class Mediterranean cuisine.',
    characteristics: ['Warm weather', 'Beach paradise', 'Gourmet dining', 'Cultural experiences'],
    imageUrl: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg',
    flight: {
      airline: 'Aegean Airlines',
      duration: '4h 15m',
      price: '€450'
    }
  },
  historicColdCulture: {
    city: 'Kyoto',
    country: 'Japan',
    description: 'Ancient temples meet modern Japanese culture. Experience centuries of tradition through architecture and cuisine.',
    characteristics: ['Moderate climate', 'Historic sites', 'Traditional cuisine', 'Cultural immersion'],
    imageUrl: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg',
    flight: {
      airline: 'Japan Airlines',
      duration: '12h 30m',
      price: '€890'
    }
  },
  partyBeachModern: {
    city: 'Miami',
    country: 'United States',
    description: 'Vibrant nightlife meets beautiful beaches. Experience the perfect blend of relaxation and excitement.',
    characteristics: ['Warm weather', 'Beach lifestyle', 'Nightlife', 'Modern city'],
    imageUrl: 'https://images.pexels.com/photos/421655/pexels-photo-421655.jpeg',
    flight: {
      airline: 'American Airlines',
      duration: '9h 20m',
      price: '€680'
    }
  },
  mountainColdRelax: {
    city: 'Zermatt',
    country: 'Switzerland',
    description: 'A picturesque Alpine paradise perfect for winter sports and relaxation with views of the Matterhorn.',
    characteristics: ['Cold climate', 'Mountain views', 'Luxury resorts', 'Winter sports'],
    imageUrl: 'https://images.pexels.com/photos/414459/pexels-photo-414459.jpeg',
    flight: {
      airline: 'Swiss Air',
      duration: '2h 10m',
      price: '€320'
    }
  }
};

export const getDestination = (preferences: {
  weather: 'hot' | 'cold';
  setting: 'mountain' | 'beach';
  activity: 'adventure' | 'relax';
  environment: 'modern' | 'historic';
  food: 'yes' | 'no';
  lifestyle: 'party' | 'sleep';
}): Destination => {
  const { weather, setting, activity, environment, food, lifestyle } = preferences;

  if (activity === 'adventure' && weather === 'hot' && environment === 'modern') {
    return destinations.adventureHotModern;
  }
  
  if (setting === 'beach' && food === 'yes' && activity === 'relax') {
    return destinations.relaxBeachCulinary;
  }
  
  if (environment === 'historic' && weather === 'cold' && food === 'yes') {
    return destinations.historicColdCulture;
  }
  
  if (lifestyle === 'party' && setting === 'beach' && environment === 'modern') {
    return destinations.partyBeachModern;
  }
  
  if (setting === 'mountain' && weather === 'cold' && activity === 'relax') {
    return destinations.mountainColdRelax;
  }

  // Default to Santorini if no perfect match
  return destinations.relaxBeachCulinary;
};
