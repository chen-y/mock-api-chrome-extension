import { useEffect, useState } from 'react'
import {
  CACHE_CONFIG_KEY,
  GLOBAL_SWITCH_KEY,
  UPDATE_CONFIG_NAME,
  ConfigModel,
} from '../constants/constants'

export default function useDataset() {
  const [dataset, setDataset] = useState<ConfigModel[]>([])
  const [globalSwitch, setGlobalSwitch] = useState(false)

  const update = (newList: ConfigModel[]) => {
    chrome.storage.sync.set({ [CACHE_CONFIG_KEY]: [...newList] })
    // setDataset(newList)
    // ! 通知到 worker
    chrome.runtime.sendMessage({
      type: UPDATE_CONFIG_NAME,
      data: [...newList],
    })
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
    const newDataset = [...dataset]
    console.log(index, 'index')
    if (index > -1) {
      newDataset[index] = m
    }
    update(newDataset)
  }

  const updateGlobalSwitch = (bool: boolean) => {
    chrome.storage.sync.set({ [GLOBAL_SWITCH_KEY]: bool })
    chrome.runtime.sendMessage({
      type: UPDATE_CONFIG_NAME,
      data: bool,
    })
  }

  useEffect(() => {
    // initial
    chrome.storage.sync.get([CACHE_CONFIG_KEY, GLOBAL_SWITCH_KEY]).then((res) => {
      // console.info(res, 'res')
      if (res?.[CACHE_CONFIG_KEY]) {
        setDataset(res[CACHE_CONFIG_KEY])
      }

      setGlobalSwitch(res?.[GLOBAL_SWITCH_KEY] || false)
    })

    chrome.storage.onChanged.addListener((channels) => {
      if (channels[CACHE_CONFIG_KEY]) {
        setDataset(channels[CACHE_CONFIG_KEY].newValue)
      }

      if (channels[GLOBAL_SWITCH_KEY]) {
        setGlobalSwitch(channels[GLOBAL_SWITCH_KEY].newValue || false)
      }
    })
  }, [])

  return {
    globalSwitch,
    dataset,
    insert,
    remove,
    edit,
    updateGlobalSwitch,
  }
}
