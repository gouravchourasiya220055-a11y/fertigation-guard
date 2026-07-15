#include "display.h"
#include "config.h"
#include <Wire.h>
#include <stdio.h>
#include <LiquidCrystal_I2C.h>

static LiquidCrystal_I2C lcd(LCD_ADDR, LCD_COLS, LCD_ROWS);

void displayInit() {
  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("FERTIGATION GUARD");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
}

void displayUpdate(const SystemStatus& s) {
  lcd.setCursor(0, 0);
  lcd.print("FERTIGATION GUARD");
  lcd.print("   ");

  char buf[21];
  lcd.setCursor(0, 1);
  snprintf(buf, sizeof(buf), "pH : %.2f      ", s.sensors.ph);
  lcd.print(buf);

  lcd.setCursor(0, 2);
  snprintf(buf, sizeof(buf), "EC : %.2f      ", s.sensors.ec);
  lcd.print(buf);

  lcd.setCursor(0, 3);
  lcd.print("Mode:");
  lcd.print(modeToString(s.mode));
  lcd.print(" ");
  lcd.print(s.crop.name);
  lcd.print("    ");

  // Second screen cycle on row 3 alternate — show flush + phase via brief overlay
  static unsigned long lastFlip = 0;
  if (millis() - lastFlip > 4000) {
    lastFlip = millis();
    lcd.setCursor(0, 3);
    snprintf(buf, sizeof(buf), "Flush:%s %s   ",
      s.relays.flushValve ? "ON " : "OFF",
      phaseToString(s.phase));
    lcd.print(buf);
  }
}
