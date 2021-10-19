/*
   This software is licensed under the MIT License. See the license file for details.
   Source: https://github.com/spacehuhntech/WiFiDuck
 */

#include "spiffs.h"

#include "config.h"
#include "debug.h"

namespace spiffs {
    File streamFile;

    // ===== PRIVATE ===== //
    void fixPath(String& path) {
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
    }

    // ===== PUBLIC ====== //
    void begin() {
        debug("Initializing SPIFFS...");
        SPIFFS.begin();
        debugln("OK");

        String FILE_NAME = "/startup_spiffs_test";

        remove(FILE_NAME);
        create(FILE_NAME);
        File f = open(FILE_NAME, "r");
        if (!f) {
            format();
        } else {
            f.close();
            remove(FILE_NAME);
        }
    }

    void format() {
        debug("Formatting SPIFFS...");
        SPIFFS.format();
        debugln("OK");
    }

    size_t size() {
        return SPIFFS.totalBytes();
    }

    size_t usedBytes() {
        return SPIFFS.usedBytes();
    }

    size_t freeBytes() {
        return SPIFFS.totalBytes() - SPIFFS.usedBytes();
    }

    size_t size(String fileName) {
        fixPath(fileName);

        File f = SPIFFS.open(fileName, "r");

        return f.size();
    }

    bool exists(String fileName) {
        return SPIFFS.exists(fileName);
    }

    File open(String fileName, const char* mode) {
        fixPath(fileName);

        return SPIFFS.open(fileName, mode);
    }

    void create(String fileName) {
        fixPath(fileName);

        File f = SPIFFS.open(fileName, "a+");

        f.close();
    }

    void remove(String fileName) {
        fixPath(fileName);

        SPIFFS.remove(fileName);
    }

    void rename(String oldName, String newName) {
        fixPath(oldName);
        fixPath(newName);

        SPIFFS.rename(oldName, newName);
    }

    void write(String fileName, const char* str) {
        File f = open(fileName, "w");

        if (f) {
            f.println(str);
            f.close();
            debugln("Wrote file");
        } else {
            debugln("File error");
        }
    }

    void write(String fileName, const uint8_t* buf, size_t len) {
        File f = open(fileName, "w");

        if (f) {
            f.write(buf, len);
            f.close();
            debugln("Wrote file");
        } else {
            debugln("File error");
        }
    }

    String listDir(String dirName) {
        String res;

        fixPath(dirName);

        File root = SPIFFS.open(dirName);
        
        if(!root) return "\n";
        if(!root.isDirectory()) return "\n";
    
        File file = root.openNextFile();
        while(file){
            res += '/';
            res += file.name();
            res += ' ';
            res += file.size();
            res += '\n';
            file = root.openNextFile();
        }
        
        if (res.length() == 0) {
            res += "\n";
        }

        return res;
    }

    void streamOpen(String fileName, const char* mode) {
        streamClose();
        streamFile = open(fileName, mode);
        if (!streamFile) debugln("ERROR: No stream file open");
    }

    void streamWrite(const char* buf, size_t len) {
        if (streamFile) streamFile.write((uint8_t*)buf, len);
        else debugln("ERROR: No stream file open");
    }

    size_t streamRead(char* buf, size_t len) {
        if (streamFile) {
            size_t i;

            for (i = 0; i<len; ++i) {
                if (!streamFile.available() || (i == len-1)) {
                    buf[i] = '\0';
                    break;
                } else {
                    buf[i] = streamFile.read();
                }
            }

            return i;
        } else {
            debugln("ERROR: No stream file open");
            return 0;
        }
    }

    size_t streamReadUntil(char* buf, char delimiter, size_t max_len) {
        if (streamFile) {
            size_t i;
            char   c = 'x';

            for (i = 0; i<max_len; ++i) {
                if ((c == delimiter) || !streamFile.available() || (i == max_len-1)) {
                    buf[i] = '\0';
                    break;
                } else {
                    c      = streamFile.read();
                    buf[i] = c;
                }
            }

            return i;
        } else {
            debugln("ERROR: No stream file open");
            return 0;
        }
    }

    void streamClose() {
        streamFile.close();
    }

    bool streaming() {
        return streamFile;
    }

    size_t streamAvailable() {
        if (!streamFile) return 0;
        return streamFile.available();
    }
}
