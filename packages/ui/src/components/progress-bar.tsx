import React from 'react';
import { Container, Text } from '../primitives';
import { IMIJUN_COLORS } from '@imijun/core';

export interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  height?: number;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Progress Bar component for showing lesson/learning progress
 * Cross-platform compatible with smooth animations
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  color = 'primary',
  height = 8,
  animated = true,
  className = '',
  style,
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const colorMap = {
    primary: IMIJUN_COLORS.verb,
    success: IMIJUN_COLORS.place,
    warning: IMIJUN_COLORS.object,
    error: '#ef4444',
  };

  const progressColor = colorMap[color];

  const containerStyles: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: height / 2,
    overflow: 'hidden',
    height,
    ...style,
  };

  const fillStyles: React.CSSProperties = {
    height: '100%',
    backgroundColor: progressColor,
    width: `${clampedProgress}%`,
    transition: animated ? 'width 0.3s ease-in-out' : 'none',
    borderRadius: height / 2,
  };

  return (
    <Container className={className} style={{ width: '100%' }}>
      {showLabel && (
        <Container flex direction="row" justify="space-between" style={{ marginBottom: 4 }}>
          <Text variant="caption" color="muted" size="sm">
            Progress
          </Text>
          <Text variant="caption" color="muted" size="sm" weight="medium">
            {Math.round(clampedProgress)}%
          </Text>
        </Container>
      )}
      
      <Container style={containerStyles}>
        <Container style={fillStyles} />
      </Container>
    </Container>
  );
};