import { Button, Switch, Table, TableColumnProps, Modal, Space } from 'antd'
import './list.css'
import { ColumnKeyEnum, COLUMN_CONFIG_MAP } from '../../constants/constants'
import AddSchemaModal from '../AddSchema'
import { useState } from 'react'
import useDataset from '../../hooks'
import { ConfigModel } from '../../constants/constants'

const CommonList = () => {
  const [modalState, setModalState] = useState<{ open: boolean; target?: ConfigModel }>({
    open: false,
  })
  const {
    dataset,
    globalSwitch,
    edit: editDatasetRow,
    updateGlobalSwitch,
    remove: datasetRemove,
  } = useDataset()
  const handleAdd = () => {
    // chrome.windows.create({ type: 'panel', url: 'newtab.html' })
    setModalState({ open: true })
  }

  const handleGlobalSwitchChange = (bool: boolean) => {
    updateGlobalSwitch(bool)
  }

  const handleSwitchChange = (checked: boolean, row: ConfigModel) => {
    editDatasetRow({
      ...row,
      [ColumnKeyEnum.OPEN]: checked,
    })
  }

  const handleDelete = (row: ConfigModel) => {
    // datasetRemove()
    Modal.confirm({
      title: '提示',
      content: '确定删除吗',
      onOk() {
        datasetRemove(row.id)
      },
    })
  }

  const handleEdit = (row: ConfigModel) => {
    setModalState({
      open: true,
      target: row,
    })
  }
  const columns: TableColumnProps<ConfigModel>[] = [
    {
      title: '',
      key: ColumnKeyEnum.OPEN,
      dataIndex: ColumnKeyEnum.OPEN,
      width: 80,
      // row 的类型为什么没有推出来？
      render(v: boolean, row: ConfigModel) {
        return (
          <Switch
            checked={v}
            size="small"
            disabled={!globalSwitch}
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
      width: 100,
    },
    {
      title: '',
      key: ColumnKeyEnum.DESC,
      dataIndex: ColumnKeyEnum.DESC,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render(_: string, row: ConfigModel) {
        return (
          <Space>
            <Button variant="link" color="primary" size="small" onClick={() => handleEdit(row)}>
              编辑
            </Button>
            <Button variant="link" color="danger" size="small" onClick={() => handleDelete(row)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ].map((c: TableColumnProps<ConfigModel>) => {
    const name = COLUMN_CONFIG_MAP.get(c.key as ColumnKeyEnum)?.name
    if (name) {
      c.title = name
    }
    return c
  })

  return (
    <div>
      <div className="common-list-head">
        <div>
          <Switch size="small" value={globalSwitch} onChange={handleGlobalSwitchChange} />
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
        target={modalState.target}
        onClose={() => {
          setModalState({ open: false })
        }}
      />
    </div>
  )
}

export default CommonList
