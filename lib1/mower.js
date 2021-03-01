// import modules 
const { EventEmitter } = require('events');
const Position = require('./position');

// initialisation de la classe Tondeuse héritant de Eventmitter 
class Mower extends EventEmitter {
  constructor(position) {
    super();
    this.position = position;
    this.status = 'off';
  }

  /**
   * Execution de la commande en paramètre (A pour avancer, D pour tourner a droite , G pour tourner à gauche)
   *  (transaction) commande à executer 
   */
  move(transaction) {
    switch (transaction) {
      case 'A': {
        // Calcul la position suivante et l'afficher
        const nextPosition = this.position.getNextPosition();
        this.emit('moveTo', nextPosition);
        break;
      }
      case 'D':
        this.position.turnRight();
        break;
      case 'G':
        this.position.turnLeft();
        break;
      default: break;
    }
  }

  /**
   * on positione la tondeuse en paramètre 
   *  (position) la position à rejoindre
   */
  moveTo(position) {
    this.position = position;
  }

  /**
   * on change le status si une tondeuse est bloquée par une autre
   */
  block() {
    this.status = 'stuck';
  }

  /**
   * on change le status quand la tondeuse tond 
   */
  start() {
    this.status = 'running';
  }

  /**
   * on change le status quand la tondeuse ne bouge plus
   */
  end() {
    this.status = 'finished';
  }

  /**
   *  boolean pour savoir si la tondeuse est bloquée par une autre 
   *  {boolean} True si la tondeuse est bloquée 
   */
  isBlocked() {
    return this.status === 'stuck';
  }

  /**
   * boolean pour savoir si la tondeuse est arrivée a ca position final ie n'a plus de commande à exécuter 
   */
  hasFinished() {
    return this.status === 'finished';
  }

  /**
   * on stoke la tondeuse dans un objet 
   *  {object} contient l'etat actuel de la tondeuse
   */
  getCurrentState() {
    //on retourne la copie des propriétés directes et enumérables de l'objet Tondeuse 
    return Object.assign({}, this.position, { status: this.status });
  }

  // on retourne la position de la tondeuse et son status sous forme de string
  toString() {
    return `Mower: ${this.position}, status=${this.status}`;
  }
}


const mowerFactory = (x, y, orientation) => {
  const position = new Position(x, y, orientation);
  return new Mower(position);
};

module.exports = mowerFactory;