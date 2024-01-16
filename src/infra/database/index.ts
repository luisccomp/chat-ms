import { DataSource } from "typeorm";
import { dataSourceOptions } from "../config/typeorm.config";

let dataSource: DataSource = null

export default function getDataSource(): DataSource {
  if (!dataSource)
    dataSource = new DataSource(dataSourceOptions)

  return dataSource
}