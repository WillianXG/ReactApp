import { View } from "react-native";
import { Card, Text, TextInput, Button } from 'react-native-paper';

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ backgroundColor: 'white'}}>
        <Card.Content style={{ width: 300, margin: 10, gap: 10}}>
        <Text variant="titleLarge">Login</Text>
        <TextInput style={{ backgroundColor: 'lightgray' }} label="Usuário" mode="outlined"/>
        <TextInput style={{ backgroundColor: 'lightgray'}} label="Password" secureTextEntry right={<TextInput.Icon icon="eye" />} />
        <Button style={{ marginTop: 10, backgroundColor: 'grey' }} mode="contained" onPress={() => console.log('Apertouuu')}> Conectar-se</Button>
        </Card.Content>
      </Card>
    </View>
  );
}
