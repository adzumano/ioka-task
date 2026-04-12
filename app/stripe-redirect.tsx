import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function StripeRedirect() {
  const url = Linking.useLinkingURL();
  const { handleURLCallback } = useStripe();

  useEffect(() => {
    const handleDeepLink = async () => {
      if (url) {
        await handleURLCallback(url);
      }
    };

    handleDeepLink();
  }, [url]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
