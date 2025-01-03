export const getUserProfile = (req, res) => {
    res.status(200).json({ message: 'Perfil do usuário retornado com sucesso!' });
  };
  
  export const updateUserProfile = (req, res) => {
    res.status(200).json({ message: 'Perfil do usuário atualizado com sucesso!' });
  };
