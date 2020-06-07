import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer';

import styles from './style'
import api from '../../utils/api'

interface Point{
  point: {
    name: string;
    image: string;
    city: string;
    uf: string;
    email: string;
    whatsapp: number;
    image_url: string;
  };
  items: {
    title: string
  }[]
}

interface routeInterface{
  pointId: string;
}

export default function Details(){
  const navigation = useNavigation()
  const route = useRoute()

  const routeParams = route.params as routeInterface

  const [ data, setData ] = useState<Point>({} as Point)

  useEffect(() => {
    api.get(`/points/${routeParams.pointId}`).then(response => {
      setData(response.data)
    })
  }, [])

  function handleNavigateBack(){
    navigation.goBack()
  }

  function handleMailCompose(){
    MailComposer.composeAsync({
      subject: 'Coleta de resíduos',
      recipients: [data.point.email],
    })
  }

  function handleWhatsappMessage(){
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Interesse em coleta de resíduos`)
  }

  return (
    <>
    {data.point && (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleNavigateBack} style={{ alignItems: 'flex-start', marginTop: 20 }}> 
            <Icon name="arrow-back" size={20} color="#34cb79" />
          </TouchableOpacity>

          <Image 
          source={{ uri: data.point.image_url }} 
          style={styles.pointImage}
          />

          <Text style={styles.pointName}>{data.point.name}</Text>
          <Text style={styles.pointItems}>
            {data.items.map((item) => item.title).join(', ')}
          </Text>

          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatsappMessage}>
            <Icon name="whatsapp" size={20} color="#fff" type="font-awesome" />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={handleMailCompose}>
            <Icon name="mail" size={20} color="#fff"/>
            <Text style={styles.buttonText}>Email</Text>
          </RectButton>
        </View>
      </SafeAreaView>
    )}
  </>
  )
}