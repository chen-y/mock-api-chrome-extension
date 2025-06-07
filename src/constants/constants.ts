export enum ColumnKeyEnum {
  OPEN = 'open',
  PATH = 'path',
  METHOD = 'method',
  DESC = 'desc',
  RESPONSE = 'resopnse',
  MODEL = 'model',
}

interface ColumnConfig {
  name: string
}

export const COLUMN_CONFIG_MAP: Map<ColumnKeyEnum, ColumnConfig> = new Map([
  [
    ColumnKeyEnum.OPEN,
    {
      name: '打开/关闭',
    },
  ],
  [
    ColumnKeyEnum.PATH,
    {
      name: 'path',
    },
  ],
  [
    ColumnKeyEnum.METHOD,
    {
      name: '方法',
    },
  ],
  [
    ColumnKeyEnum.DESC,
    {
      name: '描述',
    },
  ],
  [
    ColumnKeyEnum.RESPONSE,
    {
      name: '响应结果',
    },
  ],
  [
    ColumnKeyEnum.MODEL,
    {
      name: '模型',
    },
  ],
])

export enum MethodEnum {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export const KEYWORDS_LIST = [
  {
    keyword: '@boolean',
    doc: '@boolean(n, m, true | false)',
    value: '@boolean()',
  },
  {
    keyword: '@natural',
    doc: '@natural(min?, max?)',
    value: '@natural()',
  },
  {
    keyword: '@integer',
    doc: '@boolean(min?, max?)',
    value: '@boolean()',
  },
  {
    keyword: '@float',
    doc: '@float(nin?, max?, dmin?, dmax?)',
    value: '@float()',
  },
  {
    keyword: '@character',
    doc: '@character(pool?)',
    value: '@character()',
  },
  {
    keyword: '@string',
    doc: '@string(pool?, min?, max?)',
    value: '@string()',
  },
  {
    keyword: '@range',
    doc: '@range(start?, stop?, step?)',
    value: '@range()',
  },
  {
    keyword: '@date',
    doc: '@date(format?)',
    value: '@date()',
  },
  {
    keyword: '@time',
    doc: '@time(format?)',
    value: '@time()',
  },
  {
    keyword: '@now',
    doc: '@now(format?)',
    value: '@now()',
  },
]

export const CACHE_CONFIG_KEY = 'mc_dataset';