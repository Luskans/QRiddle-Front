// screens/CreatedRiddlesScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useCreatedRiddles } from '../hooks/useCreatedRiddles';
import RiddleCard from '../components/RiddleCard';

export default function CreatedRiddlesScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch
  } = useCreatedRiddles();

  // Aplatir les données paginées en une seule liste
  const riddles = data?.pages.flatMap(page => page.data) || [];

  // Fonction appelée quand on atteint la fin de la liste
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Rendu du footer (indicateur de chargement ou fin de liste)
  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.footerText}>Chargement...</Text>
        </View>
      );
    }
    
    if (!hasNextPage && riddles.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Fin de la liste</Text>
        </View>
      );
    }
    
    return null;
  };

  if (status === 'pending') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur: {error.message}</Text>
        <TouchableOpacity style={styles.button} onPress={() => refetch()}>
          <Text style={styles.buttonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={riddles}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <RiddleCard riddle={item} />}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3} // Déclenche le chargement quand on est à 30% de la fin
      ListFooterComponent={renderFooter}
      refreshing={status === 'pending'}
      onRefresh={refetch}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucune énigme créée</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});