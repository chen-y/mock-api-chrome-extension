import { AutoComplete, Form, Input, Modal, Select, Space, Switch, Radio, message } from 'antd'
import {
  MethodEnum,
  ColumnKeyEnum,
  KEYWORDS_LIST,
  CACHE_CONFIG_KEY,
} from '../../constants/constants'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { autocompletion } from '@codemirror/autocomplete'
import { useMemo, useEffect } from 'react'
import { getUniqueId } from '../../utils'
import useDataset, { ConfigModel } from '../../hooks'

export interface AddSchemaModalProps {
  open?: boolean
  target?: ConfigModel
  onClose?: () => void
}

const AddSchemaModal = (props: AddSchemaModalProps) => {
  const { open, target, onClose } = props
  const [form] = Form.useForm()
  const { dataset, globalSwitch, insert } = useDataset()

  const isEdit = Boolean(target)

  const jsonExtension = useMemo(() => {
    const ext = json()
    return ext
  }, [])

  useEffect(() => {
    // chrome.storage.sync.get([CACHE_CONFIG_KEY]).then((res) => {
    // })
    if (target) {
      form.setFieldsValue({
        ...target,
      })
    }

    return () => {
      form.resetFields()
    }
  }, [target])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    console.log(values)
    const isExisting = dataset?.some((d) => {
      if (d.method === values.method && d.path === values.path) {
        return true
      }
      return false
    })
    if (isExisting) {
      message.error({
        content: '已存在相同方法的路径',
        duration: 3,
      })
      return
    }
    insert({
      ...values,
      id: getUniqueId(),
    })
    message.success({
      content: '添加成功',
      duration: 3,
    })

    form.resetFields()
    onClose?.()
  }
  return (
    <Modal
      open={open}
      title="添加拦截项"
      okText="保存"
      cancelText="取消"
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form
        initialValues={{
          [ColumnKeyEnum.OPEN]: true,
          [ColumnKeyEnum.MODE]: ColumnKeyEnum.MODEL,
        }}
        form={form}
      >
        <Form.Item name={ColumnKeyEnum.OPEN}>
          <Switch disabled={globalSwitch} />
        </Form.Item>
        <Form.Item>
          <Space.Compact>
            <Form.Item name={ColumnKeyEnum.METHOD} noStyle>
              <Select style={{ width: 80 }} placeholder="any(*)">
                {Object.values(MethodEnum).map((v) => {
                  return (
                    <Select.Option value={v} key={v}>
                      {v}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item name={ColumnKeyEnum.PATH} noStyle rules={[{ required: true }]}>
              <Input placeholder="path" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item name={ColumnKeyEnum.DESC}>
          <Input.TextArea rows={2} placeholder="简单描述" />
        </Form.Item>

        <Form.Item name={ColumnKeyEnum.MODE}>
          <Radio.Group>
            <Radio value={ColumnKeyEnum.RESPONSE}>JSON</Radio>
            <Radio value={ColumnKeyEnum.MODEL}>JSON model</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item noStyle dependencies={[ColumnKeyEnum.MODE]}>
          {(form) => {
            const mode = form.getFieldValue(ColumnKeyEnum.MODE)

            if (mode === ColumnKeyEnum.RESPONSE) {
              return (
                <Form.Item name={ColumnKeyEnum.RESPONSE}>
                  <Input.TextArea></Input.TextArea>
                </Form.Item>
              )
            }

            if (mode === ColumnKeyEnum.MODEL) {
              return (
                <Form.Item
                  name={ColumnKeyEnum.MODEL}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <CodeMirror
                    placeholder={'{\n  "id": "@id()",\n  "name": "@name()"\n}'}
                    extensions={[
                      jsonExtension,
                      autocompletion({
                        override: [
                          function (context) {
                            let word = context.matchBefore(/@\w*/)

                            return {
                              from: word?.from || -1,
                              to: word?.to,
                              options: KEYWORDS_LIST.map((item) => {
                                return {
                                  label: item.keyword,
                                  apply: item.value,
                                  type: 'keyword',
                                  detail: item.doc,
                                }
                              }),
                            }
                          },
                        ],
                      }),
                    ]}
                    // basicSetup={{ autocompletion: true }}
                  />
                </Form.Item>
              )
            }
            return null
          }}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddSchemaModal
