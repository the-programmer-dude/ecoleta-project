import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation, useRoute } from '@react-navigation/native'
import Map, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'

import styles from './style'
import api from '../../utils/api'

interface Items{
  title: string;
  id: number;
  image_url: string;
}

interface Points{
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface routeInterface{
  uf: string;
  city: string;
}

export default function Points(){
  const navigation = useNavigation()

  const route = useRoute()
  const routeParams = route.params as routeInterface

  const [ items, setItems ] = useState<Items[]>([])
  const [ selectedItems, setSelectedItems ] = useState<number[]>([])
  const [ points, setPoints ] = useState<Points[]>([])
  const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0, 0])

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data)
    }).catch(console.log)
  }, [])

  useEffect(() => {
    api.get('/points', {
      params: { city: routeParams.city, uf: routeParams.uf, items: selectedItems }
    }).then(response => {
      setPoints(response.data)
    }).catch(console.log)
  }, [selectedItems])

  useEffect(() => {
    async function getPosition(){
      const { status } = await requestPermissionsAsync();

      if(status !== 'granted'){
        Alert.alert('Eita!', 'Precisamos de sua permição para pegar a sua localização')
        return
      }
      
      try{
        const { coords } = await getCurrentPositionAsync();
        const { latitude, longitude} = coords

        setInitialPosition([ latitude, longitude ])
      }catch(err){console.log(err)}
    }

    getPosition()
  }, [])

  function handleNavigateBack(){
    navigation.goBack();
  }

  function handleNavigateToDetails(id: number){
    navigation.navigate('Details', {
      pointId: id
    })
  }

  function handleItemSelected(id: number){
    if(selectedItems.includes(id)){
      const selectedItemsClone = selectedItems.filter(itemId => itemId !== id)

      setSelectedItems(selectedItemsClone)
    }else{
      setSelectedItems([ ...selectedItems, id ])
    }
  }

  return (
    <>
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack} style={{ alignItems: 'flex-start' }}>
        <Icon name="arrow-back" size={20} color="#34cb79" />
      </TouchableOpacity>

      <Text style={styles.title}>Bem vindo.</Text>
      <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

      <View style={styles.mapContainer}>
        {initialPosition[0] !== 0 && (
          <Map 
          style={styles.map}
          initialRegion={{ 
            latitude: initialPosition[0],
            longitude: initialPosition[1],
            latitudeDelta: 0.014,
            longitudeDelta: 0.014,
          }}
          >
            {points.map(point => (
              <Marker 
                key={point.id}
                style={styles.mapMarker}
                onPress={() => handleNavigateToDetails(point.id)}
                coordinate={{ 
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
              >
                <View style={styles.mapMarkerContainer}> 
                  <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
              </Marker>
            ))}
          </Map>
        )}
      </View>
    </View>
    <View style={styles.itemsContainer}>
      <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {items.map(item => (
          <TouchableOpacity 
            key={String(item.id)} 
            style={[
              styles.item,
              selectedItems.includes(item.id) ? styles.selectedItem : {}
            ]} 
            onPress={() => handleItemSelected(item.id)}
            activeOpacity={0.5}
          >
            <SvgUri width={42} height={42} uri={item.image_url} />
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    </>
  )
}