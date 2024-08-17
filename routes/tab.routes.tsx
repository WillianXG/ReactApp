import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/Home";
import Notes from "../screens/Notes";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabRoutes(){
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Adiconar nota" component={Home} options={{tabBarIcon: ({color}) => <Feather name="plus" size={24} color={color} />}} />
            <Tab.Screen name="Notas Enviadas" component={Notes} options={{tabBarIcon: ({color}) => <Feather name="book" size={24} color={color} />}} />
        </Tab.Navigator>
    )
}