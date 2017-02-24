const random = (max) =>
            R.pipe(Math.random, R.multiply(max), Math.round)()

const initArray = (size) => R.range(0, size)

const createCreature = 
                    R.pipe(
                            initArray,
                            R.map(x => random(10))
                    )
                    
const initPopulation = (popSize, creatureSize) =>
                            initArray(popSize)
                            .map(x => createCreature(creatureSize))

const mergeCreatures = (createA, createB, mergePoint) =>
                    R.concat( R.slice(0,          mergePoint, createA), 
                              R.slice(mergePoint, Infinity,       createB))

const getRandomMergePoint = (createA, createB) => 
                                random(R.min(createA.length, createB.lenth))


const randomOffspring = R.curry((creatureA, creatureB) =>
                            offspring(creatureA, creatureB, getRandomMergePoint(creatureA, creatureB)))


const isShouldMutate = (mutateRate) =>
                            Math.random() < mutateRate

const randomMutate = R.curry((mutateRate, creature) =>
                isShouldMutate(mutateRate)  
                        ? mutate(creature, random(creature.length), random(creature.length))
                        : creature)



const mutate = (create, pos, newCell) =>
                    Object.assign([], create, {[pos]: newCell})

const fitness = R.memoize( (creature) =>
                                creature.reduce((acc, curr) =>
                                    R.add(acc, curr)
                                , 0))

// input: population
const getTicket = R.pipe(
                        R.map(x => fitness(x)),
                        R.reduce(R.add, 0),
                        random
                    )

const roullete = R.curry((ticket, population) => 
               {
                   let sum = 0;
                   for(let i=0; i< population.length;i++) {
                       sum += fitness(population[i])

                       if(sum > ticket) {
                           return population[i]
                       }
                   }

                   return population[0]
})


// input: population
const calcMaxTicket = R.pipe (
                        R.map(fitness),
                        R.sum
                    )

const randomRoullete = (population) => roullete(random(calcMaxTicket(population)), population)


const roulleteNewCreature = (population) =>
                                randomOffspring(randomRoullete(population),randomRoullete(population))


let parameters = {
    mutate: true,
    mutatePosition: 3,
    mutateNewValue: 10,
    roulleteTicketA: 100,
    roulleteTicketB: 50,
    crossoverPoint: 3
}

const newCreature = (parameters, population) => {

    let creatureA = roullete(parameters.roulleteTicketA, population);
    let creatureB = roullete(parameters.roulleteTicketB, population);
    let offspring = mergeCreatures(creatureA, creatureB, parameters.crossoverPoint);
    let mutateOffspring = parameters.mutate  
                                ? mutate(offspring, parameters.mutatePosition, parameters.mutateNewValue)
                                : offspring
    return mutateOffspring;
}       



const createNewCreature = 
                        R.pipe(
                                roulleteNewCreature
                                //randomMutate(1 / population.length)
                        )

let pop = initPopulation(5,5)

const copy = (arr) => R.concat([], arr)

const getFitestCreature = (population) =>   
                            population.reduce((acc,curr) => 
                                fitness(curr) > fitness(acc) ? copy(curr) : acc
                            ,[])

                
const nextGeneration = (population) =>
                            R.pipe(
                                    initArray(population.length - 1),
                                    R.map(x => createNewCreature(population)),
                                    R.append(getFitestCreature(population))
                            )()




// The less the better
const fitnessForSorting = (creature) => 
                creature.reduce((acc, curr, i) =>
                    R.add(acc, R.mul(curr, i))
                , 0)





/// The goal: entire array should be the same digit