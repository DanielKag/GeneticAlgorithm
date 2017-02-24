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
  
  assert.deepEqual(mergeCreatures(creatureA, creatureB, 1), [1,4,3,2,1]);
  assert.deepEqual(mergeCreatures(creatureA, creatureB, 3), [1,2,3,2,1]);
});

QUnit.test( "fitness", function( assert ) {

  assert.equal(fitness([1,2,3,4,5]), 15 );  
  assert.equal(fitness([0,9,10,4,0]), 23 );
});

QUnit.test( "roullete", function( assert ) {

  let pop = [
      [1,2,3,4,5], // 15
      [2,3,4,5,6], // 20
      [5,6,7,8,9], // 35
      [3,4,5,6,7], // 25
      [4,5,6,7,8], // 30   
  ]

  assert.deepEqual(roullete(0, pop), pop[0])
  assert.deepEqual(roullete(10, pop), pop[0])
  assert.deepEqual(roullete(16, pop), pop[1])
  assert.deepEqual(roullete(35, pop), pop[1])
  assert.deepEqual(roullete(36, pop), pop[2])
  assert.deepEqual(roullete(69, pop), pop[2])
  assert.deepEqual(roullete(70, pop), pop[2])
  assert.deepEqual(roullete(71, pop), pop[3])
  assert.deepEqual(roullete(100, pop), pop[4])
  assert.deepEqual(roullete(125, pop), pop[4])

});


QUnit.test( "calcMaxTicket", function( assert ) {

  let pop = [
      [1,2,3,4,5], // 15
      [2,3,4,5,6], // 20
      [5,6,7,8,9], // 35
      [3,4,5,6,7], // 25
      [4,5,6,7,8], // 30
]

  assert.equal(calcMaxTicket(pop), 125)
  assert.equal(calcMaxTicket([]), 0)
});



QUnit.test( "getNewCreature", function( assert ) {
  let pop = [
      [1,2,3,4,5], // 15
      [2,3,4,5,6], // 20
      [5,6,7,8,9], // 35
      [3,4,5,6,7], // 25
      [4,5,6,7,8], // 30
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
      [1,2,3,4,5], // 15
      [2,3,4,5,6], // 20
      [5,6,7,8,9], // 35
      [3,4,5,6,7], // 25
      [4,5,6,7,8], // 30
]

let pop2 = [
      [1,2,3,4,5], // 15
      [2,3,4,5,6], // 20
      [5,6,7,8,9], // 35
      [5,6,7,8,9], // 35
      [3,4,5,6,7], // 25
      [4,5,6,7,8], // 30
      [5,6,7,8,9] // 35
]

let pop3 = [
      [1,2,3,4,50], // 60
      [2,3,4,5,6], // 20
      [5,6,7,8,9], // 35
      [5,6,7,8,9], // 35
      [3,4,5,6,7], // 25
      [4,5,6,7,8], // 30
      [5,6,7,8,9] // 35
]

    assert.deepEqual(getFitestCreature(pop), [5,6,7,8,9])
    assert.deepEqual(getFitestCreature(pop2), [5,6,7,8,9])
    assert.deepEqual(getFitestCreature(pop3), [1,2,3,4,50])
});