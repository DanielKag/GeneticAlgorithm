// Framework
const random = (max) =>
            R.pipe(Math.random, R.multiply(max), Math.round)()

const initArray = (size) => R.range(0, size)

// Create random population
const createCreature = 
                    R.pipe(
                            initArray,
                            R.map(x => random(100))
                    )
                    
const initPopulation = (popSize, creatureSize) =>
                            initArray(popSize)
                            .map(x => createCreature(creatureSize))


// Pure functions
const mergeCreatures = (createA, createB, mergePoint) =>
                    R.concat( R.slice(0,          mergePoint, createA), 
                              R.slice(mergePoint, Infinity,       createB))

const mutateIfShould = (shouldMutate, pos, newValue, creature) =>
                        shouldMutate 
                        ? mutate(pos, newValue, creature)
                        : creature

const mutate = (pos, newValue, creature) =>
                    Object.assign([], creature, {[pos]: newValue})

// input: creature
// Worst creature
//const fitness =  R.pipe(R.sum, R.multiply(-1), R.add(1000))
const fitness = R.sum 

const roullete = (ticket, population) => 
               {
                   let sum = 0;
                   for(let i=0; i< population.length;i++) {
                       sum += fitness(population[i])

                       if(sum >= ticket) {
                           return population[i]
                       }
                   }

                   return population[0]

}

    // input: population
const calcMaxTicket =  R.pipe (
                        R.map(fitness),
                        R.sum
                        )

// Random functions
const randomCrossoverPoint = (creatureSize) => 
                                random(creatureSize)

const randomMutatePos = (creatureSize) =>
                                random(creatureSize - 1)

const randomMutateNewValue = (creatureMaxValue) =>
                                random(creatureMaxValue)

const randomShouldMutate = (mutateRate) =>
                            Math.random < mutateRate

const randomRoulleteTicket = (population) =>
                                random(calcMaxTicket(population))

let parameters = {
    mutateRate: 0.05,
    creatureSize: 10,
    populationSize: 500,
    creatureMaxValue: 100
}

let pop = initPopulation(parameters.populationSize, parameters.creatureSize, parameters.creatureMaxValue)

const generateRandomValues = (parameters, population, sumOfFitness) => {
                            return {
                                mutate: randomShouldMutate(parameters.mutateRate),
                                mutatePosition: randomMutatePos(parameters.creatureSize),
                                mutateNewValue: randomMutateNewValue(parameters.creatureMaxValue),
                                roulleteTicketA: random(sumOfFitness),
                                roulleteTicketB: random(sumOfFitness),
                                crossoverPoint: randomCrossoverPoint(parameters.creatureSize)
                            }
                        }


const generateRandomValuesForEntirePopulation = (parameters, population, sumOfFitness) =>
                        initArray(parameters.populationSize - 1)
                        .map(x => generateRandomValues(parameters, population, sumOfFitness))

console.time('generateRandoms');
for(var i = 0;i<1;i++) {
    generateRandomValuesForEntirePopulation(parameters, pop, calcMaxTicket(pop))
}
console.timeEnd('generateRandoms');


const newCreature = (randomValues, population) => {

    let creatureA = roullete(randomValues.roulleteTicketA, population);
    let creatureB = roullete(randomValues.roulleteTicketB, population);
    let offspring = mergeCreatures(creatureA, creatureB, randomValues.crossoverPoint);
    let mutateOffspring = mutateIfShould(randomValues.mutate, 
                                         randomValues.mutatePosition, 
                                         randomValues.mutateNewValue, 
                                         offspring)
    return mutateOffspring;
}       




const copy = (arr) => R.concat([], arr)

const getFitestCreature = (population) =>   
                            population.reduce((acc,curr) => 
                                fitness(curr) > fitness(acc) ? copy(curr) : acc
                            ,[])

                
const nextGeneration = (parameters, population) => {
                            let nextGeneration =  generateRandomValuesForEntirePopulation(parameters, population, calcMaxTicket(population))
                                                .map(x => newCreature(x, population))
                            return R.append(getFitestCreature(population), nextGeneration)
}


console.log(JSON.stringify(pop))
console.log(JSON.stringify(parameters))


for(var i=0;i<10;i++) {
    pop = nextGeneration(parameters, pop);
    let best = getFitestCreature(pop); 
    console.log(JSON.stringify(best), " : ", fitness(best));
}


