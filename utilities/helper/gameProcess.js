const { BattleStatus, Warrior } = require('objects');
const _ = require('lodash');
const { getActualWidgetsRate } = require('utilities/redis/redisHelper');

class GameProcess {
  constructor({
    firstWarrior, secondWarrior, battle, widgetCurrentPrice,
  }) {
    this.battle = battle;
    this.firstWarrior = new Warrior({
      widgetName: firstWarrior.cryptoName,
      widgetCurrentPrice: widgetCurrentPrice[0],
      healthPoints: battle.playersInfo.healthPoints,
      playerID: firstWarrior.playerID,
    });
    this.secondWarrior = new Warrior({
      widgetName: secondWarrior.cryptoName,
      widgetCurrentPrice: widgetCurrentPrice[1],
      healthPoints: battle.playersInfo.healthPoints,
      playerID: secondWarrior.playerID,
    });
    this.step = new BattleStatus({
      firstWarrior: this.firstWarrior.getStatus(),
      secondWarrior: this.secondWarrior.getStatus(),
      healthPoints: battle.playersInfo.healthPoints,
      playerID: secondWarrior.playerID,
    });
  }

  async start() {
    this.startOperation = setInterval(async () => {
      this.firstWarrior.updatePrice({
        widgetCurrentPrice: (await getActualWidgetsRate(this.firstWarrior.warrior.widgetName)).price,
      });
      this.secondWarrior.updatePrice({
        widgetCurrentPrice: (await getActualWidgetsRate(this.secondWarrior.warrior.widgetName)).price,
      });
    }, 1000);
  }

  nextStep() {
    this.step.nextStep();
  }

  stop() {
    clearInterval(this.startOperation);
  }

  getStepStatus() {
    if (this.step.gameStatus === 'CLOSED') {
      this.stop();
      if (this.step.firstWarrior.healthPoints === 0) {
        this.battle.gameStatus = 'END';
        const resultBattle = winnerCheck({ winner: this.step.secondWarrior, looser: this.step.firstWarrior });
        this.battle = _.assign(this.battle, resultBattle);
        return this.battle;
      }
      this.battle.gameStatus = 'END';
      const resultBattle = winnerCheck({ winner: this.step.firstWarrior, looser: this.step.secondWarrior });
      this.battle = _.assign(this.battle, resultBattle);
      return this.battle;
    }
    if (this.step.firstWarrior.status !== 'UNCHANGED' || this.step.secondWarrior.status !== 'UNCHANGED') {
      this.battle.steps.push(_.cloneDeep(this.step.getSteps()));
      return this.battle;
    }
  }
}

const winnerCheck = ({ winner, looser }) => ({
  winner: {
    playerID: winner.playerID,
    cryptoName: winner.widgetName,
  },
  looser: {
    playerID: looser.playerID,
    cryptoName: looser.widgetName,
  },
});


module.exports = GameProcess;
