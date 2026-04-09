import { Tabs } from "expo-router";
import { PlaneIcon, ShoppingBasketIcon, TrainFrontIcon } from "lucide-react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Авиа",
          tabBarIcon: ({ color }) => <PlaneIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wagon"
        options={{
          title: "Поезда",
          tabBarIcon: ({ color }) => <TrainFrontIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="basket"
        options={{
          title: "Корзина",
          tabBarIcon: ({ color }) => <ShoppingBasketIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
