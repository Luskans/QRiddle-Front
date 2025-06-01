import React from 'react';
import { Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import FullButton from './FullButton';
import GhostButton from './GhostButton';


interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDanger?: boolean;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  isLoading = false,
  isDanger = false,
}: ConfirmationModalProps) {
  const { isDark } = useThemeStore();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="w-4/5 bg-light dark:bg-dark border border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <Text className="text-dark dark:text-light text-xl font-bold mb-2">
                {title}
              </Text>
              <Text className="text-dark dark:text-light mb-6">
                {message}
              </Text>
              <View className="flex-row gap-3">
                <View className='flex-grow'>
                  <GhostButton
                    onPress={onCancel}
                    title={cancelText}
                    color={isDark ? 'border-gray-400' : 'border-gray-500'}
                    textColor={isDark ? 'text-gray-400' : 'text-gray-500'}
                    disabled={isLoading}
                  />
                </View>
                <View className='flex-grow'>
                  <FullButton
                    onPress={onConfirm}
                    title={confirmText}
                    border={isDanger 
                      ? 'border-red-400' 
                      : isDark ? 'border-secondary-lighter' : 'border-secondary-darker'}
                    color={isDanger 
                      ? 'bg-red-400' 
                      : isDark ? 'bg-secondary-lighter' : 'bg-secondary-darker'}
                    textColor={isDark ? 'text-dark' : 'text-light'}
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}