#include <EEPROM.h>
#include <FS.h>

/*
  Upload this sketch to your ESP8266 to erase 
  - all data in the EEPROM (Application settings)
  - WiFi credentials (SSID, password)

  Also overwrites the previous program with this one
*/

void setup() {
  Serial.begin(115200);

  Serial.println();
  Serial.println("STARTING...");
  
  EEPROM.begin(4096);
  Serial.println("EEPROM initialized");
  
  for (int i = 0; i < 4096; ++i){
    EEPROM.write(i,0x00);
  }

  EEPROM.commit();

  Serial.println("EEPROM cleaned");
  
  ESP.eraseConfig();

  Serial.println("WiFi credentials erased");

  Serial.println("DONE!");
}

void loop() {
  
}