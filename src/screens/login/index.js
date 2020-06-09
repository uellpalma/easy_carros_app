import React, { useContext, useRef } from 'react'
import {
  View,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native'
import { Button } from 'react-native-paper'
import { AuthContext } from '../../services/AuthContext'
import AsyncStorage from '@react-native-community/async-storage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import api from '../../services/api'
import Logo from '../../components/logo'
import InputGroup from '../../components/inputGroup'

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
  const inputPass = useRef(null)

  return(
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.contentLogin}>
          <Logo />

          <Formik
            initialValues={{ email: '', pass: '' }}
            validationSchema={LoginSchema}
            enableReinitialize={true}
            onSubmit={login}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.contentForm}>
              <InputGroup
                label='Email'
                mode="flat"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                underlineColor="#DDD"
                error={errors.email && touched.email}
                errorMessage={errors.email}
              />

              <InputGroup
                label='Senha'
                mode="flat"
                value={values.pass}
                secureTextEntry={true}
                maxLength={100}
                ref={inputPass}
                underlineColor="#DDD"
                onChangeText={handleChange('pass')}
                onBlur={handleBlur('pass')}
                error={errors.pass && touched.pass}
                errorMessage={errors.pass}
              />

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

  function login(values, { setFieldValue }) {
    api.post('auth', {
      email: values.email,
      password: values.pass 
    })
    .then(resp => {
      let data = resp.data.data
      setTokenStorage(data.token)
    })
    .catch(error => {
      Alert.alert(
        "Ops!",
        "Sua senha ou email está incorreto!",
        [
          { text: "Tentar novamente", onPress: () => setFieldValue('pass', '') }
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
  contentInput: {
    marginBottom: 10
  },
  button: {
    elevation: 0,
    marginTop: 20,
  }
})