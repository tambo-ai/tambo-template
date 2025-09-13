import AsyncStorage from '@react-native-async-storage/async-storage';

const THREAD_KEY_PREFIX = 'tambo:thread:';

export async function saveThreadId(contextKey: string | undefined, threadId: string) {
  const key = THREAD_KEY_PREFIX + (contextKey ?? 'default');
  await AsyncStorage.setItem(key, threadId);
}

export async function getSavedThreadId(contextKey: string | undefined) {
  const key = THREAD_KEY_PREFIX + (contextKey ?? 'default');
  return AsyncStorage.getItem(key);
}

