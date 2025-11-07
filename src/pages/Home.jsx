import React, { useState } from 'react'
import axios from 'axios'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Button,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react'

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
    
    if (!values.nombre.trim()) {
      err.nombre = 'El nombre es obligatorio'
    }
    
    if (!values.apellido.trim()) {
      err.apellido = 'El apellido es obligatorio'
    }
    
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
      if (age < 18) {
        err.fechaNacimiento = 'Debe ser mayor de 18 años'
      }
    }
    
    if (!values.tipo) {
      err.tipo = 'El tipo de documento es obligatorio'
    }
    
    if (!values.numeroDocumento.trim()) {
      err.numeroDocumento = 'El número de documento es obligatorio'
    } else {
      // Validación específica por tipo de documento
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
    
    // Limpiar mensajes previos
    setApiError('')
    setSuccess(false)
    
    // Validar formulario
    const validation = validate(form)
    setErrors(validation)
    
    if (Object.keys(validation).length > 0) return

    setSubmitting(true)
    
    try {
      // Preparar datos para enviar al backend
      const clienteData = {
        tipo: form.tipo,
        numeroDocumento: form.numeroDocumento,
        apellido: form.apellido,
        nombre: form.nombre,
        fechaNacimiento: form.fechaNacimiento,
        email: form.email
      }

      // Realizar petición POST
      const response = await axios.post(API_URL, clienteData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Cliente registrado:', response.data)
      
      // Mostrar mensaje de éxito
      setSuccess(true)
      setForm(initialForm)
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccess(false), 5000)
      
    } catch (err) {
      console.error('Error al registrar cliente:', err)
      
      // Manejo de errores específicos
      if (err.response) {
        // El servidor respondió con un código de error
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
        // La petición fue hecha pero no hubo respuesta
        setApiError('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.')
      } else {
        // Otro tipo de error
        setApiError('Error inesperado. Intenta nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={6}>
      <Box w="full" maxW="lg" bg="white" rounded="lg" boxShadow="md" p={8}>
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="gray.700">
          Registro de Cliente
        </Heading>

        {success && (
          <Alert status="success" mb={4} rounded="md">
            <AlertIcon />
            <AlertDescription>
              ¡Cliente registrado correctamente!
            </AlertDescription>
          </Alert>
        )}

        {apiError && (
          <Alert status="error" mb={4} rounded="md">
            <AlertIcon />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.nombre} isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input 
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                placeholder="Ingrese su nombre" 
                disabled={submitting}
              />
              <FormErrorMessage>{errors.nombre}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.apellido} isRequired>
              <FormLabel>Apellido</FormLabel>
              <Input 
                name="apellido" 
                value={form.apellido} 
                onChange={handleChange} 
                placeholder="Ingrese su apellido"
                disabled={submitting}
              />
              <FormErrorMessage>{errors.apellido}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="correo@ejemplo.com"
                disabled={submitting}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.fechaNacimiento} isRequired>
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <Input 
                name="fechaNacimiento" 
                type="date" 
                value={form.fechaNacimiento} 
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                disabled={submitting}
              />
              <FormErrorMessage>{errors.fechaNacimiento}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.tipo} isRequired>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select 
                name="tipo" 
                value={form.tipo} 
                onChange={handleChange}
                placeholder="Seleccione tipo de documento"
                disabled={submitting}
              >
                <option value="DNI">DNI</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="CE">Carné de Extranjería</option>
              </Select>
              <FormErrorMessage>{errors.tipo}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.numeroDocumento} isRequired>
              <FormLabel>Número de Documento</FormLabel>
              <Input 
                name="numeroDocumento" 
                value={form.numeroDocumento} 
                onChange={handleChange} 
                placeholder="Ingrese número de documento"
                disabled={submitting}
              />
              <FormErrorMessage>{errors.numeroDocumento}</FormErrorMessage>
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="blue" 
              size="lg" 
              w="full"
              isLoading={submitting}
              loadingText="Registrando..."
              mt={4}
            >
              Registrar Cliente
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  )
}

export default Home