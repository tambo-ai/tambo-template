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
    <ScrollView className="flex-1 p-4 bg-white dark:bg-black" contentContainerStyle={{ gap: 12 }}>
      {(thread?.messages ?? []).map((m) => {
        const isAssistant = m.role === 'assistant';
        return (
          <View key={m.id} className="w-full">
            <View className={isAssistant ? 'items-start' : 'items-end'}>
              <View
                className={
                  isAssistant
                    ? 'max-w-[85%] bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3'
                    : 'max-w-[85%] bg-black rounded-2xl px-4 py-3'
                }
              >
                {Array.isArray(m.content) ? (
                  <View className="gap-2">
                    {m.content.map((c: any, i: number) => (
                      c?.type === 'image_url' && c?.image_url?.url ? (
                        <Image key={i} source={{ uri: c.image_url.url }} className="w-48 h-48 rounded-xl" contentFit="cover" />
                      ) : c?.type === 'text' ? (
                        <Text key={i} className={isAssistant ? 'text-gray-900 dark:text-gray-100 text-base leading-relaxed' : 'text-white text-base leading-relaxed'}>
                          {c.text}
                        </Text>
                      ) : null
                    ))}
                  </View>
                ) : typeof m.content === 'string' ? (
                  <Text className={isAssistant ? 'text-gray-900 dark:text-gray-100 text-base leading-relaxed' : 'text-white text-base leading-relaxed'}>
                    {m.content}
                  </Text>
                ) : null}
              </View>
              {m.role === 'assistant' && m.renderedComponent ? (
                <View className="mt-2 max-w-[95%]">
                  {m.renderedComponent}
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

