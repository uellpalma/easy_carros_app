import React from 'react'
import {
  View,
  Image,
  StyleSheet
} from 'react-native'

export default function Logo() {
  return(
    <View style={styles.contentLogo}>
      <Image
        style={styles.logo}
        source={require('../../resources/img/logo.png')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contentLogo: {
    alignItems: 'center'
  },
  logo: { 
    width: 200,
    height: 150,
    marginBottom: 50
  },
})