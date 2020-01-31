import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as firebase from 'firebase'

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
import AuthLoadingScreen from "./Screens/Loading";
import HomeScreen from './Screens/Home';
import SignInScreen from './Screens/SignIn'
import { firebaseConfig } from './Screens/Config'
// goes here.

firebase.initializeApp(firebaseConfig);

const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);