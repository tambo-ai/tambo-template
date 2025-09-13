import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTamboThreadInput } from '@tambo-ai/react';
import * as Haptics from 'expo-haptics';

export function SuggestionsBar() {
  const { setValue, submit, isPending } = useTamboThreadInput() as any;
  const suggestions = [
    { id: 's-1', title: 'Get started', text: 'What can you help me with?' },
    { id: 's-2', title: 'Learn more', text: 'Tell me about your capabilities.' },
    { id: 's-3', title: 'Examples', text: 'Show me some example queries I can try.' },
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-3 pb-2 bg-white dark:bg-black" contentContainerStyle={{ gap: 8 }}>
      {suggestions.map((s) => (
        <TouchableOpacity
          key={s.id}
          className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-full opacity-100"
          disabled={isPending}
          onPress={async () => {
            setValue(s.text);
            await Haptics.selectionAsync();
            await submit({ streamResponse: true });
          }}
        >
          <Text className="text-gray-900 dark:text-gray-100">{s.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

