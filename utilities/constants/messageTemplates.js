const _ = require('lodash');

exports.getHit = () => _.sample(getHitMessages);

exports.hit = () => _.sample(hitMessages);

const getHitMessages = [
  'получил по голове',
  'пропустил удар',
  'вообще присел',
];

const hitMessages = [
  'дал пяткой в глаз',
  'морально задавил соперника',
  'бросил ядовитый дротик',
];
