import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTamboThreadInput } from '@tambo-ai/react';
import * as Haptics from 'expo-haptics';

export function Composer() {
  const { value, setValue, submit } = useTamboThreadInput();
  const [error, setError] = React.useState<string | null>(null);
  return (
    <View className="p-3 border-t border-gray-200 bg-white dark:bg-black">
      <View className="flex-row items-center gap-2">
        <TextInput
          className="flex-1 border border-gray-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-100"
          placeholder="Type a message"
          value={value}
          onChangeText={(t) => {
            setError(null);
            setValue(t);
          }}
          onSubmitEditing={async () => {
            if (!value.trim()) return;
            try {
              await submit({ streamResponse: true });
            } catch (e: any) {
              setError(e?.message ?? 'Failed to send message');
            }
          }}
          returnKeyType="send"
        />
        <TouchableOpacity
          className="bg-black dark:bg-white rounded-xl px-4 py-2"
          disabled={!value.trim()}
          onPress={async () => {
            if (!value.trim()) return;
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            try {
              await submit({ streamResponse: true });
            } catch (e: any) {
              setError(e?.message ?? 'Failed to send message');
            }
          }}
        >
          <Text className="text-white dark:text-black font-medium">Send</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <Text className="mt-2 text-sm text-red-500" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

