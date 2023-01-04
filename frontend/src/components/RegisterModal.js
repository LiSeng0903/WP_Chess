import { useState } from "react"
import { Button, Modal, Form, Input } from 'antd'
import { useChess } from "../containers/hooks/useChess"

const RegisterModal = () => {
    const { register, registerFailMsg, registerFail, setRegisterFail } = useChess()
    const [ isModalOpen, setIsModalOpen ] = useState( false )
    const [ regName, setRegName ] = useState( "" )
    const [ regPassword, setRegPassword ] = useState( "" )

    const showModal = () => {
        setIsModalOpen( true )
    }

    const handleOk = () => {
        register( regName, regPassword )
        setIsModalOpen( false )
        setRegName( "" )
        setRegPassword( "" )
    }

    const handleCancel = () => {
        setIsModalOpen( false )
        setRegName( "" )
        setRegPassword( "" )
    }

    const onValuesChange = ( values ) => {
        if ( values.username ) {
            setRegName( values.username )
        } else if ( values.password ) {
            setRegPassword( values.password )
        }
    }


    return (
        <>
            <Button type="primary" onClick={showModal}>
                Register
            </Button>
            <Modal title="Register a player" open={isModalOpen || registerFail} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onValuesChange={( values ) => onValuesChange( values )}
                    autoComplete="off"
                >
                    <Form.Item
                        label="User Name"
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
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
                <p style={{ opacity: registerFail ? "1" : "0", color: "red" }}>{registerFailMsg}</p>
            </Modal>
        </>
    )
}

export default RegisterModal