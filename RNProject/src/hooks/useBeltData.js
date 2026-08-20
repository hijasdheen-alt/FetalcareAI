import { useState, useEffect, useRef } from 'react';
import { triggerSOSLocationAlert } from '../utils/sosHandler';
import {
  loadReadingHistory,
  saveReadingHistory,
  loadMoodLog,
  saveMoodLog,
  clearAllHistory,
} from '../utils/historyStorage';
import { CONFIG } from '../config';

const MAX_HISTORY_ENTRIES = 200;
const HISTORY_SAVE_THROTTLE_MS = 10000;

export function useBeltData(profile) {
  const [esp32Ip, setEsp32Ip] = useState(profile?.esp32Ip || CONFIG.ESP32_DEFAULT_IP);
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [readingHistory, setReadingHistory] = useState([]);
  const [moodLog, setMoodLog] = useState([]);

  const intervalRef = useRef(null);
  const lastHistorySaveRef = useRef(0);

  useEffect(() => {
    (async () => {
      const savedReadings = await loadReadingHistory();
      const savedMoods = await loadMoodLog();
      setReadingHistory(savedReadings);
      setMoodLog(savedMoods);
    })();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://${esp32Ip}/data`);
      if (!response.ok) throw new Error('Bad response');

      const json = await response.json();
      setData(json);
      setConnected(true);

      setReadingHistory((prev) => {
        const updated = [
          {
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            heartRate: json.fingerDetected ? json.heartRate : null,
            kickCount: json.kickCount,
            movement: json.movement,
          },
          ...prev,
        ].slice(0, MAX_HISTORY_ENTRIES);

        const now = Date.now();
        if (now - lastHistorySaveRef.current > HISTORY_SAVE_THROTTLE_MS) {
          lastHistorySaveRef.current = now;
          saveReadingHistory(updated);
        }

        return updated;
      });

      if (json.sos) {
        triggerSOSLocationAlert(profile?.emergencyContact);
      }
    } catch (err) {
      setConnected(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, CONFIG.POLL_INTERVAL_MS);
    return () => {
      clearInterval(intervalRef.current);
      saveReadingHistory(readingHistory);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esp32Ip]);

  const logMood = (entry) => {
    setMoodLog((prev) => {
      const updated = [entry, ...prev];
      saveMoodLog(updated);
      return updated;
    });
  };

  const clearHistory = async () => {
    setReadingHistory([]);
    setMoodLog([]);
    await clearAllHistory();
  };

  return {
    esp32Ip,
    setEsp32Ip,
    data,
    connected,
    readingHistory,
    moodLog,
    logMood,
    clearHistory,
    refetch: fetchData,
  };
}
