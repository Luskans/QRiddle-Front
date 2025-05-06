// import React, { useCallback, useEffect, useState, useMemo } from 'react';
// import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
// import SecondaryLayout from '@/components/(layouts)/SecondaryLayout'; // Utilise SecondaryLayout pour le scroll
// import { CollapsibleSection } from '@/components/(common)/CollapsibleSection';
// import GradientButton from '@/components/(common)/GradientButton';
// import { Formik } from 'formik'; // Pour le formulaire d'édition créateur

// // Stores
// import { useRiddleStore, RiddleDetail } from '@/stores/useRiddleStore';
// import { useAuthStore } from '@/stores/useAuthStore';
// import { useGameSessionStore, GameSession, Ranking } from '@/stores/useGameSessionStore';
// import { useReviewStore, Review } from '@/stores/useReviewStore';
// import { useStepStore, StepList } from '@/stores/useStepStore'; // Si utilisé

// // Autres composants (Formulaire d'édition, Lignes de classement/review, etc.)
// // import RiddleEditForm from '@/components/forms/RiddleEditForm';
// // import RankingRow from '@/components/leaderboard/RankingRow';
// // import ReviewItem from '@/components/reviews/ReviewItem';

// // Type pour déterminer la vue à afficher
// type ViewType = 'loading' | 'creator' | 'participant_active' | 'participant_completed' | 'viewer' | 'error';

// export default function RiddleDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const { user } = useAuthStore();

//   // --- Récupération des données des stores ---
//   const {
//     riddle,
//     isLoading: isLoadingRiddle,
//     error: riddleError,
//     fetchRiddleDetail,
//     clearRiddleDetail,
//     updateRiddle, // Pour le créateur
//     deleteRiddle, // Pour le créateur
//   } = useRiddleStore(state => state.riddleDetail);

//   const {
//     currentUserGameSession, // Nouvel état à ajouter au store
//     isLoading: isLoadingSession,
//     error: sessionError,
//     fetchCurrentUserGameSession, // Nouvelle fonction à ajouter
//     clearCurrentUserGameSession, // Nouvelle fonction
//   } = useGameSessionStore(state => state.currentUserGameSession);

//   const {
//     ranking,
//     isLoading: isLoadingRanking,
//     error: rankingError,
//     fetchRiddleRanking,
//     clearRiddleRanking, // Nouvelle fonction
//   } = useGameSessionStore(state => state.riddleRanking);

//   const {
//     reviews,
//     isLoading: isLoadingReviews,
//     error: reviewsError,
//     fetchReviewList,
//     clearReviewList, // Nouvelle fonction
//   } = useReviewStore(state => state.reviewList);

//   // Optionnel: Store pour les étapes si besoin de détails
//   const {
//     steps,
//     isLoading: isLoadingSteps,
//     fetchStepList,
//     clearStepList,
//   } = useStepStore(state => state.stepList);

//   // --- État local pour le type de vue ---
//   const [viewType, setViewType] = useState<ViewType>('loading');

//   // --- Fetch des données au focus ---
//   useFocusEffect(
//     useCallback(() => {
//       if (id && user) { // Assure-toi que user est chargé aussi
//         fetchRiddleDetail(id);
//         fetchCurrentUserGameSession(id, user.id); // Passe l'ID user
//         fetchRiddleRanking(id, { limit: 5 });
//         fetchReviewList({ riddleId: id, limit: 5 });
//         // Optionnel: fetchStepList({ riddleId: id });
//       }
//       // Nettoyage en quittant
//       return () => {
//         clearRiddleDetail();
//         clearCurrentUserGameSession();
//         clearRiddleRanking();
//         clearReviewList();
//         // Optionnel: clearStepList();
//       };
//     }, [id, user, fetchRiddleDetail, fetchCurrentUserGameSession, fetchRiddleRanking, fetchReviewList /*, fetchStepList */])
//   );

//   // --- Détermination du type de vue ---
//   useEffect(() => {
//     const anyLoading = isLoadingRiddle || isLoadingSession || isLoadingRanking || isLoadingReviews /* || isLoadingSteps */;
//     const anyError = riddleError || sessionError || rankingError || reviewsError;

//     if (anyLoading) {
//       setViewType('loading');
//       return;
//     }
//     if (anyError) {
//       setViewType('error');
//       // Tu peux stocker l'erreur spécifique si besoin
//       console.error("Erreurs:", { riddleError, sessionError, rankingError, reviewsError });
//       return;
//     }
//     if (!riddle || !user) {
//       setViewType('error'); // Ou 'not_found'
//       return;
//     }

//     const isCreator = user.id === riddle.creator_id;
//     const session = currentUserGameSession; // La session de l'utilisateur pour CE riddle

//     if (isCreator) {
//       setViewType('creator');
//     } else if (session?.status === 'active') {
//       setViewType('participant_active');
//     } else if (session?.status === 'completed') {
//       setViewType('participant_completed');
//     } else {
//       setViewType('viewer');
//     }
//   }, [isLoadingRiddle, isLoadingSession, isLoadingRanking, isLoadingReviews, riddleError, sessionError, rankingError, reviewsError, riddle, user, currentUserGameSession]);

//   // --- Fonctions spécifiques (ex: suppression, changement statut) ---
//   const handleDelete = async () => {
//     Alert.alert("Confirmation", "Supprimer cette énigme ?", [
//       { text: "Annuler", style: "cancel" },
//       { text: "Supprimer", style: "destructive", onPress: async () => {
//           const success = await deleteRiddle(id);
//           if (success) {
//             router.back(); // Revenir en arrière
//           } else {
//             Alert.alert("Erreur", "Impossible de supprimer l'énigme.");
//           }
//         }
//       }
//     ]);
//   };

//   const handleChangeStatus = async (newStatus: 'active' | 'draft' | 'disabled') => {
//      const updated = await updateRiddle(id, { status: newStatus });
//      if (!updated) {
//         Alert.alert("Erreur", "Impossible de changer le statut.");
//      }
//      // Le store mettra à jour riddleDetail, re-render automatique
//   };

//   // --- Rendu ---
//   if (viewType === 'loading') {
//     return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
//   }

//   if (viewType === 'error') {
//     return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Une erreur est survenue.</Text></View>;
//   }

//   if (!riddle) {
//      return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Énigme non trouvée.</Text></View>;
//   }

//   // --- Rendu principal ---
//   return (
//     <SecondaryLayout> {/* Utilise le layout avec ScrollView */}
//       <View style={{ padding: 16 }}>

//         {/* --- Informations Communes (Titre, etc.) --- */}
//         <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{riddle.title}</Text>
//         {/* ... autres infos communes ... */}

//         {/* ==================== VUE CRÉATEUR ==================== */}
//         {viewType === 'creator' && (
//           <View>
//             <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Mode Créateur</Text>
//             {/* Ici, tu pourrais intégrer un formulaire Formik pour l'édition */}
//             {/* <RiddleEditForm initialValues={riddle} onSubmit={handleUpdate} /> */}
//             <Text>Statut actuel : {riddle.status}</Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
//                <TouchableOpacity onPress={() => handleChangeStatus('active')}><Text>Activer</Text></TouchableOpacity>
//                <TouchableOpacity onPress={() => handleChangeStatus('draft')}><Text>Mettre en brouillon</Text></TouchableOpacity>
//                <TouchableOpacity onPress={() => handleChangeStatus('disabled')}><Text>Désactiver</Text></TouchableOpacity>
//             </View>
//             {riddle.is_private && riddle.password && <Text>Mot de passe: {riddle.password}</Text>}

//             <CollapsibleSection title="Étapes" count={steps?.length}>
//               {steps?.map(step => <Text key={step.id}>Étape {step.order_number}</Text>)}
//               <TouchableOpacity onPress={() => router.push(`/steps/create?riddleId=${id}`)}><Text>+ Ajouter une étape</Text></TouchableOpacity>
//             </CollapsibleSection>

//             <CollapsibleSection title="QR Codes">
//               {steps?.map(step => <Text key={step.id}>QR Étape {step.order_number}: {step.qr_code}</Text>)}
//             </CollapsibleSection>

//             <CollapsibleSection title="Top 5 Classement" count={ranking?.length}>
//               {ranking?.map((rank, i) => <Text key={i}>{rank.name}: {rank.score}</Text>)}
//             </CollapsibleSection>

//             <CollapsibleSection title="Top 5 Avis" count={reviews?.length}>
//                {reviews?.map(review => <Text key={review.id}>{review.name}: {review.rating}/5</Text>)}
//             </CollapsibleSection>

//             <TouchableOpacity onPress={handleDelete} style={{ marginTop: 20 }}><Text style={{ color: 'red' }}>Supprimer l'énigme</Text></TouchableOpacity>
//           </View>
//         )}

//         {/* ==================== VUE PARTICIPANT ACTIF ==================== */}
//         {viewType === 'participant_active' && (
//           <View>
//              <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Partie en cours</Text>
//              {/* Afficher l'étape actuelle si disponible dans currentUserGameSession */}
//              <GradientButton title="Reprendre la partie" onPress={() => router.push(`/game/${currentUserGameSession?.id}/play`)} />
//              {/* Afficher infos viewer aussi */}
//              <CollapsibleSection title="Top 5 Classement" count={ranking?.length}>
//                 {ranking?.map((rank, i) => <Text key={i}>{rank.name}: {rank.score}</Text>)}
//              </CollapsibleSection>
//              <CollapsibleSection title="Top 5 Avis" count={reviews?.length}>
//                 {reviews?.map(review => <Text key={review.id}>{review.name}: {review.rating}/5</Text>)}
//              </CollapsibleSection>
//           </View>
//         )}

//         {/* ==================== VUE PARTICIPANT COMPLÉTÉ ==================== */}
//         {viewType === 'participant_completed' && (
//           <View>
//             <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Partie Terminée</Text>
//             <Text>Votre score final : {currentUserGameSession?.score}</Text>
//             {/* Afficher le temps total, temps par étape, indices utilisés */}
//             <CollapsibleSection title="Détails de votre partie">
//               {currentUserGameSession?.sessionSteps?.map(step => (
//                 <View key={step.id}>
//                   <Text>Étape {step.step_order_number}: Temps {step.duration}s, Indices {step.hint_used_number}</Text>
//                 </View>
//               ))}
//             </CollapsibleSection>
//             {/* Afficher SA review si elle existe */}
//             {/* <UserReview riddleId={id} userId={user.id} /> */}
//             <TouchableOpacity onPress={() => router.push(`/reviews/add/${id}`)}><Text>Laisser/Modifier un avis</Text></TouchableOpacity>
//              <CollapsibleSection title="Top 5 Classement" count={ranking?.length}>
//                 {ranking?.map((rank, i) => <Text key={i}>{rank.name}: {rank.score}</Text>)}
//              </CollapsibleSection>
//           </View>
//         )}

//         {/* ==================== VUE VISITEUR ==================== */}
//         {viewType === 'viewer' && (
//           <View>
//             <Text style={{ marginTop: 15 }}>Note moyenne: {riddle.averageRating?.toFixed(1)}/5</Text>
//             <Text>Difficulté moyenne: {riddle.averageDifficulty?.toFixed(1)}/5</Text>
//             <Text>Nombre d'étapes: {riddle.stepCount}</Text>
//             <GradientButton title="Commencer l'énigme" onPress={() => router.push(`/game/start/${id}`)} />
//              <CollapsibleSection title="Top 5 Classement" count={ranking?.length}>
//                 {ranking?.map((rank, i) => <Text key={i}>{rank.name}: {rank.score}</Text>)}
//              </CollapsibleSection>
//              <CollapsibleSection title="Top 5 Avis" count={reviews?.length}>
//                 {reviews?.map(review => <Text key={review.id}>{review.name}: {review.rating}/5</Text>)}
//              </CollapsibleSection>
//           </View>
//         )}

//       </View>
//     </SecondaryLayout>
//   );
// }





import CommonView from '@/components/(riddles)/common/CommonView';
import CreatedView from '@/components/(riddles)/created/CreatedView2';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRiddleStore } from '@/stores/useRiddleStore2';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';


type ViewType = 'created' | 'common';

export default function RiddleDetailScreen() {
  const [viewType, setViewType] = useState<ViewType>('common');
  const { riddleId } = useLocalSearchParams<{ riddleId: string }>();
  const { user } = useAuthStore();
  const { riddle, isLoading, error } = useRiddleStore(state => state.riddleDetail);
  const { fetchRiddleDetail } = useRiddleStore();

  console.log('user', user)
  console.log('id', riddleId)
  useFocusEffect(
    useCallback(() => {
      if (riddleId && user) {
        fetchRiddleDetail(riddleId);
      }
    }, [riddleId, user, fetchRiddleDetail])
  );

  useEffect(() => {
    if (user?.id === riddle?.creator_id) {
      setViewType('created');
    } else {
      setViewType('common');
    }
  }, [riddle, user]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!isLoading && viewType === 'created') {
    return <CreatedView />
  }

  if (!isLoading && viewType === 'common') {
    return <CommonView />
  }
}