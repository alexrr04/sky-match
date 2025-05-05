const AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const API_URL = 'https://test.api.amadeus.com/v1/shopping/flight-destinations';

const FLIGHT_SERVICE_API_KEY = 'fBV6ux7cVhsGIc1KfAcATTx2vVkDMnvI';
const FLIGHT_SERVICE_API_SECRET = '7M7bJP7gNuENRG1Z';

interface AmadeusResponse {
  data: {
    type: string;
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    price: {
      total: string;
    };
  }[];
}

interface FlightOption {
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
}

async function getAccessToken(): Promise<string> {
  try {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: FLIGHT_SERVICE_API_KEY,
      client_secret: FLIGHT_SERVICE_API_SECRET,
    });

    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function findDestinationsWithinBudget(
  origin: string,
  departureDate: string,
  returnDate: string,
  maxBudget: number
): Promise<FlightOption[]> {
  try {
    const accessToken = await getAccessToken();

    const url = new URL(API_URL);
    url.searchParams.append('origin', origin);
    url.searchParams.append('maxPrice', maxBudget.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as AmadeusResponse;

    if (!data.data || data.data.length === 0) {
      return [];
    }

    const flightOptions: FlightOption[] = data.data.map((flight) => ({
      destination: flight.destination,
      departureDate: flight.departureDate,
      returnDate: flight.returnDate,
      price: parseFloat(flight.price.total),
    }));

    return flightOptions.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}
