import React from 'react';
import { View } from 'react-native';
import { useTamboThread } from '@tambo-ai/react';
import { ThreadHeader } from './ThreadHeader';
import { Messages } from './Messages';
import { SuggestionsBar } from './SuggestionsBar';
import { Composer } from './Composer';
import { HistoryPanel } from './HistoryPanel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSavedThreadId } from '../../src/hooks/thread-storage';

export function TamMobileThread() {
  const { startNewThread } = useTamboThread();
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const { switchCurrentThread } = useTamboThread();

  React.useEffect(() => {
    (async () => {
      const saved = await getSavedThreadId(undefined);
      if (saved) switchCurrentThread(saved);
    })();
  }, [switchCurrentThread]);
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ThreadHeader onNewThread={() => startNewThread()} onOpenHistory={() => setHistoryOpen(true)} />
      <Messages />
      <SuggestionsBar />
      <Composer />
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </SafeAreaView>
  );
}

// Orchestrator imports subcomponents; inner definitions moved into their own files.
