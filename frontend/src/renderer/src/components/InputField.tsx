import React from 'react'
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native'

interface InputFieldProps extends TextInputProps {
  label?: string
  error?: string
}

export default function InputField({ label, error, style, ...props }: InputFieldProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#111827'
  },
  inputError: {
    borderColor: '#ef4444'
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4
  }
})
