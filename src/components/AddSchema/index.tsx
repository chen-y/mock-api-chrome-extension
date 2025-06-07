import { AutoComplete, Form, Input, Modal, Select, Space, Switch } from 'antd'
import { MethodEnum, ColumnKeyEnum, KEYWORDS_LIST, CACHE_CONFIG_KEY } from '../../constants/constants'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { autocompletion } from '@codemirror/autocomplete'
import { useMemo, useEffect } from 'react'
import { getUniqueId } from '../../utils'
import useDataset, { ConfigModel } from '../../hooks'

export interface AddSchemaModalProps {
  open?: boolean;
  target?: ConfigModel;
  onClose?: () => void;
}

const AddSchemaModal = (props: AddSchemaModalProps) => {
  const { open, target, onClose } = props;
  const [form] = Form.useForm()
  const { insert } = useDataset();

  const jsonExtension = useMemo(() => {
    const ext = json()
    return ext
  }, [])

  useEffect(() => {
    // chrome.storage.sync.get([CACHE_CONFIG_KEY]).then((res) => {

    // })
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields()
    // getUniqueId();
    insert({
      ...values,
      id: getUniqueId(),
    })
  }
  return (
    <Modal open={open} title="添加拦截项" okText="保存" cancelText="取消" onCancel={onClose} onOk={handleSubmit}>
      <Form
        initialValues={{
          [ColumnKeyEnum.OPEN]: true,
          [ColumnKeyEnum.MODEL]: "{\n  \n}"
        }}
        form={form}
      >
        <Form.Item name={ColumnKeyEnum.OPEN}>
          <Switch />
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

        <Form.Item name={ColumnKeyEnum.RESPONSE}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item
          name={ColumnKeyEnum.MODEL}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <CodeMirror
            extensions={[
              jsonExtension,
              autocompletion({
                override: [
                  function (context) {
                    // console.info(context)
                    let word = context.matchBefore(/@\w*/)
                    console.info(word)

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
      </Form>
    </Modal>
  )
}

export default AddSchemaModal
