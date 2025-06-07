import { Button, Switch, Table, TableColumnProps, Modal } from 'antd'
import './list.css'
import { ColumnKeyEnum, COLUMN_CONFIG_MAP } from '../../constants/constants'
import AddSchemaModal from '../AddSchema'
import { useState } from 'react'
import useDataset, { ConfigModel } from '../../hooks'

const CommonList = () => {
  const [modalState, setModalState] = useState<{ open: boolean; target?: ConfigModel }>({
    open: false,
  })
  const { dataset, edit: editDatasetRow } = useDataset()
  const handleAdd = () => {
    // chrome.windows.create({ type: 'panel', url: 'newtab.html' })
    setModalState({ open: true })
  }

  const handleSwitchChange = (checked: boolean, row: ConfigModel) => {
    editDatasetRow({
      ...row,
      [ColumnKeyEnum.OPEN]: checked,
    })
  }
  const columns: TableColumnProps<ConfigModel>[] = [
    {
      title: '',
      key: ColumnKeyEnum.OPEN,
      dataIndex: ColumnKeyEnum.OPEN,
      // row 的类型为什么没有推出来？
      render(v: boolean, row: ConfigModel) {
        return (
          <Switch
            checked={v}
            size="small"
            onChange={(checked) => handleSwitchChange(checked, row)}
          ></Switch>
        )
      },
    },
    {
      title: '',
      key: ColumnKeyEnum.PATH,
      dataIndex: ColumnKeyEnum.PATH,
    },
    {
      title: '',
      key: ColumnKeyEnum.METHOD,
      dataIndex: ColumnKeyEnum.METHOD,
    },
    {
      title: '',
      key: ColumnKeyEnum.DESC,
      dataIndex: ColumnKeyEnum.DESC,
    },
  ].map((c: TableColumnProps<ConfigModel>) => {
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

      <Table rowKey={(row) => row.id} size="small" columns={columns} dataSource={dataset} />

      <AddSchemaModal
        open={modalState.open}
        onClose={() => {
          setModalState({ open: false })
        }}
      />
    </div>
  )
}

export default CommonList
