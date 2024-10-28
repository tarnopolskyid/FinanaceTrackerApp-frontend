import { ICategory } from './category.interface'

export interface ITransaction {
  id: number
  title: string
  amount: number
  type: TransactionType
  createdAt: Date
  updatedAt: Date
  category?: ICategory | null
}

export interface ITransactionData {
  title: string
  amount: number
  type: TransactionType
  category: number
}

export type TransactionType = 'income' | 'expense'
