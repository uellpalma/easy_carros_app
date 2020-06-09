import React, { useContext } from 'react'
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  StyleSheet
} from 'react-native'
import { 
  TextInput,
  Button,
  HelperText
} from 'react-native-paper'
import { AuthContext } from '../../services/AuthContext'
import AsyncStorage from '@react-native-community/async-storage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import api from '../../services/api'

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Digite um email'),
  pass: Yup.string()
    .min(6, 'Senha muito curta')
    .required('Digite sua senha'),
});

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext)

  return(
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.contentLogin}>
          <View style={styles.contentLogo}>
            <Image
              style={styles.logo}
              source={require('../../resources/img/logo.png')}
            />
          </View>

          <Formik
            initialValues={{ email: '', pass: '' }}
            validationSchema={LoginSchema}
            onSubmit={values => login(values)}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.contentForm}>
              <View style={styles.contentInput}>
                <TextInput
                  label='Email'
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  theme={{ colors: { primary: '#48bfdd' } }}
                  error={errors.email && touched.email}
                />
                {errors.email && touched.email ? (
                  <HelperText type="error">{errors.email}</HelperText>
                ) : null}
              </View>

              <View style={styles.contentInput}>
                <TextInput
                  label='Senha'
                  mode="outlined"
                  value={values.pass}
                  secureTextEntry={true}
                  maxLength={100}
                  onChangeText={() => {}}
                  theme={{ colors: { primary: '#48bfdd' } }}
                  onChangeText={handleChange('pass')}
                  onBlur={handleBlur('pass')}
                  error={errors.pass && touched.pass}
                />
                {errors.pass && touched.pass ? (
                  <HelperText type="error">{errors.pass}</HelperText>
                ) : null}
              </View>

              <Button
                contentStyle={{ paddingVertical: 6 }}
                style={styles.button}
                mode="contained"
                dark={true}
                theme={{ colors: { primary: '#48bfdd' } }}
                onPress={handleSubmit}
              >
                Entrar
              </Button>
            </View>
          )}
          </Formik>
        </View>
      </SafeAreaView>
    </View>
  )

  function login({ email, pass }) {
    api.post('auth', {
      email,
      password: pass 
    })
    .then(resp => {
      let data = resp.data.data
      setTokenStorage(data.token)
    })
    .catch(error => {
      Alert.alert(
        "Ops!",
        "Sua senha ou email podem está incorretos!",
        [
          { text: "Tentar novamente", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      );
    })
  }

  async function setTokenStorage(token) {
    try {
      await AsyncStorage.setItem('@userToken&EasyCarrosApp', token)

      signIn({ token })
    } catch (error) {
      alert(error)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF'
  },
  contentLogin: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  contentLogo: {
    alignItems: 'center'
  },
  logo: { 
    width: 200,
    height: 150,
    marginBottom: 50
  },
  contentInput: {
    marginBottom: 10
  },
  button: {
    elevation: 0,
    marginTop: 20,
    borderRadius: 50
  }
})