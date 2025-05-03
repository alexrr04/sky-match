const { findDestinationsWithinBudget } = require('./FlightSearcher');
const airportsWithAttributes = require('../constants/airports_with_attributes.json');

import { Member, GroupInput, GroupDestination, AirportInfo } from './types';

function calculateDestinationScore(destination: AirportInfo, members: Member[]): { 
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
  ];
  
  const details: { 
    [key: string]: {
      score: number;
      matches: string[];
      mismatches: string[];
    }
  } = {};
  let totalScore = 0;
  let totalWeight = 0;

  attributes.forEach(attr => {
    const matches: string[] = [];
    const mismatches: string[] = [];
    let attrScore = 0;
    let attrWeight = 0;

    members.forEach(member => {
      const memberWantsIt = member[attr] === true;
      const destinationHasIt = destination[attr] === true;

      if (memberWantsIt) {
        attrWeight += 1;
        if (destinationHasIt) {
          matches.push(member.name);
          attrScore += 1;
        } else {
          mismatches.push(member.name);
        }
      }
    });

    if (attrWeight > 0) {
      details[attr] = {
        score: attrWeight > 0 ? attrScore / attrWeight : 0,
        matches,
        mismatches
      };
      totalScore += attrScore;
      totalWeight += attrWeight;
    }
  });

  return {
    score: totalWeight > 0 ? totalScore / totalWeight : 0,
    details
  };
}

function calculateCostScore(totalCost: number, groupSize: number, maxBudget: number): number {
  const avgCost = totalCost / groupSize;
  const avgBudget = maxBudget / groupSize;
  return 0.3 * (1 - (avgCost / avgBudget));
}

async function findBestMatchingDestinations(group: GroupInput): Promise<GroupDestination[]> {
  try {
    const memberDestinationsPromises = group.members.map(member =>
      findDestinationsWithinBudget(
        member.originAirport,
        group.departureDate,
        group.returnDate,
        member.budget
      )
    );

    const memberDestinations = await Promise.all(memberDestinationsPromises);
    const destinationsMap = new Map<string, GroupDestination>();
    const maxGroupBudget = group.members.reduce((sum, member) => sum + member.budget, 0);

    group.members.forEach((member, memberIndex) => {
      const destinations = memberDestinations[memberIndex];

      destinations.forEach((dest: any) => {
        const destinationKey = dest.destination;
        const totalCost = dest.price;
        const destinationIATA = destinationKey.split(' (')[1].replace(')', '');

        const airportInfo = airportsWithAttributes.find((a: AirportInfo) => a.iata === destinationIATA);
        if (!airportInfo) {
          return;
        }

        if (totalCost > member.budget) {
          return;
        }

        if (!destinationsMap.has(destinationKey)) {
          const { score, details } = calculateDestinationScore(airportInfo, group.members);

          destinationsMap.set(destinationKey, {
            destination: destinationKey,
            totalGroupCost: 0,
            matchScore: score,
            costScore: 0,
            finalScore: 0,
            memberFlights: {},
            matchDetails: details
          });
        }

        const destinationEntry = destinationsMap.get(destinationKey)!;
        destinationEntry.memberFlights[member.name] = {
          origin: member.originAirport,
          outboundFlight: {
            airline: dest.outboundFlight.airline,
            price: dest.price / 2,
            isDirect: dest.outboundFlight.isDirect
          },
          returnFlight: {
            airline: dest.returnFlight?.airline || 'Unknown',
            price: dest.price / 2,
            isDirect: dest.returnFlight?.isDirect || false
          }
        };
        destinationEntry.totalGroupCost += dest.price;
      });
    });

    // Calculate final scores for each destination
    destinationsMap.forEach(dest => {
      dest.costScore = calculateCostScore(dest.totalGroupCost, group.members.length, maxGroupBudget);
      dest.finalScore = (dest.matchScore * 0.7) + (dest.costScore * 0.3);
    });

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
    const airportInfo = airportsWithAttributes.find((a: AirportInfo) => a.iata === iata);
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
      console.log(`    Outbound: ${flights.outboundFlight.airline} - €${flights.outboundFlight.price}${
        flights.outboundFlight.isDirect ? ' (direct)' : ' (with stops)'
      }`);
      console.log(`    Return: ${flights.returnFlight.airline} - €${flights.returnFlight.price}${
        flights.returnFlight.isDirect ? ' (direct)' : ' (with stops)'
      }`);
      console.log(`    Total: €${totalCost} (${budgetUsagePercent}% of budget, €${remainingBudget} remaining)`);
    });
    console.log('\n-----------------------------------');
  });
}

async function main() {
  const { multiOriginGroup, sameOriginGroup } = require('../constants/friendGroup');
  
  await displayMatchingDestinations(multiOriginGroup);
  await displayMatchingDestinations(sameOriginGroup);
}

if (require.main === module) {
  main().catch(console.error);
}

export { findBestMatchingDestinations, displayMatchingDestinations };
export type { GroupDestination };
