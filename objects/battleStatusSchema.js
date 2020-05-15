const { messages } = require('utilities/constants');

class BattleStatus {
  constructor({ firstWarrior, secondWarrior }) {
    this.firstWarrior = firstWarrior;
    this.secondWarrior = secondWarrior;
    this.messages = '';
    this.battleStatistics = {};
    this.gameStatus = 'OPEN';
  }

  nextStep() {
    this.messages = '';
    if (this.firstWarrior.status === 'UP') {
      this.secondWarrior.healthPoints--;
      this.messages += messages.hit(this.firstWarrior.widgetName, this.secondWarrior.widgetName);
    } else if (this.firstWarrior.status === 'DOWN') {
      this.firstWarrior.healthPoints--;
      this.messages += messages.getHit(this.firstWarrior.widgetName);
    }

    if (this.secondWarrior.status === 'UP') {
      this.firstWarrior.healthPoints--;
      this.messages += messages.hit(this.secondWarrior.widgetName, this.firstWarrior.widgetName);
    } else if (this.secondWarrior.status === 'DOWN') {
      this.secondWarrior.healthPoints--;
      this.messages += messages.getHit(this.secondWarrior.widgetName);
    }
    if (this.secondWarrior.status !== 'UNCHANGED' || this.firstWarrior.status !== 'UNCHANGED') this.saveStepInStatistics();
  }

  saveStepInStatistics() {
    this.battleStatistics[`Step ${this.battleStatistics.length}`] = this.getSteps();
  }

  getSteps() {
    if (this.firstWarrior.healthPoints === 0 || this.secondWarrior.healthPoints === 0) this.gameStatus = 'CLOSED';
    return {
      playersStats: [this.firstWarrior, this.secondWarrior],
      gameStatus: this.gameStatus,
      messages: this.messages,
    };
  }

  getStatistics() {
    return { battleStatistics: this.battleStatistics };
  }
}

module.exports = BattleStatus;
