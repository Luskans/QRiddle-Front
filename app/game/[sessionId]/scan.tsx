import FullButton from '@/components/(common)/FullButton';
import LoadingView from '@/components/(common)/LoadingView';
import SecondaryLayoutWithoutScrollView from '@/components/(layouts)/SecondaryLayoutWithoutScrollView';
import { useValidateStep } from '@/hooks/useGame';
import { useThemeStore } from '@/stores/useThemeStore';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, Vibration, View } from 'react-native';
import Toast from 'react-native-toast-message';


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
          Toast.show({
            type: 'success',
            text1: 'Félicitations',
            text2: 'Énigme réussie !'
          });
          router.navigate(`/game/${sessionId}/complete`);
        } else {
          Toast.show({
            type: 'success',
            text1: 'Bravo',
            text2: 'Étape validée !'
          });
          router.dismiss();
        }
      },
      onError: (error: any) => {
        console.log("dans validate", error)
        console.log("dans validate2", error.message)
        console.log("dans validate3", error.response)

        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
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