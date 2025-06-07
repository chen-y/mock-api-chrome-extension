import { useEffect, useState } from 'react'
import { CACHE_CONFIG_KEY, ColumnKeyEnum, MethodEnum } from '../constants/constants'

export interface ConfigModel {
  [ColumnKeyEnum.DESC]: string
  [ColumnKeyEnum.METHOD]: MethodEnum
  [ColumnKeyEnum.MODEL]: string
  [ColumnKeyEnum.OPEN]: boolean
  [ColumnKeyEnum.RESPONSE]: string
  [ColumnKeyEnum.PATH]: string
  id: string
}

export default function useDataset() {
  const [dataset, setDataset] = useState<ConfigModel[]>([])

  const update = (newList: ConfigModel[]) => {
    chrome.storage.sync.set({ [CACHE_CONFIG_KEY]: [...newList] })
    setDataset(newList);
  }

  const insert = (m: ConfigModel) => {
    const newDataset = [...dataset, m]
    update(newDataset)
  }

  const remove = (id: string) => {
    const newDataset = dataset?.filter((d) => d.id !== id)
    update(newDataset)
  }

  const edit = (m: ConfigModel) => {
    const index = dataset?.findIndex((d) => d.id === m.id)
    if (index) {
      dataset[index] = m
    }
    update([...dataset])
  }

  useEffect(() => {
    // initial
    chrome.storage.sync.get([CACHE_CONFIG_KEY]).then((res) => {
      console.info(res, 'res')
      if (res?.[CACHE_CONFIG_KEY]) {
        setDataset([res[CACHE_CONFIG_KEY]])
      }
    })
  }, [])

  return {
    dataset,
    insert,
    remove,
    edit,
  }
}
