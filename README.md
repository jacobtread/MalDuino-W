# 🛠 Malduino W+
(Malduino Wireless+)

This is a fork of the original Malduino W code which is a fork of the wifi bad usb code. This fork aims to improve the website used to control the malduino w

## ⌚️ Current State

Currently this  is incomplete and not ready for proper use however much of the underlying web code is already implemented

## 🧳 Changes

- The website is built using a web framework [Svelte](https://kit.svelte.dev/) this was chosen because its lightweight and very easy to use 🚴
- 👓 Automatic build tooling for the esp8266 using arduino cli, npm, and javascript


## 🦾 Commands

All the following commands depend on ``yarn`` because this is my package manager of choice. If you would like to use another package manager you can modify the package.json and replace ``yarn`` for ``npm run ``. The following commands are run using ``yarn ${the_command}``

| Command           | Details                                                                             |
|-------------------|-------------------------------------------------------------------------------------|
| dev               | Runs the svelte dev server to preview the website                                   |
| upload            | Builds and uploads the svelte website and esp8266 binary                            |
| upload:no-build   | Uploads the existing esp8266 binary without building                                |
| build:web         | builds the svelte website source                                                    |
| build:web:convert | Builds the svelte website and runs webconverter.js to convert it to for the esp8266 |
| build:esp         | Uses the arduino-cli to compile the binary for the sp8266                           |
| build             | builds the esp8266 and the svelte website                                           |


## 🏌️‍♀️ Setting up arduino-cli for easier builds

The following is not required you can instead use the Arduino IDE to build I just perfer to use this so that I can  
quickly and easily build from within my IDE

1) if you dont already have it installed go and install it from https://arduino.github.io/arduino-cli/0.20/installation/
2) If you haven't already created a config initialize one with ```arduino-cli config init```
3) Add the following url into the additional_urls section in your config file ```https://raw.githubusercontent.com/SpacehuhnTech/arduino/main/package_spacehuhn_index.json```
4) Run the following command to update download the new index ```arduino-cli core update-index```
5) Install the esp2866 core with ```arduino-cli core install wifiduck:esp8266``` if you have a different chipset then change it to match yours you can  
   find them using ```arduino-cli core search```
6) Run ```yarn build``` or ```arduino-cli compile --fqbn wifiduck:esp8266:malduinow```