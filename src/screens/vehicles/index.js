import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  Alert
} from 'react-native'
import { 
  FAB,
  TextInput,
  Button,
  HelperText,
  IconButton
} from 'react-native-paper'
import { Formik } from 'formik'
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '../../services/AuthContext'
import * as Yup from 'yup'
import api from '../../services/api'

const CarSchema = Yup.object().shape({
  plate: Yup.string()
    .min(7, 'Placa invalida')
    .test(
      'is-alphanumber',
      'Insira apenas caracteres alfanumérico.',
      value => !(/[^a-zA-Z0-9]/.test( value )),
    )
    .required('Digite a placa')
});

export default function VehiclesScreen() {
  const { signOut } = useContext(AuthContext)

  const [modal, setModal] = useState(false)
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    loadVehicles()
  }, [])
  
  return(
    <View style={styles.container}>
      <StatusBar backgroundColor="#48bfdd" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Veículos</Text>

        <Button 
          icon="exit-to-app"
          style={{ elevation: 0, borderRadius: 50 }}
          theme={{ colors: { primary: 'rgba(0, 0, 0, .1)' } }}
          mode="contained"
          onPress={() => logout()}
        >
          Sair
        </Button>
      </View>

      <ScrollView>
        <View style={{ padding: 15, paddingBottom: 80 }}>
        {
          vehicles.map((obj, index) => (
            <View style={styles.vehicleCard} key={index}>
              <Image 
                style={styles.vehicleCardImage} 
                source={require('../../resources/img/carro.png')}
              />
              <View style={styles.vehicleCardText}>
                <Text style={{ fontSize: 15, color: '#999' }}>Placa</Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: 'rgba(0,0,0,.6)' }}>{obj.plate}</Text>
              </View>

              <IconButton
                style={{ position: 'absolute', right: 0}}
                icon="delete"
                color="#999"
                size={20}
                onPress={() => confirmDeleteVehicle(obj)}
              />
            </View>
          ))
        }
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        theme={{ colors: { accent: '#48bfdd' } }}
        icon="plus"
        color="#FFF"
        onPress={() => setModal(true)}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.modalContent}>
          <Formik
            initialValues={{ plate: '' }}
            validationSchema={CarSchema}
            onSubmit={values => submitVehicles(values)}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.modalBox}>
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Adicionar Veículo</Text>
              </View>

              <View style={{ marginBottom: 15 }}>
                <TextInput
                  label='Placa'
                  value={values.plate}
                  mode="outlined"
                  maxLength={7}
                  autoCapitalize="characters"
                  style={{ borderRadius: 50 }}
                  onChangeText={handleChange('plate')}
                  onBlur={handleBlur('plate')}
                  theme={{ colors: { primary: '#48bfdd' } }}
                  error={errors.plate && touched.plate}
                />

                {errors.plate && touched.plate ? (
                  <HelperText type="error">{errors.plate}</HelperText>
                ) : null}
              </View>


              <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                  contentStyle={{ paddingHorizontal: 6 }}
                  style={{ elevation: 0, borderRadius: 50 }}
                  dark={true}
                  theme={{ colors: { text: '#000', primary: '#999' } }}
                  onPress={() => setModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  contentStyle={{ paddingHorizontal: 20 }}
                  style={{ elevation: 0, borderRadius: 50 }}
                  mode="contained"
                  dark={true}
                  theme={{ colors: { text: '#000', primary: '#48bfdd' } }}
                  onPress={handleSubmit}
                >
                  Salvar
                </Button>
              </View>
            </View>
          )}
          </Formik>
        </View>
      </Modal>
    </View>
  )

  function submitVehicles({ plate }) {
    api.post('vehicle', { plate })
    .then(resp => {
      loadVehicles()
      setModal(false)
    })
    .catch(error => {
      console.log(error)
    })
  }

  function loadVehicles() {
    api.get('vehicle')
    .then(resp => {
      setVehicles(resp.data.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

  function logout() {
    Alert.alert(
      "Sair",
      "Deseja sair da sua conta?",
      [
        {
          text: "Não",
          onPress: () => console.log("Cancel Logout"),
          style: "cancel"
        },
        { text: "Sim", onPress: () => destroyToken() }
      ],
      { cancelable: false }
    );
  }

  async function destroyToken() {
    try {
      await AsyncStorage.removeItem('@userToken&EasyCarrosApp')

      signOut()
    } catch (error) {
      alert(error)
    }
  }

  function confirmDeleteVehicle({ id, plate }) {
    Alert.alert(
      'Excluir',
      `Deseja excluir o veículo de placa '${plate}'`,
      [
        {
          text: 'Cancelar',
          onPress: () => console.log("Cancel Delete"),
          style: "cancel"
        },
        { text: "Sim, Excluir", onPress: () => deleteVehicle(id) }
      ]
    )
  }

  function deleteVehicle(id) {
    api.delete(`/vehicle/${id}`)
    .then(() => loadVehicles())
    .catch(error => alert(error))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingVertical: 30,
    backgroundColor: '#48bfdd',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 25,
    color: '#FFF',
    fontWeight: 'bold'
  },
  fab: {
    position: 'absolute',
    elevation: 0,
    margin: 20,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    paddingHorizontal: 15
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10
  },

  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: '#ededed',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  vehicleCardImage: {
    width: 100,
    height: 51
  },
  vehicleCardText: {
    marginLeft: 15
  }
})