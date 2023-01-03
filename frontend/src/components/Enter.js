import { Button, Checkbox, Form, Input } from 'antd'
import { UserOutlined } from "@ant-design/icons"
import { useChess } from "../containers/hooks/useChess"
import { useState } from "react"

const Enter = ( { me, setName, roomNumber, setRoomNumber, setLoginError } ) => {
    const { createRoom, joinRoom } = useChess()
    const [ user, setUser ] = useState( "" )

    const onFinish = ( values ) => {
        if ( !values.roomNumber ) {
            setLoginError( true )
        } else {
            setName( values.userName )
            joinRoom( values.roomNumber, values.userName )
        }
    }

    const onFinishFailed = ( errorInfo ) => {
        setLoginError( true )
    }

    const onValuesChange = ( allValues ) => {
        if ( allValues.userName ) {
            setUser( allValues.userName )
        }
    }

    const handleOnCreate = () => {
        if ( user ) {
            setName( user )
            createRoom( user )
        }
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
            onValuesChange={onValuesChange}
            autoComplete="off"
        >
            <Form.Item
                label="User Name"
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
                        required: false,
                        // message: 'Please input your password!',
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

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" onClick={handleOnCreate}>
                    Create Room
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Enter