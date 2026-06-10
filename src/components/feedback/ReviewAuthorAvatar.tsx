import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { initialsFromName } from '@/services/feedback/reviewAuthor';
import { getReviewMemberAvatarColor } from '@/services/feedback/reviewMemberDisplay';
import type { AppColors } from '@/theme/palettes';
import { radius, typography, useThemedStyles } from '@/theme';

type Props = {
  reviewId: string;
  displayName: string;
  avatarUrl: string | null;
  size?: number;
};

function createStyles(colors: AppColors, size: number) {
  return StyleSheet.create({
    wrap: {
      width: size,
      height: size,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.hairline,
      overflow: 'hidden',
    },
    image: {
      width: size,
      height: size,
    },
    initials: {
      ...typography.label,
      color: colors.textInverse,
      fontSize: Math.max(11, Math.round(size * 0.32)),
      letterSpacing: 0.4,
    },
  });
}

export function ReviewAuthorAvatar({ reviewId, displayName, avatarUrl, size = 40 }: Props) {
  const styles = useThemedStyles((colors) => createStyles(colors, size));
  const [imageFailed, setImageFailed] = useState(false);

  const initials = initialsFromName(displayName);
  const avatarColor = getReviewMemberAvatarColor(reviewId);
  const showPhoto = Boolean(avatarUrl?.trim()) && !imageFailed;

  return (
    <View style={[styles.wrap, { backgroundColor: avatarColor }]}>
      {!showPhoto ? (
        <Text style={styles.initials}>{initials}</Text>
      ) : (
        <Image
          source={{ uri: avatarUrl! }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
          onError={() => setImageFailed(true)}
          accessibilityLabel={displayName}
        />
      )}
    </View>
  );
}
