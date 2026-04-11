import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
Notifications.setNotificationHandler({
handleNotification: async () => ({
shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true,
}),
})
export async function registerForPushNotifications(): Promise<string|null> {
if (!Device.isDevice) return null
const { status: existing } = await Notifications.getPermissionsAsync()
let final = existing
if (existing !== 'granted') {
const { status } = await Notifications.requestPermissionsAsync()
final = status
}
if (final !== 'granted') return null
if (Platform.OS==='android') {
await Notifications.setNotificationChannelAsync('default', {
name: 'Fidelio', importance: Notifications.AndroidImportance.MAX,
vibrationPattern: [0,250,250,250], lightColor: '#6C3DF4',
})
}
const token = await Notifications.getExpoPushTokenAsync({
projectId: Constants.expoConfig?.extra?.eas?.projectId,
})
return token.data
}