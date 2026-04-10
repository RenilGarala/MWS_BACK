import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  type?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
}

export default function Button({ title, type = 'primary', loading = false, disabled, style, ...props }: ButtonProps) {
  const isPrimary = type === 'primary'
  const isDanger = type === 'danger'
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.primary,
        !isPrimary && !isDanger && styles.secondary,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        style
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary || isDanger ? '#fff' : '#4f46e5'} size="small" />
      ) : (
        <Text style={[
          styles.text, 
          (isPrimary || isDanger) ? styles.textLight : styles.textDark
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#4f46e5',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4f46e5'
  },
  danger: {
    backgroundColor: '#ef4444'
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textLight: {
    color: '#fff',
  },
  textDark: {
    color: '#4f46e5',
  }
})
