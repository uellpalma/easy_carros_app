import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import {
  TextInput,
  HelperText
} from 'react-native-paper'

export default function InputGroup(props) {
  return(
    <View style={styles.contentInput}>
      <TextInput
        theme={{ colors: { primary: '#48bfdd', background: '#F9F9F9' } }}
        {...props}
      />
      {props.error ? (
        <HelperText type="error">{props.errorMessage}</HelperText>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  contentInput: {
    marginBottom: 10
  }
})