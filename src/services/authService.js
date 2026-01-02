const API_URL = "http://localhost:8082/api/auth"; // tu backend Spring Boot

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (response.ok && !data.error && data.usuario) {
    // guardar sesión localmente con información del usuario
    localStorage.setItem("user", JSON.stringify(data.usuario));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
  const user = getUser();
  return user ? user.rol : null;
};

export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};

export const isRecepcionista = () => {
  return getUserRole() === "RECEPCIONISTA";
};

