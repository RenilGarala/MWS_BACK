import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/AppNavigator'
import Card from '../components/Card'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { projectAPI } from '../services/api'
import { useProjectStore } from '../store/useProjectStore'

type PartEntryRouteProp = RouteProp<RootStackParamList, 'PartEntry'>
type PartEntryNavProp = NativeStackNavigationProp<RootStackParamList, 'PartEntry'>

interface Props {
  route: PartEntryRouteProp
  navigation: PartEntryNavProp
}

export default function PartEntryScreen({ route, navigation }: Props) {
  const { projectData } = route.params
  const targetCount = projectData.numberOfParts
  
  const { parts, addPart, removePart, clearParts } = useProjectStore()
  
  const [currentPart, setCurrentPart] = useState({
    partCode: '', partName: '', orderQuantity: '', dispatchDate: ''
  })
  
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Clear parts on mount
  useEffect(() => {
    clearParts()
  }, [])

  useEffect(() => {
    if (currentPart.partCode.length > 1 || currentPart.partName.length > 1) {
      const q = currentPart.partCode || currentPart.partName
      projectAPI.getSuggestions(q).then(res => setSuggestions(res.data)).catch(() => {})
    } else {
      setSuggestions([])
    }
  }, [currentPart.partCode, currentPart.partName])

  const handleAddPart = () => {
    if (!currentPart.partCode || !currentPart.partName || !currentPart.orderQuantity || !currentPart.dispatchDate) {
      window.alert?.('Please fill all part fields')
      return
    }
    
    addPart({ ...currentPart, orderQuantity: parseInt(currentPart.orderQuantity, 10) })
    setCurrentPart({ partCode: '', partName: '', orderQuantity: '', dispatchDate: '' })
    setSuggestions([])
  }

  const handleCreateProject = async () => {
    setLoading(true)
    try {
      // 1. Create Project
      const res = await projectAPI.createProject({
        projectId: projectData.projectNumber,
        projectName: projectData.projectName,
        description: projectData.details,
        numberOfItems: targetCount
      })
      
      console.log(res);
      
      const projectId = res.data._id || res.data.id

      // 2. Add Parts
      await projectAPI.addParts(projectId, parts)
      
      alert('Project created successfully!')
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'ProjectModule' }]
      })
    } catch (e: any) {
      console.error("API Error Object:", e)
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message
      alert(`Failed to create project! Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.infoCard}>
        <Text style={styles.infoText}>Project: <Text style={styles.bold}>{projectData.projectName}</Text></Text>
        <Text style={styles.infoText}>Parts Added: <Text style={styles.bold}>{parts.length}</Text></Text>
      </Card>

      <Card style={styles.formCard}>
        <Text style={styles.title}>Add Part</Text>
          <View style={styles.row}>
            <View style={styles.flex1relative}>
              <InputField 
                label="Part Code" 
                value={currentPart.partCode}
                onChangeText={v => setCurrentPart({...currentPart, partCode: v})}
              />
              {suggestions.length > 0 && currentPart.partCode.length > 0 && (
                <View style={styles.suggestionsList}>
                  {suggestions.map((s, i) => (
                    <TouchableOpacity key={i} style={styles.suggestionItem} onPress={() => {
                      setCurrentPart({...currentPart, partCode: s.partCode, partName: s.partName})
                      setSuggestions([])
                    }}>
                      <Text>{s.partCode} - {s.partName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.flex1}><InputField label="Part Name" value={currentPart.partName} onChangeText={v => setCurrentPart({...currentPart, partName: v})} /></View>
            <View style={styles.flex1}><InputField label="Order Quantity" keyboardType="numeric" value={currentPart.orderQuantity} onChangeText={v => setCurrentPart({...currentPart, orderQuantity: v})} /></View>
            <View style={styles.flex1}><InputField label="Dispatch Date (YYYY-MM-DD)" value={currentPart.dispatchDate} onChangeText={v => setCurrentPart({...currentPart, dispatchDate: v})} /></View>
            <View style={{ justifyContent: 'center', marginTop: 16 }}>
              <Button title="Add Part" onPress={handleAddPart} />
            </View>
          </View>
        </Card>

      {parts.length > 0 && (
        <Card style={styles.tableCard}>
          <Text style={styles.title}>Added Parts Preview</Text>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.bold]}>No</Text>
            <Text style={[styles.tableCell, styles.bold]}>Code</Text>
            <Text style={[styles.tableCell, styles.bold]}>Name</Text>
            <Text style={[styles.tableCell, styles.bold]}>Qty</Text>
            <Text style={[styles.tableCell, styles.bold]}>Date</Text>
            <Text style={[styles.tableCell, styles.bold]}>Actions</Text>
          </View>
          {parts.map((p, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{i + 1}</Text>
              <Text style={styles.tableCell}>{p.partCode}</Text>
              <Text style={styles.tableCell}>{p.partName}</Text>
              <Text style={styles.tableCell}>{p.orderQuantity}</Text>
              <Text style={styles.tableCell}>{p.dispatchDate}</Text>
              <View style={styles.tableCell}>
                <Button title="Del" type="danger" onPress={() => removePart(i)} style={{ paddingVertical: 4, paddingHorizontal: 8 }} />
              </View>
            </View>
          ))}
          
          <View style={styles.footer}>
            <Button title="Create Project" onPress={handleCreateProject} loading={loading} />
          </View>
        </Card>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20 },
  infoCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#eef2ff' },
  infoText: { fontSize: 16, color: '#374151' },
  bold: { fontWeight: 'bold', color: '#111827' },
  formCard: { marginTop: 10, zIndex: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start', zIndex: 10 },
  flex1: { flex: 1, marginRight: 8 },
  flex1relative: { flex: 1, marginRight: 8, position: 'relative' },
  suggestionsList: { position: 'absolute', top: 70, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tableCard: { marginTop: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingVertical: 12, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f9fafb' },
  tableCell: { flex: 1, fontSize: 14, color: '#374151' },
  footer: { marginTop: 20, alignItems: 'flex-end' }
})
