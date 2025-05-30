import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { CollapsibleSection } from '@/components/(common)/CollapsibleSection';
import { useThemeStore } from '@/stores/useThemeStore';
import SecondaryLayout from '@/components/(layouts)/SecondaryLayout';
import GhostButton from '@/components/(common)/GhostButton';
import RiddleUpdateForm from '@/components/(riddles)/created/UpdateForm';
import StepList from '@/components/(riddles)/created/StepList';
import QrCodeList from '@/components/(riddles)/created/QrCodeList';
import TopReviewList from '@/components/(riddles)/common/TopReviewsList';
import TopRiddleLeaderboard from '@/components/(riddles)/common/TopRiddleLeaderboard';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { getStatusColor, getStatusName } from '@/lib/getStatusColor';
import GradientButton from '@/components/(common)/GradientButton';
import Separator from '@/components/(common)/Separator';
import * as Clipboard from 'expo-clipboard';
import { RiddleDetail } from '@/interfaces/riddle';
import { useDeleteRiddle, useUpdateRiddle } from '@/hooks/useRiddles';
import QrCodeDownloader from './QrCodeDownloader';
import FullButton from '@/components/(common)/FullButton';


export default function CreatedView({ riddle }: { riddle: RiddleDetail }) {
  const { isDark } = useThemeStore();
  const [copied, setCopied] = useState<boolean>(false);
  const updateRiddleMutation = useUpdateRiddle();
  const deleteRiddleMutation = useDeleteRiddle();

  const handleUpdate = async () => {
    if (riddle.status === 'draft') {
      updateRiddleMutation.mutate({id: riddle.id.toString(), data: {status: 'published'}}, {
        onSuccess: () => {
          alert('Énigme publiée');
        },
        onError: (error) => {
          alert(`Une erreur est survenue: ${error.response.data.message}`);
        },
      });

    } else if (riddle.status === 'published') {
      updateRiddleMutation.mutate({id: riddle.id.toString(), data: {status: 'draft'}}, {
        onSuccess: () => {
          alert('Énigme dépubliée');
        },
        onError: (error) => {
          alert(`Une erreur est survenue: ${error.response.data.message}`);
        },
      });
    }
  };

  const handleDelete = async () => {
    deleteRiddleMutation.mutate(riddle.id.toString()), {
      onSuccess: () => {
        alert('Énigme supprimée');
        router.dismissAll();
      },
      onError: (error: any) => {
        alert(`Une erreur est survenue: ${error.response.data.message}`);
      },
    };
  };

  const copyToClipboard = async () => {
    if (!riddle.password) {
      return;
    }

    try {
      await Clipboard.setStringAsync(riddle.password);
      setCopied(true);
      // TODO : toast Mot de passe copié !  
      alert('Mot de passe copié !');
      setTimeout(() => setCopied(false), 2000);

    } catch (error) {
      // TODO : toast Mot de passe copié !  
      alert('Impossible de copier le mot de passe');
    }
  };

  return (
    <SecondaryLayout>
      <View className='py-10 gap-4'>
        <View className='px-6 mb-8'>
          {riddle.is_private && (
            <View className='flex-row gap-3 items-center'>
              <Text className='text-dark dark:text-light font-semibold'>Mot de passe :</Text>
              <Text className='flex-1 text-dark dark:text-light border rounded-lg p-2 border-dark dark:border-light text-center'>{riddle.password}</Text>
              <TouchableOpacity
                className='border border-dark dark:border-light p-2 border rounded-lg'
                onPress={copyToClipboard}
              >
                <Ionicons name="copy-outline" size={18} color={isDark ? colors.light : colors.dark} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <CollapsibleSection
          title="Informations générales"
          icon="information-circle-outline"
        >
          <RiddleUpdateForm riddle={riddle} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Etapes"
          icon="footsteps-outline"
          number={riddle.stepsCount}
        >
          {riddle.steps.length > 0 ? (
            <StepList steps={riddle.steps}></StepList>
          ) : (
            <Text className='px-6 text-dark dark:text-light'>Aucune étape pour le moment.</Text>
          )}

          <Link href={`/steps/riddles/${riddle.id}/create`} asChild className='flex-1 justify-center mt-6'>
            <TouchableOpacity className='flex-row items-center gap-1'>
              <Ionicons name="add-circle-outline" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>Ajouter une étape</Text>
            </TouchableOpacity>
          </Link>
        </CollapsibleSection>

        <CollapsibleSection
          title="QR codes"
          icon="qr-code-outline"
        >
          {riddle.steps.length > 0 ? (
            <>
              <QrCodeList steps={riddle.steps} />

              <View className='flex-row justify-center mt-6'>
                <QrCodeDownloader steps={riddle.steps} riddleTitle={riddle.title} />
              </View>
            </>
          ) : (
            <Text className='px-6 text-dark dark:text-light'>Aucune étape pour le moment.</Text>
          )}

        </CollapsibleSection>

        <CollapsibleSection
          title="Avis"
          icon="chatbubble-ellipses-outline"
          number={riddle.reviewsCount}
        >
          <View>
            <View className="flex-row justify-center gap-6">
              <View className="flex-row items-center gap-1">
                <Ionicons name="star-outline" size={18} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
                <Text className="text-gray-400 dark:text-gray-400 text-lg">
                  Note :
                  <Text className="font-semibold text-secondary-darker dark:text-secondary-lighter"> {riddle.averageRating || '-'}</Text>
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="trending-up-sharp" size={22} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
                <Text className="text-gray-400 dark:text-gray-400 text-lg">
                  Difficulté :
                  <Text className="font-semibold text-secondary-darker dark:text-secondary-lighter"> {riddle.averageDifficulty  || '-'}</Text>
                </Text>
              </View>
            </View>
            <View className="self-center mt-6 mb-6 w-[200px] h-[1px] bg-gray-300 dark:bg-gray-600" />
          </View>

          <TopReviewList riddleId={riddle.id.toString()} />

          <Link href={`/reviews/riddle/${riddle.id.toString()}`} asChild className='flex-1 justify-center mt-6'>
            <TouchableOpacity className='flex-row items-center gap-1'>
              <Ionicons name="arrow-forward" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>Voir tous les avis</Text>
            </TouchableOpacity>
          </Link>
        </CollapsibleSection>

        <CollapsibleSection
          title="Classement"
          icon="trophy-outline"
        >
          <TopRiddleLeaderboard riddleId={riddle.id.toString()} />

          <Link href={`/leaderboards/riddle/${riddle.id.toString()}`} asChild className='flex-1 justify-center mt-6 mb-8'>
            <TouchableOpacity className='flex-row items-center gap-1'>
              <Ionicons name="arrow-forward" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
              <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>Voir le classement complet</Text>
            </TouchableOpacity>
          </Link>
          <Separator />
        </CollapsibleSection>

        <Text className={`${getStatusColor(riddle.status)} w-auto self-center text-sm py-0.5 px-2.5 rounded-full mt-8`}>
          {getStatusName(riddle.status)}
        </Text>

        <View className='px-6 flex-1 flex-row gap-3 items-center justify-center'>
          <GradientButton
            onPress={handleUpdate}
            title={riddle.status == "draft" ? "Publier" : "Dépublier"}
            colors={isDark ? [colors.primary.lighter, colors.primary.lighter] : [colors.primary.darker, colors.primary.darker]}
            textColor={isDark ? 'text-dark' : 'text-light'}
            disabled={riddle.stepsCount <= 0 || updateRiddleMutation.isPending}
            isLoading={updateRiddleMutation.isPending}
          />

          <FullButton
            onPress={handleUpdate}
            title={riddle.status == "draft" ? "Publier" : "Dépublier"}
            border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
            color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
            textColor={isDark ? 'text-dark' : 'text-light'}
            disabled={riddle.stepsCount <= 0 || updateRiddleMutation.isPending}
            isLoading={updateRiddleMutation.isPending}
          />

          <GhostButton
            onPress={handleDelete}
            title="Supprimer"
            color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
            textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
            isLoading={deleteRiddleMutation.isPending}
            disabled={deleteRiddleMutation.isPending}
          />
        </View>

        {(riddle.stepsCount <= 0) && <Text className='px-6 text-sm text-gray-500 dark:text-gray-400 text-center'>Ajoutez une étape avec un indice pour publier l'énigme</Text>}
      </View>

    </SecondaryLayout>
  );
}