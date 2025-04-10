// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

// export default function VerifyEmailScreen() {
//   const { user, checkEmailVerification } = useAuth();
//   const [isChecking, setIsChecking] = useState(false);
//   const [countdown, setCountdown] = useState(60);

//   useEffect(() => {
//     // Vérifie toutes les 5 secondes si l'email a été vérifié
//     const interval = setInterval(() => {
//       checkEmailVerification();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     // Countdown pour le renvoi d'email
//     if (countdown > 0) {
//       const timer = setInterval(() => {
//         setCountdown(c => c - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [countdown]);

//   const handleResendEmail = async () => {
//     if (countdown > 0) return;
    
//     setIsChecking(true);
//     try {
//       await api.post('/email/resend-verification');
//       setCountdown(60);
//       alert('Email de vérification renvoyé');
//     } catch (error) {
//       alert('Erreur lors de l\'envoi de l\'email');
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-white p-6 items-center justify-center">
//       <Text className="text-2xl font-bold text-center">
//         Vérifiez votre email
//       </Text>

//       <View className="p-4 rounded-lg mb-8">
//         <Text className="text-center">
//           Un email de vérification a été envoyé à{' '}
//           <Text className="font-bold text-secondary">{user?.email}sylvain@mail.com</Text>
//         </Text>
//       </View>

//       <Text className="text-gray-600 text-center mt-4">
//         Veuillez cliquer sur le lien dans l'email pour activer votre compte.
//         La page se mettra à jour automatiquement une fois vérifié.
//       </Text>

//       <TouchableOpacity
//         className={`mt-8 rounded-full py-3 px-6 ${
//           countdown > 0 ? 'bg-gray-300' : 'bg-secondary'
//         }`}
//         onPress={handleResendEmail}
//         disabled={countdown > 0 || isChecking}
//       >
//         {isChecking ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text className="text-white font-semibold">
//             {countdown > 0 
//               ? `Renvoyer l'email (${countdown}s)` 
//               : "Renvoyer l'email"}
//           </Text>
//         )}
//       </TouchableOpacity>

//     </View>
//   );
// }


import SecondaryLayout from '@/components/layouts/SecondaryLayout';
import { View, Text } from 'react-native';

export default function verifyEmailScreen() {
  return (
    <SecondaryLayout>
      <View>
        <Text>Page du verify email</Text>
      </View>
    </SecondaryLayout>
  );
}