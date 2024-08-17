import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, Text, Dimensions, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { supabase } from '../../config/supabaseClient';

// Função para validar o CPF
function validateCPF(cpf: string) {
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
}

const saveToSupabase = async (data: any) => {
    const { data: result, error } = await supabase
      .from('formdatatwo') // Verifique o nome da tabela
      .insert([data]);

    if (error) {
      console.error('Erro ao salvar dados:', error);
    } else {
      console.log('Dados salvos com sucesso:', result);
    }
};

export default function Form() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [observation, setObservation] = useState("");
  const [value, setValue] = useState("");
  const [cpfError, setCpfError] = useState(false);
  const [valueError, setValueError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formDataList, setFormDataList] = useState<any[]>([]); // Lista para armazenar os dados do formulário

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
    setSuccessMessage(""); // Limpa a mensagem de sucesso ao tentar enviar novamente

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

    // Configuração da requisição
    const formData = {
      name, // corresponde à coluna 'name'
      cpf,  // corresponde à coluna 'cpf'
      observation, // corresponde à coluna 'observation'
      value: parseFloat(value), // corresponde à coluna 'value'
      data: new Date().toISOString(), // Adiciona a data e a hora atuais
    };

    // Atualiza a lista com os novos dados
    setFormDataList(prevList => {
      const updatedList = [...prevList, formData];
      saveToSupabase(formData); // Salva os dados no Supabase
      setSuccessMessage("Ótimo, Nota Enviada!");
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
    setSuccessMessage(""); // Limpa a mensagem de sucesso ao alterar qualquer campo
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
          Enviar
        </Button>
      </Animated.View>

      {successMessage !== "" && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: Dimensions.get("window").width * 0.9, // 90% da largura da tela
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    width: Dimensions.get("window").width * 0.9, // 90% da largura da tela
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  successText: {
    color: "green",
    marginTop: 20,
    textAlign: "center",
    fontSize: 26,
  },
});
