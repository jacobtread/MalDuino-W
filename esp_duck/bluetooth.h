/*
   This software is licensed under the MIT License. See the license file for details.
   Source: https://github.com/spacehuhntech/WiFiDuck
 */

#pragma once

namespace bluetooth {
    void begin();
    void update();
    void send(const char* str);

    bool enabled();
}