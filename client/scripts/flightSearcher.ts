import { socket } from '../utils/socket';

export interface FlightOption {
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
}

export async function findDestinationsWithinBudget(
  origin: string,
  departureDate: string,
  returnDate: string,
  maxBudget: number
): Promise<FlightOption[]> {
  return new Promise((resolve, reject) => {
    const handleFlightResults = (response: {
      success: boolean;
      data?: FlightOption[];
      error?: string;
      origin: string;
    }) => {
      if (response.origin !== origin) return; // Ignore results for other origins

      // Remove listener to avoid memory leaks
      socket.off('flightSearchResults', handleFlightResults);

      if (response.success) {
        resolve(response.data || []);
      } else {
        console.error('Error searching flights:', response.error);
        reject(new Error(response.error));
      }
    };

    // Set up listener before emitting
    socket.on('flightSearchResults', handleFlightResults);

    // Emit search request
    socket.emit('searchFlights', {
      origin,
      departureDate,
      returnDate,
      maxBudget,
    });

    // Set a timeout to prevent hanging
    setTimeout(() => {
      socket.off('flightSearchResults', handleFlightResults);
      reject(new Error('Flight search timeout'));
    }, 30000);
  });
}
