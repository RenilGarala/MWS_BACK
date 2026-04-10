import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import Button from '../components/Button'

type ProjectModuleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProjectModule'>

interface Props {
  navigation: ProjectModuleScreenNavigationProp
}

export default function ProjectModuleScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.menuBox}>
        <Button 
          title="Create New Project" 
          onPress={() => navigation.navigate('CreateProject')} 
          style={styles.btn}
        />
        <Button 
          title="Current Projects" 
          type="secondary"
          onPress={() => navigation.navigate('ProjectList', { type: 'current' })} 
          style={styles.btn}
        />
        <Button 
          title="Completed Projects" 
          type="secondary"
          onPress={() => navigation.navigate('ProjectList', { type: 'completed' })} 
          style={styles.btn}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  menuBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  btn: {
    marginBottom: 16
  }
})
