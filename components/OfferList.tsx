import { Offer } from '@/types/search'
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import OfferCard from './OfferCard'

interface OfferListProps {
	offers: Offer[]
}

export default function OfferList({offers}: OfferListProps) {
	 const insets = useSafeAreaInsets();
	 
	return (
		<FlatList
						data={offers}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <OfferCard offer={item} />}
						contentContainerStyle={{ 
							padding: 16, 
							paddingBottom: insets.bottom + 20 
						}}
						ItemSeparatorComponent={() => <View className="h-4" />}
						ListEmptyComponent={() => (
							<View className="items-center justify-center py-20">
								<Text className="text-muted-foreground">Ничего не найдено</Text>
							</View>
						)}
					/>
	)
}
