import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import Feather from 'react-native-vector-icons/Feather';

// Dummy data for tickets
const STATUS_LABELS = {
  0: "Pending",
  1: "In Progress", 
  2: "Under Review",
  3: "Closed",
  9: "Invalid"
};

const dummyTickets = [
  {
    ticket_id: "TKT-001",
    ticket_type: "Account Opening",
    priority: 1,
    status: 1,
    customer_name: "John Doe",
    phone: "+91 98765 43210",
    incoming_phone: "+91 98765 43210",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T14:20:00Z",
    assigned_to_name: "Sarah Wilson",
    assigned_by_name: "Manager",
    ticket_description: "Customer wants to open a new savings account with initial deposit of ₹50,000. Requires assistance with documentation.",
    call_id: "0",
    auto_escalated: false,
    file_urls: ["document1.pdf", "id_proof.jpg"]
  },
  {
    ticket_id: "TKT-002", 
    ticket_type: "Loan Application",
    priority: 2,
    status: 2,
    customer_name: "Jane Smith",
    phone: "+91 87654 32109",
    incoming_phone: 0,
    created_at: "2024-01-14T09:15:00Z",
    updated_at: "2024-01-15T11:45:00Z",
    assigned_to_name: "Mike Johnson",
    assigned_by_name: "Auto Assignment",
    ticket_description: "Personal loan application for ₹2,00,000. Income verification pending.",
    call_id: "12345",
    auto_escalated: true,
    file_urls: []
  },
  {
    ticket_id: "TKT-003",
    ticket_type: "Card Replacement", 
    priority: 3,
    status: 3,
    customer_name: "Robert Brown",
    phone: "+91 76543 21098",
    incoming_phone: "+91 76543 21098",
    created_at: "2024-01-13T16:20:00Z",
    updated_at: "2024-01-14T10:30:00Z",
    assigned_to_name: "Lisa Davis",
    assigned_by_name: "Customer Service",
    ticket_description: "Debit card lost. Requesting replacement card with new PIN.",
    call_id: "0",
    auto_escalated: false,
    file_urls: ["police_complaint.pdf"]
  }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status) => {
  switch(status) {
    case 1: return tw`bg-blue-200`;
    case 2: return tw`bg-yellow-200`;
    case 3: return tw`bg-green-200`;
    case 9: return tw`bg-orange-200`;
    default: return tw`bg-gray-200`;
  }
};

const getStatusTextColor = (status) => {
  switch(status) {
    case 1: return tw`text-blue-800`;
    case 2: return tw`text-yellow-800`;
    case 3: return tw`text-green-800`;
    case 9: return tw`text-orange-800`;
    default: return tw`text-gray-800`;
  }
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 1: return tw`bg-red-200`;
    case 2: return tw`bg-yellow-200`;
    default: return tw`bg-green-200`;
  }
};

const getPriorityTextColor = (priority) => {
  switch(priority) {
    case 1: return tw`text-red-800`;
    case 2: return tw`text-yellow-800`;
    default: return tw`text-green-800`;
  }
};

const getPriorityText = (priority) => {
  switch(priority) {
    case 1: return "High";
    case 2: return "Medium";
    default: return "Low";
  }
};

export default function Ticket() {
  const handleViewDetails = (ticket) => {
    Alert.alert("View Details", `Ticket ID: ${ticket.ticket_id}\nType: ${ticket.ticket_type}`);
  };

  const handleViewFiles = (ticket) => {
    if (ticket.file_urls && ticket.file_urls.length > 0) {
      Alert.alert("View Files", `Files: ${ticket.file_urls.join(', ')}`);
    } else {
      Alert.alert("No Files", "No files available for this ticket.");
    }
  };

  const handleUploadFile = (ticket) => {
    Alert.alert("Upload File", `Upload file for ticket: ${ticket.ticket_id}`);
  };

  const handleAppeal = (ticket) => {
    Alert.alert("Appeal Decision", `Appeal for ticket: ${ticket.ticket_id}`);
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4`}>
          {dummyTickets.length === 0 ? (
            <View style={tw`flex items-center justify-center py-12`}>
              <Text style={tw`text-gray-500 text-lg mb-4`}>No tickets found.</Text>
            </View>
          ) : (
            dummyTickets.map((ticket, index) => (
              <View 
                key={ticket.ticket_id}
                style={[
                  tw`relative rounded-lg overflow-hidden bg-white mb-4 shadow-lg`,
                  ticket.status === 1 ? tw`border-r-4 border-blue-200` :
                  ticket.status === 2 ? tw`border-r-4 border-yellow-200` :
                  ticket.status === 3 ? tw`border-r-4 border-green-200` :
                  ticket.status === 9 ? tw`border-r-4 border-orange-200` :
                  tw`border-r-4 border-gray-200`
                ]}
              >
                {/* Status Badge - Fixed positioning */}
                <View style={[
                  tw`absolute top-2 left-0 px-3 py-1 rounded-r-lg`,
                  getStatusColor(ticket.status)
                ]}>
                  <Text style={[
                    tw`text-xs font-semibold`,
                    getStatusTextColor(ticket.status)
                  ]}>
                    {STATUS_LABELS[ticket.status] || "Unknown"}
                  </Text>
                </View>

                <View style={tw`flex-row`}>
                  {/* Left: QR Stub */}
                  <View style={tw`border-r border-gray-300 flex items-center justify-center px-3 py-4 w-28`}>
                    <View style={[
                      tw`px-2 py-1 rounded text-xs font-semibold mb-2`,
                      ticket.call_id === "0" ? tw`bg-purple-300` : tw`bg-blue-300`
                    ]}>
                      <Text style={ticket.call_id === "0" ? tw`text-purple-800` : tw`text-blue-800`}>
                        {ticket.call_id === "0" ? "Web" : "AI-Call"}
                      </Text>
                    </View>
                    
                    <Text style={tw`text-xs uppercase tracking-wide font-medium text-gray-600 mb-1`}>
                      Ticket ID
                    </Text>
                    <Text style={tw`text-sm font-mono font-bold text-gray-800 mb-2`}>
                      {ticket.ticket_id}
                    </Text>
                    
                    {/* QR Code Placeholder */}
                    <View style={tw`w-12 h-12 bg-gray-200 rounded items-center justify-center`}>
                      <Text style={tw`text-xs text-gray-500`}>QR</Text>
                    </View>
                  </View>

                  {/* Center: Ticket Info */}
                  <View style={tw`flex-1 px-3 py-3`}>
                    <View style={tw`flex-row items-center mb-2`}>
                      <Text style={tw`text-base font-semibold text-gray-800 mr-2 flex-1`}>
                        {ticket.ticket_type}
                      </Text>
                      <View style={[
                        tw`rounded px-2 py-1`,
                        getPriorityColor(ticket.priority)
                      ]}>
                        <Text style={[
                          tw`text-xs font-semibold`,
                          getPriorityTextColor(ticket.priority)
                        ]}>
                          {getPriorityText(ticket.priority)}
                        </Text>
                      </View>
                    </View>
                    
                    {ticket.auto_escalated && (
                      <View style={tw`bg-red-100 border border-red-200 rounded px-2 py-1 mb-2`}>
                        <Text style={tw`text-xs text-red-700 font-semibold`}>
                          Escalated
                        </Text>
                      </View>
                    )}

                    <View style={tw`space-y-1 mb-2`}>
                      <View style={tw`flex-row`}>
                        <Text style={tw`text-xs text-gray-600 w-16`}>Name:</Text>
                        <Text style={tw`text-xs text-gray-800 flex-1`}>{ticket.customer_name || "N/A"}</Text>
                      </View>
                      <View style={tw`flex-row`}>
                        <Text style={tw`text-xs text-gray-600 w-16`}>Phone:</Text>
                        <Text style={tw`text-xs text-gray-800 flex-1`}>{ticket.phone || "N/A"}</Text>
                      </View>
                      {ticket.incoming_phone !== 0 && (
                        <View style={tw`flex-row`}>
                          <Text style={tw`text-xs text-gray-600 w-16`}>Calling:</Text>
                          <Text style={tw`text-xs text-gray-800 flex-1`}>{ticket.incoming_phone || "N/A"}</Text>
                        </View>
                      )}
                      <View style={tw`flex-row`}>
                        <Text style={tw`text-xs text-gray-600 w-16`}>Created:</Text>
                        <Text style={tw`text-xs text-gray-800 flex-1`}>{formatDate(ticket.created_at)}</Text>
                      </View>
                      <View style={tw`flex-row`}>
                        <Text style={tw`text-xs text-gray-600 w-16`}>Assigned:</Text>
                        <Text style={tw`text-xs text-gray-800 flex-1`}>{ticket.assigned_to_name || "N/A"}</Text>
                      </View>
                    </View>

                    <View style={tw`bg-gray-50 p-2 rounded border border-gray-200`}>
                      <Text style={tw`text-xs font-bold text-gray-700 mb-1`}>Description</Text>
                      <Text style={tw`text-xs text-gray-800`}>
                        {ticket.ticket_description || "No description provided."}
                      </Text>
                    </View>
                  </View>

                  {/* Right: Actions - Fixed alignment */}
                  <View style={tw`flex justify-center items-center p-2 w-16`}>
                    <View style={tw`space-y-3`}>
                      <TouchableOpacity
                        onPress={() => handleViewDetails(ticket)}
                        style={tw`w-8 h-8 bg-blue-600 rounded-full items-center justify-center`}
                      >
                        <Feather name="eye" size={12} color="white" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => handleViewFiles(ticket)}
                        style={[
                          tw`w-8 h-8 rounded-full items-center justify-center`,
                          ticket.file_urls && ticket.file_urls.length > 0
                            ? tw`bg-purple-600`
                            : tw`bg-gray-400`
                        ]}
                      >
                        <Feather name="file-text" size={12} color="white" />
                      </TouchableOpacity>
                      
                      {ticket.call_id !== "0" && ticket.status !== 3 && ticket.status !== 9 && (
                        <TouchableOpacity
                          onPress={() => handleUploadFile(ticket)}
                          style={tw`w-8 h-8 bg-green-600 rounded-full items-center justify-center`}
                        >
                          <Feather name="upload" size={12} color="white" />
                        </TouchableOpacity>
                      )}
                      
                      {(ticket.status === 3 || ticket.status === 9) && (
                        <TouchableOpacity
                          onPress={() => handleAppeal(ticket)}
                          style={tw`w-8 h-8 bg-red-600 rounded-full items-center justify-center`}
                        >
                          <Feather name="alert-triangle" size={12} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}