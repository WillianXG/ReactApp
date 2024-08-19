import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, RefreshControl } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SwipeListView } from 'react-native-swipe-list-view';

const supabaseUrl = 'https://slcqpbnzklomznghkioq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3FwYm56a2xvbXpuZ2hraW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM4NDg3OTEsImV4cCI6MjAzOTQyNDc5MX0.5twJFh_0_dhRCrc_Bnk89cQc_Z1DkJfQv95Y3ue89hs';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const Appsa = () => {
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      let { data: formdatatwo, error } = await supabase
        .from('formdatatwo')
        .select('*');

      if (error) {
        console.error('Erro ao buscar dados:', error.message);
      } else {
        setData(formdatatwo || []);
      }
    } catch (error) {
      console.error('Erro geral:', error);
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
          <Image 
            source={
              item.check_done === 1
                ? require('../../assets/images/checked.png')
                : require('../../assets/images/remove.png')
            } 
            style={styles.icon} 
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderHiddenItem = () => (
    <View>
      {/* Mantido vazio para remover fundo oculto */}
    </View>
  );

  const handleSwipeValueChange = (swipeData: any) => {
    const { key, value } = swipeData;
    if (value < -75) {
      handleMarkAsDone(key);
    }
  };

  return (
    <SwipeListView
      data={data}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-75}
      onSwipeValueChange={handleSwipeValueChange}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      disableRightSwipe
      keyExtractor={item => item.id.toString()}
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
    width: 24,
    height: 24,
  },
});

export default Appsa;
