import { SKYSCANNER_API_KEY, SKYSCANNER_API_URL } from './config';

interface FlightOption {
  destination: string;
  price: number;
  outboundFlight: {
    airline: string;
    isDirect: boolean;
  };
  returnFlight?: {
    airline: string;
    isDirect: boolean;
  };
}

interface FlightSearchRequest {
  query: {
    market: string;
    locale: string;
    currency: string;
    queryLegs: {
      originPlace: {
        queryPlace: {
          iata: string;
        };
      };
      destinationPlace: {
        anywhere: boolean;
      };
      fixedDate: {
        year: number;
        month: number;
        day: number;
      };
    }[];
  };
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

async function findDestinationsWithinBudget(
  origin: string,
  departureDate: string,
  returnDate: string,
  maxBudget: number
): Promise<FlightOption[]> {
  try {
    const searchRequest: FlightSearchRequest = {
      query: {
        market: 'ES',
        locale: 'en-GB',
        currency: 'EUR',
        queryLegs: [
          {
            originPlace: {
              queryPlace: {
                iata: origin
              }
            },
            destinationPlace: {
              anywhere: true
            },
            fixedDate: parseDate(departureDate)
          }
        ]
      }
    };

    const headers = new Headers();
    headers.append('x-api-key', SKYSCANNER_API_KEY);
    headers.append('Content-Type', 'application/json');

    const response = await fetch(SKYSCANNER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(searchRequest)
    });

    const data = await response.json();
    if (!data?.content?.results) {
      return [];
    }

    const { quotes, carriers, places } = data.content.results;
    const flightOptions: FlightOption[] = [];

    for (const quote of Object.values(quotes as Record<string, any>)) {
      const destination = places[quote.outboundLeg.destinationPlaceId];
      const airline = carriers[quote.outboundLeg.marketingCarrierId];
      const price = parseInt(quote.minPrice.amount);

      flightOptions.push({
        destination: `${destination.name} (${destination.iata})`,
        price: price,
        outboundFlight: {
          airline: airline.name,
          isDirect: quote.isDirect
        }
      });
    }

    return flightOptions.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

// Example usage
async function main() {
  const result = await findDestinationsWithinBudget(
    'BCN',
    '2025-07-15',
    '2025-07-22',
    500
  );

  result.forEach(option => {
    console.log(`${option.destination}: €${option.price}`);
    console.log(`  ${option.outboundFlight.airline}${option.outboundFlight.isDirect ? ' (direct)' : ' (with stops)'}`);
    console.log('-----------------------------------');
  });
}

// Run main function if this is the entry point
if (process.argv[1] === import.meta.url) {
  main().catch(console.error);
}

export { findDestinationsWithinBudget };
