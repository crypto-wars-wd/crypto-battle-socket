class Warrior {
  constructor({
    cryptoName, widgetCurrentPrice, playerID, healthPoints,
  }) {
    this.warrior = {
      cryptoName, status: 'UNCHANGED', price: widgetCurrentPrice, playerID, healthPoints,
    };
  }

  updatePrice({ widgetCurrentPrice }) {
    if (this.warrior.price === widgetCurrentPrice) this.warrior.status = 'UNCHANGED';
    if (this.warrior.price < widgetCurrentPrice) {
      this.warrior.status = 'UP';
      this.warrior.price = widgetCurrentPrice;
    } else if (this.warrior.price > widgetCurrentPrice) {
      this.warrior.status = 'DOWN';
      this.warrior.price = widgetCurrentPrice;
    }
  }

  getStatus() {
    return this.warrior;
  }
}

module.exports = Warrior;
