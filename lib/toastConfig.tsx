import { ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <SuccessToast
      {...props}
      style={{ 
        borderLeftColor: '#70ff72',
        borderLeftWidth: 10,
      }}
      text1Style={{
        fontSize: 16
      }}
      text2Style={{
        color: '#363636',
        fontSize: 14
      }}
      text2NumberOfLines={null}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ 
        borderLeftColor: '#ff7070',
        borderLeftWidth: 10,
      }}
      text1Style={{
        fontSize: 16
      }}
      text2Style={{
        color: '#363636',
        fontSize: 14
      }}
      text2NumberOfLines={null}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{ 
        borderLeftColor: '#9970ff',
        borderLeftWidth: 10,
      }}
      text1Style={{
        fontSize: 16
      }}
      text2Style={{
        color: '#363636',
        fontSize: 14
      }}
      text2NumberOfLines={null}
    />
  ),
};