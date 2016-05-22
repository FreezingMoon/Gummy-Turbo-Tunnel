# Gummy Turbo Tunnel

[![Join the chat at https://gitter.im/FreezingMoon/Gummy-Turbo-Tunnel](https://badges.gitter.im/FreezingMoon/Gummy-Turbo-Tunnel.svg)](https://gitter.im/FreezingMoon/Gummy-Turbo-Tunnel?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This game is insipired by the infamous NES game called BattleToads, which had it's 3rd level, Turbo Tunnel, known as one of the most frustrating and difficult levels in gaming history. It's a 2d racing game, similar to the infinite runners, but limited game length wise so that you can beat it, with enough skill. You can play from the browser since we're using [Phaser](https://phaser.io) game engine.

## Objective

Avoid all the obstacles and reach level 100. Sounds easy, right? Too bad you are a speeding maniac having a death wish today.

## Game Design

### Main Menu

Here we'll have a big Gumble head staring at us and blinking, with hotkeys listen above and  "Press Start" text blinking below.

### Gameplay

You are controling Gumble, from the [Ancient Beast](https://AncientBeast.com) game project, while riding through the Gummy Turbo Tunnel.
The game has 5 zones, each containing 20 semi-randomly generated obstacles plus an extra life that you'll have to actually pick-up.
Each of the proceeding zones will have a higher difficulty level and you'll get to encouter more types of obstacles along the way.
You'll have to avoid crashing into all sorts of walls made out of hard checking gum and pass over any holes in the stick gum road.

#### Warm-Up Zone

Default distance between obstacles, 4 blinks when possible.

Normal walls randomly placed on top or bottom lanes (dodge).

Wide walls that can't be dodged are placed on the road (jump).

An extra life will be placed on the road on any lane (pick).

#### Green Checkpoint

Distance between obstacles is now 80% and only 3 blinks.

Wide walls can also be placed in mid-air (don't jump).

Small holes can now also appear, severing the road (jump).

The extra life can be placed mid-air on any lane now (pick).

#### Blue Checkpoint

Distance between obstacles is now 60% and only 2 blinks.

Ramps can randomly appear on any lane before large holes (follow).

Large holes where regular jump won't do anymore (take ramp).

The extra life can be placed right before an obstacle (pick).

#### Yellow Checkpoint

Distance between obstacles is now 40% and only 1 blink.

Normal walls can now be randomly placed on middle lane too (dodge).

Ramps can now randomly appear in mid-air as well on any 3 lanes (jump).

The extra life can be placed above or under wide walls now (pick).

#### Red Checkpoint

Distance between obstacles is now 20% and no blinks.

Short walls will get dropped on any 3 lanes (dodge or jump).

Slower speed moving traffic participants (dodge and maybe jump).

The extra life can be placed over small holes as well now (pick).

### Game Over

If you die and still have remaining lives, you get respawned from the last threshold, with a bit of empty space ahead to warm up.
This means that difficulty thresholds also act as checkpoints for the game, so you'll get set-back if you die before reaching one.
When you do reach a threshold, a colored gummy worm will appear in the background, making the checkpoint but also distracting you.
No lives and the "game over" menu will be displayed, showing Gumble in a very bad shape for a few seconds, then the main menu again.

### Winning Screen

An artwork of Gumble being victorious on his vehicle will be displayed, with text on screen "YOU WON!", also showing remaining lives.

## Controls

**Keyboard**<br>
Up arrow or W to move up<br>
Down arrow or S to move down<br>
Spacebar to jump obstacles

**Touchscreen**<br>
On left side, scroll up and down to move.<br>
On right side, tap to jump over obstacles.

## License

Artwork: [CC-BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0)<br>
Code: [AGPL 3.0](http://www.gnu.org/licenses/agpl-3.0.html)
