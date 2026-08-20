import { Alert, NativeModules, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { CONFIG } from '../config';

const { DirectSms } = NativeModules;

async function requestPermissions() {
  if (Platform.OS !== 'android') {
    Alert.alert(
      'Not Supported',
      'Automatic SMS sending is only available on Android in this app.'
    );
    return false;
  }

  // Check if our native module is available (it won't be on iOS or if build failed)
  if (!DirectSms) {
    Alert.alert(
      'SOS Module Not Available',
      'The SMS module failed to load. Please rebuild the app.'
    );
    return false;
  }

  const locationGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message: 'Fetal Care AI needs your location to send it during an SOS alert.',
      buttonPositive: 'Allow',
    }
  );

  const smsGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
    {
      title: 'SMS Permission',
      message: 'Fetal Care AI needs SMS permission to automatically alert your emergency contact.',
      buttonPositive: 'Allow',
    }
  );

  return (
    locationGranted === PermissionsAndroid.RESULTS.GRANTED &&
    smsGranted === PermissionsAndroid.RESULTS.GRANTED
  );
}

// Prevents spamming multiple SMS if sos stays true across several polls
let lastSosSentAt = 0;
const SOS_RESEND_COOLDOWN_MS = 60000; // don't resend within 60s of the last send

async function sendSMS(contactNumber, message) {
  try {
    await DirectSms.send(contactNumber, message);
    console.log('SOS SMS sent successfully to:', contactNumber);
    lastSosSentAt = Date.now();
    Alert.alert('SOS Sent ✅', 'Emergency SMS sent to your emergency contact.');
  } catch (err) {
    console.log('SMS send FAILED:', err);
    Alert.alert(
      'SOS SMS Failed',
      'Could not send SMS automatically. Reason: ' + (err?.message ?? JSON.stringify(err))
    );
  }
}

export async function triggerSOSLocationAlert(emergencyContactOverride) {
  const contactNumber = (emergencyContactOverride || CONFIG.EMERGENCY_CONTACT_NUMBER || '').trim();
  console.log('SOS triggered. Contact number:', contactNumber);

  if (!contactNumber) {
    Alert.alert(
      'No Emergency Contact',
      'Please set an emergency contact number in Settings before using SOS.'
    );
    return;
  }

  const now = Date.now();
  if (now - lastSosSentAt < SOS_RESEND_COOLDOWN_MS) {
    console.log('SOS skipped - cooldown active');
    return;
  }

  const hasPermission = await requestPermissions();
  console.log('Permissions granted?', hasPermission);

  if (!hasPermission) {
    Alert.alert(
      'Permissions Needed',
      'Cannot send automatic SOS alert without location and SMS permissions.\n\nPlease grant them in your device Settings.'
    );
    return;
  }

  Geolocation.getCurrentPosition(
    (position) => {
      console.log('Got location:', position.coords);
      const { latitude, longitude } = position.coords;
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

      const message =
        `SOS ALERT from Fetal Care AI Belt.\n` +
        `The wearer has pressed the emergency button.\n` +
        `Current location: ${mapsLink}`;

      sendSMS(contactNumber, message);
    },
    (error) => {
      console.log('Location FAILED. Reason:', error);
      // Fallback: Still send the SMS but indicate location was unavailable
      const fallbackMessage =
        `SOS ALERT from Fetal Care AI Belt.\n` +
        `The wearer has pressed the emergency button.\n` +
        `(Location temporarily unavailable)`;

      sendSMS(contactNumber, fallbackMessage);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}
