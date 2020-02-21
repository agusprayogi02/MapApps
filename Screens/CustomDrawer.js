import { SafeAreaView } from "react-native-safe-area-view";
import { DrawerItems } from "react-navigation-drawer";
import { ScrollView } from "react-native-gesture-handler";
import {
    StyleSheet, Text, View
} from 'react-native'

import { useContext } from 'react'

const CustomDrawer = props => {
    const { blue, setBlue } = useContext(BlueContext);
    const textColor = blue ? 'blue' : 'red';
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32 }}>Drawer</Text>
            <Text
                onPress={() => {
                    setBlue(!blue);
                }}
                style={{ fontSize: 22, color: textColor }}>
                Click me to toggle my color
      </Text>
            <DrawerNavigatorItems {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default CustomDrawer;
