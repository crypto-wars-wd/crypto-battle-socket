const _ = require('lodash');

exports.hit = (cryptoName) => {
  const message = _.concat(battleMessages.common.singleAttack, battleMessages[`${cryptoName}`].singleAttack);
  return _.sample(message);
};
exports.getHit = () => _.sample(battleMessages.common.getHit);
exports.starter = () => _.sample(battleMessages.common.starter);
exports.finisher = () => _.sample(battleMessages.common.finisher);

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
    starter: ['BTC starter'],
    singleAttack: ['Наносит неожиданный удар копьем в голову'],
    finisher: ['BTC finisher'],
  },
  BAT: {
    starter: ['BAT starter'],
    singleAttack: ['Достает двойные мечи и молниеносно бьет по ногам'],
    finisher: ['BAT finisher'],
  },
  BCH: {
    starter: ['BCH starter'],
    singleAttack: ['Распахнув крылья в полете, быстрым движением бьет противника по руке'],
    finisher: ['BCH finisher'],
  },
  DASH: {
    starter: ['DASH starter'],
    singleAttack: ['Точным выстрелом попадает в плечо соперника'],
    finisher: ['DASH finisher'],
  },
  EOS: {
    starter: ['EOS starter'],
    singleAttack: ['Раскручивая булаву, бьет сильнейшим ударом по земле и отбрасывает противника'],
    finisher: ['EOS finisher'],
  },
  ETH: {
    starter: ['ETH starter'],
    singleAttack: ['Натягивая тетиву твердой рукой, резко выстрелил точно в ребро, куда и планировал'],
    finisher: ['ETH finisher'],
  },
  LTC: {
    starter: ['LTC starter'],
    singleAttack: ['Подскочил на коне, нанеся урон копытом по голове'],
    finisher: ['LTC finisher'],
  },
  NEO: {
    starter: ['NEO starter'],
    singleAttack: ['В состоянии безумия начала очень быстро рубить топором, тем самым нанося не смертельные но болезненные раны противнику'],
    finisher: ['NEO finisher'],
  },
  WAVES: {
    starter: ['WAVES starter'],
    singleAttack: ['Бездумно несясь на стоящего противника, сбивает его с ног'],
    finisher: ['WAVES finisher'],
  },
  XMR: {
    starter: ['XMR starter'],
    singleAttack: [' singleAttack'],
    finisher: ['XMR finisher'],
  },
  ZEC: {
    starter: ['ZEC starter'],
    singleAttack: ['Блокируя удар противника щитом и резко отталкиваясь от земли ногами, наносит апперкот прикладом меча в бороду'],
    finisher: ['ZEC finisher'],
  },
  XRP: {
    starter: ['XRP starter'],
    singleAttack: ['очень ловко метнула свой удлиненный кинжал и не промахнулась'],
    finisher: ['XRP finisher'],
  },
  ZRX: {
    starter: ['ZRX starter'],
    singleAttack: ['грациозно виляя плащом, начала кружиться с двумя клинками словно юла не оставив и шанса заблокировать свой удар'],
    finisher: ['ZRX finisher'],
  },
};
