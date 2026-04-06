import { useColorScheme } from '@/hooks/use-color-scheme'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { Stack } from "expo-router"
import { StatusBar } from 'expo-status-bar'
import "../global.css"

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack screenOptions={{
      headerShown: false
    }} />
    <StatusBar style="auto" />
    <PortalHost/>
  </ThemeProvider>
}
