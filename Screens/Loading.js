import React, { Component } from "react";
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text
} from "react-native";
import firebase from "firebase";
import Geolocation from 'react-native-geolocation-service'
import { request, PERMISSIONS } from 'react-native-permissions';

const LATITUDE_DELTA = 0.0022
const LONGITUDE_DELTA = 0.0020

class LoadingScreen extends Component {

    constructor(props) {
        super(props)
        global.changeRegion = {
            latitude: -7.9606086,
            longitude: 112.6508681,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }
    }

    componentDidMount() {
        this.requestLocationPermission()
    }

    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            response = await request(PERMISSIONS.IOS.MEDIA_LIBRARY)
            console.log('iPhone: ' + response);

            if (response === 'granted') {
                this.locateCurrentPosition()
                this.CheckIfLogin()
            }
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            response = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
            response = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)

            console.log('Android: ' + response);

            if (response === 'granted') {
                this.locateCurrentPosition()
                this.CheckIfLogin()
            }
        }
    }

    locateCurrentPosition = async () => {
        Geolocation.getCurrentPosition(
            position => {
                // console.log(JSON.stringify(position));

                var latitude = position.coords.latitude
                var longitude = position.coords.longitude
                global.changeRegion = {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        )
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
                <Text>Loading..</Text>
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