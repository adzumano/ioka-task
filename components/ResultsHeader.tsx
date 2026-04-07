import { Button } from '@/components/ui/button'
import { Settings2Icon } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

interface ResultsHeaderProps {
	filteredOffersLength?: number;
	activeCount: number;
	onOpenPress: () => void
}

export default function ResultsHeader({filteredOffersLength=0, activeCount, onOpenPress}: ResultsHeaderProps) {
	return (
		 <View className="flex-row justify-between items-center p-4 border-b border-border bg-background">
        <View>
          <Text className="text-xl font-bold text-foreground">Результаты</Text>
          <Text className="text-xs text-muted-foreground">{filteredOffersLength} вариантов найдено</Text>
        </View>
        <Button
          variant="outline"
          className="relative border-border"
          onPress={onOpenPress} 
        >
          <Settings2Icon size={18} className="text-foreground" />
          {activeCount > 0 && (
            <View className="absolute -top-2 -right-2 bg-primary h-5 w-5 rounded-full items-center justify-center border-2 border-background">
              <Text className="text-[10px] text-primary-foreground font-bold">{activeCount}</Text>
            </View>
          )}
        </Button>
      </View>
	)
}
