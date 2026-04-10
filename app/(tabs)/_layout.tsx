import { Tabs } from "expo-router";
import { PlaneIcon, ReceiptTextIcon, TrainFrontIcon } from "lucide-react-native";

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
        name="checkout"
        options={{
          title: "Заказ",
          tabBarIcon: ({ color }) => <ReceiptTextIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
