import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Image } from 'react-native';
import tw from 'twrnc';
import { 
  EyeIcon, 
  FileTextIconSmall, 
  UploadIcon, 
  AlertTriangleIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  FileTextIcon,
  CallOutIcon,
  UserPlusIcon,
  DocumentIcon,
  CheckIcon,
  XIcon
} from './SvgIcons';
import { getApiUrl, getEmployeeApiUrl, getScanUrl, API_CONFIG } from '../config/api';
import { getAccessToken, getCustomerPhoneNumber, isProfileComplete } from '../utils/storage';

// Status labels
const STATUS_LABELS = {
  0: "Un-Assigned",
  1: "Assigned", 
  2: "To Be Reviewed",
  3: "Closed",
  4: "Requested For More Info",
  9: "Invalid"
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  return `${day} ${month} ${year} - ${formattedTime}`;
};

const getStatusColor = (status) => {
  switch(status) {
    case 1: return tw`bg-blue-200`;
    case 2: return tw`bg-yellow-200`;
    case 3: return tw`bg-green-200`;
    case 9: return tw`bg-orange-200`;
    case 0: return tw`bg-gray-200`;
    default: return tw`bg-gray-200`;
  }
};

const getStatusTextColor = (status) => {
  switch(status) {
    case 1: return tw`text-blue-800`;
    case 2: return tw`text-yellow-800`;
    case 3: return tw`text-green-800`;
    case 9: return tw`text-orange-800`;
    case 0: return tw`text-gray-800`;
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

export default function TicketEnhanced() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalTicket, setModalTicket] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentTicketForUpload, setCurrentTicketForUpload] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isViewFileModalOpen, setIsViewFileModalOpen] = useState(false);
  const [currentTicketForView, setCurrentTicketForView] = useState(null);
  const [activeFileTab, setActiveFileTab] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isActionTakenModalOpen, setIsActionTakenModalOpen] = useState(false);
  const [currentTicketForAction, setCurrentTicketForAction] = useState(null);
  const [actionTakenDetails, setActionTakenDetails] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionData, setActionData] = useState({
    status: "",
    remarks: "",
  });
  
  // Ticket history states
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Check profile completion on mount
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const profileComplete = true;
        if (!profileComplete) {
          setShowProfileModal(true);
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
      }
    };
    checkProfileCompletion();
  }, []);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch ticket history when modalTicket changes
  useEffect(() => {
    if (!modalTicket) return;
    fetchTicketHistory(modalTicket.ticket_id);
  }, [modalTicket]);

  // Fetch all tickets for the customer
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // const phoneNumber = await getCustomerPhoneNumber();
      // const accessToken = await getAccessToken();
      
      // if (!phoneNumber || !accessToken) {
      //   throw new Error('Authentication required');
      // }
      console.log(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS) + `?phone=${'7038908888'}`);
      const res = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS) + `?phone=${'7038908888'}`, {
        // headers: {
        //   'Authorization': accessToken
        // }
      });
      console.log(res);
      
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ticket history
  const fetchTicketHistory = async (ticketId) => {
    setHistoryLoading(true);
    setHistoryError(null);
    setHistory([]);
    
    try {
      // const accessToken = await getAccessToken();
      
      // if (!accessToken) {
      //   throw new Error('Authentication required');
      // }
      
      const res = await fetch(getEmployeeApiUrl(API_CONFIG.ENDPOINTS.TICKET_HISTORY), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: accessToken,
        },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      
      if (!res.ok) throw new Error("Failed to fetch ticket history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setHistoryError(err.message);
      console.error('Error fetching ticket history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch action taken details for closed tickets
  const fetchActionTakenDetails = async (ticketId) => {
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }
      
      const res = await fetch(getEmployeeApiUrl(API_CONFIG.ENDPOINTS.ACTION_TAKEN_DETAILS), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      
      if (!res.ok) throw new Error("Failed to fetch action taken details");
      const data = await res.json();
      setActionTakenDetails(data);
    } catch (err) {
      Alert.alert("Error", err.message);
      setActionTakenDetails(null);
    }
  };

  const handleViewDetails = (ticket) => {
    setModalTicket(ticket);
  };

  const handleViewFiles = (ticket) => {
    if (ticket.file_urls && ticket.file_urls.length > 0) {
      setCurrentTicketForView(ticket);
      setActiveFileTab(0);
      setIsViewFileModalOpen(true);
    } else {
      Alert.alert("No Files", "No files available for this ticket.");
    }
  };

  const handleUploadFile = (ticket) => {
    setCurrentTicketForUpload(ticket);
    setSelectedFiles([]);
    setIsUploadModalOpen(true);
  };

  const handleAppeal = (ticket) => {
    setCurrentTicket(ticket);
    setActionData({
      status: ticket.status.toString(),
      remarks: "",
    });
    setIsActionModalOpen(true);
  };

  const handleActionTaken = (ticket) => {
    setCurrentTicketForAction(ticket);
    setIsActionTakenModalOpen(true);
    fetchActionTakenDetails(ticket.ticket_id);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0 || !currentTicketForUpload) {
      Alert.alert("Error", "Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }
      
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append('ticket_id', currentTicketForUpload.ticket_id);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_FILES), {
        method: 'POST',
        headers: {
          'Authorization': accessToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload files');
      }

      Alert.alert("Success", `${selectedFiles.length} file(s) uploaded successfully!`);
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setCurrentTicketForUpload(null);
      fetchTickets(); // Refresh tickets after upload
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitAction = async () => {
    if (!actionData.status || !currentTicket) return;

    setIsSubmitting(true);
    
    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.APPEAL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({
          ticket_id: currentTicket.ticket_id,
          appeal_message: actionData.remarks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit appeal");
      }
      
      Alert.alert("Success", "Appeal submitted successfully!");
      setIsActionModalOpen(false);
      fetchTickets(); // Refresh tickets after appeal
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileComplete = () => {
    setShowProfileModal(false);
    Alert.alert("Success", "Profile completed successfully! You can now use all features.");
  };

  const handleFileSelect = () => {
    // Simulate file selection - in real app, you'd use document picker
    const dummyFile = {
      name: `document_${Date.now()}.pdf`,
      size: Math.floor(Math.random() * 5000000) + 1000000 // 1-6MB
    };
    
    if (selectedFiles.length >= 5) {
      Alert.alert("Error", "You can only upload up to 5 files at a time");
      return;
    }
    
    setSelectedFiles(prev => [...prev, dummyFile]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4`}>
          
          {loading ? (
            <View style={tw`flex items-center justify-center py-12`}>
              <Text style={tw`text-gray-500 text-lg mb-4`}>Loading tickets...</Text>
            </View>
          ) : error ? (
            <View style={tw`flex items-center justify-center py-12`}>
              <Text style={tw`text-red-500 text-lg mb-4`}>Error: {error}</Text>
            </View>
          ) : tickets.length === 0 ? (
            <View style={tw`flex items-center justify-center py-12`}>
              <Text style={tw`text-gray-500 text-lg mb-4`}>No tickets found.</Text>
            </View>
          ) : (
            tickets
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((ticket, index) => (
                <View 
                  key={ticket.ticket_id}
                  style={[
                    tw`relative rounded-lg overflow-hidden bg-white mb-4 shadow-lg`,
                    ticket.status === 1 ? tw`border-r-4 border-blue-200` :
                    ticket.status === 2 ? tw`border-r-4 border-yellow-200` :
                    ticket.status === 3 ? tw`border-r-4 border-green-200` :
                    ticket.status === 9 ? tw`border-r-4 border-orange-200` :
                    ticket.status === 0 ? tw`border-r-4 border-gray-200` :
                    tw`border-r-4 border-gray-200`
                  ]}
                >
                  {/* Status Badge */}
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
                            ⚠️ Escalated Due to TAT Expiry
                          </Text>
                        </View>
                      )}

                      <View style={tw`space-y-4 mb-2`}>
                        <View style={tw`flex-row items-center`}>
                          <UserIcon size={14} color="#6b7280" />
                          <Text style={tw`text-xs text-gray-600 w-16 ml-2`}>Name:</Text>
                          <Text style={tw`text-xs font-medium flex-1`}>{ticket.customer_name || "N/A"}</Text>
                        </View>
                        <View style={tw`flex-row items-center`}>
                          <PhoneIcon size={14} color="#6b7280" />
                          <Text style={tw`text-xs text-gray-600 w-16 ml-2`}>Phone:</Text>
                          <Text style={tw`text-xs font-medium flex-1`}>{ticket.phone || "N/A"}</Text>
                        </View>
                        
                        <View style={tw`flex-row items-center`}>
                          <CalendarIcon size={14} color="#6b7280" />
                          <Text style={tw`text-xs text-gray-600 w-16 ml-2`}>Created:</Text>
                          <Text style={tw`text-xs font-medium flex-1`}>{formatDate(ticket.created_at)}</Text>
                        </View>
                        {ticket.incoming_phone !== 0 && (
                          <View style={tw`flex-row items-center`}>
                            <CallOutIcon size={14} color="#6b7280" />
                            <Text style={tw`text-xs text-gray-600 w-16 ml-2`}>Calling:</Text>
                            <Text style={tw`text-xs font-medium flex-1`}>{ticket.incoming_phone || "N/A"}</Text>
                          </View>
                        )}
                        <View style={tw`flex-row items-center`}>
                          <CalendarIcon size={14} color="#6b7280" />
                          <Text style={tw`text-xs text-gray-600 w-16 ml-2`}>Updated:</Text>
                          <Text style={tw`text-xs font-medium flex-1`}>{formatDate(ticket.updated_at)}</Text>
                        </View>

                      </View>

                      <View style={tw`relative bg-gray-50 p-2 pt-4 rounded border border-gray-200 mt-2`}>
                        {/* Floating Label on Border */}
                        <View style={[
                          tw`absolute left-2 flex-row items-center`,
                          { top: -8, backgroundColor: '#F9FAFB', paddingHorizontal: 4 }
                        ]}>
                          <DocumentIcon size={14} color="#6b7280" />
                          <Text style={tw`text-xs font-bold text-gray-700 ml-2`}>Description</Text>
                        </View>

                        {/* Description Contents */}
                        <Text style={tw`text-xs text-gray-800`}>
                          {ticket.ticket_description || "No description provided."}
                        </Text>
                      </View>
                    </View>

                    {/* Right: Actions */}
                    <View style={tw`flex justify-top items-center p-2 w-16`}>
                      <View style={tw`space-y-3`}>
                        <TouchableOpacity
                          onPress={() => handleViewDetails(ticket)}
                          style={tw`w-8 h-8 bg-blue-600 rounded-full items-center justify-center mb-1`}
                        >
                          <EyeIcon size={12} color="white" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          onPress={() => handleViewFiles(ticket)}
                          style={[
                            tw`w-8 h-8 rounded-full items-center justify-center mb-1`,
                            ticket.file_urls && ticket.file_urls.length > 0
                              ? tw`bg-purple-600`
                              : tw`bg-gray-400`
                          ]}
                        >
                          <FileTextIconSmall size={12} color="white" />
                        </TouchableOpacity>
                        
                        {(
                          ticket.call_id !== "0" &&
                          (
                            (ticket.status !== 3 && ticket.status !== 9 && ticket.closed_by_flag !== 3 && ticket.invalid_by_flag !== 3) ||
                            (ticket.status === 3 && ticket.closed_by_flag === 3) ||
                            (ticket.status === 9 && ticket.invalid_by_flag === 3)
                          )
                        ) && (
                          <TouchableOpacity
                            onPress={() => handleUploadFile(ticket)}
                            style={tw`w-8 h-8 bg-green-600 rounded-full items-center justify-center mb-1`}
                          >
                            <UploadIcon size={12} color="white" />
                          </TouchableOpacity>
                        )}
                        
                        {/* Appeal button - only show for closed tickets */}
                        {((ticket.status === 3 && ticket.closed_by_flag === 3) ||
                          (ticket.status === 9 && ticket.invalid_by_flag === 3)) && (
                          <TouchableOpacity
                            onPress={() => handleAppeal(ticket)}
                            style={tw`w-8 h-8 bg-red-600 rounded-full items-center justify-center mb-1`}
                          >
                            <AlertTriangleIcon size={12} color="white" />
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

      {/* Ticket Details Modal */}
      <Modal
        visible={modalTicket !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalTicket(null)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-xl p-6 w-full max-w-lg max-h-[90%]`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                {modalTicket?.ticket_type}
              </Text>
              <TouchableOpacity onPress={() => setModalTicket(null)}>
                <XIcon size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={tw`text-sm text-gray-600 mb-4`}>
              Ticket ID: <Text style={tw`font-medium`}>{modalTicket?.ticket_id}</Text> • Phone: <Text style={tw`font-medium`}>{modalTicket?.phone}</Text>
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-4`}>
              Assigned To: <Text style={tw`font-medium`}>{modalTicket?.assigned_to_name || "N/A"}</Text> • Assigned By: <Text style={tw`font-medium`}>{modalTicket?.assigned_by_name || "N/A"}</Text>
            </Text>
            

            <View style={tw`flex-row gap-2 mb-4`}>
              <View style={[
                tw`px-3 py-1 rounded-full`,
                getStatusColor(modalTicket?.status)
              ]}>
                <Text style={[
                  tw`text-xs font-medium`,
                  getStatusTextColor(modalTicket?.status)
                ]}>
                  {STATUS_LABELS[modalTicket?.status] || "Unknown"}
                </Text>
              </View>
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`font-semibold mb-1 text-gray-900`}>Description</Text>
              <Text style={tw`text-sm text-gray-700`}>
                {modalTicket?.ticket_description}
              </Text>
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`font-semibold mb-1 text-gray-900`}>Timeline</Text>
              {historyLoading ? (
                <Text style={tw`text-sm text-gray-600`}>Loading history...</Text>
              ) : historyError ? (
                <Text style={tw`text-sm text-red-600`}>{historyError}</Text>
              ) : history.length === 0 ? (
                <Text style={tw`text-sm text-gray-600`}>No history found for this ticket.</Text>
              ) : (
                <View style={tw`border-l-2 border-blue-400 ml-2`}>
                  {history.map((stage, idx) => (
                    <View key={stage.id} style={tw`mb-4 ml-4`}>
                      <View style={tw`absolute w-3 h-3 bg-blue-400 rounded-full -left-5.5 border border-white`}></View>
                      <Text style={tw`font-medium text-gray-900`}>
                        {stage.remark}
                      </Text>
                      <Text style={tw`text-sm text-gray-600 mb-1`}>
                        {formatDate(stage.created_at)}
                      </Text>
                      <Text style={tw`text-sm text-gray-600`}>
                        From: {STATUS_LABELS[stage.stage_from] || stage.stage_from} → To: {STATUS_LABELS[stage.stage_to] || stage.stage_to}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={tw`mt-2 px-4 py-2 rounded-md bg-blue-600 items-center`}
              onPress={() => setModalTicket(null)}
            >
              <Text style={tw`text-white font-medium`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Upload File Modal */}
      <Modal
        visible={isUploadModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUploadModalOpen(false)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-xl p-6 w-full max-w-md`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-semibold text-gray-900`}>Upload File</Text>
              <TouchableOpacity onPress={() => setIsUploadModalOpen(false)}>
                <XIcon size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={tw`space-y-4`}>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>
                  Ticket ID: {currentTicketForUpload?.ticket_id}
                </Text>
                <Text style={tw`text-sm text-gray-600 mb-3`}>
                  {currentTicketForUpload?.ticket_type}
                </Text>
              </View>

              {/* File Upload Area */}
              <View style={tw`border-2 border-dashed border-gray-300 rounded-lg p-6 items-center`}>
                {selectedFiles.length > 0 ? (
                  <View style={tw`w-full space-y-3`}>
                    <View style={tw`flex-row items-center justify-center gap-2 mb-2`}>
                      <CheckIcon size={20} color="#10b981" />
                      <Text style={tw`font-medium text-gray-900`}>
                        {selectedFiles.length} file(s) selected
                      </Text>
                    </View>
                    <ScrollView style={tw`max-h-32`}>
                      {selectedFiles.map((file, index) => (
                        <View key={index} style={tw`flex-row items-center justify-between p-2 border border-gray-200 rounded mb-2`}>
                          <View style={tw`flex-1`}>
                            <Text style={tw`text-sm font-medium text-gray-900`} numberOfLines={1}>
                              {file.name}
                            </Text>
                            <Text style={tw`text-xs text-gray-600`}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => removeFile(index)}>
                            <XIcon size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                    {selectedFiles.length < 5 && (
                      <Text style={tw`text-sm text-gray-600`}>
                        You can add {5 - selectedFiles.length} more file(s)
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={tw`items-center space-y-2`}>
                    <UploadIcon size={48} color="#9ca3af" />
                    <Text style={tw`font-medium text-gray-900 text-center`}>
                      Drop your files here, or tap to browse
                    </Text>
                    <TouchableOpacity
                      style={tw`px-4 py-2 bg-blue-500 rounded-lg`}
                      onPress={handleFileSelect}
                    >
                      <Text style={tw`text-white font-medium`}>Select Files</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-sm text-gray-600`}>
                      You can upload up to 5 files at once
                    </Text>
                  </View>
                )}
              </View>

              <View style={tw`flex-row justify-end gap-3 pt-2`}>
                <TouchableOpacity
                  style={tw`px-4 py-2 rounded-lg border border-gray-300 bg-gray-50`}
                  onPress={() => setIsUploadModalOpen(false)}
                >
                  <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`px-4 py-2 rounded-lg flex-row items-center`,
                    selectedFiles.length === 0 ? tw`bg-gray-400` : tw`bg-green-600`
                  ]}
                  disabled={selectedFiles.length === 0 || isUploading}
                  onPress={handleFileUpload}
                >
                  {isUploading ? (
                    <>
                      <Text style={tw`text-white font-semibold`}>Uploading...</Text>
                    </>
                  ) : (
                    <Text style={tw`text-white font-semibold`}>Upload</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Files Modal */}
      <Modal
        visible={isViewFileModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsViewFileModalOpen(false)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-xl p-6 w-full max-w-md`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-semibold text-gray-900`}>View Files</Text>
              <TouchableOpacity onPress={() => setIsViewFileModalOpen(false)}>
                <XIcon size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`max-h-64`}>
              {currentTicketForView?.file_urls?.map((file, index) => (
                <View key={index} style={tw`p-3 border border-gray-200 rounded mb-2`}>
                  <Text style={tw`text-sm font-medium text-gray-900`}>{file}</Text>
                  <Text style={tw`text-xs text-gray-600 mt-1`}>Click to view</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={tw`mt-4 px-4 py-2 rounded-lg bg-blue-600 items-center`}
              onPress={() => setIsViewFileModalOpen(false)}
            >
              <Text style={tw`text-white font-medium`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Completion Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-xl p-6 w-full max-w-md`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-semibold text-gray-900`}>Complete Your Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <XIcon size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={tw`space-y-4`}>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>Name:</Text>
                <TextInput
                  style={tw`w-full p-2 rounded-lg border border-gray-300 bg-gray-50`}
                  placeholder="Enter your name"
                />
              </View>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>Phone:</Text>
                <TextInput
                  style={tw`w-full p-2 rounded-lg border border-gray-300 bg-gray-50`}
                  placeholder="Enter your phone number"
                />
              </View>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>Email:</Text>
                <TextInput
                  style={tw`w-full p-2 rounded-lg border border-gray-300 bg-gray-50`}
                  placeholder="Enter your email"
                />
              </View>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>Address:</Text>
                <TextInput
                  style={tw`w-full p-2 rounded-lg border border-gray-300 bg-gray-50`}
                  placeholder="Enter your address"
                  multiline
                />
              </View>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>Additional Information:</Text>
                <TextInput
                  style={tw`w-full p-2 rounded-lg border border-gray-300 bg-gray-50`}
                  placeholder="Any additional information"
                  multiline
                />
              </View>
              <TouchableOpacity
                style={tw`px-4 py-2 rounded-lg bg-green-600 items-center`}
                onPress={handleProfileComplete}
              >
                <Text style={tw`text-white font-semibold`}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Action Modal (Appeal) */}
      <Modal
        visible={isActionModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsActionModalOpen(false)}
      >
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-xl p-6 w-full max-w-md`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-semibold text-gray-900`}>Submit Appeal</Text>
              <TouchableOpacity onPress={() => setIsActionModalOpen(false)}>
                <XIcon size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={tw`space-y-4`}>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>Status</Text>
                <View style={tw`w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50`}>
                  <Text style={tw`text-sm text-gray-700`}>Request Review</Text>
                </View>
              </View>
              <View>
                <Text style={tw`text-sm font-medium mb-1 text-gray-900`}>Appeal Message</Text>
                <TextInput
                  style={tw`w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50`}
                  placeholder="Enter your appeal message..."
                  multiline
                  numberOfLines={3}
                  value={actionData.remarks}
                  onChangeText={(text) => setActionData({ ...actionData, remarks: text })}
                />
              </View>

              <View style={tw`flex-row justify-end gap-3 pt-2`}>
                <TouchableOpacity
                  style={tw`px-4 py-2 rounded-lg border border-gray-300 bg-gray-50`}
                  onPress={() => setIsActionModalOpen(false)}
                >
                  <Text style={tw`text-gray-700 font-medium`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`px-4 py-2 rounded-lg flex-row items-center`,
                    isSubmitting ? tw`bg-gray-400` : tw`bg-blue-600`
                  ]}
                  disabled={isSubmitting}
                  onPress={handleSubmitAction}
                >
                  {isSubmitting ? (
                    <Text style={tw`text-white font-semibold`}>Processing...</Text>
                  ) : (
                    <Text style={tw`text-white font-semibold`}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 