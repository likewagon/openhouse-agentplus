import React from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from "./screens/Splash";
import SocialLoginScreen from "./screens/auth/SocialLogin";
import FormScreen from "./screens/auth/Form";
import SMSScreen from "./screens/auth/SMS";

import WelcomeScreen from "./screens/Welcome";
import DashboardScreen from "./screens/Dashboard";

import PreferenceScreen from "./screens/setting/Preference";
import MlsSettingLinkScreen from "./screens/setting/MlsSettingLink";
import MlsSettingSearchScreen from "./screens/setting/MlsSettingSearch";

import ClientListScreen from "./screens/client/ClientList";
import ClientInviteScreen from "./screens/client/ClientInvite";
import ClientShareScreen from "./screens/client/ClientShare";
import ClientMapScreen from "./screens/client/ClientMap";
import ClientViewScreen from "./screens/client/ClientView";
import ClientViewPDFScreen from "./screens/client/ClientViewPDF";
import ClientViewedPropertyMapScreen from "./screens/client/ClientViewedPropertyMap";

import AgentListingScreen from "./screens/agent/AgentListing";
import AgentListingMapScreen from "./screens/agent/AgentListingMap";

import PropertyScreen from "./screens/property/Property";
import PropertyWithClientScreen from "./screens/property/PropertyWithClient";

import OpenHouseHomeScreen from "./screens/openhouse/OpenHouseHome";
import OpenHouseQuestionScreen from "./screens/openhouse/OpenHouseQuestion";
import OpenHouseSigninScreen from "./screens/openhouse/OpenHouseSignin";
import OpenHouseSignatureScreen from "./screens/openhouse/OpenHouseSignature";
import OpenHouseSignatureEndScreen from "./screens/openhouse/OpenHouseSignatureEnd";

import LiveCallScreen from './screens/LiveCall';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName='SocialLogin'
      headerMode='none'
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'tomato' }
      }}
    >
      <Stack.Screen
        name='SocialLogin'
        component={SocialLoginScreen}
        options={{
          title: 'SocialLogin'
        }}
      />
      <Stack.Screen
        name='Form'
        component={FormScreen}
        options={{
          title: 'Form'
        }}
      />
      <Stack.Screen
        name='SMS'
        component={SMSScreen}
        options={{
          title: 'SMS'
        }}
      />
    </Stack.Navigator>
  )
}

function ClientStack() {
  return (
    <Stack.Navigator
      initialRouteName="ClientList"
      headerMode="none"
    >
      <Stack.Screen
        name="ClientList"
        component={ClientListScreen}
      />
      <Stack.Screen
        name="ClientInvite"
        component={ClientInviteScreen}
      />
      <Stack.Screen
        name="ClientShare"
        component={ClientShareScreen}
      />
      <Stack.Screen
        name="ClientMap"
        component={ClientMapScreen}
      />
      <Stack.Screen
        name="ClientView"
        component={ClientViewScreen}
      />
      <Stack.Screen
        name="ClientViewPDF"
        component={ClientViewPDFScreen}
      />
      <Stack.Screen
        name="ClientViewedPropertyMap"
        component={ClientViewedPropertyMapScreen}
      />
    </Stack.Navigator>
  );
}

function AgentStack() {
  return (
    <Stack.Navigator
      initialRouteName="AgentListing"
      headerMode="none"
    >
      <Stack.Screen
        name="AgentListing"
        component={AgentListingScreen}
      />
      <Stack.Screen
        name="AgentListingMap"
        component={AgentListingMapScreen}
      />      
    </Stack.Navigator>
  );
}

function PropertyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Property"
      headerMode="none"
    >
      <Stack.Screen
        name="Property"
        component={PropertyScreen}
      />
      <Stack.Screen
        name="PropertyWithClient"
        component={PropertyWithClientScreen}
      />      
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator
      initialRouteName="MlsSettingLink"
      headerMode="none"
    >
      <Stack.Screen
        name="MlsSettingLink"
        component={MlsSettingLinkScreen}
      />
      <Stack.Screen
        name="MlsSettingSearch"
        component={MlsSettingSearchScreen}
      />
      <Stack.Screen
        name="Preference"
        component={PreferenceScreen}
      />
    </Stack.Navigator>
  );
}

function OpenHouseStack() {
  return (
    <Stack.Navigator
      initialRouteName="OpenHouseHome"
      headerMode="none"
    >
      <Stack.Screen
        name="OpenHouseHome"
        component={OpenHouseHomeScreen}
      />
      <Stack.Screen
        name="OpenHouseQuestion"
        component={OpenHouseQuestionScreen}
      />
      <Stack.Screen
        name="OpenHouseSignin"
        component={OpenHouseSigninScreen}
      />
      <Stack.Screen
        name="OpenHouseSignature"
        component={OpenHouseSignatureScreen}
      />
      <Stack.Screen
        name="OpenHouseSignatureEnd"
        component={OpenHouseSignatureEndScreen}
      />
    </Stack.Navigator>
  );
}

///////////////////////////
function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      headerMode="none"
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />
      <Stack.Screen
        name="ClientStack"
        component={ClientStack}
      />
      <Stack.Screen
        name="AgentStack"
        component={AgentStack}
      />
      <Stack.Screen
        name="PropertyStack"
        component={PropertyStack}
      />      
      <Stack.Screen
        name="SettingStack"
        component={SettingStack}
      />
      <Stack.Screen
        name="OpenHouseStack"
        component={OpenHouseStack}
      />
      <Stack.Screen
        name="LiveCall"
        component={LiveCallScreen}
      />      
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


