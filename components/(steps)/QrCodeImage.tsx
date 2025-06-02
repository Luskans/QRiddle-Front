import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';


export default function QrCodeImage({ qrcodeValue }: { qrcodeValue: string }) {
  
  return (
    <View>
      <QRCode
        value={qrcodeValue}
        size={200}
        color="black"
        backgroundColor="white"
        logo={require('@/assets/images/logo-dark.png')}
        logoSize={50}
        logoBackgroundColor="white"
        logoBorderRadius={10}
        quietZone={10}
        enableLinearGradient={true}
        linearGradient={['rgb(255,0,0)', 'rgb(0,255,255)']}
      />
    </View>
  );
}
