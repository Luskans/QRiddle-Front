// src/screens/CreatePostScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useCreatePost } from '../hooks/usePosts';
import { useNavigation } from '@react-navigation/native';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigation = useNavigation();
  
  // Utilisation du hook de mutation pour créer un post
  const createPostMutation = useCreatePost();
  
  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    // Appel de la mutation avec les données du formulaire
    createPostMutation.mutate(
      {
        title,
        body,
        userId: '1', // Dans un cas réel, ce serait l'ID de l'utilisateur connecté
      },
      {
        onSuccess: () => {
          Alert.alert('Succès', 'Votre post a été créé avec succès');
          navigation.goBack();
        },
        onError: (error) => {
          Alert.alert('Erreur', `Une erreur est survenue: ${error.message}`);
        },
      }
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un nouveau post</Text>
      
      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Entrez le titre du post"
      />
      
      <Text style={styles.label}>Contenu</Text>
      <TextInput
        style={[styles.input, styles.bodyInput]}
        value={body}
        onChangeText={setBody}
        placeholder="Entrez le contenu du post"
        multiline
        textAlignVertical="top"
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
        disabled={createPostMutation.isPending}
      >
        {createPostMutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Publier</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  bodyInput: {
    height: 150,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});