import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { supabase } from '../../config/supabaseClient';
import { sendPushNotification } from '../../app/NotificationService'; // Importe a função para enviar notificações

interface FormData {
  name: string;
  cpf: string;
  observation: string;
  value: number;
  data: string;
}

const saveToSupabase = async (data: FormData) => {
  const { data: result, error } = await supabase
    .from('formdatatwo') // Verifique o nome da tabela
    .insert([data]);

  if (error) {
    console.error('Erro ao salvar dados:', error);
  } else {
    console.log('Dados salvos com sucesso:', result);
  }
};

const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, ""); // Remove qualquer coisa que não seja número
  if (cpf.length !== 11) return false;

  // Verificação de CPFs inválidos conhecidos
  if (/^(\d)\1*$/.test(cpf)) return false;

  // Validação dos dígitos verificadores
  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

export default function Form() {
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [observation, setObservation] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [cpfError, setCpfError] = useState<boolean>(false);
  const [valueError, setValueError] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formDataList, setFormDataList] = useState<FormData[]>([]); // Estado definido com tipo FormData[]
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const shakeButton = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    setSuccessMessage("");

    let hasError = false;

    if (!validateCPF(cpf)) {
      setCpfError(true);
      hasError = true;
    } else {
      setCpfError(false);
    }

    if (isNaN(Number(value))) {
      setValueError(true);
      hasError = true;
    } else {
      setValueError(false);
    }

    if (hasError) {
      shakeButton();
      return;
    }

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const formData: FormData = {
      name,
      cpf,
      observation,
      value: parseFloat(value),
      data: formatDate(new Date()),
    };

    // Atualiza a lista com os novos dados
    setFormDataList(prevList => {
      const updatedList = [...prevList, formData];
      saveToSupabase(formData); // Salva os dados no Supabase
      setSuccessMessage("Ótimo, Nota Enviada!");

      if (expoPushToken) {
        sendPushNotification(expoPushToken, "Sua nota foi enviada com sucesso!");
      }

      return updatedList;
    });

    // Limpa os campos do formulário
    setName("");
    setCpf("");
    setObservation("");
    setValue("");
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    setSuccessMessage("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nome (Opcional)"
        mode="outlined"
        value={name}
        onChangeText={handleInputChange(setName)}
        style={styles.input}
      />

      <TextInput
        label="CPF"
        mode="outlined"
        value={cpf}
        onChangeText={handleInputChange(setCpf)}
        keyboardType="numeric"
        maxLength={11}
        style={styles.input}
        error={cpfError}
      />
      {cpfError && <Text style={styles.errorText}>CPF inválido.</Text>}

      <TextInput
        label="Observação"
        mode="outlined"
        value={observation}
        onChangeText={handleInputChange(setObservation)}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      <TextInput
        label="Valor"
        mode="outlined"
        value={value}
        onChangeText={handleInputChange(setValue)}
        keyboardType="numeric"
        style={styles.input}
        error={valueError}
      />
      {valueError && <Text style={styles.errorText}>O valor deve ser numérico.</Text>}

      <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Enviar Nota
        </Button>
      </Animated.View>

      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  successText: {
    color: 'green',
    marginTop: 16,
  },
});
