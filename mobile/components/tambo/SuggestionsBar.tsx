import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTamboThreadInput } from '@tambo-ai/react';

export function SuggestionsBar() {
  const { setValue, submit } = useTamboThreadInput();
  const suggestions = [
    { id: 's-1', title: 'Get started', text: 'What can you help me with?' },
    { id: 's-2', title: 'Learn more', text: 'Tell me about your capabilities.' },
    { id: 's-3', title: 'Examples', text: 'Show me some example queries I can try.' },
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-3 pb-2" contentContainerStyle={{ gap: 8 }}>
      {suggestions.map((s) => (
        <TouchableOpacity
          key={s.id}
          className="bg-gray-100 px-3 py-2 rounded-full"
          onPress={async () => {
            setValue(s.text);
            await submit({ streamResponse: true });
          }}
        >
          <Text className="text-gray-900">{s.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

