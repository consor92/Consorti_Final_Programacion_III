
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Breadcrumb, Flex } from 'antd';

function breadcrumb() {
    return (
        <Flex gap="large" align='flex-end'>
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },
                    {
                        href: '',
                        title: (
                            <>
                                <UserOutlined />
                                <span>Application List</span>
                            </>
                        ),
                    },
                    {
                        title: 'Application',
                    },
                ]}
            />
        </Flex>
    )

}
export default breadcrumb;