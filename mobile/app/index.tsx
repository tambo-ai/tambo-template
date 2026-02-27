import { View, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white p-6">
      <Text className="text-xl font-semibold">Tambo Mobile</Text>
      <Link href="/(tambo)" asChild>
        <TouchableOpacity className="bg-black px-4 py-2 rounded-lg">
          <Text className="text-white">Open Chat</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
