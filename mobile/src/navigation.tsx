import 'react-native-gesture-handler'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Homepage from './pages/Home'
import Points from './pages/Points'
import Details from './pages/Details'

const Stack = createStackNavigator()

const NavConfig = () => (
    <NavigationContainer>
        <Stack.Navigator 
        initialRouteName={"Homepage"} 
        headerMode="none" 
        screenOptions={{ 
            cardStyle: {
                backgroundColor: "#f0f5f0"
            }}
        }>
            <Stack.Screen name="Homepage" component={Homepage}/>
            <Stack.Screen name="Points" component={Points}/>
            <Stack.Screen name="Details" component={Details}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default NavConfig
