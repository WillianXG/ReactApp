// NotificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// Função para solicitar permissões e obter o token de notificação
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Falha', 'Permissão para notificações não concedida!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

// Função para enviar uma notificação
export const sendPushNotification = async (expoPushToken: string, message: string) => {
  const messageBody = {
    to: expoPushToken,
    sound: 'default',
    title: 'Nova Nota Enviada',
    body: message,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageBody),
  });
};
