const { messages } = require('utilities/constants');

class BattleStatus {
  constructor({ firstWarrior, secondWarrior }) {
    this.firstWarrior = firstWarrior;
    this.secondWarrior = secondWarrior;
    this.messages = '';
    this.gameStatus = 'OPEN';
  }

  nextStep() {
    this.messages = [];
    statusChecker({ currentPlayer: this.firstWarrior, minorPlayer: this.secondWarrior, currentMessages: this.messages });
    statusChecker({ currentPlayer: this.secondWarrior, minorPlayer: this.firstWarrior, currentMessages: this.messages });
  }

  getSteps() {
    if (this.firstWarrior.healthPoints === 0 || this.secondWarrior.healthPoints === 0) this.gameStatus = 'CLOSED';
    return {
      playersStats: [this.firstWarrior, this.secondWarrior],
      messages: this.messages.toString(),
    };
  }
}

const statusChecker = ({ currentPlayer, minorPlayer, currentMessages }) => {
  if (currentPlayer.status === 'UP') {
    minorPlayer.healthPoints--;
    currentMessages.push(messages.hit(currentPlayer.cryptoName, minorPlayer.cryptoName));
  } else if (currentPlayer.status === 'DOWN') {
    currentPlayer.healthPoints--;
    currentMessages.push(messages.getHit(currentPlayer.cryptoName));
  }
};

module.exports = BattleStatus;
