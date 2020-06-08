import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StatusBar
} from 'react-native'

export default function VehiclesScreen() {
  return(
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View>
          <Text>Vehicles Screen</Text>
        </View>
      </SafeAreaView>
    </>
  )
}