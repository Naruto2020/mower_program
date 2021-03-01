// import modules 
const mowerFactory = require('./mower');
const Transaction = require('./transaction');


/**
 *  analyse de de la tondeuse en position initial (4 4 S) 
 * param {string} initPositionLine ligne contenant la position initial 
 * retourne {Position} position initial de la tondeuse 
 * throws {Error}  si la ligne n'est pas correcte 
 */
const parseMowerPosition = (initialPositionLine) => {
  const initPositionLineRegex = /(\d+) (\d+) ([N|E|W|S]$)/;
  const isValidInitPositionLine = initPositionLineRegex.test(initialPositionLine);

  if (!isValidInitPositionLine) {
    throw new Error(`ligne contenant la position initiale de la tondeuse invalide . devrais être 'X Y ORIENTATION'.. '${initialPositionLine}' trouvé.`);
  }

  const [, x, y, orientation] = initialPositionLine.match(initPositionLineRegex);

  return mowerFactory(x, y, orientation);
};


/**
 * analyse de la ligne d'instruction de la tondeuse dans un tableau d'instruction 
 * param {string} instructionLine  contient les instructions de la tondeuse 
 * retourne {Array}  contient la liste d'instructions de la tondeuse 
 * throws {Error}  si la ligne d'instruction n'est pas valide 
 */
const parseInstructionsLine = (instructionLine) => {
  const instructionsRegex = /([A|D|G][^\s-]$)/;
  const isValidInstructions = instructionsRegex.test(instructionLine);

  if (!isValidInstructions) {
    throw new Error(`instructions invalide : ${isValidInstructions}`);
  }

  return Array.from(instructionLine);
};

/**
 *  analyse des 2 lignes affichant la tondeuse et ses instructions 
 * param {string} initTondeusePositionLine  position ligne conetant la position initial
 * param {string} tondeuseInstructionsLine  contient les instructions de la tondeuse 
 */
const parseCurrentMower = (initMowerPositionLine, mowerInstructionsLine) => {
  const mower = parseMowerPosition(initMowerPositionLine);
  const mowerInstructions = parseInstructionsLine(mowerInstructionsLine);

  const mowerTransactions = mowerInstructions.map(instruction =>
    new Transaction(mower, instruction));

  return { mower, mowerTransactions };
};


/**
 *  analyse les spécifications de la tondeuse en action pour creer un environnement initiale  
 * 
 * param {string} specs spécifications des tondeuseuse en action 
 * retourne  objet contenant la tondeuse et ça liste de transactions
 */
const parseMowItNowSpecs = (specs) => {
  const isValidSpecs = specs && typeof specs === 'string';
  if (!isValidSpecs) {
    throw Error(' les spécifications pour executer les tondeuses en action sont invalides .verrifier la doc svp.');
  }

  const splitSpecs = specs.split('\n');

  // on extrait l'en-tête representant les spécifications du jardin
  const landSpecsRegex = /(\d+) (\d+)/;
  const [, width, height] = splitSpecs[0].match(landSpecsRegex);
  splitSpecs.shift();


  const mowersDefinition = [];
  for (let line = 0; line < splitSpecs.length; line += 2) {
    const initMowerPositionLine = splitSpecs[line].trim();
    console.log("ligne",splitSpecs[line + 1]);
    const mowerInstructionsLine = splitSpecs[line + 1].trim();

    const mowerDefinition = parseCurrentMower(initMowerPositionLine, mowerInstructionsLine);

    mowersDefinition.forEach((mowerDef) => {
      const mowerStoredState = mowerDef.mower.getCurrentState();
      const mowerToAddState = mowerDefinition.mower.getCurrentState();
      const isOnSamePosition = mowerStoredState.x === mowerToAddState.x && mowerStoredState.y === mowerToAddState.y;

      if (isOnSamePosition) {
        throw new Error('deux tondeuses à la meme position.');
      }
    });
    mowersDefinition.push(mowerDefinition);
  }

  return {
    landSize: { width, height },
    mowersDefinition,
  };
};

module.exports = parseMowItNowSpecs;