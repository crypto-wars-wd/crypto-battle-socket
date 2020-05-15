exports.getHit = (victim) => `Игрок ${victim} ${getHitMessages[random(0, getHitMessages.length)]} `;

exports.hit = (kicker, victim) => `Игрок ${kicker} ${hitMessages[random(0, hitMessages.length)]} ${victim} `;


const getHitMessages = [
  'получил по голове',
  'офигел от всего происходящего',
  'вообще присел',
];

const hitMessages = [
  'дал пяткой в глаз',
  'унизил',
];

const random = (min, max) => Math.floor(min + Math.random() * (max - min));
