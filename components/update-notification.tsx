import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { useServiceWorker } from '@/hooks/use-service-worker';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export function UpdateNotification() {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const colors = useColors();
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isUpdateAvailable) {
      setVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isUpdateAvailable, fadeAnim]);

  const handleUpdate = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      updateServiceWorker();
    });
  };

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        },
      ]}
    >
      <View
        className={cn(
          'mx-4 mb-4 p-4 rounded-xl border',
          'bg-primary border-primary'
        )}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white font-bold text-base mb-1">
              Atualizacao Disponivel
            </Text>
            <Text className="text-white text-sm opacity-90">
              Uma nova versao do Aprova+ esta pronta. Recarregue para atualizar.
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2 mt-4">
          <Pressable
            onPress={handleDismiss}
            className="flex-1 py-2 px-3 rounded-lg bg-white/20"
          >
            <Text className="text-white text-center font-semibold text-sm">
              Depois
            </Text>
          </Pressable>

          <Pressable
            onPress={handleUpdate}
            className="flex-1 py-2 px-3 rounded-lg bg-white"
          >
            <Text className="text-primary text-center font-bold text-sm">
              Atualizar Agora
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
