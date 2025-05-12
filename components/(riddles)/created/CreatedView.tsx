import React, { useCallback, useEffect } from 'react';
import { View, Text, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, useFocusEffect } from 'expo-router';
import { CollapsibleSection } from '@/components/(common)/CollapsibleSection';
import { useThemeStore } from '@/stores/useThemeStore';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import GhostButton from '@/components/(common)/GhostButton';
import UpdateForm from '@/components/(riddles)/created/UpdateForm';
import StepList from '@/components/(riddles)/created/StepList';
import QrCodeList from '@/components/(riddles)/created/QrCodeList';
import ReviewList from '@/components/(riddles)/common/ReviewList';
import TopRiddleLeaderboard from '@/components/(riddles)/common/TopRiddleLeaderboard';
import { Riddle, useRiddleStore } from '@/stores/useRiddleStore2';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { getStatusColor } from '@/lib/getStatusColor';
import { defaultStepsByRiddleState, useStepStore } from '@/stores/useStepStore2';
import GradientButton from '@/components/(common)/GradientButton';

export default function CreatedView({riddle}: {riddle: Riddle}) {
  const { isDark } = useThemeStore();
  const { fetchStepsByRiddle } = useStepStore();
  const { updateRiddle } = useRiddleStore();
  const { steps, isLoading: stepsLoading, error: stepsError } = useStepStore(state => state.stepsByRiddle[riddle.id] || defaultStepsByRiddleState);

  useFocusEffect(
    useCallback(() => {
      // fetchRiddleDetail(id);
      // fetchStepList(id);
      // fetchReviewList(id);
      fetchStepsByRiddle(riddle.id.toString());
    }, [])
  );
  
  // const renderMainButton = () => {
  //   const status = riddleDetail.riddle?.status;

  //   if (status === 'active') {
  //     return (
  //       <GradientButton
  //         onPress={() => updateRiddle(id, { status: 'draft' })}
  //         title="Dépublier"
  //         colors={isDark ? [colors.primary.lighter, colors.primary.lighter] : [colors.primary.darker, colors.primary.darker]}
  //         textColor={isDark ? 'text-dark' : 'text-light'}
  //       />
  //     );
  //   } else if (status === 'draft') {
  //     return (
  //       <GradientButton
  //         onPress={() => updateRiddle(id, { status: 'active' })}
  //         title="Publier"
  //         colors={isDark ? [colors.primary.lighter, colors.primary.lighter] : [colors.primary.darker, colors.primary.darker]}
  //         textColor={isDark ? 'text-dark' : 'text-light'}
  //       />
  //     );
  //   } else {
  //     return (
  //       <GradientButton
  //         onPress={() => updateRiddle(id, { status: 'active' })}
  //         title="Vérifier"
  //         colors={isDark ? [colors.primary.lighter, colors.primary.lighter] : [colors.primary.darker, colors.primary.darker]}
  //         textColor={isDark ? 'text-dark' : 'text-light'}
  //       />
  //     );
  //   }
  // };

  const handleUpdate = () => {
    if (riddle.status == 'draft') {
      updateRiddle(riddle.id.toString(), { status: 'active' })
      alert('Énigme publiée')

    } else if (riddle.status == 'active') {
      updateRiddle(riddle.id.toString(), { status: 'draft' })
      alert('Énigme dépubliée')
    }
  };

  const handleDelete = () => {
    // Ajouter une confirmation avant de supprimer ?
    // Alert.alert("Confirmation", "Voulez-vous vraiment supprimer cette énigme ?", [ { text: "Annuler" }, { text: "Supprimer", onPress: () => deleteRiddle(riddleId) } ]);
    // console.log("Suppression de l'énigme :", id);
    // deleteRiddle(id);
    // Peut-être naviguer en arrière après suppression ? router.back();
  };

  return (
    <SecondaryLayout>
      <View className='py-10 gap-4'>
        <View className='px-6 mb-8'>
          {riddle.is_private && (
            <View className='flex-row gap-3 items-center'>
              <TextInput
                className='flex-1 bg-gray-200 text-gray-600 border rounded-lg p-2 border-gray-300'
                value="password test"
                editable={false}
              />
              <View className='border border-dark dark:border-light p-2 border rounded-lg'>
                <Ionicons name="copy-outline" size={18} color={isDark ? colors.light : colors.dark } />
              </View>
            </View>
          )}
        </View>
        
        <CollapsibleSection
          title="Informations générales"
          icon="information-circle-outline"
        >
          <UpdateForm riddleId={riddle.id.toString()} />
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="Etapes"
          icon="footsteps-outline"
          number={steps?.length ?? 0}
        >
          {stepsLoading && <ActivityIndicator />}
          {stepsError && <Text style={{ color: 'red' }}>{stepsError}</Text>}
          {!stepsLoading && !stepsError && (steps.length === 0) && <Text>Aucune étape pour cette énigme.</Text>}
          {!stepsLoading && !stepsError && (steps.length > 0) && <StepList steps={steps} />}
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="QR codes"
          icon="qr-code-outline"
        >
          {stepsLoading && <ActivityIndicator />}
          {stepsError && <Text style={{ color: 'red' }}>{stepsError}</Text>}
          {!stepsLoading && !stepsError && (steps.length === 0) && <Text>Aucun QR code pour cette énigme.</Text>}
          {!stepsLoading && !stepsError && (steps.length > 0) && <QrCodeList steps={steps} />}
        </CollapsibleSection>

        <CollapsibleSection
          title="Avis"
          icon="chatbubble-ellipses-outline"
          number={riddle.reviewsCount ?? 0}
        >
          <ReviewList riddleId={riddle.id.toString()} />
        </CollapsibleSection>

        <CollapsibleSection 
          title="Classement"
          icon="trophy-outline"
        >
          <TopRiddleLeaderboard riddleId={riddle.id.toString()} />
        </CollapsibleSection>

        <Text className={`${getStatusColor(riddle.status)} w-auto self-center text-sm py-0.5 px-2.5 rounded-full mt-8`}>
          { riddle.status }
        </Text>

        <View className='px-6 flex-1 flex-row gap-3 items-center justify-center'>
          <GradientButton
            onPress={() => handleUpdate()}
            title={ riddle.status == "draft" ? "Publier" : "Dépublier"}
            colors={isDark ? [colors.primary.lighter, colors.primary.lighter] : [colors.primary.darker, colors.primary.darker]}
            textColor={isDark ? 'text-dark' : 'text-light'}
            disabled={steps.length <= 0}
          />

          <GhostButton
            onPress={handleDelete}
            title="Supprimer"
            color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
            textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
          />
        </View>
      </View>
    </SecondaryLayout>
  );
}