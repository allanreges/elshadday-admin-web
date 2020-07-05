import React, { useCallback, useRef } from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useToast } from '../../hooks/Toast';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SigUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('Email Obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro realizado com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na realização do cadastro',
          description: 'Erro ao tentar criar a conta',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <Container>
        <Background />
        <Content>
          <AnimationContainer>
            <img src={logoImg}></img>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Faça seu Cadastro</h1>
              <Input name="name" icon={FiUser} placeholder="Nome" />
              <Input name="email" icon={FiMail} placeholder="E-mail" />

              <Input
                name="password"
                icon={FiLock}
                placeholder="Senha"
                type="password"
              />

              <Button type="submit">Cadastrar</Button>
            </Form>

            <Link to="/">
              <FiArrowLeft />
              Voltar para Login
            </Link>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default SigUp;
