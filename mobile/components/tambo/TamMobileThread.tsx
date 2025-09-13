import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTambo, useTamboThread, useTamboThreadInput, useTamboThreadList, type TamboThread } from '@tambo-ai/react';
import { saveThreadId } from '../../src/hooks/thread-storage';

export function TamMobileThread() {
  return (
    <View className="flex-1 bg-white">
      <ThreadHeader />
      <Messages />
      <SuggestionsBar />
      <Composer />
      <HistoryModal />
    </View>
  );
}

function ThreadHeader() {
  const { startNewThread } = useTamboThread();
  const { refetch } = useTamboThreadList({});
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Tambo</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="bg-gray-100 px-3 py-2 rounded-lg"
            onPress={async () => {
              await startNewThread();
              await refetch();
            }}
          >
            <Text className="text-gray-900">New</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-3 py-2 rounded-lg" onPress={() => setOpen(true)}>
            <Text className="text-gray-900">History</Text>
          </TouchableOpacity>
        </View>
      </View>
      <HistoryModal openExternal={open} onCloseExternal={() => setOpen(false)} />
    </>
  );
}

function Messages() {
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

function SuggestionsBar() {
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

function Composer() {
  const { value, setValue, submit } = useTamboThreadInput();
  return (
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
  );
}

function HistoryModal({ openExternal, onCloseExternal }: { openExternal?: boolean; onCloseExternal?: () => void }) {
  const { data: threads } = useTamboThreadList({});
  const { switchCurrentThread } = useTamboThread();
  const [open, setOpen] = React.useState(false);
  const visible = openExternal ?? open;
  const setVisible = openExternal === undefined ? setOpen : (v: boolean) => (v ? undefined : onCloseExternal?.());
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={() => (openExternal ? onCloseExternal?.() : setOpen(false))}>
      <View className="flex-1 bg-white">
        <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
          <Text className="text-lg font-semibold">Threads</Text>
          <Pressable className="px-3 py-2" onPress={() => (openExternal ? onCloseExternal?.() : setOpen(false))}>
            <Text className="text-blue-600">Close</Text>
          </Pressable>
        </View>
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 8 }}>
          {(threads?.items ?? []).map((t: TamboThread) => (
            <TouchableOpacity
              key={t.id}
              className="p-3 rounded-lg border border-gray-200"
              onPress={() => {
                switchCurrentThread(t.id);
                openExternal ? onCloseExternal?.() : setOpen(false);
              }}
            >
              <Text className="font-medium">{t.name ?? `Thread ${t.id.slice(0, 8)}`}</Text>
              <Text className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

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
