const { BattleStatus, Warrior } = require('objects');
const _ = require('lodash');
const { widgetsQuotes } = require('utilities/request');

class GameProcess {
  constructor({ firstWarrior, secondWarrior, battle }) {
    this.battle = battle;
    this.firstWarrior = new Warrior({
      widgetName: widgetsQuotes.quotesRate[firstWarrior.cryptoName].widgetName,
      widgetCurrentPrice: widgetsQuotes.quotesRate[firstWarrior.cryptoName].price,
      healthPoints: battle.playersInfo.healthPoints,
      playerID: firstWarrior.playerID,
    });
    this.secondWarrior = new Warrior({
      widgetName: widgetsQuotes.quotesRate[secondWarrior.cryptoName].widgetName,
      widgetCurrentPrice: widgetsQuotes.quotesRate[secondWarrior.cryptoName].price,
    });
    this.step = new BattleStatus({
      firstWarrior: this.firstWarrior.getStatus(),
      secondWarrior: this.secondWarrior.getStatus(),
      healthPoints: battle.playersInfo.healthPoints,
      playerID: secondWarrior.playerID,
    });
  }

  start() {
    this.startOperation = setInterval(() => {
      this.firstWarrior.updatePrice({
        widgetCurrentPrice: widgetsQuotes.quotesRate[this.firstWarrior.warrior.widgetName].price,
      });
      this.secondWarrior.updatePrice({
        widgetCurrentPrice: widgetsQuotes.quotesRate[this.secondWarrior.warrior.widgetName].price,
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
