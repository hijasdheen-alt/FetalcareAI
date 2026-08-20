import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import SmsAndroid from 'react-native-sms-android';
import { CONFIG } from '../config';

async function requestPermissions() {
  if (Platform.OS !== 'android') {
    Alert.alert(
      'Not Supported',
      'Automatic SMS sending is only available on Android in this app.'
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

export async function triggerSOSLocationAlert(emergencyContactOverride) {
  const contactNumber = emergencyContactOverride || CONFIG.EMERGENCY_CONTACT_NUMBER;
  console.log('SOS triggered. Contact number:', contactNumber);

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
      'Cannot send automatic SOS alert without location and SMS permissions.'
    );
    return;
  }

  const sendSMS = (msg) => {
    console.log('Attempting to send SMS to:', contactNumber);
    SmsAndroid.autoSend(
      contactNumber,
      msg,
      (fail) => {
        console.log('SMS send FAILED. Reason:', fail);
        Alert.alert('SOS SMS Failed', 'Reason: ' + JSON.stringify(fail));
      },
      (success) => {
        console.log('SMS sent successfully:', success);
        Alert.alert('SOS Sent', 'Emergency SMS sent to your contact.');
        lastSosSentAt = Date.now();
      }
    );
  };

  Geolocation.getCurrentPosition(
    (position) => {
      console.log('Got location:', position.coords);
      const { latitude, longitude } = position.coords;
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

      const message =
        `SOS ALERT from Fetal Care AI Belt.\n` +
        `The wearer has pressed the emergency button.\n` +
        `Current location: ${mapsLink}`;

      sendSMS(message);
    },
    (error) => {
      console.log('Location FAILED. Reason:', error);
      // Fallback: Still send the SMS but indicate location was unavailable
      const fallbackMessage =
        `SOS ALERT from Fetal Care AI Belt.\n` +
        `The wearer has pressed the emergency button.\n` +
        `(Location details were temporarily unavailable: ${error.message})`;

      sendSMS(fallbackMessage);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}
