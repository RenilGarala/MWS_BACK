export interface Project {
  _id?: string
  projectId: string
  projectName: string
  description: string
  numberOfItems: number
  totalItems?: number
  status?: 'current' | 'completed'
}

export interface Part {
  partCode: string
  partName: string
  orderQuantity: string | number
  dispatchDate: string
  numberOfPart?: number
}
