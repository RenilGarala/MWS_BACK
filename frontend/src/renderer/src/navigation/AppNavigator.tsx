import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { TouchableOpacity, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from '../screens/HomeScreen'
import ProjectModuleScreen from '../screens/ProjectModuleScreen'
import CreateProjectScreen from '../screens/CreateProjectScreen'
import PartEntryScreen from '../screens/PartEntryScreen'
import ProjectListScreen from '../screens/ProjectListScreen'

export type RootStackParamList = {
  Home: undefined
  ProjectModule: undefined
  CreateProject: undefined
  PartEntry: { projectData: any }
  ProjectList: { type: 'current' | 'completed' }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#4f46e5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: ({ canGoBack }) => canGoBack ? (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginRight: 16, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>← Back</Text>
            </TouchableOpacity>
          ) : undefined
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MachineWala ERP' }} />
        <Stack.Screen name="ProjectModule" component={ProjectModuleScreen} options={{ title: 'Project Planning' }} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} options={{ title: 'Create New Project' }} />
        <Stack.Screen name="PartEntry" component={PartEntryScreen} options={{ title: 'Parts Entry' }} />
        <Stack.Screen 
          name="ProjectList" 
          component={ProjectListScreen} 
          options={({ route }) => ({ title: route.params.type === 'current' ? 'Current Projects' : 'Completed Projects' })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
