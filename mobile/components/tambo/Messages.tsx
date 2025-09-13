import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useTambo } from '@tambo-ai/react';
import { saveThreadId } from '../../src/hooks/thread-storage';

export function Messages() {
  const { thread } = useTambo();
  React.useEffect(() => {
    if (thread?.id) void saveThreadId(undefined, thread.id);
  }, [thread?.id]);
  return (
    <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 12 }}>
      {(thread?.messages ?? []).map((m) => (
        <View key={m.id} className="w-full">
          {Array.isArray(m.content) ? (
            <View className="gap-2">
              {m.content.map((c: any, i: number) => (
                c?.type === 'image_url' && c?.image_url?.url ? (
                  <Image key={i} source={{ uri: c.image_url.url }} className="w-48 h-48 rounded-md" contentFit="cover" />
                ) : c?.type === 'text' ? (
                  <Text key={i} className="text-base leading-relaxed">{c.text}</Text>
                ) : null
              ))}
            </View>
          ) : typeof m.content === 'string' ? (
            <Text className="text-base leading-relaxed">{m.content}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

