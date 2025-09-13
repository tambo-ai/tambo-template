import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Animated, Dimensions } from 'react-native';
import { FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTamboThreadList, useTamboThread, type TamboThread } from '@tambo-ai/react';
import { Search, X } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

type HistoryPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function HistoryPanel({ open, onClose }: HistoryPanelProps) {
  const { data: threads, refetch } = useTamboThreadList({});
  const { switchCurrentThread } = useTamboThread();
  const [query, setQuery] = React.useState('');
  const translateX = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: open ? 0 : SCREEN_WIDTH,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  }, [open, translateX]);

  const items = React.useMemo(() => {
    const list = threads?.items ?? [];
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter((t) => (t.name?.toLowerCase().includes(q) ?? false) || t.id.toLowerCase().includes(q));
  }, [threads?.items, query]);

  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={{ position: 'absolute', inset: 0 }}>
      {open && (
        <Pressable style={{ position: 'absolute', inset: 0 }} onPress={onClose}>
          <BlurView intensity={25} tint="light" style={{ position: 'absolute', inset: 0 }} />
        </Pressable>
      )}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: Math.min(360, SCREEN_WIDTH * 0.9),
          transform: [{ translateX }],
          backgroundColor: 'white',
          borderLeftWidth: 1,
          borderLeftColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 12,
        }}
      >
      <View className="flex-1">
        <View className="px-4 py-3 border-b border-gray-200 bg-white flex-row items-center justify-between">
          <Text className="text-base font-semibold">History</Text>
          <Pressable className="p-2" onPress={onClose}>
            <X size={18} color="#111827" />
          </Pressable>
        </View>
        <View className="px-4 py-3 border-b border-gray-200 bg-white">
          <View className="flex-row items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={16} color="#6b7280" />
            <TextInput
              placeholder="Search threads"
              className="flex-1"
              value={query}
              onChangeText={(t) => setQuery(t)}
              onSubmitEditing={() => refetch()}
              returnKeyType="search"
            />
          </View>
        </View>
        <View className="flex-1 px-4 py-3 bg-white">
          <FlatList
            data={items}
            keyExtractor={(t) => t.id}
            renderItem={({ item: t }) => (
              <TouchableOpacity
                className="p-3 rounded-xl border border-gray-200 mb-2 bg-white"
                accessibilityLabel={`Switch to thread ${t.name ?? t.id}`}
                onPress={() => {
                  switchCurrentThread(t.id);
                  onClose();
                }}
              >
                <Text className="font-medium">{t.name ?? `Thread ${t.id.slice(0, 8)}`}</Text>
                <Text className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Animated.View>
    </View>
  );
}

