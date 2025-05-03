const { findDestinationsWithinBudget } = require('./FlightSearcher');

interface Member {
  name: string;
  originAirport: string;
  budget: number;
}

interface GroupInput {
  code: string;
  departureDate: string;
  returnDate: string;
  members: Member[];
}

interface GroupDestination {
  destination: string;
  totalGroupCost: number;
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
}

async function findMatchingDestinations(group: GroupInput): Promise<GroupDestination[]> {
  try {
    const memberDestinationsPromises = group.members.map((member: Member) =>
      findDestinationsWithinBudget(
        member.originAirport,
        group.departureDate,
        group.returnDate,
        member.budget
      )
    );

    const memberDestinations = await Promise.all(memberDestinationsPromises);
    const destinationsMap = new Map<string, GroupDestination>();

    group.members.forEach((member: Member, memberIndex: number) => {
      const destinations = memberDestinations[memberIndex];

      destinations.forEach((dest: any) => {
        const destinationKey = dest.destination;
        const totalCost = dest.price;

        // Skip if this destination would exceed the member's budget
        if (totalCost > member.budget) return;

        if (!destinationsMap.has(destinationKey)) {
          destinationsMap.set(destinationKey, {
            destination: destinationKey,
            totalGroupCost: 0,
            memberFlights: {}
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

    return Array.from(destinationsMap.values())
      .filter(dest => Object.keys(dest.memberFlights).length === group.members.length)
      .sort((a, b) => a.totalGroupCost - b.totalGroupCost);
  } catch (error) {
    console.error('Error finding matching destinations:', error);
    return [];
  }
}

async function displayMatchingDestinations(group: GroupInput): Promise<void> {
  console.log(`\nFinding matching destinations for group ${group.code}...`);
  console.log(`Travel dates: ${group.departureDate} - ${group.returnDate}`);
  console.log('\nMember budgets:');
  group.members.forEach(member => {
    console.log(`${member.name} (from ${member.originAirport}): €${member.budget}`);
  });
  console.log('');

  const destinations = await findMatchingDestinations(group);

  if (destinations.length === 0) {
    console.log('No destinations found that match all member requirements.');
    return;
  }

  destinations.forEach((dest, index) => {
    const allMembersWithinBudget = group.members.every(member => {
      const memberFlight = dest.memberFlights[member.name];
      const totalCost = memberFlight.outboundFlight.price + memberFlight.returnFlight.price;
      return totalCost <= member.budget;
    });

    if (allMembersWithinBudget) {
      console.log(`${index + 1}. ${dest.destination}`);
      console.log(`Total group cost: €${dest.totalGroupCost}`);
      console.log('\nFlight details per member:');
      
      Object.entries(dest.memberFlights).forEach(([memberName, flights]) => {
        const member = group.members.find(m => m.name === memberName)!;
        const totalCost = flights.outboundFlight.price + flights.returnFlight.price;
        const remainingBudget = member.budget - totalCost;
        
        console.log(`\n  ${memberName} (${flights.origin} → ${dest.destination.split(' (')[1].replace(')', '')}}):`);
        console.log(`    Outbound: ${flights.outboundFlight.airline} - €${flights.outboundFlight.price}${
          flights.outboundFlight.isDirect ? ' (direct)' : ' (with stops)'
        }`);
        console.log(`    Return: ${flights.returnFlight.airline} - €${flights.returnFlight.price}${
          flights.returnFlight.isDirect ? ' (direct)' : ' (with stops)'
        }`);
        console.log(`    Total: €${totalCost} (Remaining budget: €${remainingBudget})`);
      });
      console.log('\n-----------------------------------');
    }
  });
}

// Example usage
async function main() {
  const { multiOriginGroup, sameOriginGroup } = require('../constants/friendGroup');
  
  await displayMatchingDestinations(multiOriginGroup);
  await displayMatchingDestinations(sameOriginGroup);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { findMatchingDestinations, displayMatchingDestinations };
