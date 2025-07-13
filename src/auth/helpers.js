export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};


export const getApiUrl = () => {
  const apiUrl = "https://localhost:7140/api";
  
  return apiUrl;
}

export const renovarToken = async () => {
  const usuario = localStorage.getItem('usuario');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!usuario || !refreshToken) return null;

  try {
    const res = await axios.post(`${getApiUrl()}/Usuarios/refresh`, {
      usuario,
      refreshToken
    });

    const nuevoToken = res.data.result.token;
    const nuevoRefresh = res.data.result.refreshToken;

    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('refreshToken', nuevoRefresh);

    return {
      token: nuevoToken,
      refreshToken: nuevoRefresh,
      usuario: res.data.result.usuario
    };
  } catch (err) {
    console.error('Error al renovar token:', err);
    localStorage.clear();
    return null;
  }
};


