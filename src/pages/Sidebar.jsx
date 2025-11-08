import { useState } from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  IconButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiMessageSquare,
  FiHeart,
  FiSettings,
  FiMenu,
  FiSearch,
  FiChevronLeft,
} from "react-icons/fi";

const sections = [
  {
    title: "Analytics",
    items: [
      { name: "Dashboard", icon: FiHome, active: true },
      { name: "Performance", icon: FiTrendingUp },
      { name: "Conversions", icon: FiBarChart2 },
    ],
  },
  {
    title: "Contents",
    items: [
      { name: "Guide", icon: FiBookOpen },
      { name: "Hotspots", icon: FiMessageSquare, badge: 10 },
      { name: "Checklists", icon: FiCalendar },
      { name: "NPS", icon: FiHeart },
    ],
  },
  {
    title: "Customs",
    items: [
      { name: "Segments", icon: FiSettings, badge: 20 },
      { name: "Theme", icon: FiSettings },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const SidebarContent = ({ isDrawer = false }) => (
    <Box
      bg="white"
      h="100vh"
      w={collapsed && !isDrawer ? "80px" : "260px"}
      transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      borderRight="1px solid"
      borderColor="gray.200"
      display="flex"
      flexDirection="column"
      boxShadow="sm"
      overflow="hidden"
    >
      {/* TOP */}
      <Box
        overflowY="auto"
        overflowX="hidden"
        flex="1"
        p="4"
        sx={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.300",
            borderRadius: "full",
          },
        }}
      >
        {/* Logo */}
        <Flex align="center" mb={6} minH="40px">
          <Box
            bg="gray.800"
            minW="40px"
            h="40px"
            borderRadius="xl"
            mr={collapsed && !isDrawer ? 0 : 3}
            transition="margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            flexShrink={0}
          />
          <Box
            opacity={collapsed && !isDrawer ? 0 : 1}
            transform={
              collapsed && !isDrawer ? "translateX(-10px)" : "translateX(0)"
            }
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            overflow="hidden"
            whiteSpace="nowrap"
            pointerEvents={collapsed && !isDrawer ? "none" : "auto"}
          >
            <Text fontWeight="bold" fontSize="md" lineHeight="shorter">
              Halal Lab
            </Text>
            <Text fontSize="xs" color="gray.500" lineHeight="shorter" mt={0.5}>
              Workspace switcher
            </Text>
          </Box>
        </Flex>

        {/* Search */}
        <Box
          mb={5}
          opacity={collapsed && !isDrawer ? 0 : 1}
          h={collapsed && !isDrawer ? "0" : "auto"}
          overflow="hidden"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          pointerEvents={collapsed && !isDrawer ? "none" : "auto"}
        >
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none" h="40px">
              <Icon as={FiSearch} color="gray.400" boxSize={4} />
            </InputLeftElement>
            <Input
              placeholder="Search"
              borderRadius="lg"
              fontSize="sm"
              h="40px"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300", bg: "gray.100" }}
              _focus={{
                bg: "white",
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
              transition="all 0.2s"
            />
          </InputGroup>
        </Box>

        {/* Sections */}
        {sections.map((section) => (
          <Box key={section.title} mb={4}>
            {/* Section Title */}
            <Box
              opacity={collapsed && !isDrawer ? 0 : 1}
              h={collapsed && !isDrawer ? "0" : "auto"}
              overflow="hidden"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              mb={collapsed && !isDrawer ? 0 : 2}
            >
              <Text
                fontSize="xs"
                color="gray.400"
                textTransform="uppercase"
                fontWeight="semibold"
                letterSpacing="wider"
              >
                {section.title}
              </Text>
            </Box>

            {/* Menu Items */}
            <Box>
              {section.items.map((item) => {
                const menuItem = (
                  <Flex
                    key={item.name}
                    align="center"
                    justify={
                      collapsed && !isDrawer ? "center" : "space-between"
                    }
                    bg={item.active ? "gray.100" : "transparent"}
                    _hover={{
                      bg: item.active ? "gray.200" : "gray.50",
                      transform: "translateX(2px)",
                    }}
                    p={collapsed && !isDrawer ? "2.5" : "2.5"}
                    borderRadius="lg"
                    cursor="pointer"
                    mb={1}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    position="relative"
                  >
                    <Flex align="center" gap="3" flex="1" minW="0">
                      <Icon
                        as={item.icon}
                        boxSize={5}
                        color={item.active ? "blue.500" : "gray.600"}
                        flexShrink={0}
                        transition="color 0.2s"
                      />
                      <Text
                        fontSize="sm"
                        color={item.active ? "gray.800" : "gray.700"}
                        fontWeight={item.active ? "medium" : "normal"}
                        opacity={collapsed && !isDrawer ? 0 : 1}
                        transform={
                          collapsed && !isDrawer
                            ? "translateX(-10px)"
                            : "translateX(0)"
                        }
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        pointerEvents={collapsed && !isDrawer ? "none" : "auto"}
                      >
                        {item.name}
                      </Text>
                    </Flex>
                    {item.badge && (
                      <Badge
                        borderRadius="full"
                        bg="gray.800"
                        color="white"
                        fontSize="0.7em"
                        px={2}
                        py={0.5}
                        opacity={collapsed && !isDrawer ? 0 : 1}
                        transform={
                          collapsed && !isDrawer ? "scale(0)" : "scale(1)"
                        }
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        pointerEvents={collapsed && !isDrawer ? "none" : "auto"}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Flex>
                );

                // Tooltip solo en estado colapsado (desktop)
                return collapsed && !isDrawer ? (
                  <Tooltip
                    key={item.name}
                    label={item.name}
                    placement="right"
                    hasArrow
                    bg="gray.800"
                    color="white"
                    fontSize="xs"
                    px={3}
                    py={2}
                    borderRadius="md"
                  >
                    {menuItem}
                  </Tooltip>
                ) : (
                  <Box key={item.name}>{menuItem}</Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* BOTTOM - Collapse Button (solo desktop) */}
      {!isDrawer && (
        <Box p="4" borderTop="1px solid" borderColor="gray.200" bg="white">
          <Flex justify={collapsed ? "center" : "flex-end"}>
            <Tooltip
              label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              placement="right"
              hasArrow
              bg="gray.800"
              color="white"
              fontSize="xs"
              px={3}
              py={2}
              borderRadius="md"
            >
              <IconButton
                icon={
                  <Icon
                    as={FiChevronLeft}
                    boxSize={4}
                    transform={collapsed ? "rotate(180deg)" : "rotate(0deg)"}
                    transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  />
                }
                aria-label={collapsed ? "Expandir" : "Colapsar"}
                onClick={() => setCollapsed(!collapsed)}
                bg="gray.800"
                color="white"
                borderRadius="lg"
                _hover={{
                  bg: "gray.700",
                  transform: "scale(1.05)",
                }}
                _active={{
                  bg: "gray.900",
                  transform: "scale(0.95)",
                }}
                size="sm"
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              />
            </Tooltip>
          </Flex>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Botón hamburguesa flotante (solo móvil) */}
      <IconButton
        icon={<Icon as={FiMenu} boxSize={5} />}
        aria-label="Abrir menú"
        onClick={onOpen}
        position="fixed"
        top="4"
        left="4"
        zIndex="dropdown"
        bg="gray.800"
        color="white"
        borderRadius="lg"
        _hover={{
          bg: "gray.700",
          transform: "scale(1.05)",
        }}
        _active={{
          bg: "gray.900",
          transform: "scale(0.95)",
        }}
        display={{ base: isOpen ? "none" : "flex", md: "none" }}
        boxShadow="lg"
        size="md"
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      />

      {/* Sidebar desktop */}
      <Box display={{ base: "none", md: "block" }} position="relative">
        <SidebarContent />
      </Box>

      {/* Drawer móvil */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay
          backdropFilter="blur(4px)"
          bg="blackAlpha.400"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        />
        <DrawerContent maxW="260px" boxShadow="2xl">
          <DrawerCloseButton
            top="4"
            right="4"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
            transition="all 0.2s"
          />
          <DrawerBody p="0">
            <SidebarContent isDrawer={true} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
