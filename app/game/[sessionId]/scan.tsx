import FullButton from '@/components/(common)/FullButton';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import { useValidateStep } from '@/hooks/useGame';
import { useThemeStore } from '@/stores/useThemeStore';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, Vibration, View } from 'react-native';


export default function ScanScreen() {
  const { isDark } = useThemeStore();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [isScanning, setIsScanning] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const validateStepMutation = useValidateStep();
  
  const handleBarCodeScanned = async ({ data }: any) => {
    if (!isScanning) return;

    setIsScanning(false);
    Vibration.vibrate();

    validateStepMutation.mutate({id: sessionId, qr_code: data}, {
      onSuccess: (validateStepResponse) => {
        if (validateStepResponse.game_completed) {
          alert('Félicitation ! Énigme réussie !');
          router.replace(`/game/${sessionId}/complete`);
        } else {
          alert('Bravo ! Étape validée !');
          router.dismiss();
        }
      },
      onError: (error: any) => {
        alert(`Une erreur est survenue: ${error.response.data.message}`);
        setTimeout(() => setIsScanning(true), 2000);
      },
    });
  };

  if (!permission || validateStepMutation.isPending) {
    return (
      <LoadingView />
    );
  }

  if (!permission.granted) {
    return (
      <SecondaryLayoutWithoutScrollView>
        <View className='flex-1 py-10 px-6 gap-10 justify-center items-center'>
          <Text className='text-dark dark:text-light text-center'>Veuillez accorder les permissions nécessaires pour afficher la caméra.</Text>
          <FullButton
            onPress={requestPermission}
            title='Donner les permissions'
            border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
            color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
            textColor={isDark ? 'text-dark' : 'text-light'}
          />
        </View>
      </SecondaryLayoutWithoutScrollView>
    );
  }

  return (
    <SecondaryLayoutWithoutScrollView>
      <CameraView 
        style={{flex: 1}}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
       />
    </SecondaryLayoutWithoutScrollView>
  );
}