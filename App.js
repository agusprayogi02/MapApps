import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from "react-navigation-drawer";
import * as firebase from 'firebase'
import { CustomDrawer } from "./Screens/CustomDrawer";

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
import AuthLoadingScreen from "./Screens/Loading";
import HomeScreen from './Screens/Home';
import SignInScreen from './Screens/SignIn'
import { firebaseConfig } from './Screens/Config'
import { RootStack } from './Screens/App'
// goes here.

firebase.initializeApp(firebaseConfig)

const AppStack = createDrawerNavigator({
  Home: { screen: HomeScreen },
}, { contentComponent: CustomDrawer });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
      sqlite: RootStack
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);