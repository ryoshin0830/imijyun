import React from 'react';
import { Container, Text } from '../primitives';
import { IMIJUN_COLORS, IMIJUN_LABELS, ENGLISH_LABELS, type BoxType, type Word } from '@imijun/core';

export interface ImijunBoxProps {
  type: BoxType;
  word: Word | null;
  isHighlighted?: boolean;
  showLabels?: boolean;
  onWordRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Imijun Box component for displaying meaning-order boxes
 * Cross-platform compatible with consistent styling
 */
export const ImijunBox: React.FC<ImijunBoxProps> = ({
  type,
  word,
  isHighlighted = false,
  showLabels = true,
  onWordRemove,
  className = '',
  style,
}) => {
  const boxColor = IMIJUN_COLORS[type];
  const japaneseLabel = IMIJUN_LABELS[type];
  const englishLabel = ENGLISH_LABELS[type];

  const boxStyles: React.CSSProperties = {
    minHeight: 80,
    minWidth: 120,
    backgroundColor: word ? boxColor : 'transparent',
    borderColor: boxColor,
    borderWidth: 2,
    borderStyle: isHighlighted ? 'dashed' : 'solid',
    opacity: isHighlighted ? 0.7 : 1,
    transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
    cursor: word && onWordRemove ? 'pointer' : 'default',
    ...style,
  };

  const handlePress = () => {
    if (word && onWordRemove) {
      onWordRemove();
    }
  };

  return (
    <Container
      className={className}
      style={boxStyles}
      flex
      direction="column"
      align="center"
      justify="center"
      padding="sm"
      radius="md"
    >
      {showLabels && (
        <Container margin="none" style={{ marginBottom: 8 }}>
          <Text
            variant="caption"
            color="muted"
            size="xs"
            align="center"
            weight="medium"
          >
            {japaneseLabel}
          </Text>
          <Text
            variant="caption"
            color="muted"
            size="xs"
            align="center"
          >
            {englishLabel}
          </Text>
        </Container>
      )}
      
      <Container
        flex
        align="center"
        justify="center"
        style={{
          minHeight: 32,
          cursor: word && onWordRemove ? 'pointer' : 'default',
        }}
        // Add click handler for web
        {...(word && onWordRemove && {
          onClick: handlePress,
        })}
      >
        {word ? (
          <Text
            variant="label"
            color={word ? 'primary' : 'muted'}
            weight="medium"
            align="center"
            style={{
              color: word ? 'white' : '#9ca3af',
            }}
          >
            {word.text}
          </Text>
        ) : (
          <Text
            variant="caption"
            color="muted"
            size="sm"
            align="center"
            style={{ opacity: 0.5 }}
          >
            Drop here
          </Text>
        )}
      </Container>
    </Container>
  );
};