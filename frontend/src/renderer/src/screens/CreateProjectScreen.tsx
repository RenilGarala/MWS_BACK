import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import Card from '../components/Card'
import InputField from '../components/InputField'
import Button from '../components/Button'

type CreateProjectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateProject'>

interface Props {
  navigation: CreateProjectScreenNavigationProp
}

export default function CreateProjectScreen({ navigation }: Props) {
  const [form, setForm] = useState({
    projectNumber: '',
    projectName: '',
    details: '',
    numberOfParts: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNext = () => {
    let newErrors: Record<string, string> = {}
    if (!form.projectNumber) newErrors.projectNumber = 'Required'
    if (!form.projectName) newErrors.projectName = 'Required'
    if (!form.details) newErrors.details = 'Required'
    
    const partsCount = parseInt(form.numberOfParts, 10)
    if (!form.numberOfParts || isNaN(partsCount) || partsCount <= 0) {
      newErrors.numberOfParts = 'Must be greater than 0'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    navigation.navigate('PartEntry', { projectData: { ...form, numberOfParts: partsCount } })
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <InputField 
          label="Project Number" 
          value={form.projectNumber}
          onChangeText={v => { setForm({...form, projectNumber: v}); setErrors({...errors, projectNumber: ''}) }}
          error={errors.projectNumber}
        />
        <InputField 
          label="Project Name" 
          value={form.projectName}
          onChangeText={v => { setForm({...form, projectName: v}); setErrors({...errors, projectName: ''}) }}
          error={errors.projectName}
        />
        <InputField 
          label="Other Details" 
          multiline
          style={{ height: 100 }}
          value={form.details}
          onChangeText={v => { setForm({...form, details: v}); setErrors({...errors, details: ''}) }}
          error={errors.details}
        />
        <InputField 
          label="Number of Parts" 
          keyboardType="numeric"
          value={form.numberOfParts}
          onChangeText={v => { setForm({...form, numberOfParts: v}); setErrors({...errors, numberOfParts: ''}) }}
          error={errors.numberOfParts}
        />
        <View style={styles.footer}>
          <Button title="Next" onPress={handleNext} />
        </View>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20
  },
  card: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    marginTop: 20
  },
  footer: {
    marginTop: 20,
    alignItems: 'flex-end'
  }
})
