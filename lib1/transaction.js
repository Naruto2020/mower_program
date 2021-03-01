// initialisation instructions 
const ALLOWED_INSTRUCTIONS = ['A', 'D', 'G'];

class Transaction {
  constructor(mower, instruction) {
    this.instruction = instruction;
    this.mower = mower;
  }

  static isValidInstruction(instruction) {
    return ALLOWED_INSTRUCTIONS.includes(instruction);
  }

  run() {
    this.mower.move(this.instruction);
  }

  // retourne l'instruction sous forme de string 
  toString() {
    return `'${this.instruction}' sur ${this.mower}`;
  }
}

module.exports = Transaction;