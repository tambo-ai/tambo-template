import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Plus, History } from 'lucide-react-native';

type ThreadHeaderProps = {
  onNewThread: () => Promise<void> | void;
  onOpenHistory: () => void;
  title?: string;
};

export function ThreadHeader({ onNewThread, onOpenHistory, title = 'Tambo' }: ThreadHeaderProps) {
  return (
    <LinearGradient
      colors={["#ffffff", "#f8fafc"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}
    >
      <View className="px-4 py-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">{title}</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="New thread"
            className="bg-black px-3 py-2 rounded-lg"
            onPress={async () => {
              await Haptics.selectionAsync();
              await onNewThread();
            }}
          >
            <View className="flex-row items-center gap-2">
              <Plus size={18} color="#fff" />
              <Text className="text-white font-medium">New</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open thread history"
            className="bg-gray-100 px-3 py-2 rounded-lg"
            onPress={async () => {
              await Haptics.selectionAsync();
              onOpenHistory();
            }}
          >
            <View className="flex-row items-center gap-2">
              <History size={18} color="#111827" />
              <Text className="text-gray-900 font-medium">History</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

