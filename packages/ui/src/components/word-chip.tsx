import React from 'react';
import { Container, Text } from '../primitives';
import { IMIJUN_COLORS, type Word } from '@imijun/core';

export interface WordChipProps {
  word: Word;
  isDragging?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Word Chip component for displaying draggable words
 * Cross-platform compatible with consistent styling
 */
export const WordChip: React.FC<WordChipProps> = ({
  word,
  isDragging = false,
  isDisabled = false,
  onPress,
  className = '',
  style,
}) => {
  const wordColor = IMIJUN_COLORS[word.type];

  const chipStyles: React.CSSProperties = {
    backgroundColor: isDisabled ? '#f3f4f6' : wordColor,
    borderColor: wordColor,
    borderWidth: 1,
    borderStyle: 'solid',
    opacity: isDragging ? 0.5 : isDisabled ? 0.6 : 1,
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    cursor: isDisabled ? 'not-allowed' : 'grab',
    transition: 'all 0.2s ease-in-out',
    ...style,
  };

  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  return (
    <Container
      className={className}
      style={chipStyles}
      padding="sm"
      radius="md"
      shadow="sm"
      // Add click handler for web
      {...(onPress && !isDisabled && {
        onClick: handlePress,
      })}
    >
      <Text
        variant="label"
        color="primary"
        weight="medium"
        align="center"
        style={{
          color: isDisabled ? '#9ca3af' : 'white',
          userSelect: 'none',
        }}
      >
        {word.text}
      </Text>
    </Container>
  );
};