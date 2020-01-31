import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import { Button } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome'
import firebase from "firebase";

class HomeScreen extends Component {
    static navigationOptions = {
        headerRight: () => (
            <View style={{ marginRight: 8 }}>
                <Button
                    onPress={() => firebase.auth().signOut()}
                    icon={
                        <Icon
                            name='sign-out'
                            size={24}
                            color='black'
                        />
                    }
                    type="clear"
                />
            </View>)
    }
    render() {
        return (
            <View style={styles.container}>

            </View>
        );
    }
}
export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});