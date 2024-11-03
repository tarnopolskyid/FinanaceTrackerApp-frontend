import { ICategory } from './category.interface'

export interface ITransaction {
  id: number
  title: string
  amount: number
  type: TransactionType
  createdAt: Date
  updatedAt: Date
  comment: string
  category?: ICategory | null
}

export interface ITransactionData {
  title: string
  amount: number
  type: TransactionType
  comment: string
  category: number
}

export type TransactionType = 'income' | 'expense'

export enum MethodEnum {
  EDIT,
  CREATE
}
