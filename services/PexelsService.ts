interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    tiny: string;
  };
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page: string;
}

const PEXELS_API_KEY = 'W1jpCAgbuhNOpVfiqOoJnqr2MJppKKrXZgWIsbWb0hhQ0AvfUPxip2P5';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export const searchCityPhotos = async (cityName: string): Promise<string | null> => {
  try {
    const response = await fetch(`${PEXELS_API_URL}/search?query=${cityName} city landmarks&per_page=1&orientation=landscape`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      console.error('Pexels API error:', response.statusText);
      return null;
    }

    const data: PexelsSearchResponse = await response.json();
    
    if (data.photos.length === 0) {
      console.warn('No photos found for', cityName);
      return null;
    }

    return data.photos[0].src.large;
  } catch (error) {
    console.error('Error fetching city photo:', error);
    return null;
  }
};
