import React, { Component } from "react";
import {
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import firebase from "firebase";


class LoadingScreen extends Component {

    componentDidMount() {
        this.CheckIfLogin()
    }

    CheckIfLogin = () => {
        firebase.auth().onAuthStateChanged(
            function (user) {
                if (user) {
                    this.props.navigation.navigate('App')
                } else {
                    this.props.navigation.navigate('Auth')
                }
            }.bind(this)
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    size={"large"}
                />
            </View>
        );
    }
}
export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});