import { PermissionsAndroid, Platform } from 'react-native';

export async function requestAllPermissions() {
  if (Platform.OS !== 'android') return;

  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
  ]);
  // We don't hard-block on the result here - sosHandler re-checks/requests
  // again if needed when an actual SOS fires, as a safety net.
}
