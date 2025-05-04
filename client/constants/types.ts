export interface AirportAttributes {
  iata: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  Relax: boolean;
  Adventure: boolean;
  Cold: boolean;
  Hot: boolean;
  Beach: boolean;
  Mountain: boolean;
  'Modern City': boolean;
  Historic: boolean;
  Nightlife: boolean;
  'Quiet evenings': boolean;
  'Good food': boolean;
}

export interface Member {
  name: string;
  originAirport: string;
  budget: number;
  Relax: boolean;
  Adventure: boolean;
  Cold: boolean;
  Hot: boolean;
  Beach: boolean;
  Mountain: boolean;
  'Modern City': boolean;
  Historic: boolean;
  Nightlife: boolean;
  'Quiet evenings': boolean;
  'Good food': boolean;
  [key: string]: string | number | boolean;
}

export interface GroupInput {
  code: string;
  departureDate: string;
  returnDate: string;
  members: Member[];
}

export interface GroupDestination {
  destination: string;
  totalGroupCost: number;
  matchScore: number;
  costScore: number;
  finalScore: number;
  memberFlights: {
    [memberName: string]: {
      origin: string;
      outboundFlight: {
        airline: string;
        price: number;
        isDirect: boolean;
      };
      returnFlight: {
        airline: string;
        price: number;
        isDirect: boolean;
      };
    };
  };
  matchDetails: {
    [attribute: string]: {
      score: number;
      matches: string[];
      mismatches: string[];
    };
  };
}

export interface AirportInfo {
  iata: string;
  name: string;
  country: string;
  Relax: boolean;
  Adventure: boolean;
  Cold: boolean;
  Hot: boolean;
  Beach: boolean;
  Mountain: boolean;
  'Modern City': boolean;
  Historic: boolean;
  Nightlife: boolean;
  'Quiet evenings': boolean;
  'Good food': boolean;
  [key: string]: string | boolean;
}
