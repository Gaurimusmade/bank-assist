import React from 'react';
import { View, ScrollView } from 'react-native';
import tw from 'twrnc';
import TicketEnhanced from './TicketEnhanced';

export default function Ticket() {

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <ScrollView style={tw`flex-1`}>
        <TicketEnhanced />
      </ScrollView>
    </View>
  );
}