export const mockApiResponses = (req, res, next) => {
  if (process.env.DEMO_MODE !== 'true') return next();

  if (req.method === 'GET') {
    if (req.originalUrl.includes('/api/farms')) {
      return res.status(200).json({
        success: true,
        data: [
          {
            _id: "demo-farm-1",
            name: "Demo Farm",
            crop: "Tomato",
            area: 12.5,
            areaUnit: "Acre",
            plantCount: 1500,
            location: "Demo City",
            dailyWaterReq: 500,
            targetPh: 6.2,
            targetEc: 1.8,
            gpsLocation: { lat: 34.05, lng: -118.24 }
          }
        ]
      });
    }

    if (req.originalUrl.includes('/api/sensors/latest')) {
       return res.status(200).json({
         success: true,
         data: {
            temperature: 24.5,
            soilMoisture: 65,
            ph: 6.2,
            ec: 1.8,
            waterTank: 80,
            relay: { pump: true, fertilizer: false, stirrer: false, flush: false }
         }
       });
    }

    if (req.originalUrl.includes('/api/relays')) {
       return res.status(200).json({
         success: true,
         data: { waterPump: true, peristalticPump: false, stirrer: false, flushValve: false }
       });
    }

    if (req.originalUrl.includes('/api/weather')) {
       return res.status(200).json({
         success: true,
         data: { temperature: 26, humidity: 55, windSpeed: 12 }
       });
    }
  }

  // Fallback for all other requests to proceed to their actual routes
  return next();
};
