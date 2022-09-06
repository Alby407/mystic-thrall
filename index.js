'use strict';

/**
 * Creates a skill object with the given skill ID and the location of the player.
 *
 * @param skill_id - The skill ID.
 * @param player_location - The location of the player.
 *
 * @return _ A skill object.
 */
function create_skill(skill_id, player_location) {
  return {
    skill: {
      id: skill_id,
      reserved: 0,
      nps: false,
      type: 1,
      huntingZoneId: 0,
    },
    w: player_location.w,
    loc: player_location.loc,
    dest: player_location.dest,
    unk: true,
    moving: false,
    continue: false,
    target: 0,
    unk2: false,
  };
}

/**
 * Buffs the player after a given amount of delay in milliseconds.
 * @param mod - The mod.
 * @param player_location - The location of the player.
 * @param delay - The delay in milliseconds.
 * @param skill_id - The skill ID.
 * @param job - The job of the player.
 */
function buff(mod, player_location, delay, skill_id, job) {
  if (job === 7) {
    setTimeout(() => {
      if (mod.settings.thrall) {
        mod.send('C_START_KILL', 7, create_skill(skill_id, player_location));
      }
    }, delay);
  }
}

module.exports = function Thrall(mod) {
  mod.command.add('t', (arg) => {
    if (arg === 'on') {
      mod.settings.thrall = true;
      mod.command.message('Thrall mode enabled ma cutie boo <3');
    } else if (arg === 'off') {
      mod.settings.thrall = false;
      mod.command.message('Thrall mode disabled ma super cutie boo <3');
    } else {
      mod.command.message(
        `Thrall mode is ${mod.settings.thrall ? 'enabled' : 'disabled'}`
      );
    }
  });

  let job;
  mod.game.on('enter_game', () => {
    job = (mod.game.me.templateId - 10101) % 100;
  });

  let player_location = {};
  mod.hook('C_PLAYER_LOCATION', 5, (event) => {
    player_location.loc = event.loc;
    player_location.w = event.w;
  });

  const skill_id = 331700;
  buff(mod, player_location, 1000, skill_id, job);
};
