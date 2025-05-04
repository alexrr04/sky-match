interface MemberPreferences {
  name: string;
  originAirport: string; // IATA code of origin airport
  budget: number;
  Relax: boolean;
  Adventure: boolean;
  Cold: boolean;
  Hot: boolean;
  Beach: boolean;
  Mountain: boolean;
  "Modern City": boolean;
  Historic: boolean;
  Nightlife: boolean;
  "Quiet evenings": boolean;
  "Good food": boolean;
}

interface FriendGroup {
  code: string;
  members: MemberPreferences[];
  departureDate: string;
  returnDate: string;
}

// Example of a group with same origin
const sameOriginGroup: FriendGroup = {
  code: "BCN22",
  departureDate: "2025-07-15",
  returnDate: "2025-07-22",
  members: [
    {
      name: "Maria",
      originAirport: "BCN",
      budget: 100,
      Relax: true,
      Adventure: false,
      Cold: false,
      Hot: true,
      Beach: true,
      Mountain: false,
      "Modern City": false,
      Historic: true,
      Nightlife: false,
      "Quiet evenings": true,
      "Good food": true
    },
    {
      name: "Alex",
      originAirport: "BCN",
      budget: 200,
      Relax: false,
      Adventure: true,
      Cold: true,
      Hot: false,
      Beach: false,
      Mountain: true,
      "Modern City": true,
      Historic: false,
      Nightlife: true,
      "Quiet evenings": false,
      "Good food": false
    }
  ]
};

// Example of a group with different origins
const multiOriginGroup: FriendGroup = {
  code: "EUR33",
  departureDate: "2025-08-01",
  returnDate: "2025-08-15",
  members: [
    {
      name: "Carlos",
      originAirport: "BCN",
      budget: 300,
      Relax: false,
      Adventure: true,
      Cold: false,
      Hot: true,
      Beach: true,
      Mountain: false,
      "Modern City": true,
      Historic: false,
      Nightlife: true,
      "Quiet evenings": false,
      "Good food": true
    },
    {
      name: "Laura",
      originAirport: "MAD",
      budget: 400,
      Relax: true,
      Adventure: false,
      Cold: true,
      Hot: false,
      Beach: false,
      Mountain: true,
      "Modern City": false,
      Historic: true,
      Nightlife: false,
      "Quiet evenings": true,
      "Good food": true
    },
    {
      name: "Pierre",
      originAirport: "CDG",
      budget: 200,
      Relax: true,
      Adventure: true,
      Cold: false,
      Hot: true,
      Beach: true,
      Mountain: true,
      "Modern City": true,
      Historic: true,
      Nightlife: true,
      "Quiet evenings": false,
      "Good food": true
    }
  ]
};

export type { MemberPreferences, FriendGroup };
module.exports = { sameOriginGroup, multiOriginGroup };
