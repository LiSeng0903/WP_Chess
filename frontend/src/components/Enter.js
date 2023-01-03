import { Button, Checkbox, Form, Input } from 'antd'
import { UserOutlined } from "@ant-design/icons"
import { useChess } from "../containers/hooks/useChess"

const Enter = ( { me, setName, roomNumber, setRoomNumber, setLoginError } ) => {
    const { login } = useChess()

    const onFinish = ( values ) => {
        setName( values.userName )
        setRoomNumber( values.roomNumber )
        login()
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
                label="Username"
                name="userName"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Room Number"
                name="roomNumber"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Start!
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Enter