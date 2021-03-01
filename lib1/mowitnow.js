// import modules
const fs = require('fs');
const Land = require('./land');
const parseInstructions = require('./parser');


class MowItNowWorker {
  constructor(logger = null) {
    this.log = logger;

    this.queues = [];
    this.land = {};
    this.history = [];
  }

  /**
   * affiche debug si loggin injecté 
   *  {*} toDebug  à deboger
   */
  debug(toDebug = '\n') {
    if (this.log) {
      this.log.debug(toDebug);
    }
  }

  /**
   * Initialisation de MowItNowWorker depuis une chaine de carractère
   *  {string} text  string contenant les instructions 
   * retourne l' instance courante 
   */
  fromText(text) {
    const mowItNow = parseInstructions(text);

    const mowers = mowItNow.mowersDefinition.map(definition => definition.mower);
    this.queues = mowItNow.mowersDefinition.map(definition => definition.mowerTransactions);

    const { width, height } = mowItNow.landSize;
    this.land = new Land(height, width, mowers);

    return this;
  }

  /**
   * Initialisation MowItNowWorker depuis un tableau 
   * parametre {array} mowItNow Array array contenant toutes les lignes d'instructions 
   * retourne  l'instance courante
   */
  fromArray(mowItNowArray) {
    const isValidArray = mowItNowArray && mowItNowArray instanceof Array && mowItNowArray.length >= 3;

    if (!isValidArray) {
      throw Error(`mauvais parametre dans le tableau mowItNow : ${mowItNowArray}`);
    }
    return this.fromText(mowItNowArray.join('\n'));
  }

  /**
   * Initialisation  MowItNowWorker depuis un fichier et appel du cb en parametre 
   * parametre {string} path  chemin du fichier d'instructions 
   * parametre {function} callback  fonction a appeler une fois terminé 
   * parametre {string} encoding  encodage fichier 
   */
  fromFileAsync(path, callback, encoding = 'utf-8') {
    fs.readFile(path, encoding, (err, instructions) => {
      if (err) {
        throw err;
      }
      callback(this.fromText(instructions));
    });
  }

  /**
   * Initialisation  MowItNowWorker depuis un fichier 
   * parametre {*} path chemin du fichier d'instructions
   * parametre {*} encoding encodage fichier 
   * retourne instance courante
   */
  fromFileSync(path, encoding = 'utf-8') {
    const instructions = fs.readFileSync(path, encoding);

    return this.fromText(instructions);
  }

  /**
   * retourne un objet avec l'état actuel de la tondeuse 
   * retourne un tableau d'objets
   */
  getMowers() {
    return this.land.mowers.map(mower => mower.getCurrentState());
  }

  /**
   * résourdre le probleme de déplacement des tondeuses en les déplacants par itération 
   * si toutes les tondeuses en cours d'exécution sont toutes bloquées urgence
   * throws Error si toutes les tondeuses en cours d'exécutions sont bloquées par une autre 
   * retourne instance courante 
   */
  resolve() {
    if (this.queues.length === 0) {
      throw Error('aucunes instructions trouvées. avez vous utilisé les fonctions d\' aides ?');
    }

    let allQueuesEmpty;
    do {
      allQueuesEmpty = this.queues.reduce((isQueuesEmpty, queue) => {
        const isCurrentQueueEmpty = queue.length === 0;

        if (!isCurrentQueueEmpty) {
          const currentTransaction = queue.shift();
          this.debug(`Transaction: ${currentTransaction}`);

          // Execute commande
          currentTransaction.run();
          this.debug(`resultats ${currentTransaction.mower}`);

          // si la tondeuse est bloquée par une autre mettre le déplacement en haut de la file d'attente
          if (currentTransaction.mower.isBlocked()) {
            queue.unshift(currentTransaction);
          }

          //  si plus de transaction dans la file, tondeuse en position final
          if (queue.length === 0) {
            currentTransaction.mower.end();
          }

          this.land.generateNewMap(); // pour chaque nouvel exécution 
        }
        return isQueuesEmpty && isCurrentQueueEmpty;
      }, true);

      // si toutes les tondeuses encore en marche sont bloquées 
      const blockedMowers = this.land.mowers.filter(mower => mower.isBlocked());
      const finishedMowers = this.land.mowers.filter(mower => mower.hasFinished());
      const isDeadLockCase = blockedMowers.length === (this.land.mowers.length - finishedMowers);
      this.debug(`Tondeuses bloquées: ${blockedMowers}`);
      if (isDeadLockCase) {
        throw Error('Toutes les tondeuses encore en marche bloquées . Urgence !');
      }

      this.debug(this.land.toString());
    } while (!allQueuesEmpty);
    this.debug(this.land.mowers.map(mower => mower).join('\n'));

    return this;
  }
}

const mowItNow = (logger = null) => new MowItNowWorker(logger);

module.exports = {
  MowItNowWorker,
  mowItNow,
};