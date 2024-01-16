import { DataSourceOptions } from "typeorm";

export const dataSourceOptions = {
  type: process.env.DB_TYPE ?? 'sqlite',
  databse: 'db.sqlite'
} as DataSourceOptions