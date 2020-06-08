import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StatusBar
} from 'react-native'

export default function LoginScreen() {
  return(
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View>
          <Text>Login</Text>
        </View>
      </SafeAreaView>
    </>
  )
}