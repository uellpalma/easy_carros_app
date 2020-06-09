import React, { 
  useReducer,
  useEffect,
  useMemo
} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'
import LoginScreen from '../screens/login'
import VehiclesScreen from '../screens/vehicles'
import { AuthContext } from '../services/AuthContext'
import SplachScreen from '../components/splashScreen'

const Stack = createStackNavigator();

export default function Route({ navigation }) {

  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case 'REFRESH_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        };
      case 'LOGIN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null
        }
    }
  },{
    isLoading: true,
    isSignout: false,
    userToken: null
  })

  useEffect(() => {
    const reloadToken = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('@userToken&EasyCarrosApp')
      } catch(error) {
        dispatch({ type: 'LOGOUT' })
      }
      setTimeout(() => {
        dispatch({ type: 'REFRESH_TOKEN', token: userToken })
      }, 1000)
    }

    reloadToken()
  }, [])

  const authContext = useMemo(() => ({
    signIn: async ({ token }) => {
      dispatch({ type: 'LOGIN', token: token })
    },
    signOut: () => dispatch({ type: 'LOGOUT' })
  }), [])

  if (state.isLoading) {
    return (
      <SplachScreen/>
    );
  }

  return(
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
            stackAnimation: 'default',
            stackPresentation: 'transparentModal',
            contentStyle: {
              backgroundColor: "#FFF"
            }
          }}
        >
          {state.userToken == null ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Vehicles" component={VehiclesScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}