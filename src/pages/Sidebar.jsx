import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserRole, getUser, logout } from "../services/authService";
import {
  Box,
  Flex,
  Icon,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  IconButton,
  useDisclosure,
  Avatar,
  Button,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiSettings,
  FiMenu,
  FiGrid,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const getSections = (userRole) => {
  const baseSections = [];

  // Secciones para RECEPCIONISTA
  if (userRole === "RECEPCIONISTA") {
    baseSections.push({
      title: "Gestión",
      items: [
        { name: "Registro de Clientes", icon: FiHome, path: "/clientes/registro" },
        { name: "Nueva Reserva", icon: FiCalendar, path: "/reservas" },
        { name: "Lista de Reservas", icon: FiBookOpen, path: "/reservas/lista" },
        { name: "Mapa de Habitaciones", icon: FiGrid, path: "/habitaciones/mapa" },
      ],
    });
  }

  // Secciones para ADMIN
  if (userRole === "ADMIN") {
    baseSections.push(
      {
        title: "Consultas",
        items: [
          { name: "Lista de Reservas", icon: FiBookOpen, path: "/reservas/lista" },
          { name: "Mapa de Habitaciones", icon: FiGrid, path: "/habitaciones/mapa" },
        ],
      },
      {
        title: "Administración",
        items: [
          { name: "Gestión de Habitaciones", icon: FiSettings, path: "/admin/habitaciones" },
          { name: "Gestión de Usuarios", icon: FiUser, path: "/admin/usuarios" },
        ],
      },
      {
        title: "Reportes",
        items: [
          { name: "Dashboard", icon: FiTrendingUp, path: "/admin/dashboard" },
          { name: "Ocupación", icon: FiBarChart2 },
          { name: "Ingresos", icon: FiBarChart2 },
        ],
      }
    );
  }

  return baseSections;
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();
  const user = getUser();
  const sections = getSections(userRole);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = ({ isDrawer = false }) => (
    <Box
      className="bg-gradient-primary"
      h="100vh"
      w={collapsed && !isDrawer ? "80px" : "260px"}
      transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      display="flex"
      flexDirection="column"
      boxShadow="2xl"
      overflow="hidden"
    >
      {/* Header con Logo */}
      <Box p="6" borderBottom="1px solid" borderColor="whiteAlpha.200">
        <Flex align="center" gap="3">
          <Box className="text-4xl">🏨</Box>
          {(!collapsed || isDrawer) && (
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="white">
                Hotel System
              </Text>
              <Text fontSize="xs" color="whiteAlpha.800">
                Gestión Hotelera
              </Text>
            </Box>
          )}
        </Flex>
      </Box>

      {/* User Info */}
      {user && (
        <Box p="4" borderBottom="1px solid" borderColor="whiteAlpha.200">
          <Flex align="center" gap="3">
            <Avatar
              size="sm"
              name={user.username}
              bg="whiteAlpha.300"
              color="white"
            />
            {(!collapsed || isDrawer) && (
              <Box flex="1">
                <Text fontSize="sm" fontWeight="semibold" color="white">
                  {user.username}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.800">
                  {user.rol}
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
      )}

      {/* Menu Items */}
      <Box
        overflowY="auto"
        overflowX="hidden"
        flex="1"
        p="4"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '4px',
          },
        }}
      >
        {sections.map((section, idx) => (
          <Box key={idx} mb="6">
            {(!collapsed || isDrawer) && (
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="white"
                textTransform="uppercase"
                mb="2"
                px="3"
                opacity="0.9"
              >
                {section.title}
              </Text>
            )}
            {section.items.map((item, itemIdx) => {
              const isActive = location.pathname === item.path;
              return (
                <Flex
                  key={itemIdx}
                  align="center"
                  gap="3"
                  p="3"
                  mb="1"
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? "whiteAlpha.300" : "transparent"}
                  color="white"
                  _hover={{
                    bg: "whiteAlpha.200",
                    transform: "translateX(4px)",
                  }}
                  transition="all 0.2s"
                  onClick={() => item.path && navigate(item.path)}
                >
                  <Icon as={item.icon} boxSize="5" />
                  {(!collapsed || isDrawer) && (
                    <Text fontSize="sm" fontWeight="medium">
                      {item.name}
                    </Text>
                  )}
                </Flex>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Logout Button */}
      <Box p="4" borderTop="1px solid" borderColor="whiteAlpha.200">
        <Button
          leftIcon={<FiLogOut />}
          onClick={handleLogout}
          w="full"
          size="sm"
          bg="whiteAlpha.200"
          color="white"
          _hover={{ bg: "whiteAlpha.300" }}
          display={collapsed && !isDrawer ? "none" : "flex"}
        >
          Cerrar Sesión
        </Button>
        {collapsed && !isDrawer && (
          <IconButton
            icon={<FiLogOut />}
            onClick={handleLogout}
            size="sm"
            bg="whiteAlpha.200"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            aria-label="Cerrar sesión"
          />
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box display={{ base: "none", md: "block" }}>
        <SidebarContent />
      </Box>

      {/* Mobile Menu Button */}
      <IconButton
        icon={<FiMenu />}
        onClick={onOpen}
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top="4"
        left="4"
        zIndex="999"
        colorScheme="purple"
        aria-label="Abrir menú"
      />

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="transparent" boxShadow="none">
          <DrawerCloseButton color="white" />
          <DrawerBody p="0">
            <SidebarContent isDrawer={true} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
