import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { spacing, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  stars: number;
  size?: number;
};

function createStyles() {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 2,
    },
  });
}

export function ReviewStars({ stars, size = 14 }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialCommunityIcons
          key={star}
          name={star <= stars ? 'star' : 'star-outline'}
          size={size}
          color={star <= stars ? colors.accent : colors.textTertiary}
        />
      ))}
    </View>
  );
}
