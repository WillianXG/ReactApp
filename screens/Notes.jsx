import Form from "@/components/Form";
import { View } from "react-native";
import { Card, Text, TextInput, Button } from 'react-native-paper';
import Appsa, {FetchData } from '@/components/CardsList'
import App from "@/app";

export default function Index() {
  return (
    <View >
      
      <Text style={{alignSelf:"center", fontSize: 24, fontWeight: "bold" }}>
        Aqui fica as Notas
      </Text>
      <Appsa/>
    </View>
  );
}
