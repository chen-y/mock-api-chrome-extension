import { Button, Switch, Table, TableColumnProps, Modal } from 'antd'
import './list.css'
import { ColumnKeyEnum, COLUMN_CONFIG_MAP } from '../../constants/constants'
import AddSchemaModal from '../AddSchema'
import { useState } from 'react'
import { ConfigModel } from '../../hooks'

const CommonList = () => {
  const [modalState, setModalState] = useState<{ open: boolean; target?: ConfigModel }>({
    open: false,
  })
  const handleAdd = () => {
    // chrome.windows.create({ type: 'panel', url: 'newtab.html' })
    setModalState({ open: true })
  }
  const columns: TableColumnProps<{}>[] = [
    {
      key: ColumnKeyEnum.OPEN,
      dataIndex: ColumnKeyEnum.OPEN,
    },
    {
      key: ColumnKeyEnum.PATH,
      dataIndex: ColumnKeyEnum.PATH,
    },
    {
      key: ColumnKeyEnum.METHOD,
      dataIndex: ColumnKeyEnum.METHOD,
    },
    {
      key: ColumnKeyEnum.DESC,
      dataIndex: ColumnKeyEnum.DESC,
    },
  ].map((c: TableColumnProps) => {
    c.title = COLUMN_CONFIG_MAP.get(c.key as ColumnKeyEnum)!.name
    return c
  })

  return (
    <div>
      <div className="common-list-head">
        <div>
          <Switch size="small" />
        </div>
        <div>
          <Button size="small" type="primary" onClick={handleAdd}>
            添加
          </Button>
        </div>
      </div>

      <Table size="small" columns={columns} />

      <AddSchemaModal open={modalState.open} />
    </div>
  )
}

export default CommonList
