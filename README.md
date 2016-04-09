# BattleGum Turbo Tunnel

This game is insipired by the infamous NES game called BattleToads, which had it's 3rd level, Turbo Tunnel, known as one of the most frustrating and difficult levels in gaming history.
It's a 2d racing game, similar to the infinite runners, but limited in gameplay, so yeah, you can beat it, with enough skill.
Game engine used is http://phaser.io as the game is meant to tbe played from the browser.

## Objective

Avoid all the obstacles and reach level 100. Sounds easy, right? Too bad you are a speeding maniac having a death wish today.

## Game Design

### Asset Loader

All the assets will get preloaded when the game starts.
The on-screen loaded will be a bit of a joke, simulating the boot of old arcade cabinets, checking components progress happens.

CPU OK
RAM OK
DISK OK
SOUND OK
GUMBLE OK

### Main Menu

Here we'll have a big Gumble head staring at us and blinking, with some informative "Press Spacebar" text being displayed under.

### Gameplay

You are controling Gumble, from the [Ancient Beast](https://AncientBeast.com) game project, while riding through the Gummy Turbo Tunnel.
You start out with a single life, gaining an extra one every 20 levels, when you'll enter a harder difficulty threshold as well.
The level is semi-randomly generated based on a set of rules, if you are a higher level you'll encounter more types of obstacles.
You'll have to avoid crashing into all sorts of walls made out of hard checking gum and pass over any holes in the stick gum road.

### Game Over

If you die and still have remaining lives, you get respawned from the last threshold, with a bit of empty space ahead to warm up.
This means that difficulty thresholds also act as checkpoints for the game, so you'll get set-back if you die before reaching one.
When you do reach a threshold, a colored gummy worm will appear in the background, making the checkpoint but also distracting you.
No lives and the "game over" menu will be displayed, showing Gumble in a very bad shape for a few seconds, then the main menu again.

### Winning Screen

An artwork of Gumble being victorious on his vehicle will be displayed, with text on screen "YOU WON!", also showing remaining lives.

## Controls

**Keyboard**
Up arrow or W to move up
Down arrow or S to move down
Spacebar to jump obstacles

**Touchscreen**
On left side, scroll up and down to move.
On right side, tap to jump over obstacles.

## License

Artwork: [CC-By-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0)
Code: [AGPL 3.0](http://www.gnu.org/licenses/agpl-3.0.html)
