import { Button, Checkbox, Form, Input } from 'antd'
import { UserOutlined } from "@ant-design/icons"
import { useChess } from "../containers/hooks/useChess"
import { useState } from "react"

const Enter = ( { setLoginError } ) => {
    const { login } = useChess()

    const onFinish = ( values ) => {
        login( values.userName, values.password )
    }

    const onFinishFailed = ( errorInfo ) => {
        setLoginError( true )
    }

    return (
        <Form
            name="basic"
            labelCol={{
                span: 10,
            }}
            wrapperCol={{
                span: 16,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="User Name"
                name="userName"
                rules={[
                    {
                        required: true,
                        message: 'Please enter your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please enter password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Login
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Enter