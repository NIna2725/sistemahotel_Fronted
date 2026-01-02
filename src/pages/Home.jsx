import React, { useState } from 'react'
import axios from 'axios'
import PageHeader from '../components/PageHeader'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Button,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { FiUser, FiMail, FiCalendar, FiFileText, FiCreditCard } from 'react-icons/fi'

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  fechaNacimiento: '',
  tipo: '',
  numeroDocumento: '',
}

const API_URL = 'http://localhost:8082/api/clientes'

const Home = () => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setApiError('')
  }

  const validate = (values) => {
    const err = {}

    if (!values.nombre.trim()) err.nombre = 'El nombre es obligatorio'
    if (!values.apellido.trim()) err.apellido = 'El apellido es obligatorio'

    if (!values.email.trim()) {
      err.email = 'El email es obligatorio'
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      err.email = 'Email no válido'
    }

    if (!values.fechaNacimiento) {
      err.fechaNacimiento = 'La fecha de nacimiento es obligatoria'
    } else {
      const birthDate = new Date(values.fechaNacimiento)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18) err.fechaNacimiento = 'Debe ser mayor de 18 años'
    }

    if (!values.tipo) err.tipo = 'El tipo de documento es obligatorio'

    if (!values.numeroDocumento.trim()) {
      err.numeroDocumento = 'El número de documento es obligatorio'
    } else {
      if (values.tipo === 'DNI' && values.numeroDocumento.length !== 8) {
        err.numeroDocumento = 'El DNI debe tener 8 dígitos'
      } else if (values.tipo === 'CE' && values.numeroDocumento.length !== 9) {
        err.numeroDocumento = 'El CE debe tener 9 dígitos'
      }
    }

    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    setSuccess(false)

    const validation = validate(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setSubmitting(true)

    try {
      const clienteData = {
        tipo: form.tipo,
        numeroDocumento: form.numeroDocumento,
        apellido: form.apellido,
        nombre: form.nombre,
        fechaNacimiento: form.fechaNacimiento,
        email: form.email
      }

      await axios.post(API_URL, clienteData, {
        headers: { 'Content-Type': 'application/json' }
      })

      setSuccess(true)
      setForm(initialForm)
      setTimeout(() => setSuccess(false), 5000)

    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setApiError('Datos inválidos. Verifica la información ingresada.')
        } else if (err.response.status === 409) {
          setApiError('El documento o email ya está registrado.')
        } else if (err.response.status === 500) {
          setApiError('Error en el servidor. Intenta nuevamente más tarde.')
        } else {
          setApiError(`Error: ${err.response.data.message || 'No se pudo registrar el cliente'}`)
        }
      } else if (err.request) {
        setApiError('No se pudo conectar con el servidor.')
      } else {
        setApiError('Error inesperado. Intenta nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box minH="100vh" className="bg-gradient-to-br from-gray-50 to-gray-100" p={6}>
      <Box maxW="4xl" mx="auto">
        <PageHeader
          title="Registro de Clientes"
          description="Registra nuevos clientes en el sistema hotelero"
          icon="👤"
          gradient="bg-gradient-ocean"
        />

        <Box bg="white" rounded="2xl" boxShadow="xl" p={8} className="animate-fadeIn">
          {success && (
            <Alert status="success" mb={6} rounded="xl" className="animate-fadeIn">
              <AlertIcon />
              <AlertDescription>
                ¡Cliente registrado correctamente!
              </AlertDescription>
            </Alert>
          )}

          {apiError && (
            <Alert status="error" mb={6} rounded="xl" className="animate-fadeIn">
              <AlertIcon />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.nombre} isRequired>
                  <FormLabel fontWeight="semibold">Nombre</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiUser className="text-gray-400" />
                    </InputLeftElement>
                    <Input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese su nombre"
                      disabled={submitting}
                      size="lg"
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.apellido} isRequired>
                  <FormLabel fontWeight="semibold">Apellido</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiUser className="text-gray-400" />
                    </InputLeftElement>
                    <Input
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="Ingrese su apellido"
                      disabled={submitting}
                      size="lg"
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.apellido}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel fontWeight="semibold">Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMail className="text-gray-400" />
                  </InputLeftElement>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    disabled={submitting}
                    size="lg"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.fechaNacimiento} isRequired>
                <FormLabel fontWeight="semibold">Fecha de Nacimiento</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiCalendar className="text-gray-400" />
                  </InputLeftElement>
                  <Input
                    name="fechaNacimiento"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    disabled={submitting}
                    size="lg"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.fechaNacimiento}</FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.tipo} isRequired>
                  <FormLabel fontWeight="semibold">Tipo de Documento</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiFileText className="text-gray-400" />
                    </InputLeftElement>
                    <Select
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      placeholder="Seleccione tipo"
                      disabled={submitting}
                      size="lg"
                    >
                      <option value="DNI">DNI</option>
                      <option value="PASAPORTE">Pasaporte</option>
                      <option value="CE">Carné de Extranjería</option>
                    </Select>
                  </InputGroup>
                  <FormErrorMessage>{errors.tipo}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.numeroDocumento} isRequired>
                  <FormLabel fontWeight="semibold">Número de Documento</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiCreditCard className="text-gray-400" />
                    </InputLeftElement>
                    <Input
                      name="numeroDocumento"
                      value={form.numeroDocumento}
                      onChange={handleChange}
                      placeholder="Número de documento"
                      disabled={submitting}
                      size="lg"
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.numeroDocumento}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <Button
                type="submit"
                className="bg-gradient-ocean"
                color="white"
                size="lg"
                w="full"
                isLoading={submitting}
                loadingText="Registrando..."
                mt={4}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
              >
                Registrar Cliente
              </Button>
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Home