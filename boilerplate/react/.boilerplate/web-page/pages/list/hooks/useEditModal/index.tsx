import { apiPutMchInquiryFreeActivityInitVerify } from '@src/apis/义诊管理';
import { Input } from 'antd';
import { handleSubmit, useModal } from 'parsec-admin';
export type UseEditModalCallbackParams = any;

const useEditModal = () => {
  return useModal(({ id }: UseEditModalCallbackParams) => {
    const isEdit = !!id;
    return {
      title: isEdit ? '编辑账号' : '新增账号',
      onSubmit: async values => {
        await handleSubmit(() =>
          // @ts-ignore
          apiPutMchInquiryFreeActivityInitVerify({
            ...values
          })
        );
      },
      items: [
        {
          name: 'result',
          label: '标签名称',
          required: true,
          render: <Input placeholder='请输入标签名称' />
        },
        {
          name: 'remark',
          label: '标签备注',
          render: <Input placeholder='请输入标签备注' />
        }
      ]
    };
  });
};
export default useEditModal;
