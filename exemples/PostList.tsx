// src/screens/PostsScreen.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { usePosts } from '../hooks/usePosts';
import { useNavigation } from '@react-navigation/native';

export default function PostsScreen() {
  const { data: posts, isLoading, isError, error, refetch } = usePosts();
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Une erreur est survenue: {error.message}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={{
          padding: 16,
          backgroundColor: '#007BFF',
          alignItems: 'center',
          margin: 16,
          borderRadius: 8
        }}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Créer un nouveau post</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('PostDetail', { id: item.id })}
            style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text numberOfLines={2}>{item.body}</Text>
          </TouchableOpacity>
        )}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}