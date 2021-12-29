# MalDuino W Svelte

A Fork of the original MalDuino W code with an improved user interface using Svelte Kit along with various other misc
edits

## Setting up arduino-cli for easier builds

The following is not required you can instead use the Arduino IDE to build I just perfer to use this so that I can
quickly and easily build from within my IDE

1) if you dont already have it installed go and install it from https://arduino.github.io/arduino-cli/0.20/installation/
2) If you haven't already created a config initialize one with ```arduino-cli config init```
3) Add the following url into the additional_urls section in your config file ```https://raw.githubusercontent.com/SpacehuhnTech/arduino/main/package_spacehuhn_index.json```
4) Run the following command to update download the new index ```arduino-cli core update-index```
5) Install the esp2866 core with ```arduino-cli core install wifiduck:esp8266``` if you have a different chipset then change it to match yours you can
find them using ```arduino-cli core search```
6) Run ```yarn compile``` or ```arduino-cli compile --fqbn wifiduck:esp8266:malduinow```