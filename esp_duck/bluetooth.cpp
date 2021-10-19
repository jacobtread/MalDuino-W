/*
   This software is licensed under the MIT License. See the license file for details.
   Source: https://github.com/spacehuhntech/WiFiDuck
 */

#include "bluetooth.h"

#include "config.h"
#include "debug.h"
#include "cli.h"
#include "settings.h"
#include "com.h"

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include <Arduino.h> // pinMode, digitalRead, ...

#ifdef BLUETOOTH_EN
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif
#endif

namespace bluetooth {
    // ===== PRIVATE ===== //
    bool _enabled { false };

    BLEServer *pServer = NULL;
    BLECharacteristic * pTxCharacteristic;
    bool deviceConnected { false };
    bool oldDeviceConnected { false };

    class MyServerCallbacks: public BLEServerCallbacks {
        void onConnect(BLEServer* pServer) {
          deviceConnected = true;
        };

        void onDisconnect(BLEServer* pServer) {
          deviceConnected = false;
        }
    };

    class MyCallbacks: public BLECharacteristicCallbacks {
        void onWrite(BLECharacteristic *pCharacteristic) {
          std::string rxValue = pCharacteristic->getValue();
          rxValue += '\n';

          if(isUpperCase(rxValue[0])) {
            com::send(rxValue.c_str(), rxValue.length());
          } else {
            cli::parse(rxValue.c_str(), send);
          }
        }
    };

    // ===== PUBLIC ===== //
    void begin() {
#ifdef BLUETOOTH_EN
      pinMode(BLUETOOTH_SWITCH, INPUT_PULLUP);
      _enabled = !digitalRead(BLUETOOTH_SWITCH);
#endif

      if(!_enabled) return;
      
      // Create the BLE Device
      BLEDevice::init(BLUETOOTH_NAME);

      // Create the BLE Server
      pServer = BLEDevice::createServer();
      pServer->setCallbacks(new MyServerCallbacks());

      // Create the BLE Service
      BLEService *pService = pServer->createService(BLUETOOTH_UUID);

      // Create a BLE Characteristic
      pTxCharacteristic = pService->createCharacteristic(
                        BLUETOOTH_UUID_TX,
                        BLECharacteristic::PROPERTY_NOTIFY
                      );
                          
      pTxCharacteristic->addDescriptor(new BLE2902());

      BLECharacteristic * pRxCharacteristic = pService->createCharacteristic(
                          BLUETOOTH_UUID_RX,
                          BLECharacteristic::PROPERTY_WRITE
                        );

      pRxCharacteristic->setCallbacks(new MyCallbacks());

      // Start the service
      pService->start();

      // Start advertising
      pServer->getAdvertising()->start();
      
      debugln("Bluetooth enabled");
    }

    void update() {
      if(_enabled) {
        if (deviceConnected) {
            /* pTxCharacteristic->setValue(&txValue, 1);
              pTxCharacteristic->notify();
              txValue++;
              delay(10); // bluetooth stack will go into congestion, if too many packets are sent*/
        }

        // disconnecting
        if (!deviceConnected && oldDeviceConnected) {
            delay(500); // give the bluetooth stack the chance to get things ready
            pServer->startAdvertising(); // restart advertising
            oldDeviceConnected = deviceConnected;
        }
        
        // connecting
        if (deviceConnected && !oldDeviceConnected) {
            // do stuff here on connecting
            oldDeviceConnected = deviceConnected;
        }
      }
    }

    void send(const char* str) {
      pTxCharacteristic->setValue((uint8_t*)str, strlen(str));
      pTxCharacteristic->notify();
    }

    bool enabled() {
      return _enabled;
    }
}
