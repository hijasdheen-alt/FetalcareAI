import { useState, useEffect, useRef } from 'react';
import { logKick } from './dataService';
import { triggerSOSLocationAlert } from '../utils/sosHandler';
import { CONFIG } from '../config';

const POLL_INTERVAL_MS = 2000;

export function useEsp32(esp32Ip, userId, emergencyContact) {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const lastKnownKickCount = useRef(null); // null = not yet initialized
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!esp32Ip) return;

    const poll = async () => {
      try {
        const res = await fetch(`http://${esp32Ip}/data`);
        if (!res.ok) throw new Error('bad response');
        const json = await res.json();

        setData(json);
        setConnected(true);

        // Sync device-detected kicks into local storage, without double counting
        // on the very first poll (we only care about NEW kicks from here on).
        if (lastKnownKickCount.current === null) {
          lastKnownKickCount.current = json.kickCount;
        } else if (json.kickCount > lastKnownKickCount.current) {
          const newKicks = json.kickCount - lastKnownKickCount.current;
          lastKnownKickCount.current = json.kickCount;
          for (let i = 0; i < newKicks; i++) {
            try {
              await logKick(userId);
            } catch (err) {
              console.log('Save kick to local storage failed:', err.message);
            }
          }
        }

        if (json.sos) {
          triggerSOSLocationAlert(emergencyContact);
        }
      } catch (err) {
        setConnected(false);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [esp32Ip, userId]);

  return { data, connected };
}
