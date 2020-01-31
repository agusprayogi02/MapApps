import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import firebase from "firebase";

class SignInScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            icon: "eye",
            isPasswordHidden: true,
            errorM: null,
        }
    }

    handleToggle = () => {
        const { isPasswordHidden } = this.state;

        if (isPasswordHidden) {
            this.setState({ isPasswordHidden: false });
            this.setState({ icon: 'eye-slash' });
        } else {
            this.setState({ isPasswordHidden: true });
            this.setState({ icon: 'eye' });
        }
    };

    Login = () => {
        const { email, password } = this.state;
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('App'))
            .catch(error => this.setState({ errorM: error.message }))
    }

    register = () => {
        const { email, password } = this.state;
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('App'))
            .catch(err => this.setState({ errorM: err.message }))
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.text}>Login</Text>
                        {this.state.errorM &&
                            <Text style={{ color: 'red' }}>
                                {this.state.errorM}
                            </Text>
                        }
                    </View>
                    <View style={styles.Input}>
                        <Input
                            placeholder="Email"
                            autoCompleteType="email"
                            leftIcon={
                                <Icon
                                    name='envelope'
                                    size={24}
                                    color='black'
                                />
                            }
                            onChangeText={email => this.setState({ email })}
                        />
                    </View>
                    <View style={styles.Input}>
                        <Input
                            placeholder="Password"
                            autoCompleteType="password"
                            secureTextEntry={this.state.isPasswordHidden}
                            leftIcon={
                                <Icon
                                    name='lock'
                                    size={24}
                                    color='black'
                                />
                            }
                            rightIcon={
                                <TouchableOpacity onPress={this.handleToggle}>
                                    <Icon
                                        name={this.state.icon}
                                        size={24}
                                        color='black'
                                    />
                                </TouchableOpacity>
                            }
                            onChangeText={password => this.setState({ password })}
                        />
                    </View>
                    <View style={styles.button}>
                        <Button
                            title="Sign IN"
                            type="outline"
                            onPress={this.Login}
                        />
                    </View>
                    <View style={styles.button}>
                        <Button
                            title="Sign UP"
                            type="outline"
                            onPress={this.register}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#eaeaea"
    },
    card: {
        padding: 10,
        marginTop: 30,
        alignContent: "center",
        borderColor: "black",
        borderWidth: 1,
        width: "90%",
        borderRadius: 5,
        backgroundColor: "white",
    },
    Input: {
        borderWidth: 0.5,
        margin: 10,
        borderRadius: 20,
        color: "blue",
        padding: 10
    },
    text: {
        fontSize: 35,
        margin: 10,
        fontWeight: 'bold',
        color: 'blue',
    },
    button: {
        margin: 10,
    }
});