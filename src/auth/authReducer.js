export const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload,
        refreshToken: action.refreshToken || null,
        roles: action.roles || [],
        permisos: action.permisos || []
      };

    case 'logout':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        refreshToken: null
      };
    case 'SET_ROLES_Y_PERMISOS':
      return {
        ...state,
        roles: action.payload.roles,
        permisos: action.payload.permisos
      };
    default:
      return state;
  }
};
