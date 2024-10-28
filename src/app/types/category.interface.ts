import { ITransaction } from './transaction.interface'

export interface ICategory {
  id: number
  title: string
  createdAt: Date
  updatedAt: Date
  transactions: ITransaction[]
}
