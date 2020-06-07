import React, { useEffect, useState } from 'react';
import { View, Image, Text, ImageBackground } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios'
import styles from './style'

const selecteStyle = {
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
}

interface IBGEUFResponse{
  sigla: string;
}

interface IBGECITYResponse{
  nome: string;
}

export default function Homepage(){
  const navigation = useNavigation()

  const [ ufInitials, setUfInitials ] = useState<string[]>([]);
  const [ cityOptions, setCityOptions ] = useState([]);
  const [ selectedCity, setSelectedCity ] = useState();
  const [ selectedUf, setSelectedUf ] = useState();

  useEffect(() => {
      axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
          const cities: any = response.data.map(city => city.nome)

          setCityOptions(cities)
      })
  }, [selectedCity, selectedUf])

  useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
          const initials = response.data.map(uf => uf.sigla)

          setUfInitials(initials);
      })
  }, [])

  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }

  return (
    <ImageBackground 
    source={require('../../assets/home-background.png')} 
    style={styles.container}
    imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de form eficiente.</Text>
        
      </View>

      <View style={styles.footer}>
        <RNPickerSelect 
          style={{...selecteStyle}}
          onValueChange={(value) => setSelectedUf(value)}
          items={ufInitials.map(uf => {
            return {label: uf, value: uf }
          })} 
        />

        <RNPickerSelect 
          style={selecteStyle}
          onValueChange={(value) => setSelectedCity(value)}
          items={cityOptions.map(city => {
            return {label: city, value: city }
          })} 
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
              <Icon 
              name="arrow-forward" 
              color="#fff" 
              size={24} 
              />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}