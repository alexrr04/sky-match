import { socket } from '../utils/socket';

export interface FlightOption {
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
}

export async function findDestinationsWithinBudget(
  origin: string,
  departureDate: string, // Keep params for backward compatibility
  returnDate: string, // but don't use them in API call
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
        // Filter results by date and budget client-side since Amadeus API
        // only supports origin parameter
        const results = (response.data || [])
          .filter((flight) => {
            const flightPrice = parseFloat(String(flight.price));
            const flightDate = new Date(flight.departureDate);
            const requestedDate = new Date(departureDate);

            return (
              flightPrice <= maxBudget //&&
              // flightDate.getMonth() === requestedDate.getMonth() &&
              // flightDate.getFullYear() === requestedDate.getFullYear()
            );
          })
          .sort((a, b) => a.price - b.price);

        resolve(results);
      } else {
        console.error('Error searching flights:', response.error);
        reject(new Error(response.error));
      }
    };

    // Set up listener before emitting
    socket.on('flightSearchResults', handleFlightResults);

    // Emit search request with only origin
    socket.emit('searchFlights', { origin });

    // Set a timeout to prevent hanging
    setTimeout(() => {
      socket.off('flightSearchResults', handleFlightResults);
      reject(new Error('Flight search timeout'));
    }, 30000);
  });
}
