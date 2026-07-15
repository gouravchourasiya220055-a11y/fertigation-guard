export const CROP_PRESETS = [
  { id: 'tomato', name: 'Tomato', targetPh: 6.2, targetEc: 2.3, phTolerance: 0.2, ecTolerance: 0.15, flushSec: 20, doseDelayMs: 10000 },
  { id: 'chilli', name: 'Chilli', targetPh: 6.0, targetEc: 2.0, phTolerance: 0.2, ecTolerance: 0.15, flushSec: 20, doseDelayMs: 10000 },
  { id: 'capsicum', name: 'Capsicum', targetPh: 6.0, targetEc: 2.2, phTolerance: 0.2, ecTolerance: 0.15, flushSec: 20, doseDelayMs: 10000 },
  { id: 'cucumber', name: 'Cucumber', targetPh: 6.0, targetEc: 1.8, phTolerance: 0.2, ecTolerance: 0.15, flushSec: 25, doseDelayMs: 10000 },
  { id: 'strawberry', name: 'Strawberry', targetPh: 5.8, targetEc: 1.2, phTolerance: 0.2, ecTolerance: 0.1, flushSec: 20, doseDelayMs: 8000 },
  { id: 'rose', name: 'Rose', targetPh: 6.2, targetEc: 1.5, phTolerance: 0.2, ecTolerance: 0.1, flushSec: 20, doseDelayMs: 10000 },
  { id: 'lettuce', name: 'Lettuce', targetPh: 6.0, targetEc: 1.2, phTolerance: 0.2, ecTolerance: 0.1, flushSec: 15, doseDelayMs: 8000 },
  { id: 'spinach', name: 'Spinach', targetPh: 6.5, targetEc: 1.8, phTolerance: 0.2, ecTolerance: 0.15, flushSec: 20, doseDelayMs: 10000 },
  { id: 'onion', name: 'Onion', targetPh: 6.2, targetEc: 1.6, phTolerance: 0.2, ecTolerance: 0.15, flushSec: 20, doseDelayMs: 10000 },
  { id: 'potato', name: 'Potato', targetPh: 5.5, targetEc: 2.0, phTolerance: 0.2, ecTolerance: 0.15, flushSec: 25, doseDelayMs: 10000 },
];

export function findCrop(idOrName) {
  const key = String(idOrName).toLowerCase();
  return CROP_PRESETS.find(
    (c) => c.id === key || c.name.toLowerCase() === key
  );
}
