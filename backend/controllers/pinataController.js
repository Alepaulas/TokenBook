export const uploadToPinata = (req, res) => {
    res.status(200).json({ message: 'Upload para Pinata realizado com sucesso!' });
  };
  
  export const getFromPinata = (req, res) => {
    res.status(200).json({ message: 'Dados obtidos da Pinata!' });
  };
  