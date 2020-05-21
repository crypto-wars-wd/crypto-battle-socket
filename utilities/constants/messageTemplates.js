const _ = require('lodash');

exports.getHit = (victim) => `Игрок ${victim} ${_.sample(getHitMessages)} `;

exports.hit = (kicker, victim) => `Игрок ${kicker} ${_.sample(hitMessages)} ${victim} `;

const getHitMessages = [
  'получил по голове',
  'офигел от всего происходящего',
  'вообще присел',
];

const hitMessages = [
  'дал пяткой в глаз',
  'унизил',
];
