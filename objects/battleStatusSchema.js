const { messages } = require('utilities/constants');

class BattleStatus {
  constructor({ firstWarrior, secondWarrior }) {
    this.firstWarrior = firstWarrior;
    this.secondWarrior = secondWarrior;
    this.messages = '';
    this.gameStatus = 'OPEN';
  }

  nextStep() {
    this.messages = '';
    if (this.firstWarrior.status === 'UP') {
      this.secondWarrior.healthPoints--;
      this.messages += messages.hit(this.firstWarrior.cryptoName, this.secondWarrior.cryptoName);
    } else if (this.firstWarrior.status === 'DOWN') {
      this.firstWarrior.healthPoints--;
      this.messages += messages.getHit(this.firstWarrior.cryptoName);
    }

    if (this.secondWarrior.status === 'UP') {
      this.firstWarrior.healthPoints--;
      this.messages += messages.hit(this.secondWarrior.cryptoName, this.firstWarrior.widgetName);
    } else if (this.secondWarrior.status === 'DOWN') {
      this.secondWarrior.healthPoints--;
      this.messages += messages.getHit(this.secondWarrior.cryptoName);
    }
  }

  getSteps() {
    if (this.firstWarrior.healthPoints === 0 || this.secondWarrior.healthPoints === 0) this.gameStatus = 'CLOSED';
    return {
      playersStats: [this.firstWarrior, this.secondWarrior],
      messages: this.messages,
    };
  }
}

module.exports = BattleStatus;
