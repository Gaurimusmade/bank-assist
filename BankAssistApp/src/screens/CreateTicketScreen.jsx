import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { FileIcon, PaperclipIcon, SendIcon, InfoIcon } from '../components/SvgIcons';

export default function CreateTicketScreen() {
  const [ticketType, setTicketType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCreateTicket = () => {
    if (!ticketType.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Simulate ticket creation
    Alert.alert(
      'Success', 
      `Ticket created successfully!\n\nTicket Type: ${ticketType}\nDescription: ${description}${selectedFile ? '\nFile: ' + selectedFile.name : ''}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setTicketType('');
            setDescription('');
            setSelectedFile(null);
          }
        }
      ]
    );
  };

  const handleFileUpload = () => {
    // Simulate file picker
    Alert.alert(
      'File Upload',
      'File upload functionality would be implemented here. For now, this is a simulation.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Select File',
          onPress: () => {
            // Simulate file selection
            setSelectedFile({ name: 'document.pdf', size: '2.5 MB' });
            Alert.alert('Success', 'File selected: document.pdf');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>Create New Ticket</Text>
        
        {/* Ticket Type */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>Ticket Type *</Text>
          <TextInput
            style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
            placeholder="e.g., Account Opening, Loan Application"
            value={ticketType}
            onChangeText={setTicketType}
          />
        </View>

        {/* Description */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>Description *</Text>
          <TextInput
            style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-24`}
            placeholder="Describe the issue or request..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* File Upload */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm font-semibold text-gray-700 mb-2`}>Upload File</Text>
          <TouchableOpacity
            style={tw`bg-white border border-gray-300 rounded-lg p-4 items-center`}
            onPress={handleFileUpload}
          >
            <View style={tw`flex-row items-center`}>
              <PaperclipIcon size={20} color="#2563eb" />
              <Text style={tw`text-blue-600 font-semibold ml-2`}>
                {selectedFile ? 'File Selected: ' + selectedFile.name : 'Choose File'}
              </Text>
            </View>
            {selectedFile && (
              <View style={tw`flex-row items-center mt-2`}>
                <FileIcon size={16} color="#6b7280" />
                <Text style={tw`text-sm text-gray-500 ml-1`}>
                  Size: {selectedFile.size}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={tw`bg-blue-600 rounded-lg py-4 px-6 items-center flex-row`}
          onPress={handleCreateTicket}
        >
          <SendIcon size={20} color="white" />
          <Text style={tw`text-white font-bold text-lg ml-2`}>Submit Ticket</Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={tw`mt-4 p-4 bg-blue-50 rounded-lg flex-row items-center`}>
          <InfoIcon size={16} color="#1e40af" />
          <Text style={tw`text-sm text-blue-800 ml-2`}>
            * Required fields
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 