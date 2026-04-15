import React, { JSX, useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/AppNavigator'
import { projectAPI } from '../services/api'
import { Project, Part } from '../types'

type ProjectListRouteProp = RouteProp<RootStackParamList, 'ProjectList'>

interface Props {
  route: ProjectListRouteProp
}

export default function ProjectListScreen({ route }: Props) {
  const { type } = route.params
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({})

  const fetchProj = useCallback(async () => {
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
  }, [type])

  useEffect(() => {
    fetchProj()
  }, [fetchProj])

  const handleProjectChange = (projId: string, field: string, value: string) => {
    setProjects(projects.map(p => p._id === projId ? { ...p, [field]: value } : p))
  }

  const handlePartChange = (projId: string, partId: string, field: string, value: string) => {
    setProjects(projects.map(p => {
      if (p._id !== projId) return p
      return {
        ...p,
        parts: p.parts?.map(part => part._id === partId ? { ...part, [field]: value } : part)
      }
    }))
  }

  const cycleStatus = (projId: string, partId: string, currentStatus?: string) => {
    const statuses = ['PLANNED', 'WIP', 'DONE']
    const nextIdx = (statuses.indexOf(currentStatus || 'PLANNED') + 1) % statuses.length
    handlePartChange(projId, partId, 'status', statuses[nextIdx])
  }

  const toggleEditRow = (rowKey: string) => {
    setEditingRows(prev => ({ ...prev, [rowKey]: true }))
  }

  const saveRow = async (rowKey: string, projId: string, partId: string | undefined) => {
    try {
      const proj = projects.find(p => p._id === projId)
      if (!proj) return

      // Save Project Data
      await projectAPI.updateProject(projId, { 
        projectId: proj.projectId, 
        projectName: proj.projectName 
      })

      // Save Part Data if it exists
      if (partId) {
        const part = proj.parts?.find(p => p._id === partId)
        if (part) {
          await projectAPI.updatePart(partId, {
            partCode: part.partCode,
            partName: part.partName,
            orderQuantity: part.orderQuantity,
            dispatchDate: part.dispatchDate,
            status: part.status
          })
        }
      }
      
      setEditingRows(prev => ({ ...prev, [rowKey]: false }))
      // Refresh to ensure any projects that fully became DONE vanish from Current!
      await fetchProj()
    } catch (err) {
      console.error('Error saving row:', err)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  const renderRows = () => {
    if (projects.length === 0) {
      return <Text style={styles.emptyText}>No projects found.</Text>
    }

    const rows: JSX.Element[] = []
    let rowIndex = 1

    projects.forEach((proj) => {
      const partsLength = proj.parts && proj.parts.length > 0 ? proj.parts.length : 1

      for (let i = 0; i < partsLength; i++) {
        const part = proj.parts && proj.parts.length > 0 ? proj.parts[i] : null
        const rowKey = `${proj._id}-${part?._id || i}`
        const isEditing = !!editingRows[rowKey]

        rows.push(
          <View key={`${proj.projectId}-${i}-${rowIndex}`} style={styles.tableRow}>
            <View style={[styles.cell, styles.colIndex]}>
              <Text style={styles.cellText}>{i === 0 ? rowIndex : ''}</Text>
            </View>
            <View style={[styles.cell, styles.colProjId]}>
              {i === 0 && proj._id ? (
                isEditing ? (
                  <TextInput
                    style={[styles.input, styles.highlight]}
                    value={proj.projectId}
                    onChangeText={(val) => handleProjectChange(proj._id!, 'projectId', val)}
                  />
                ) : <Text style={[styles.cellText, styles.highlight]}>{proj.projectId}</Text>
              ) : null}
            </View>
            <View style={[styles.cell, styles.colProjName]}>
              {i === 0 && proj._id ? (
                isEditing ? (
                  <TextInput
                    style={[styles.input, styles.highlight]}
                    value={proj.projectName}
                    onChangeText={(val) => handleProjectChange(proj._id!, 'projectName', val)}
                  />
                ) : <Text style={[styles.cellText, styles.highlight]}>{proj.projectName}</Text>
              ) : null}
            </View>
            
            <View style={[styles.cell, styles.colPartCode]}>
              {part && proj._id && part._id ? (
                isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={part.partCode}
                    onChangeText={(val) => handlePartChange(proj._id!, part._id!, 'partCode', val)}
                  />
                ) : <Text style={styles.cellText}>{part.partCode}</Text>
              ) : <Text style={styles.cellText}>-</Text>}
            </View>
            <View style={[styles.cell, styles.colPartName]}>
              {part && proj._id && part._id ? (
                isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={part.partName}
                    onChangeText={(val) => handlePartChange(proj._id!, part._id!, 'partName', val)}
                  />
                ) : <Text style={styles.cellText}>{part.partName}</Text>
              ) : <Text style={styles.cellText}>-</Text>}
            </View>
            <View style={[styles.cell, styles.colQty]}>
              {part && proj._id && part._id ? (
                isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={part.orderQuantity?.toString() || ''}
                    onChangeText={(val) => handlePartChange(proj._id!, part._id!, 'orderQuantity', val)}
                    keyboardType="numeric"
                  />
                ) : <Text style={styles.cellText}>{part.orderQuantity}</Text>
              ) : <Text style={styles.cellText}>-</Text>}
            </View>
            <View style={[styles.cell, styles.colDate]}>
              {part && proj._id && part._id ? (
                isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={part.dispatchDate}
                    onChangeText={(val) => handlePartChange(proj._id!, part._id!, 'dispatchDate', val)}
                  />
                ) : <Text style={styles.cellText}>{part.dispatchDate}</Text>
              ) : <Text style={styles.cellText}>-</Text>}
            </View>
            <View style={[styles.cell, styles.colStatus]}>
              {part && proj._id && part._id ? (
                isEditing ? (
                  <TouchableOpacity onPress={() => cycleStatus(proj._id!, part._id!, part.status)}>
                    <View style={[
                      styles.statusBadge, 
                      part.status === 'DONE' ? styles.statusDone : part.status === 'WIP' ? styles.statusWIP : styles.statusPlanned
                    ]}>
                      <Text style={styles.statusBadgeText}>{part.status || 'PLANNED'}</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[
                    styles.statusBadge, 
                    part.status === 'DONE' ? styles.statusDone : part.status === 'WIP' ? styles.statusWIP : styles.statusPlanned
                  ]}>
                    <Text style={styles.statusBadgeText}>{part.status || 'PLANNED'}</Text>
                  </View>
                )
              ) : <Text style={styles.cellText}>-</Text>}
            </View>
            
            <View style={[styles.cell, styles.colAction]}>
              {proj._id ? (
                isEditing ? (
                  <TouchableOpacity 
                    style={styles.saveBtn} 
                    onPress={() => saveRow(rowKey, proj._id!, part?._id)}
                  >
                    <Text style={styles.btnText}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => toggleEditRow(rowKey)}
                  >
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>
                )
              ) : null}
            </View>
          </View>
        )
      }
      rowIndex++
    })

    return rows
  }

  return (
    <View style={styles.container}>
      {projects.length > 0 && (
        <View style={styles.tableContainer}>
          <ScrollView horizontal style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} bounces={false}>
              
              <View style={[styles.tableRow, styles.headerRow]}>
                <View style={[styles.cell, styles.headerCell, styles.colIndex]}><Text style={styles.headerText}>No</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colProjId]}><Text style={styles.headerText}>Proj No.</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colProjName]}><Text style={styles.headerText}>Project Name</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colPartCode]}><Text style={styles.headerText}>Part Code</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colPartName]}><Text style={styles.headerText}>Part Name</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colQty]}><Text style={styles.headerText}>Qty</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colDate]}><Text style={styles.headerText}>Date</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colStatus]}><Text style={styles.headerText}>Status</Text></View>
                <View style={[styles.cell, styles.headerCell, styles.colAction]}><Text style={styles.headerText}>Action</Text></View>
              </View>

              {renderRows()}

            </ScrollView>
          </ScrollView>
        </View>
      )}
      
      {projects.length === 0 && (
        <Text style={styles.emptyText}>No projects found in this repository.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
    fontSize: 16
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  headerRow: {
    backgroundColor: '#f9fafb',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb'
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f3f4f6',
    minHeight: 44
  },
  headerCell: {
    borderRightColor: '#e5e7eb',
    paddingVertical: 12
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
  },
  headerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase'
  },
  highlight: {
    fontWeight: 'bold',
    color: '#111827'
  },
  input: {
    fontSize: 14,
    color: '#374151',
    padding: 2,
    margin: 0,
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#fff'
  },
  
  colIndex: { width: 50, alignItems: 'center' },
  colProjId: { width: 100 },
  colProjName: { width: 180 },
  colPartCode: { width: 120 },
  colPartName: { width: 220 },
  colQty: { width: 60, alignItems: 'center' },
  colDate: { width: 100 },
  colStatus: { width: 100, alignItems: 'center' },
  colAction: { width: 80, alignItems: 'center' },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusPlanned: {
    backgroundColor: '#f3f4f6'
  },
  statusWIP: {
    backgroundColor: '#fef3c7'
  },
  statusDone: {
    backgroundColor: '#d1fae5'
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  },

  editBtn: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  saveBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  }
})
