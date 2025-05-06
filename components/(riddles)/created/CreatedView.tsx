import React, { useCallback, useEffect } from 'react';
import { View, Text, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, useFocusEffect } from 'expo-router';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import { CollapsibleSection } from '@/components/(common)/CollapsibleSection';
import { useThemeStore } from '@/stores/useThemeStore';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import GradientButton from '@/components/(common)/GradientButton';
import GhostButton from '@/components/(common)/GhostButton';
import { useRiddleStore } from '@/stores/useRiddleStore';
import { useStepStore } from '@/stores/useStepStore';
import { useReviewStore } from '@/stores/useReviewStore';
// import { useLeaderboardStore } from '@/stores/useGlobalScoreStore';
import UpdateForm from '@/components/(riddles)/UpdateForm';
import StepList from '@/components/(riddles)/StepList';
import QrCodeList from '@/components/(riddles)/QrCodeList';
import ReviewList from '@/components/(riddles)/ReviewList';
import TopRiddleLeaderboard from '@/components/(riddles)/common/TopRiddleLeaderboard';

export default function CreatedView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // const { riddleDetail, updateRiddle, deleteRiddle, fetchRiddleDetail } = useRiddleStore();
  // const { stepList, fetchStepList } = useStepStore();
  // const { reviewList, fetchReviewList } = useReviewStore();
  // const { gameLeaderboard, fetchGameLeaderboard } = useLeaderboardStore();
  const { isDark } = useThemeStore();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        // fetchRiddleDetail(id);
        fetchStepList(id);
        // fetchReviewList(id);
        // fetchRiddleLeaderboard(id);
      }
    }, [id, fetchStepList])
  );
  console.log("step list", stepList)
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

  const handleDelete = () => {
    // Ajouter une confirmation avant de supprimer ?
    // Alert.alert("Confirmation", "Voulez-vous vraiment supprimer cette énigme ?", [ { text: "Annuler" }, { text: "Supprimer", onPress: () => deleteRiddle(riddleId) } ]);
    console.log("Suppression de l'énigme :", id);
    // deleteRiddle(id);
    // Peut-être naviguer en arrière après suppression ? router.back();
  };

  return (
    <SecondaryLayout>
      <View className='py-10 gap-4'>
        {/* <View className='px-6 mb-8'>
          <Text
            className='text-xl text-dark dark:text-light font-semibold mb-1'
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {riddleDetail.riddle.title}
          </Text>
          {riddleDetail.riddle.is_private
            ? <View className='flex-row gap-3 items-center'>
                <TextInput
                  className='flex-1 bg-gray-200 text-gray-600 border rounded-lg p-2 border-gray-300'
                  value="password test"
                  editable={false}
                />
                <View className='border border-dark dark:border-light p-2 border rounded-lg'>
                  <Ionicons name="copy-outline" size={18} color={isDark ? colors.light : colors.dark } />
                </View>
              </View>
            : ''
          }
        </View> */}
        
        <CollapsibleSection
          title="Informations générales"
          icon="information-circle-outline"
        >
          <UpdateForm />
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="Etapes"
          icon="footsteps-outline"
          number={stepList.steps.length}
        >
          <StepList stepList={stepList} />
        </CollapsibleSection>
        
        <CollapsibleSection 
          title="QR codes"
          icon="qr-code-outline"
        >
          <QrCodeList stepList={stepList} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Avis"
          icon="chatbubble-ellipses-outline"
        >
          <ReviewList />
        </CollapsibleSection>

        {/* <CollapsibleSection 
          title="Classement"
          icon="trophy-outline"
        >
          <Leaderboard ranking={} userRank={}/>
        </CollapsibleSection> */}

        {/* <Text className={`${getStatusColor(riddleDetail.riddle.status)} w-auto self-center text-sm py-0.5 px-2.5 rounded-full mt-8`}>
          { riddleDetail.riddle.status }
        </Text> */}

        <View className='px-6 flex-1 flex-row gap-3 items-center justify-center'>
          {/* {renderMainButton()} */}

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