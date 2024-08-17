import Form from "@/components/Form";
import { View } from "react-native";
import { Card, Text, TextInput, Button } from 'react-native-paper';

export default function Index() {
  return (
    <View >
      
      <Text style={{alignSelf:"center", fontSize: 24, fontWeight: "bold", marginTop: 90 }}>
        Informações sobre a Nota
      </Text>

      <Form/>
    </View>
  );
}
