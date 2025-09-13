import React from 'react';
import { View } from 'react-native';
import { useTamboThread } from '@tambo-ai/react';
import { ThreadHeader } from './ThreadHeader';
import { Messages } from './Messages';
import { SuggestionsBar } from './SuggestionsBar';
import { Composer } from './Composer';
import { HistoryPanel } from './HistoryPanel';

export function TamMobileThread() {
  const { startNewThread } = useTamboThread();
  const [historyOpen, setHistoryOpen] = React.useState(false);
  return (
    <View className="flex-1 bg-white">
      <ThreadHeader onNewThread={() => startNewThread()} onOpenHistory={() => setHistoryOpen(true)} />
      <Messages />
      <SuggestionsBar />
      <Composer />
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </View>
  );
}

// Orchestrator imports subcomponents; inner definitions moved into their own files.

import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTambo, useTamboThreadInput } from '@tambo-ai/react';
import { Image } from 'expo-image';

export function TamMobileThread() {
  const { thread } = useTambo();
  const { value, setValue, submit } = useTamboThreadInput();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 8 }}>
        {(thread?.messages ?? []).map((m) => (
          <View key={m.id} className="w-full">
            {Array.isArray(m.content) ? (
              <View className="gap-2">
                {m.content.map((c, i) => (
                  c.type === 'image_url' && c.image_url?.url ? (
                    <Image key={i} source={{ uri: c.image_url.url }} className="w-32 h-32 rounded-md" contentFit="cover" />
                  ) : c.type === 'text' ? (
                    <Text key={i} className="text-base">{c.text}</Text>
                  ) : null
                ))}
              </View>
            ) : typeof m.content === 'string' ? (
              <Text className="text-base">{m.content}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
      <View className="p-3 border-t border-gray-200">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Type a message"
            value={value}
            onChangeText={setValue}
            onSubmitEditing={async () => {
              if (!value.trim()) return;
              await submit({ streamResponse: true });
            }}
            returnKeyType="send"
          />
          <TouchableOpacity
            className="bg-black rounded-lg px-4 py-2"
            disabled={!value.trim()}
            onPress={async () => {
              if (!value.trim()) return;
              await submit({ streamResponse: true });
            }}
          >
            <Text className="text-white font-medium">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
