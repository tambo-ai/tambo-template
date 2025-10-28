import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useTambo, type TamboThreadMessage } from '@tambo-ai/react';
import { saveThreadId } from '../../src/hooks/thread-storage';

export function Messages() {
  const { thread } = useTambo();
  React.useEffect(() => {
    if (thread?.id) void saveThreadId(undefined, thread.id);
  }, [thread?.id]);
  const messages: TamboThreadMessage[] = (thread?.messages ?? []) as TamboThreadMessage[];
  return (
    <FlashList
      className="flex-1 p-4 bg-white dark:bg-black"
      data={messages}
      estimatedItemSize={100}
      renderItem={({ item: m }) => {
        const isAssistant = m.role === 'assistant';
        return (
          <View className="w-full mb-3">
            <View className={isAssistant ? 'items-start' : 'items-end'}>
              <View
                className={
                  isAssistant
                    ? 'max-w-[85%] bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3'
                    : 'max-w-[85%] bg-black rounded-2xl rounded-tr-sm px-4 py-3'
                }
              >
                {Array.isArray(m.content) ? (
                  <View className="gap-2">
                    {m.content.map((c: { type: 'text' | 'image_url'; text?: string; image_url?: { url?: string } }, i: number) => (
                      c?.type === 'image_url' && c?.image_url?.url ? (
                        <Image key={i} source={{ uri: c.image_url.url }} className="w-48 h-48 rounded-xl" contentFit="cover" />
                      ) : c?.type === 'text' ? (
                        <Text key={i} className={isAssistant ? 'text-gray-900 dark:text-gray-100 text-base leading-relaxed' : 'text-white text-base leading-relaxed'}>
                          {c.text ?? ''}
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
      }}
      keyExtractor={(m) => m.id ?? `${m.role}-${m.createdAt}`}
    />
  );
}

