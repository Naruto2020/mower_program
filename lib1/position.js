// initialisation de la classe position 
class Position {
    constructor(x, y, orientation = null) {
      this.x = Number.parseInt(x, 10);
      this.y = Number.parseInt(y, 10);
      this.orientation = orientation;
    }
  
  
    // representation des orientations
    getRepresentation() {
      switch (this.orientation) {
        case 'N': return ' ^ ';
        case 'E': return ' > ';
        case 'W': return ' < ';
        case 'S': return ' v ';
        default: return '   ';
      }
    }
  
    // gestion des orientations 90° left et  right
    turnLeft() {
      switch (this.orientation) {
        case 'N':
          this.orientation = 'W';
          break;
        case 'W':
          this.orientation = 'S';
          break;
        case 'S':
          this.orientation = 'E';
          break;
        case 'E':
          this.orientation = 'N';
          break;
        default: break;
      }
    }
  
    turnRight() {
      switch (this.orientation) {
        case 'N':
          this.orientation = 'E';
          break;
        case 'W':
          this.orientation = 'N';
          break;
        case 'S':
          this.orientation = 'W';
          break;
        case 'E':
          this.orientation = 'S';
          break;
        default: break;
      }
    }
  
    // on definit la prochaine position en fonction du déplacement de la tondeuse
    getNextPosition() {
      // on copie les propriétés directes et enumérables de l'objet position sur l'instance newPosition
      const newPosition = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  
      switch (this.orientation) {
        case 'N':
          newPosition.y += 1;
          break;
        case 'W':
          newPosition.x -= 1;
          break;
        case 'S':
          newPosition.y -= 1;
          break;
        case 'E':
          newPosition.x += 1;
          break;
        default: break;
      }
      return newPosition;
    }
  
    // on retourne la position sous forme de string 
    toString() {
      return `${this.x} ${this.y} ${this.orientation}`;
    }
  }
  
  module.exports = Position;