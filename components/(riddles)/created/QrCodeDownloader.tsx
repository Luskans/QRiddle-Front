import React, { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import colors from '@/constants/colors';
import { useThemeStore } from '@/stores/useThemeStore';
import { StepItem } from '@/interfaces/riddle';


export default function QrCodeDownloader({ steps, riddleTitle }: {steps: StepItem[], riddleTitle: string}) {
  const { isDark } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);

  const generateQrCodeHtml = () => {
    let html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #333;
              margin-bottom: 10px;
            }
            h2 {
              text-align: center;
              color: #333;
              margin-bottom: 30px;
            }
            .qr-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 30px;
            }
            .qr-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 30px;
            }
            .qr-label {
              margin-bottom: 10px;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
            }
            .qr-message {
              width: 80px;
              margin-top: 10px;
              font-size: 10px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h1>QRiddle</h1>
          <h2>Énigme : ${riddleTitle}</h1>
          <div class="qr-container">
    `;

    steps.forEach((step) => {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(step.qr_code)}`;
      
      html += `
        <div class="qr-item">
          <p class="qr-label">Étape ${step.order_number}</p>
          <img src="${qrCodeUrl}" width="80" height="80" />
          <p class="qr-message">Na pas toucher, étape du jeu mobile QRiddle.</p>
        </div>
      `;
    });

    html += `
          </div>
        </body>
      </html>
    `;

    return html;
  };

  const downloadQrCodes = async () => {
    try {
      setIsLoading(true);
      
      const html = generateQrCodeHtml();
      
      const { uri } = await Print.printToFileAsync({ 
        html,
        base64: false
      });
      
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Télécharger les QR codes',
          UTI: 'com.adobe.pdf'
        });
        
      } else {
        alert('Le partage n\'est pas disponible sur cet appareil');
      }

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      className='flex-row items-center justify-center gap-2 py-2'
      onPress={downloadQrCodes}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
      ) : (
        <Ionicons name="download-outline" size={20} color={isDark ? colors.secondary.lighter : colors.secondary.darker} />
      )}
      <Text className='text-secondary-darker dark:text-secondary-lighter font-semibold'>
        {isLoading ? 'Génération en cours...' : 'Télécharger les QR codes'}
      </Text>
    </TouchableOpacity>
  );
}