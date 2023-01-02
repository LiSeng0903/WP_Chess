import { Button, Checkbox, Form, Input } from 'antd'
import { UserOutlined } from "@ant-design/icons"

const Enter = ( { me, setName, roomNumber, setRoomNumber, onLogin } ) => {
    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
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
        // <>
        //     <Input
        //         size="large"
        //         style={{ width: 300, margin: 50 }}
        //         prefix={<UserOutlined />}
        //         placeholder="Enter your name"
        //         value={me}
        //         onChange={( e ) => setName( e.target.value )}
        //         enterButton="Sign In"
        //         onSearch={( name ) => onLogin( name )}
        //     />
        //     <Input.Search
        //         size="large"
        //         style={{ width: 300, margin: 50 }}
        //         prefix={<UserOutlined />}
        //         placeholder="Enter your name"
        //         value={me}
        //         onChange={( e ) => setName( e.target.value )}
        //         enterButton="Sign In"
        //         onSearch={( name ) => onLogin( name )}
        //     />
        // </>
    )
}

export default Enter