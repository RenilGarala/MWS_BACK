import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/AppNavigator'
import Card from '../components/Card'
import { projectAPI } from '../services/api'
import { Project } from '../types'

type ProjectListRouteProp = RouteProp<RootStackParamList, 'ProjectList'>

interface Props {
  route: ProjectListRouteProp
}

export default function ProjectListScreen({ route }: Props) {
  const { type } = route.params
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProj = async () => {
      try {
        const res = type === 'current' 
          ? await projectAPI.getCurrentProjects() 
          : await projectAPI.getCompletedProjects()
        setProjects(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProj()
  }, [type])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {projects.length === 0 ? (
        <Text style={styles.emptyText}>No projects found.</Text>
      ) : (
        projects.map((proj, i) => (
          <Card key={i} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Number:</Text>
              <Text style={styles.value}>{proj.projectId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{proj.projectName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Items:</Text>
              <Text style={styles.value}>{proj.totalItems || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.status}>{proj.status}</Text>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 16 },
  card: { marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  value: { fontSize: 15, color: '#111827', fontWeight: 'bold' },
  status: { fontSize: 15, color: '#4f46e5', fontWeight: 'bold', textTransform: 'uppercase' }
})
