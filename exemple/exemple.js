// import modules 
const { mowItNow } = require('../lib1/mowitnow');

const worker = mowItNow().fromFileSync('./instructions.txt');

// affiche la position initiale des tondeuses
console.log('position initiale:');
const initialMowers = worker.getMowers();
initialMowers.forEach((mower) => {
  console.log(`${mower.x} ${mower.y} ${mower.orientation}`);
});

// affiche position finale 
console.log('\n position finale:');
const finalMowers = worker.resolve().getMowers();
finalMowers.forEach((mower) => {
  console.log(`${mower.x} ${mower.y} ${mower.orientation}`);
});