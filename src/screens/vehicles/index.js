import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Modal
} from 'react-native'
import { 
  FAB,
  TextInput,
  Button,
  HelperText,
  IconButton
} from 'react-native-paper'
import { Formik } from 'formik'
import * as Yup from 'yup'

const CarSchema = Yup.object().shape({
  car: Yup.string(),
  number: Yup.string()
    .min(7, 'Placa invalida')
    .test(
      'is-alphanumber',
      'Alfanumérico apenas',
      value => !(/[^a-zA-Z0-9]/.test( value )),
    )
    .required('Digite a placa')
});

export default function VehiclesScreen() {
  const [modal, setModal] = useState(false)
  
  return(
    <View style={styles.container}>
      <StatusBar backgroundColor="#48bfdd" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Veículos</Text>
      </View>

      <ScrollView style={{ padding: 15}}>
        <View style={styles.vehicleCard}>
          <Image 
            style={styles.vehicleCardImage} 
            source={require('../../resources/img/carro.png')}
          />
          <View style={styles.vehicleCardText}>
            <Text style={{ fontSize: 15, color: '#999' }}>Onix LT</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: 'rgba(0,0,0,.6)' }}>PLACA89</Text>
          </View>

          <IconButton
            style={{ position: 'absolute', right: 0}}
            icon="dots-vertical"
            color="#999"
            size={20}
            onPress={() => console.log('Pressed')}
          />
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
            initialValues={{ car: '', number: '' }}
            validationSchema={CarSchema}
            onSubmit={values => signIn()}
          >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.modalBox}>
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Adicionar Veículo</Text>
              </View>
              
              <View style={{ marginBottom: 15 }}>
                <TextInput
                  label='Carro'
                  value={values.car}
                  mode="outlined"
                  onChangeText={handleChange('car')}
                  onBlur={handleBlur('car')}
                  theme={{ colors: { primary: '#48bfdd' } }}
                  error={errors.car && touched.car}
                />
                {errors.car && touched.car ? (
                  <HelperText type="error">{errors.car}</HelperText>
                ) : null}
              </View>

              <View style={{ marginBottom: 15 }}>
                <TextInput
                  label='Placa'
                  value={values.number}
                  mode="outlined"
                  maxLength={7}
                  autoCapitalize="characters"
                  style={{ borderRadius: 50 }}
                  onChangeText={handleChange('number')}
                  onBlur={handleBlur('number')}
                  theme={{ colors: { primary: '#48bfdd' } }}
                  error={errors.number && touched.number}
                />

                {errors.number && touched.number ? (
                  <HelperText type="error">{errors.number}</HelperText>
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
                  onPress={() => signIn()}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingVertical: 30,
    backgroundColor: '#48bfdd'
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