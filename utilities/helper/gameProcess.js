const { BattleStatus, Warrior } = require('objects');
const { getActualWidgetsRate } = require('utilities/redis/redisHelper');

class GameProcess {
  constructor({ firstWarrior, secondWarrior, battle }) {
    return (async () => {
      this.battle = battle;
      this.firstWarrior = new Warrior({
        widgetName: firstWarrior.cryptoName,
        widgetCurrentPrice: (await getActualWidgetsRate(firstWarrior.cryptoName)).price,
        healthPoints: battle.playersInfo.healthPoints,
        playerID: firstWarrior.playerID,
      });
      this.secondWarrior = new Warrior({
        widgetName: secondWarrior.cryptoName,
        widgetCurrentPrice: (await getActualWidgetsRate(secondWarrior.cryptoName)).price,
        healthPoints: battle.playersInfo.healthPoints,
        playerID: secondWarrior.playerID,
      });
      this.step = new BattleStatus({
        firstWarrior: this.firstWarrior.getStatus(),
        secondWarrior: this.secondWarrior.getStatus(),
        healthPoints: battle.playersInfo.healthPoints,
        playerID: secondWarrior.playerID,
      });
      return this;
    })();
  }

  async start() {
    this.startOperation = setInterval(async () => {
      this.firstWarrior.updatePrice({
        widgetCurrentPrice: (await getActualWidgetsRate(this.firstWarrior.warrior.widgetName)).price,
      });
      this.secondWarrior.updatePrice({
        widgetCurrentPrice: (await getActualWidgetsRate(this.secondWarrior.warrior.widgetName)).price,
      });
      this.step.nextStep();
    }, 1000);
  }

  stop() {
    clearInterval(this.startOperation);
  }

  getStepStatus() {
    if (this.step.gameStatus === 'CLOSED') {
      this.stop();
      if (this.step.firstWarrior.healthPoints === 0) return { messages: `Игрок ${this.step.secondWarrior.widgetName} с треском проиграл битву!`, gameStatus: 'CLOSED' };
      return { messages: `Игрок ${this.step.firstWarrior.widgetName} с треском проиграл битву!`, gameStatus: 'CLOSED' };
    }
    if (this.step.firstWarrior.status !== 'UNCHANGED' || this.step.secondWarrior.status !== 'UNCHANGED') {
      this.battle.steps.push(this.step.getSteps());
      return this.battle;
    }
  }

  getBattleStatistics() {
    return this.battle.getStatistics();
  }
}


module.exports = GameProcess;
