const _ = require('lodash');

exports.hit = (cryptoName) => {
  const message = _.concat(battleMessages.common.singleAttack, battleMessages[`${cryptoName}`].singleAttack);
  return _.sample(message);
};
exports.finisher = (cryptoName) => {
  const message = _.concat(battleMessages.common.finisher, battleMessages[`${cryptoName}`].finisher);
  return _.sample(message);
};
exports.starter = (cryptoName) => {
  const message = _.concat(battleMessages.common.starter, battleMessages[`${cryptoName}`].starter);
  return _.sample(message);
};
exports.getHit = () => _.sample(battleMessages.common.getHit);

const battleMessages = {
  common: {
    starter: [
      'Приветствую! Я заберу все твои деньги и жизнь!',
      'Зазвучал горн, воины пустились в смертельную схватку',
    ],
    singleAttack: [
      'Обрушивает на врага град быстрых ударов',
      'Бросает камень в лицо неприятелю ',
      'Наносит подкрадной удар в челюсть',
      'Наносит скользящий удар по ногам',
      'Легко парируя удар, наносит удар коленом',
      'С разгона ударяет двумя ногами в грудь',
      'Бьет ногой с разворота',
      'С яростным криком, отталкивает врага',
      'Удушает врага веревкой',
      'Быстро парируя, наносит удар ногой',
      'Наносит удар кулаком в нос',
      'Наступая, сбивает врага с ног подсечкой',
    ],
    getHit: [
      'пропустил удар',
    ],
    finisher: [
      'Зрители надолго запомнят этот бой, в трактирах еще долго обсуждали эту  битву',
      'Стервятникам сегодня будет чем поживиться, тишина воцарилась над полем боя',
      'Блистательное сражение, барды еще не раз воспоют о славе победителя',
      'Темные времена пришли в мир где царит такая жестокость, лишь спустя месяц дождь смыл следы крови с места сражения',
    ],
  },
  BTC: {
    starter: [],
    singleAttack: ['Наносит неожиданный удар копьем в голову'],
    finisher: [],
  },
  BAT: {
    starter: [],
    singleAttack: ['Достает двойные мечи и молниеносно бьет по ногам'],
    finisher: [],
  },
  BCH: {
    starter: [],
    singleAttack: ['Распахнув крылья в полете, быстрым движением бьет противника по руке'],
    finisher: [],
  },
  DASH: {
    starter: [],
    singleAttack: ['Точным выстрелом попадает в плечо соперника'],
    finisher: [],
  },
  EOS: {
    starter: [],
    singleAttack: ['Раскручивая булаву, бьет сильнейшим ударом по земле и отбрасывает противника'],
    finisher: [],
  },
  ETH: {
    starter: [],
    singleAttack: ['Натягивая тетиву твердой рукой, резко выстрелил точно в ребро, куда и планировал'],
    finisher: [],
  },
  LTC: {
    starter: [],
    singleAttack: ['Подскочил на коне, нанеся урон копытом по голове'],
    finisher: [],
  },
  NEO: {
    starter: [],
    singleAttack: ['В состоянии безумия начала очень быстро рубить топором, тем самым нанося не смертельные но болезненные раны противнику'],
    finisher: [],
  },
  WAVES: {
    starter: [],
    singleAttack: ['Бездумно несясь на стоящего противника, сбивает его с ног'],
    finisher: [],
  },
  XMR: {
    starter: [],
    singleAttack: ['Наносит неожиданный удар копьем в голову'],
    finisher: [],
  },
  ZEC: {
    starter: [],
    singleAttack: ['Блокируя удар противника щитом и резко отталкиваясь от земли ногами, наносит апперкот прикладом меча в бороду'],
    finisher: [],
  },
  XRP: {
    starter: [],
    singleAttack: ['очень ловко метнула свой удлиненный кинжал и не промахнулась'],
    finisher: [],
  },
  ZRX: {
    starter: [],
    singleAttack: ['грациозно виляя плащом, начала кружиться с двумя клинками словно юла не оставив и шанса заблокировать свой удар'],
    finisher: [],
  },
};
