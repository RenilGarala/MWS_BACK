import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { Settings, Boxes, Users, FileText } from 'lucide-react'

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

interface Props {
  navigation: HomeScreenNavigationProp
}

const MODULES = [
  { id: '1', title: 'Project Planning', active: true, icon: <Boxes color="#4f46e5" size={32} /> },
  { id: '2', title: 'Inventory', active: false, icon: <Settings color="#9ca3af" size={32} /> },
  { id: '3', title: 'HR', active: false, icon: <Users color="#9ca3af" size={32} /> },
  { id: '4', title: 'Invoicing', active: false, icon: <FileText color="#9ca3af" size={32} /> },
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: (i + 5).toString(),
    title: `Module ${i + 5}`,
    active: false,
    icon: <Settings color="#9ca3af" size={32} />
  }))
]

export default function HomeScreen({ navigation }: Props) {
  const renderItem = ({ item }: { item: typeof MODULES[0] }) => (
    <TouchableOpacity 
      style={[styles.moduleCard, !item.active && styles.inactiveCard]}
      onPress={() => item.active && navigation.navigate('ProjectModule')}
      activeOpacity={item.active ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={[styles.moduleTitle, !item.active && styles.inactiveTitle]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>MachineWala ERP</Text>
        <Text style={styles.subtitle}>Welcome to ERP System</Text>
      </View>
      <FlatList
        data={MODULES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20
  },
  headerBlock: {
    marginBottom: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4
  },
  grid: {
    paddingBottom: 20
  },
  moduleCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '30%'
  },
  inactiveCard: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6'
  },
  iconContainer: {
    marginBottom: 12
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 8
  },
  inactiveTitle: {
    color: '#9ca3af'
  }
})
