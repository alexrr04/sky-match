import { findDestinationsWithinBudget } from './flightSearcher';
import airportsWithAttributes from '../constants/airports_with_attributes_full.json' with { type: 'json' };
import { Member, GroupInput, GroupDestination, AirportInfo, AirportAttributes } from '@/constants/types';

function calculateDestinationScore(destination: AirportAttributes | AirportInfo, members: Member[]): { 
  score: number; 
  details: { 
    [key: string]: {
      score: number;
      matches: string[];
      mismatches: string[];
    }
  } 
} {
  const attributes = [
    'Relax', 'Adventure', 'Cold', 'Hot', 'Beach', 'Mountain',
    'Modern City', 'Historic', 'Nightlife', 'Quiet evenings', 'Good food'
  ] as const;
  
  const details: { 
    [key: string]: {
      score: number;
      matches: string[];
      mismatches: string[];
    }
  } = {};

  let totalMatchScore = 0;
  let totalAttributesConsidered = 0;

  // Calculate attribute-specific details for display
  attributes.forEach(attr => {
    const matches: string[] = [];
    const mismatches: string[] = [];
    let interestedMembers = 0;
    let matchedMembers = 0;

    members.forEach(member => {
      const memberWantsIt = member[attr] === true;
      const destinationHasIt = destination[attr] === true;

      if (memberWantsIt) {
        interestedMembers++;
        if (destinationHasIt) {
          matches.push(member.name);
          matchedMembers++;
        } else {
          mismatches.push(member.name);
        }
      }
    });

    if (interestedMembers > 0) {
      const attrScore = matchedMembers / members.length; // Calculate score based on total members
      details[attr] = {
        score: attrScore,
        matches,
        mismatches
      };
      // For total score calculation, also use total members
      totalMatchScore += attrScore;
      totalAttributesConsidered++;
    }
  });

  return {
    score: totalAttributesConsidered > 0 ? totalMatchScore / totalAttributesConsidered : 0,
    details
  };
}

function calculateCostScore(totalCost: number, groupSize: number, maxBudget: number): number {
  const avgCost = totalCost / groupSize;
  const avgBudget = maxBudget / groupSize;
  return 0.3 * (1 - (avgCost / avgBudget));
}

// Cache structures
const airportAttributesCache = new Map<string, AirportAttributes>();
const destinationCache = new Map<string, any[]>();

// Initialize airport cache
airportsWithAttributes.forEach((airport: AirportAttributes) => {
  airportAttributesCache.set(airport.iata, airport);
});

// Cache key generator
const getCacheKey = (origin: string, date: string, budget: number) => 
  `${origin}-${date}-${budget}`;

async function findBestMatchingDestinations(group: GroupInput): Promise<GroupDestination[]> {
  console.log('Searching for destinations...');
  try {
    // Create origin groups with budget info
    const originGroups = group.members.reduce((acc, member) => {
      if (!acc.has(member.originAirport)) {
        acc.set(member.originAirport, { members: [], lowestBudget: member.budget });
      }
      const group = acc.get(member.originAirport)!;
      group.members.push(member);
      group.lowestBudget = Math.min(group.lowestBudget, member.budget);
      return acc;
    }, new Map<string, { members: Member[], lowestBudget: number }>());

    // Parallel search with caching and timeouts
    const [originDestinations, maxGroupBudget] = await Promise.all([
      Promise.all(Array.from(originGroups.entries()).map(async ([origin, { lowestBudget }]) => {
        const cacheKey = getCacheKey(origin, group.departureDate, lowestBudget);
        
        if (destinationCache.has(cacheKey)) {
          return [origin, destinationCache.get(cacheKey)] as [string, any[]];
        }

        // Always try to get results, using cached data as fallback
        try {
          const destinations = await findDestinationsWithinBudget(
            origin, 
            group.departureDate, 
            group.returnDate, 
            lowestBudget
          );
          destinationCache.set(cacheKey, destinations);
          return [origin, destinations] as [string, any[]];
        } catch (error) {
          console.warn(`Error searching for ${origin}: ${error}, using cached results if available`);
          // Use cached results or empty array as fallback
          const cachedResults = destinationCache.get(cacheKey) || [];
          return [origin, cachedResults] as [string, any[]];
        }
      })),
      Promise.resolve(group.members.reduce((sum, member) => sum + member.budget, 0))
    ]);

    // Create destination map more efficiently
    const originDestinationsMap = new Map(originDestinations as [string, any[]][]);
    // Pre-calculate destination scores
    const destinationsMap = new Map<string, GroupDestination>();

    // Process destinations more efficiently
    for (const [origin, destinations] of originDestinationsMap) {
      const originMembers = originGroups.get(origin)!.members;

      for (const dest of destinations) {
        const destinationIATA = dest.destination;
        const airportInfo = airportAttributesCache.get(destinationIATA);
        
        if (!airportInfo) {
          console.warn(`Airport info not found for IATA: ${destinationIATA}`);
          continue;
        }

        const destinationKey = `${airportInfo.name} (${destinationIATA})`;

        const totalCost = parseFloat(dest.price);
        if (totalCost > originGroups.get(origin)!.lowestBudget) continue;

        const pricePerFlight = totalCost / 2; // Split total price between outbound and return

        let destinationEntry = destinationsMap.get(destinationKey);
        if (!destinationEntry) {
          const { score, details } = calculateDestinationScore(airportInfo, group.members);
          destinationEntry = {
            destination: destinationKey,
            totalGroupCost: 0,
            matchScore: score,
            costScore: 0,
            finalScore: 0,
            memberFlights: {},
            matchDetails: details
          };
          destinationsMap.set(destinationKey, destinationEntry);
        }

        for (const member of originMembers) {
          destinationEntry.memberFlights[member.name] = {
            origin,
            outboundFlight: {
              airline: 'Multiple Airlines',
              price: pricePerFlight,
              isDirect: false
            },
            returnFlight: {
              airline: 'Multiple Airlines',
              price: pricePerFlight,
              isDirect: false
            }
          };
          destinationEntry.totalGroupCost += totalCost;
        }
      }
    }

    // Calculate scores in a single pass
    for (const dest of destinationsMap.values()) {
      dest.costScore = calculateCostScore(dest.totalGroupCost, group.members.length, maxGroupBudget);
      dest.finalScore = (dest.matchScore * 0.7) + (dest.costScore * 0.3);
    }

    return Array.from(destinationsMap.values())
      .filter(dest => Object.keys(dest.memberFlights).length === group.members.length)
      .sort((a, b) => b.finalScore - a.finalScore);
  } catch (error) {
    console.error('Error finding matching destinations:', error);
    return [];
  }
}

async function displayMatchingDestinations(group: GroupInput): Promise<void> {
  console.log(`\nFinding matching destinations for group ${group.code}...`);
  console.log(`Travel dates: ${group.departureDate} - ${group.returnDate}`);
  console.log('\nGroup preferences:');
  group.members.forEach(member => {
    console.log(`\n${member.name} (from ${member.originAirport}, budget: €${member.budget}):`);
    Object.entries(member)
      .filter(([key, value]) => typeof value === 'boolean' && value)
      .forEach(([pref]) => console.log(`  - ${pref}`));
  });
  console.log('\n');

  const destinations = await findBestMatchingDestinations(group);

  if (destinations.length === 0) {
    console.log('No destinations found that match all member requirements.');
    return;
  }

  destinations.forEach((dest, index) => {
    const iata = dest.destination.split(' (')[1].replace(')', '');
    const airportInfo = airportsWithAttributes.find((a: AirportAttributes) => a.iata === iata);
    if (!airportInfo) return;

    console.log(`${index + 1}. ${dest.destination} (${airportInfo.country})`);
    console.log(`Overall score: ${(dest.finalScore * 100).toFixed(1)}%`);
    console.log(`Preference match: ${(dest.matchScore * 100).toFixed(1)}%`);
    console.log(`Cost efficiency: ${(dest.costScore * 100).toFixed(1)}%`);
    console.log(`Total group cost: €${dest.totalGroupCost}`);
    
    console.log('\nMatching attributes:');
    Object.entries(dest.matchDetails)
      .sort((a, b) => b[1].score - a[1].score)
      .forEach(([attr, detail]) => {
        if (detail.matches.length > 0) {
          console.log(`  - ${attr} (${(detail.score * 100).toFixed(0)}%):`);
          console.log(`    Matches: ${detail.matches.join(', ')}`);
          if (detail.mismatches.length > 0) {
            console.log(`    Mismatches: ${detail.mismatches.join(', ')}`);
          }
        }
      });

    console.log('\nFlight details per member:');
    Object.entries(dest.memberFlights).forEach(([memberName, flights]) => {
      const member = group.members.find(m => m.name === memberName)!;
      const totalCost = flights.outboundFlight.price + flights.returnFlight.price;
      const remainingBudget = member.budget - totalCost;
      const budgetUsagePercent = ((totalCost / member.budget) * 100).toFixed(1);
      
      console.log(`\n  ${memberName} (${flights.origin} → ${iata}):`);
      console.log(`    Outbound: ${flights.outboundFlight.airline} - €${flights.outboundFlight.price} (direct)`);
      console.log(`    Return: ${flights.returnFlight.airline} - €${flights.returnFlight.price} (direct)`);
      console.log(`    Total: €${totalCost} (${budgetUsagePercent}% of budget, €${remainingBudget} remaining)`);
    });
    console.log('\n-----------------------------------');
  });
}

export { findBestMatchingDestinations, displayMatchingDestinations };
export type { GroupDestination };
