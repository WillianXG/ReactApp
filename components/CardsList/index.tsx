import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FlatList } from 'react-native';

const supabaseUrl = 'https://slcqpbnzklomznghkioq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3FwYm56a2xvbXpuZ2hraW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM4NDg3OTEsImV4cCI6MjAzOTQyNDc5MX0.5twJFh_0_dhRCrc_Bnk89cQc_Z1DkJfQv95Y3ue89hs';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const Appsa = () => {
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      let { data: formdatatwo, error } = await supabase
        .from('formdatatwo')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dados:', error.message);
      } else {
        setData(formdatatwo || []);
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleMarkAsDone = async (itemId: string) => {
    Alert.alert(
      'Nota Enviada Feita?',
      'Você quer marcar esta nota como enviada?',
      [
        {
          text: 'Não',
          onPress: () => console.log('Ação cancelada'),
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('formdatatwo')
                .update({ check_done: 1 })
                .eq('id', itemId);

              if (error) {
                console.error('Erro ao atualizar:', error.message);
              } else {
                fetchData();
              }
            } catch (error) {
              console.error('Erro geral:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Title>{item.name}</Title>
          <Paragraph>CPF: {item.cpf}</Paragraph>
          <Paragraph>Data: {new Date(item.data).toLocaleDateString()}</Paragraph>
          <Paragraph>Hora: {new Date(item.data).toLocaleTimeString()}</Paragraph>
          <Paragraph>Observação: {item.observation}</Paragraph>
          <Paragraph>Valor: {item.value}</Paragraph>
          {item.check_done === 1 && (
            <Paragraph>Confirmado</Paragraph>
          )}
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleMarkAsDone(item.id)}>
            <Image 
              source={
                item.check_done === 1
                  ? require('../../assets/images/checked.png')
                  : require('../../assets/images/remove.png')
              } 
              style={styles.icon} 
            />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando notas...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 26,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40, // Aumenta a largura do ícone
    height: 40, // Aumenta a altura do ícone
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Appsa;
