#define SOIL 34
#define PH 35
#define TDS 32

void setup() {
  Serial.begin(115200);
}

void loop() {

  Serial.print("Soil=");
  Serial.print(analogRead(SOIL));

  Serial.print("  pH=");
  Serial.print(analogRead(PH));

  Serial.print("  TDS=");
  Serial.println(analogRead(TDS));

  delay(1000);
}