import { Animated, Easing } from 'react-native';

/**
 * Animações Premium para Aprova+
 * Microanimações para aumentar satisfação visual e retenção
 */

export class PremiumAnimations {
  /**
   * Animar preenchimento de barra de progresso
   */
  static createProgressBarAnimation(duration = 800) {
    const animatedValue = new Animated.Value(0);

    const animate = (toValue: number) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    return { animatedValue, animate };
  }

  /**
   * Animar conclusão de tarefa com bounce
   */
  static createCompletionAnimation() {
    const scaleValue = new Animated.Value(1);
    const opacityValue = new Animated.Value(1);

    const animate = () => {
      Animated.sequence([
        // Bounce para cima
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 200,
          easing: Easing.out(Easing.elastic(1.2)),
          useNativeDriver: true,
        }),
        // Voltar ao normal
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.elastic(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { scaleValue, opacityValue, animate };
  }

  /**
   * Animar streak com fogo
   */
  static createStreakAnimation() {
    const rotateValue = new Animated.Value(0);
    const scaleValue = new Animated.Value(1);

    const animate = () => {
      Animated.parallel([
        Animated.loop(
          Animated.timing(rotateValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    return { rotateValue, scaleValue, animate };
  }

  /**
   * Animar círculo de progresso
   */
  static createCircleProgressAnimation(duration = 1000) {
    const animatedValue = new Animated.Value(0);

    const animate = (toValue: number) => {
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    return { animatedValue, animate };
  }

  /**
   * Animar entrada de tela (fade + slide)
   */
  static createScreenEntryAnimation() {
    const fadeValue = new Animated.Value(0);
    const slideValue = new Animated.Value(50);

    const animate = () => {
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { fadeValue, slideValue, animate };
  }

  /**
   * Animar saída de tela (fade + slide)
   */
  static createScreenExitAnimation() {
    const fadeValue = new Animated.Value(1);
    const slideValue = new Animated.Value(0);

    const animate = () => {
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideValue, {
          toValue: -50,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { fadeValue, slideValue, animate };
  }

  /**
   * Animar medalha desbloqueada
   */
  static createMedalAnimation() {
    const scaleValue = new Animated.Value(0);
    const rotateValue = new Animated.Value(0);

    const animate = () => {
      Animated.sequence([
        // Entrada com rotação
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1.3,
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
          Animated.timing(rotateValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Voltar ao tamanho normal
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { scaleValue, rotateValue, animate };
  }

  /**
   * Animar pulso (para elementos destacados)
   */
  static createPulseAnimation() {
    const opacityValue = new Animated.Value(1);

    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.5,
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    return { opacityValue, animate };
  }

  /**
   * Animar shimmer (carregamento)
   */
  static createShimmerAnimation() {
    const shimmerValue = new Animated.Value(0);

    const animate = () => {
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    };

    return { shimmerValue, animate };
  }

  /**
   * Animar confete (celebração)
   */
  static createConfettiAnimation() {
    const animations = Array.from({ length: 10 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }));

    const animate = () => {
      animations.forEach((anim, index) => {
        const delay = index * 50;
        const duration = 2000;

        setTimeout(() => {
          Animated.parallel([
            Animated.timing(anim.y, {
              toValue: -300,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(anim.x, {
              toValue: Math.random() * 200 - 100,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 1,
              duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start();
        }, delay);
      });
    };

    return { animations, animate };
  }

  /**
   * Animar bounce (entrada suave)
   */
  static createBounceAnimation() {
    const bounceValue = new Animated.Value(0);

    const animate = () => {
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -10,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.bounce),
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { bounceValue, animate };
  }

  /**
   * Animar flip (virada)
   */
  static createFlipAnimation() {
    const flipValue = new Animated.Value(0);

    const animate = () => {
      Animated.timing(flipValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    return { flipValue, animate };
  }
}

/**
 * Interpolações úteis para animações
 */
export const AnimationInterpolations = {
  /**
   * Converter valor de 0-1 para rotação em graus
   */
  rotationFromProgress: (value: Animated.Value) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }),

  /**
   * Converter valor de 0-1 para escala
   */
  scaleFromProgress: (value: Animated.Value) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),

  /**
   * Converter valor de 0-1 para opacidade
   */
  opacityFromProgress: (value: Animated.Value) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),

  /**
   * Converter valor de 0-1 para posição Y
   */
  translateYFromProgress: (value: Animated.Value) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    }),
};
