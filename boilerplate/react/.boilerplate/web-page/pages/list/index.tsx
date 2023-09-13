import { useMemo } from 'react';
import {
  LinkButton,
  DayRangePicker,
  getPrice,
  ActionsWrap,
  actionConfirm,
  ArrSelect
} from 'parsec-admin';
import { doctorAuditStatus } from '@src/utils/enumMap';
import MyTableList from '@components/myTableList';
import { Button } from 'antd';
import {
  apiGetMchInquiryFreeActivity,
  apiPutMchInquiryFreeActivityPublishId
} from '@src/apis/义诊管理';
import { PlusOutlined } from '@ant-design/icons';

import useEditModal from './hooks/useEditModal';

export default () => {
  const editModal = useEditModal();
  const columns = useMemo(
    () => [
      {
        title: '标签名称',
        width: 180,
        dataIndex: 'topic',
        search: true
      },

      {
        title: '标签备注',
        width: 180,
        dataIndex: '2'
      },
      {
        title: '抬头类型',
        width: 180,
        dataIndex: 'creatorName',
        search: <ArrSelect options={doctorAuditStatus} />,
        render: text => doctorAuditStatus[text]
      },
      {
        title: '创建人',
        width: 180,
        dataIndex: 'creatorName'
      },
      {
        title: '创建时间',
        width: 180,
        dataIndex: 'startTime',
        search: <DayRangePicker placeholder={['开始时间', '结束时间']} />,
        searchIndex: ['searchStartTime', 'searchEndTime']
      },
      {
        title: '结束时间',
        width: 180,
        dataIndex: 'endTime'
      },
      {
        title: '义诊优惠价（元）',
        width: 180,
        dataIndex: 'discountPrice',
        render: v => `￥${getPrice(v)}`
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180
      },
      {
        title: '审核时间',
        dataIndex: 'verifyTime',
        width: 180
      },

      {
        title: '操作',
        fixed: 'right',
        width: 450,
        render: (_, record) => (
          <ActionsWrap>
            <LinkButton
              onClick={() => {
                editModal(record);
              }}>
              编辑
            </LinkButton>
            <LinkButton
              onClick={() => {
                actionConfirm(async () => {
                  await apiPutMchInquiryFreeActivityPublishId({
                    // @ts-ignore
                    id: record.id!
                  });
                }, '删除');
              }}>
              删除
            </LinkButton>
          </ActionsWrap>
        )
      }
    ],
    [editModal]
  );
  return (
    <MyTableList
      tableTitle='标签列表'
      action={
        <Button onClick={() => editModal()} icon={<PlusOutlined />}>
          新建
        </Button>
      }
      getList={({ params }: { params: any }) => {
        return apiGetMchInquiryFreeActivity(params) as any;
      }}
      columns={columns}
    />
  );
};
