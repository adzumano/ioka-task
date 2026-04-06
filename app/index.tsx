import { StatusBar } from 'expo-status-bar'
import { Text, View } from "react-native"

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar/>
      <Text className="text-lg font-bold text-red-600 bg-black">
        React Native(Expo)
      </Text>
    </View>
  );
}
