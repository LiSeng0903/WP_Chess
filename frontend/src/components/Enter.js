import { Button, Checkbox, Form, Input } from 'antd'
import { UserOutlined } from "@ant-design/icons"
import { useChess } from "../containers/hooks/useChess"
import { useState } from "react"
import styled from "styled-components"

const FormStyle = styled(Form)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const ButtonStyle = styled(Button)`
    background-color: brown;
    width: 200px;
    opacity: .5;
    
    &:hover{
        background-color: brown !important;
        opacity: 1;
    }
`

const Enter = ( { setLoginError } ) => {
    const { login } = useChess()

    const onFinish = ( values ) => {
        login( values.userName, values.password )
    }

    const onFinishFailed = ( errorInfo ) => {
        setLoginError( true )
    }

    return (
        <FormStyle 
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
                label={<p style={{color:"white"}}>User Name :</p>}
                name="userName"
                colon={false}
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
                label={<p style={{color:"white"}}>Password :</p>}
                name="password"
                colon={false}
                rules={[
                    {
                        required: true,
                        message: 'Please enter password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <ButtonStyle type="primary" htmlType="submit">
                Login
            </ButtonStyle>

        </FormStyle>
    )
}

export default Enter