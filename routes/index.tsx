import { NavigationContainer } from "@react-navigation/native";
import TabRoutes from "./tab.routes";

export default function Routes(){
    return(
        <NavigationContainer independent={true}>
            <TabRoutes/>
        </NavigationContainer>
    )
}