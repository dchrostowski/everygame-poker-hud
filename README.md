# Heads Up Display for everygame.eu Online Poker ###

## Privacy Disclaimer
This software logs every aspect of your poker game including your dealt cards.  This data is stored in a database and cannot be deleted.  You acknowledge and agree that you have no expectation of privacy while using this software.

## Video
Click or tap the image below to see the HUD working in action.<br/>
[![IMAGE YouTube](https://img.youtube.com/vi/0H_7ni6yq-Y/0.jpg)](https://www.youtube.com/watch?v=0H_7ni6yq-Y)
## Installation
[Download a zipped copy of this repository](https://github.com/dchrostowski/everygame-poker-hud/archive/refs/heads/master.zip) and open Google Chrome.  Go to Settings -> Extensions and toggle on Developer mode.  Click on Load unpacked and then browse to the root directory of this repository. After installing the Chrome extension proceed to https://poker.evergame.eu.  Click on INSTANT PLAY to play from your browser and login on the next screen. Join either a cash game or tournament and the HUD should pop up on the screen at the conclusion of the current hand.

*Note: this browser extension cannot be listed on the Chrome Web Store because it violates Google's policy of not including extensions that "facilitate gambling".  I would aruge that poker is much more a game of skill than a game of chance, so I don't think labelling it as a gambling game is always appropriate.  Unfortunately I haven't been able to get Google to see it my way.*

## How It Works
When you install this browser extension and observe or play at a table on [poker.everygame.eu](https://poker.everygame.eu), a script from the browser extension is injected into the poker site.  This script proceeds to listen in on a websocket connection for the table initialized by the user when he/she opened the table.  This effectively allows the script to watch and record all of the players, their actions, position, chipstack, and cards (if they don't muck) among other details.  It will continue recording hands as long as a player is present at a table, even if he/she stops playing.  At the conclusion of each hand, the hand data is finalized and sent via an API call to a back-end. The back-end then processes the hand and stores it permanently in a database.  This database continuously accumulates poker hand data.  When a new hand starts, another API call is made which re-calculates the HUD stats on-the-fly and re-renders them to the player table on the HUD interface.

## Basic Usage
When entering a cash table, you should notice the HUD interface spawn in the top left-hand corner with nothing populated.  Once the next hand begins a list of players and numbers should populate.  If sitting on the left-hand side of the table, the HUD should automatically reposition itself over to the right unless the user has already repositioned it.  When switching to other tables, the HUD for the last table will disappear after a few moments and a new HUD for the current table will appear.

### Minimizing/Maximizing
The HUD interface can be changed to two different minimized states.  This is particularly helpful if playing on a small monitor or on mobile.  Tapping the [-] button at the top left corner of the HUD will collapse the player stat table.  Tapping the [+] on the header will re-expand the player list.  Tapping the < button on the upper right corner of the HUD will reduce the HUD to a small block. This can be helpful if the HUD is obstructinmg the view of the game.

### Repositioning
The HUD can easily be repositioned by simply dragging and dropping with a mouse cursor (drag and drop does not work on mobile)

### Displaying Folded Players' Stats
By default, the HUD will remove players from the stat table as they are eliminated from the hand.  This was done with screen real estate in mind.  To retain and see these players' stats, simply check the `Show Folded` checkbox in the bottom left of the HUD

### AutoFold
If the `Auto-Fold Bad Hands Preflop` box is checked, this will automatically fold your hand (preflop only) per the advice located above the player table.  The preflop advice is preprogrammed in to the HUD and follows the preflop ranges listed at https://pokertrainer.se. 

### Opacity Slider
The opacity slider is located at the bottom right-hand corner of the HUD.  Swiping it to the left makes the HUD more transparent allowing you to see through it when playing on a screen with limited size.

## Statistics
The HUD calculates fairly common statistics for each player at the table and include a hand sample size (**Hands**), *voluntary-put-into-pot* (**VPIP**), *pre-flop-raise* (**PFR**), preflop *three-bet* (**3BET**), **won-when-saw-flop** (**WWSF**), *went-to-showdown*, (**WTSD**), *won-at-showdown* (**WSD**), and *aggression* (**AG**) These stats are accumulated communally by all players using the browser extension.  For information on what each of these statistics are and how they should be used, please see https://upswingpoker.com/poker-hud-stats/.

## Future Devleopment
I do intend to include additional statistics in later releases.  Please create an issue [here](https://github.com/dchrostowski/everygame-poker-hud/issues) to request new statistic you'd like included and I will attempt to implement it as time permits.


### Limitation of Liability
The use of the platform or any related application is conducted at your own risk. The Platform is provided on an “as is” and “as available” basis. To the fullest extent possible under applicable law, the Developer gives no warranty, express or implied, as to the quality, content and availability or fitness for a specific purpose of the platform. In no event shall the Developer, its affiliates, officers, directors, employees, licensees or any third parties be liable for any direct, indirect, incidental, special or consequential damages (including but not limited to any loss of data, service interruption, computer failure or pecuniary loss) arising out of the use of or inability to use the Platform. Any unauthorized use of protected material within the content, which would constitute an infringement of third party rights is strictly prohibited. You do declare that you indemnify, keep harmless from any third party claim or demand the Developer, its subsidiaries, affiliates, successors, and assigns, and their respective employees, agents, directors, officers and/or shareholders for any liability from the unauthorised use of copyrighted material and fully pay on their behalf or reimburse them any and all direct and indirect damages they may suffer.

### Reporting Bugs / Problems
This Chrome extension has not been thoroughly tested.  Please submit issues here:
https://github.com/dchrostowski/everygame-poker-hud/issues

