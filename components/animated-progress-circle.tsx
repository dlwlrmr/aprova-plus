import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { PremiumAnimations, AnimationInterpolations } from '@/lib/animations';
import { useColors } from '@/hooks/use-colors';

interface AnimatedProgressCircleProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
}

export function AnimatedProgressCircle({
  progress,
  size = 200,
  strokeWidth = 8,
  label = 'Progresso',
  animated = true,
}: AnimatedProgressCircleProps) {
  const colors = useColors();
  const { animatedValue, animate } = PremiumAnimations.createCircleProgressAnimation();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (animated) {
      animate(progress / 100);
    }
  }, [progress, animated]);

  const rotationInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          transform: [{ rotate: rotationInterpolate }],
        }}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.7" />
            </LinearGradient>
          </Defs>

          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.surface}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
      </Animated.View>

      {/* Center text */}
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="text-3xl font-bold text-foreground">
          {Math.round(progress)}%
        </Text>
        <Text className="text-sm text-muted mt-1">{label}</Text>
      </View>
    </View>
  );
}
