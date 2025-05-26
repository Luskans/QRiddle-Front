// src/screens/PostDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { usePost, useDeletePost } from '../hooks/usePosts';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  
  // Récupération des données du post
  const { data: post, isLoading, isError, error } = usePost(id);
  
  // Mutation pour supprimer un post
  const deletePostMutation = useDeletePost();
  
  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce post ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            deletePostMutation.mutate(id, {
              onSuccess: () => {
                Alert.alert('Succès', 'Le post a été supprimé');
                navigation.goBack();
              },
              onError: (err) => {
                Alert.alert('Erreur', `Impossible de supprimer le post: ${err.message}`);
              }
            });
          }
        }
      ]
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur: {error.message}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Retour à la liste</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditPost', { post })}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
          disabled={deletePostMutation.isPending}
        >
          {deletePostMutation.isPending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Supprimer</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});