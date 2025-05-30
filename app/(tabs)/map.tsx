import ErrorView from '@/components/(common)/ErrorView';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import colors from '@/constants/colors';
import { MAP_LATITUDE, MAP_LATITUDE_DELTA, MAP_LONGITUDE, MAP_LONGITUDE_DELTA } from '@/constants/constants';
import { useRiddles } from '@/hooks/useRiddles';
import { RiddleItem } from '@/interfaces/riddle';
import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';


export default function MapScreen() {
  const { isDark } = useThemeStore();
  const [region, setRegion] = useState<Region>({
    latitude: MAP_LATITUDE,
    longitude: MAP_LONGITUDE,
    latitudeDelta: MAP_LATITUDE_DELTA,
    longitudeDelta: MAP_LONGITUDE_DELTA,
  });
  const [selectedRiddle, setSelectedRiddle] = useState<RiddleItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading, isError, error } = useRiddles();
  
  const onMarkerPress = (riddle: RiddleItem) => {
    setSelectedRiddle(riddle);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRiddle(null);
  };

  if (isLoading) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <LoadingView />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (isError) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <ErrorView error={ error.message } />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  if (!data) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <ErrorView error="Aucune donnée disponible" />
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return (
      <View className='flex-1'>
        <MapView style={{flex: 1}} region={region} onRegionChangeComplete={setRegion} showsUserLocation={true} showsMyLocationButton={true}>
          {data.map((riddle) => 
            riddle.latitude && riddle.longitude && (
              <Marker
                key={riddle.id}
                coordinate={{ latitude: parseFloat(riddle.latitude), longitude: parseFloat(riddle.longitude) }}
                onPress={() => onMarkerPress(riddle)}
              />
            )
          )}
        </MapView>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View className='flex-1 justify-end items-center px-6 pb-20' >
              <TouchableOpacity onPress={() => router.push(`/riddles/${selectedRiddle?.id}`)} style={{height: 100}} className='w-full bg-light dark:bg-dark p-4 z-2'>
                {selectedRiddle && (
                  <View className='flex-1 flex-row justify-between items-center px-6 gap-8'>
                    <View className='flex-1 flex-col'>
                      <View className='flex-row items-center gap-3'>
                        { selectedRiddle.is_private ? (
                            <Ionicons name="lock-closed-outline" size={16} color={isDark ? colors.light : colors.dark } />
                          ) : null
                        }
                        <Text
                          className='text-dark dark:text-light text-lg font-semibold'
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          { selectedRiddle.title }
                        </Text>
                      </View>

                      <Text className='text-gray-400 text-sm mb-1'>
                        {moment(selectedRiddle.updated_at).isSame(moment(), 'day')
                          ? moment(selectedRiddle.updated_at).fromNow()
                          : moment(selectedRiddle.updated_at).format('DD-MM-YYYY')}
                      </Text>
                      

                      <View className='flex-row gap-6'>
                        <View className='flex-row gap-1'>
                          <Ionicons name="footsteps-outline" size={18} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
                          <Text className='text-gray-400'>{ selectedRiddle.steps_count }</Text>
                        </View>

                        <View className='flex-row gap-1'>
                          <Ionicons name="star-outline" size={18} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
                          <Text className='text-gray-400'>{ Math.round(selectedRiddle.reviews_avg_rating * 10) / 10 }</Text>
                        </View>

                        <View className='flex-row gap-1'>
                          <Ionicons name="trending-up-sharp" size={22} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
                          <Text className='text-gray-400'>{ Math.round(selectedRiddle.reviews_avg_difficulty * 10) / 10 }</Text>
                        </View>

                        <View className='flex-row gap-1'>
                          <Ionicons name="chatbubble-ellipses-outline" size={18} color={isDark ? colors.secondary.lighter : colors.secondary.darker } />
                          <Text className='text-gray-400'>{ selectedRiddle.reviews_count }</Text>
                        </View>
                      </View>
                    </View>

                    <View className=''>
                      <Ionicons name="caret-forward" size={20} color={isDark ? colors.light : colors.dark } />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
  );
}