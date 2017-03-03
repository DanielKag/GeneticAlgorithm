QUnit.test( "mutate", function( assert ) {
  let creature = [1,2,3,4,5]
  

  assert.deepEqual(mutate(0,2,creature), [2,2,3,4,5]);
  assert.deepEqual(mutate(1,3,creature), [1,3,3,4,5]);
});

QUnit.test( "mutateIfShould", function( assert ) {
  let creature = [1,2,3,4,5]
  

  assert.deepEqual(mutateIfShould(true, 0,2,creature), [2,2,3,4,5]);
  assert.deepEqual(mutateIfShould(false,1,3,creature), [1,2,3,4,5]);
});

QUnit.test( "merge", function( assert ) {
  let creatureA = [1,2,3,4,5]
  let creatureB = [5,4,3,2,1]
  
  assert.deepEqual(mergeCreatures(1, creatureA, creatureB), [1,4,3,2,1]);
  assert.deepEqual(mergeCreatures(3, creatureA, creatureB), [1,2,3,2,1]);
});

QUnit.test( "maxArrayFitness", function( assert ) {

  assert.equal(maxArrayFitness([1,2,3,4,5]), 15 );  
  assert.equal(maxArrayFitness([0,9,10,4,0]), 23 );
});

QUnit.test( "roullete", function( assert ) {

  let pop = [
      {creature:[1,2,3,4,5], fitness: 15}, // 15
      {creature:[2,3,4,5,6], fitness: 20}, // 20
      {creature:[5,6,7,8,9], fitness: 35}, // 35
      {creature:[3,4,5,6,7], fitness: 25}, // 25
      {creature:[4,5,6,7,8], fitness: 30}, // 30   
  ]

  assert.deepEqual(roullete(0, pop), pop[0].creature)
  assert.deepEqual(roullete(10, pop), pop[0].creature)
  assert.deepEqual(roullete(16, pop), pop[1].creature)
  assert.deepEqual(roullete(35, pop), pop[1].creature)
  assert.deepEqual(roullete(36, pop), pop[2].creature)
  assert.deepEqual(roullete(69, pop), pop[2].creature)
  assert.deepEqual(roullete(70, pop), pop[2].creature)
  assert.deepEqual(roullete(71, pop), pop[3].creature)
  assert.deepEqual(roullete(100, pop), pop[4].creature)
  assert.deepEqual(roullete(125, pop), pop[4].creature)

});


QUnit.test( "calcMaxTicket", function( assert ) {

  let pop = [
      {creature:[1,2,3,4,5]}, // 15
      {creature:[2,3,4,5,6]}, // 20
      {creature:[5,6,7,8,9]}, // 35
      {creature:[3,4,5,6,7]}, // 25
      {creature:[4,5,6,7,8]}, // 30
]

  assert.equal(calcMaxTicket(maxArrayFitness, pop), 125)
  assert.equal(calcMaxTicket(maxArrayFitness, []), 0)
});



QUnit.test( "getNewCreature", function( assert ) {
  let pop = [
      {creature:[1,2,3,4,5], fitness: 15}, // 15
      {creature:[2,3,4,5,6], fitness: 20}, // 20
     {creature: [5,6,7,8,9], fitness: 35}, // 35
     {creature: [3,4,5,6,7], fitness: 25}, // 25
     {creature: [4,5,6,7,8], fitness: 30}, // 30
]

let parameters = {
    mutate: true,
    mutatePosition: 3,
    mutateNewValue: 10,
    roulleteTicketA: 20,
    roulleteTicketB: 50,
    crossoverPoint: 3
}

  assert.deepEqual(newCreature(parameters, pop), [2,3,4,10,9])
});

QUnit.test( "getFittestCreature", function( assert ) {
  let pop = [
      {creature:[1,2,3,4,5], fitness: 15}, // 15
      {creature:[2,3,4,5,6], fitness: 20}, // 20
      {creature:[5,6,7,8,9], fitness: 35}, // 35
      {creature:[3,4,5,6,7], fitness: 25}, // 25
      {creature:[4,5,6,7,8], fitness: 30}, // 30
]

let pop2 = [
      {creature:[1,2,3,4,5], fitness: 15}, // 15
      {creature:[2,3,4,5,6], fitness: 20}, // 20
      {creature:[5,6,7,8,9], fitness: 35}, // 35
      {creature:[5,6,7,8,9], fitness: 35}, // 35
      {creature:[3,4,5,6,7], fitness: 25}, // 25
      {creature:[4,5,6,7,8], fitness: 30}, // 30
      {creature:[5,6,7,8,9], fitness: 35} // 35
]

let pop3 = [
      {creature:[1,2,3,4,50], fitness: 60}, // 60
      {creature:[2,3,4,5,6], fitness: 20}, // 20
      {creature:[5,6,7,8,9], fitness: 35}, // 35
      {creature:[5,6,7,8,9], fitness: 35}, // 35
      {creature:[3,4,5,6,7], fitness: 25}, // 25
      {creature:[4,5,6,7,8], fitness: 30}, // 30
      {creature:[5,6,7,8,9], fitness: 35} // 35
]

    assert.deepEqual(getFittestCreature(pop), {creature:[5,6,7,8,9], fitness: 35})
    assert.deepEqual(getFittestCreature(pop2),{creature:[5,6,7,8,9], fitness: 35})
    assert.deepEqual(getFittestCreature(pop3),{creature:[1,2,3,4,50], fitness: 60})
});