import React, { useCallback, useEffect, useState } from 'react'
import { history } from 'umi'
import './index.scss'
import FileItem from '@/components/fileItem'
import Loading from '@/utils/Loading'
import { get } from '@/api/request'
import { ProjectType, ScaffoldList } from '@/type/file.type'
import { Drawer, Form, Row, Col, Input, Select, Space, Button } from 'antd'

export default function FilePage() {
  const [isCreate, setIsCreate] = useState(false)
  const [fileList, setFileList] = useState<ProjectType[]>([])
  const [scaffoldList, setScaffoldList] = useState<ScaffoldList[]>([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    scaffoldId: ''
  })

  const createFile = useCallback((name: string) => {
    if (name) {
      console.log('我要创建', name)
      Loading.showLoading()
    }
    setIsCreate(false)
    setTimeout(() => {
      Loading.closeLoading()
    }, 5000)
  }, [])

  useEffect(() => {
    getData()
    getScaffoldList()
  }, [])

  const getData = async () => {
    Loading.showLoading()
    const data = await get<ProjectType[]>('/project/getProject', {})
    if (data.code == 0) {
      setFileList(data.data)
    }
    Loading.closeLoading()
  }

  const getScaffoldList = async () => {
    Loading.showLoading()
    const data = await get<ScaffoldList[]>('/project/getScaffoldList', {})
    if (data.code == 0) {
      setScaffoldList(data.data)
    }
    Loading.closeLoading()
  }

  const goCode = useCallback((name: string, modelName: string) => {
    console.log('click===')
    if (modelName.indexOf('vue') > -1) {
      history.push(`/vue?name=${name}`)
    } else if (modelName.indexOf('react') > -1) {
      history.push(`/jsx?name=${name}`)
    }
  }, [])

  const closeWindow = () => {
    setShowDrawer(false)
  }

  const onScaffoldChange = (value: string) => {
    console.log(`selected ${value}`)
    setCreateForm({
      ...createForm,
      scaffoldId: value
    })
  }

  const createProject = async () => {
    closeWindow()
    Loading.showLoading()
    const create = await get('project/createProject', createForm)
    if (create.code === 0) {
      getData()
    }
    Loading.closeLoading()
  }

  return (
    <div className="fileContainer">
      <div className="fileContainer-titleContainer">
        <div className="fileContainer-titleContainer-title">Project</div>
        <div
          onClick={() => {
            setShowDrawer(true)
          }}
          className="fileContainer-titleContainer-btn">
          创建
        </div>
      </div>
      <Drawer
        extra={
          <Space>
            <Button onClick={closeWindow}>取消</Button>
            <Button onClick={createProject} type="primary">
              创建
            </Button>
          </Space>
        }
        title="创建项目"
        width={600}
        visible={showDrawer}
        onClose={closeWindow}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Form.Item
              label="项目名"
              rules={[{ required: true, message: '请输入项目名' }]}>
              <Input
                onChange={val => {
                  setCreateForm({
                    ...createForm,
                    name: val.target.value
                  })
                }}
                value={createForm.name}
                placeholder="请输入项目名"
              />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Select
              style={{ width: 200 }}
              showSearch
              onChange={onScaffoldChange}
              filterOption={(input, option) =>
                option
                  ? option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  : false
              }
              placeholder="请选择一个脚手架">
              {scaffoldList.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.scaffoldName}
                </Select.Option>
              ))}
            </Select>
          </Row>
        </Form>
      </Drawer>
      {isCreate && <FileItem modelName="" createCallback={createFile} />}
      {fileList.map(item => (
        <FileItem
          key={item.name}
          fileName={item.name}
          modelName={item.scaffold.modelName}
          callback={goCode}
          // path={item.path}
        />
      ))}
    </div>
  )
}
