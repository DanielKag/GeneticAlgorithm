
// Framework
const random = (max) =>
            R.pipe(Math.random, R.multiply(max), Math.round)()

const initArray = (size) => R.range(0, size)

const isDebug = false

const sayX = x => isDebug ? console.log('x is ' + x): null;
const sayY = y => isDebug ? console.log('y is ' + y): null;


// Create random population
const createCreature = 
                    R.pipe(
                            initArray,
                            R.map(x => random(100))
                    )
                    
const initPopulation = (parameters) =>
                            initArray(parameters.populationSize)
                            .map(x => createCreature(parameters.creatureSize))
                            .map(x => Object.assign({}, {creature: x}, {fitness: parameters.calcFitness(x)}))


// Pure functions
const mergeCreatures =  R.curry(
                         (mergePoint, createA, createB) =>
                            R.concat( R.slice(0,          mergePoint, createA), 
                              R.slice(mergePoint, Infinity,       createB))
                        )

const mutateIfShould = R.curry(
                        (shouldMutate, pos, newValue, creature) =>
                        shouldMutate 
                        ? mutate(pos, newValue, creature)
                        : creature)

const mutate = (pos, newValue, creature) =>
                    Object.assign([], creature, {[pos]: newValue})

// input: creature
// Worst creature
//const fitness =  R.pipe(R.sum, R.multiply(-1), R.add(1000))
const maxArrayFitness = R.sum 

const minArrayFitness = R.pipe(R.sum, R.multiply(-1), R.add(1000)) 

const distanceFromSqr = num => R.pipe(Math.sqrt, R.subtract(Math.floor(Math.sqrt(num))), R.multiply(100), R.add(1000))(num)

const sqrFitness = R.reduce((acc,curr) => acc + distanceFromSqr(curr), 0) 


const roullete = R.curry( (ticket, population) => 
               {
                   let sum = 0;
                   for(let i=0; i< population.length;i++) {
                       sum += population[i].fitness

                       if(sum >= ticket) {
                           return population[i].creature
                       }
                   }

                   return population[0].creature

})

    // input: population
const calcMaxTicket = (calcFitness, population) => R.pipe (
                        R.map(x => x.creature),
                        R.map(calcFitness),
                        R.sum
                        )(population)

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


const newCreature_old = (calcFitness, randomValues, population) => {

    let creatureA = roullete(randomValues.roulleteTicketA, population);
    let creatureB = roullete(randomValues.roulleteTicketB, population);
    let offspring = mergeCreatures(creatureA, creatureB, randomValues.crossoverPoint);
    let mutateOffspring = mutateIfShould(randomValues.mutate, 
                                         randomValues.mutatePosition, 
                                         randomValues.mutateNewValue, 
                                         offspring)
    return {creature: mutateOffspring, fitness: calcFitness(mutateOffspring)};
}   


const newCreature = (randomValues, population) => 
    R.pipe(
        roullete(randomValues.roulleteTicketB),
        mergeCreatures(randomValues.crossoverPoint, roullete(randomValues.roulleteTicketA, population)),
        mutateIfShould(randomValues.mutate, 
                          randomValues.mutatePosition, 
                          randomValues.mutateNewValue)
    )(population)  

const wrapCreatureWithFitness = (calcFitness, creature) => {
    return {creature: creature, fitness: calcFitness(creature)}
}


const copy = (arr) => R.concat([], arr)

const getFitness = R.prop('fitness')

// input: population
const getFittestCreature =  R.pipe (R.sortBy(getFitness),R.last)
                
const nextGeneration = (parameters, population) => {
                            let nextGeneration = generateRandomValuesForEntirePopulation(parameters, 
                                                                                         population, 
                                                                                         calcMaxTicket(parameters.calcFitness, population))
                                                .map(randoms => newCreature(randoms, population))
                                                .map(creature => wrapCreatureWithFitness(parameters.calcFitness, creature))
                            return R.append(getFittestCreature(population), nextGeneration)
}



let parameters = {
    mutateRate: 0.05,
    creatureSize: 10,
    populationSize: 500,
    creatureMaxValue: 100,
    generationsNumber: 200,
    calcFitness: sqrFitness
}

const geneticAlgorithm = (parameters, currentGeneration = "empty", currentPopulation = "empty") =>
                            currentGeneration === "empty" 
                               ? geneticAlgorithm(parameters,  
                                                  parameters.generationsNumber, 
                                                  initPopulation(parameters)) 
                               : currentGeneration === 0
                                 ? getFittestCreature(currentPopulation)
                                 : geneticAlgorithm(parameters, currentGeneration - 1, nextGeneration(parameters, currentPopulation))


//console.log(geneticAlgorithm(parameters));

/*
let pop = initPopulation(parameters.populationSize, parameters.creatureSize, sqrFitness)
console.log(JSON.stringify(pop))
console.log(JSON.stringify(parameters))
for(var i=0;i<100;i++) {
    pop = nextGeneration(parameters, pop);
    let best = getFittestCreature(pop); 
    console.log(JSON.stringify(best.creature), " : ", best.fitness);
}
*/



