import { ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { CollapsibleSection } from "@/components/(common)/CollapsibleSection";
import GhostButton from "@/components/(common)/GhostButton";
import { useThemeStore } from "@/stores/useThemeStore";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import FormField from "@/components/(common)/FormField";
import { hintSchema } from "@/lib/validationSchemas";
import { BACKEND_URL, HINT_MAX_LENGTH } from "@/constants/constants";
import { HintFormData, HintItem } from "@/interfaces/hint";
import { useDeleteHint, useUpdateHint, useUploadHintImage } from "@/hooks/useHints";
import FullButton from "../(common)/FullButton";
import Toast from "react-native-toast-message";
import ConfirmationModal from "../(common)/ConfirmationModal";
// import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import colors from "@/constants/colors";


export default function HintListItem({ hint }: { hint: HintItem }) {
  const { isDark } = useThemeStore();
  const SCREEN_WIDTH = Dimensions.get('window').width - 24;
  const updateHintMutation = useUpdateHint();
  const deleteHintMutation = useDeleteHint();
  // const uploadHintImageMutation = useUploadHintImage();
  const [initialValues, setInitialValues] = useState<HintFormData>({
    type: 'text',
    content: ''
  });
  const [contentByType, setContentByType] = useState({
    text: '',
    image: '',
    audio: ''
  });
  const formikRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [imagePicked, setImagePicked] = useState<any>(null);
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const audioPlayer = useAudioPlayer(audioSource);

  useEffect(() => {
    if (hint) {
      const hintType = (hint.type as 'text' | 'image' | 'audio') || 'text';

      setContentByType({
        text: hintType === 'text' ? hint.content || '' : '',
        image: hintType === 'image' ? hint.content || '' : '',
        audio: hintType === 'audio' ? hint.content || '' : ''
      });

      setInitialValues({
        type: hintType,
        content: hint.content || ''
      });

      hintType === 'image' && setImagePreview(`${BACKEND_URL}${hint.content}`);
      hintType === 'audio' && setAudioSource(`${BACKEND_URL}${hint.content}`);
    }
  }, [hint]);

  const handleUpdate = async (values: HintFormData) => {
    updateHintMutation.mutate({id: hint.id.toString(), data: values}, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text2: 'Indice mis à jour !'
        });

        setContentByType(prev => ({
          ...prev,
          [values.type]: values.content
        }))
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
      },
    });
  };

  // const handleUpdate = async (values: HintFormData) => {
  //   try {
  //     //  --- IMAGE ---
  //     if (values.type === 'image' && values.content && values.content.startsWith('file://')) {
  //       const formData = new FormData();
  //       const uniqueName = crypto.randomUUID();
        
  //       formData.append('image', {
  //         uri: imagePicked.uri,
  //         name: imagePicked.fileName,
  //         type: imagePicked.mimeType,
  //       });
        
  //       uploadHintImageMutation.mutate({id: hint.id.toString(), data: formData}, {
  //         onSuccess: () => {
  //           Toast.show({
  //             type: 'success',
  //             text2: 'Image ajoutée à votre indice !'
  //           });
  //         },
  //         onError: () => {
  //           Toast.show({
  //             type: 'error',
  //             text1: 'Erreur',
  //             text2: `Erreur lors de l'upload de votre image.`
  //           });
  //         },
  //       });
  //     }
      
  //     //  --- ALL ---
  //     updateHintMutation.mutate({id: hint.id.toString(), data: values}, {
  //       onSuccess: () => {
  //         Toast.show({
  //           type: 'success',
  //           text2: 'Indice mis à jour !'
  //         });
          
  //         setContentByType(prev => ({
  //           ...prev,
  //           [values.type]: values.content
  //         }));
          
  //         // if (values.type === 'image') {
  //         //   setImagePreview(values.content);
  //         // }
  //       },
  //       onError: (error: any) => {
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Erreur',
  //           text2: `${error.response.data.message}`
  //         });
  //       },
  //     });

  //   } catch (error) {
  //     console.error('Erreur lors du téléchargement de l\'image:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Erreur',
  //       text2: 'Impossible de télécharger l\'image'
  //     });
  //   }
  // };

  const confirmDelete = async () => {
    deleteHintMutation.mutate(hint.id.toString()), {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text2: 'Indice supprimé.'
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: `${error.response.data.message}`
        });
      },
    };
    setShowDeleteModal(false);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleTypeChange = (newType: ('text' | 'image' | 'audio'), setFieldValue: any) => {
    if (formikRef.current) {
      // @ts-ignore
      const currentValues = formikRef.current.values;
      setContentByType(prev => ({
        ...prev,
        [currentValues.type]: currentValues.content
      }));
    }
    
    setFieldValue('type', newType);
    setFieldValue('content', contentByType[newType]);
  };

  // const pickImage = async (setFieldValue: any) => {
  //   try {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
  //     if (status !== 'granted') {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Permission refusée',
  //         text2: 'Veuillez accorder les permissions nécessaires pour accéder à vos photos.'
  //       });
  //       return;
  //     }
      
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ['images'],
  //       allowsEditing: true,
  //       aspect: [4, 4],
  //       quality: 0.8,
  //     });
      
  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       const selectedImage = result.assets[0];
        
  //       setFieldValue('content', selectedImage.uri);
  //       setImagePreview(selectedImage.uri);
  //       setImagePicked(selectedImage);
  //       setContentByType(prev => ({
  //         ...prev,
  //         image: selectedImage.uri
  //       }));
  //     }

  //   } catch (error) {
  //     console.error('Erreur lors de la sélection de l\'image:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Erreur',
  //       text2: 'Impossible de sélectionner l\'image'
  //     });
  //   }
  // };

  return (
    <CollapsibleSection
      title={`Indice ${hint.order_number}`}
      icon="finger-print"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={hintSchema}
        onSubmit={handleUpdate}
        enableReinitialize
        innerRef={formikRef}
      >
        {({ handleSubmit, values, setFieldValue, isValid, isSubmitting, touched, errors, setFieldTouched }) => (
          <View className="gap-8">

            {/* --- Type de contenu --- */}
            <View className="px-6 gap-3">
              <Text className="text-dark dark:text-light font-semibold mb-1">Type d'indice :</Text>
              <View className='flex-row'>
                <TouchableOpacity
                  // onPress={() => {setFieldValue('type', 'text')}}
                  onPress={() => handleTypeChange('text', setFieldValue)}
                  className="flex-1 flex-row items-center gap-2"
                >
                  <View className={`w-5 h-5 border border-gray-400 rounded-full ${values.type === 'text' ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                  <Text className="text-dark dark:text-light">Texte</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => {setFieldValue('type', 'image')}}
                  onPress={() => handleTypeChange('image', setFieldValue)}
                  className="flex-1 flex-row items-center gap-2"
                >
                  <View className={`w-5 h-5 border border-gray-400 rounded-full ${values.type === 'image' ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                  <Text className="text-dark dark:text-light">Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => {setFieldValue('type', 'audio')}}
                  onPress={() => handleTypeChange('audio', setFieldValue)}
                  className="flex-1 flex-row items-center gap-2"
                >
                  <View className={`w-5 h-5 border border-gray-400 rounded-full ${values.type === 'audio' ? 'bg-secondary-darker dark:bg-secondary-lighter' : ''}`} />
                  <Text className="text-dark dark:text-light">Audio</Text>
                </TouchableOpacity>
              </View>
              {touched.type && errors.type && (<Text className="text-red-500 text-sm mt-1">{errors.type}</Text>)}
            </View>

            {/* --- Contenu --- */}
            <View className='px-6 mb-6'>
              <Text className="text-dark dark:text-light font-semibold mb-4">Contenu de l'indice :</Text>
              {values.type === 'text' && (
                <>
                  <FormField
                    name="content"
                    className="bg-gray-50 border border-gray-300 rounded-lg p-3"
                    multiline
                    numberOfLines={10}
                    maxLength={HINT_MAX_LENGTH}
                    placeholder="Entrez un indice pour le joueur puisse trouver le QR code afin de passer à l'étape suivante..."
                    style={{ height: 150, textAlignVertical: 'top' }}
                  />
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-right">
                    {(values.content ? HINT_MAX_LENGTH - values.content.length : HINT_MAX_LENGTH)} caractères restants
                  </Text>
                </>
              )}
              {values.type === 'image' && (
                <View className="gap-3">
                  {imagePreview ? (
                    <View>
                      <Image 
                        source={{ uri: imagePreview }}
                        className="rounded"
                        resizeMode="cover"
                        style={{ height: SCREEN_WIDTH }}
                        accessibilityLabel='Hint image'
                      />
                    </View>
                  ) : null}
                  
                  {/* <TouchableOpacity 
                    onPress={() => pickImage(setFieldValue)}
                    className="flex-row items-center justify-center bg-gray-100 dark:bg-gray-darker p-4 rounded-lg border border-dashed border-gray-400"
                  >
                    <Ionicons 
                      name="image-outline" 
                      size={24} 
                      color={isDark ? "#fff" : "#333"} 
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-dark dark:text-light">
                      {imagePreview ? "Changer d'image" : "Sélectionner une image"}
                    </Text>
                  </TouchableOpacity> */}

                  <Text className="px-6 py-2 bg-red-200 border border-red-500 text-500 rounded-lg">Fonctionnalité non implémentée: utiliser du texte merci.</Text>
                  
                  {touched.content && errors.content && (
                    <Text className="text-red-500 text-sm mt-1">{errors.content}</Text>
                  )}
                </View>
              )}
              {values.type === 'audio' && (
                <View className="gap-3">
                  {audioSource ? (
                    <View className='flex-row justify-between gap-6'>
                      <TouchableOpacity
                        className={`flex-row flex-1 items-center rounded-lg gap-1 px-6 py-2 border ${audioPlayer.playing ? 'border-secondary-darker dark:border-secondary-lighter' : 'border-dark dark:border-light'}`}
                        onPress={() => {setAudioSource(`${BACKEND_URL}${hint.content}`), audioPlayer.play()}}
                      >
                        {audioPlayer.playing ? (
                          <ActivityIndicator size="small" color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
                        ) : (
                          <Ionicons name="play" size={20} color={isDark ? colors.light : colors.dark} />
                        )}
                        <Text className={`${audioPlayer.playing ? 'text-secondary-darker dark:text-secondary-lighter' : 'text-dark dark:text-light'}`}>Jouer le son</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className='flex-row items-center rounded-lg border gap-1 px-6 py-2 border-dark dark:border-light'
                        onPress={() => audioPlayer.pause()}
                      >
                        <Ionicons name="pause" size={20} color={isDark ? colors.light : colors.dark} />
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <Text className="px-6 py-2 bg-red-200 border border-red-500 text-500 rounded-lg">Fonctionnalité non implémentée: utiliser du texte merci.</Text>

                  {touched.content && errors.content && (
                    <Text className="text-red-500 text-sm mt-1">{errors.content}</Text>
                  )}
                </View>
              )}
            </View>

            {/* --- Bouton de soumission --- */}
            <View className='px-6 flex-1 flex-row gap-3 items-center justify-center'>
              <View className="flex-grow">
                <GhostButton
                  onPress={openDeleteModal}
                  title="Supprimer"
                  color={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                  textColor={isDark ? 'text-primary-lighter' : 'text-primary-darker'}
                  isLoading={deleteHintMutation.isPending}
                  disabled={deleteHintMutation.isPending}
                />
              </View>

              <View className="flex-grow">
                <FullButton
                  onPress={handleSubmit}
                  title="Modifier"
                  border={isDark ? 'border-primary-lighter' : 'border-primary-darker'}
                  color={isDark ? 'bg-primary-lighter' : 'bg-primary-darker'}
                  textColor={isDark ? 'text-dark' : 'text-light'}
                  isLoading={isSubmitting || updateHintMutation.isPending}
                  disabled={isSubmitting || !isValid || updateHintMutation.isPending}
                />
              </View>
            </View>

          </View>
        )}
      </Formik>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Supprimer l'indice"
        message={`Êtes-vous sûr de vouloir supprimer l'indice ${hint.order_number} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        isLoading={deleteHintMutation.isPending}
        isDanger={true}
      />
    </CollapsibleSection>
  );
};