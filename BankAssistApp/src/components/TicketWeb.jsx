import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ProfileCompletionModal from './ProfileCompletionModal';
import {
  MdVisibility,
  MdUpload,
  MdDescription,
  MdHistory,
} from "react-icons/md";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import FileViewerModal from './FileViewerModal';
import { FaUser, FaPhone, FaCalendarAlt, FaUserTie, FaUserCheck, FaSyncAlt, FaExclamationTriangle } from 'react-icons/fa';
import { FaRegCreditCard } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";

const STATUS_LABELS = {
  0: "Un-Assigned",
  1: "Assigned",
  2: "To Be Reviewed",
  4: "Requested For More Info",
  3: "Closed",
  9: "Invalid",
};

const API_BASE_URL = import.meta.env.VITE_CUSTOMER_URL;
const API_EMPLOYEE_URL = import.meta.env.VITE_EMPLOYEE_URL;
const VITE_SCAN_URL = import.meta.env.VITE_SCAN_URL;

const MyTickets = () => {
  const { theme } = useContext(ThemeContext);
  const [modalTicket, setModalTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Upload file states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentTicketForUpload, setCurrentTicketForUpload] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // View file states
  const [isViewFileModalOpen, setIsViewFileModalOpen] = useState(false);
  const [currentTicketForView, setCurrentTicketForView] = useState(null);
  const [activeFileTab, setActiveFileTab] = useState(0);

  // Profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Action taken modal state
  const [isActionTakenModalOpen, setIsActionTakenModalOpen] = useState(false);
  const [currentTicketForAction, setCurrentTicketForAction] = useState(null);
  const [actionTakenDetails, setActionTakenDetails] = useState(null);
  const [actionTakenLoading, setActionTakenLoading] = useState(false);

  // Action modal state (for customer appeals)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionData, setActionData] = useState({
    status: "",
    remarks: "",
  });
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Theme-based classes
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const cardBorder = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const pageBg = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const cardBg1 = theme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
  const inputBg = theme === 'light' ? 'bg-white' : 'bg-gray-700/50';
  const borderColor = theme === 'light' ? 'border-gray-400' : 'border-gray-600';
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const cardBlur = theme === 'light' ? 'bg-black/30' : 'bg-gray-700/60';

  // Fetch all tickets for the customer
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    const phoneNumber = localStorage.getItem('customerPhoneNumber');
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/?phone=${phoneNumber}`, {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check profile completion status on mount
  useEffect(() => {
    const profileComplete = localStorage.getItem("profile_complete");
    if (profileComplete === "false" || profileComplete === null) {
      setShowProfileModal(true);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch ticket history when modalTicket changes
  useEffect(() => {
    if (!modalTicket) return;
    const fetchHistory = async () => {
      setHistoryLoading(true);
      setHistoryError(null);
      setHistory([]);
      try {
        const res = await fetch(`${API_EMPLOYEE_URL}/ticket-history/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ ticket_id: modalTicket.ticket_id }),
        });
        if (!res.ok) throw new Error("Failed to fetch ticket history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setHistoryError(err.message);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [modalTicket]);

  // Handle file upload
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0 || !currentTicketForUpload) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      // selectedFiles.forEach((file, index) => {
      //   formData.append(`file_${index}`, file);
      // });

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append('ticket_id', currentTicketForUpload.ticket_id);

      const response = await fetch(`${API_BASE_URL}/upload-files/`, {
        method: 'POST',
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload files');
      }

      toast.success(`${selectedFiles.length} file(s) uploaded successfully!`);
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setCurrentTicketForUpload(null);
      fetchTickets();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Open upload modal
  const openUploadModal = (ticket) => {
    setCurrentTicketForUpload(ticket);
    setSelectedFiles([]);
    setIsUploadModalOpen(true);
  };

  // Open view file modal
  const openViewFileModal = (ticket) => {
    setCurrentTicketForView(ticket);
    setActiveFileTab(0);
    setIsViewFileModalOpen(true);
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (selectedFiles.length >= 5) {
      toast.error("You can only upload up to 5 files at a time");
      return;
    }
    setSelectedFiles(prev => [...prev, file]);
  };

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle profile completion
  const handleProfileComplete = () => {
    setShowProfileModal(false);
    toast.success("Profile completed successfully! You can now use all features.");
  };

  // Fetch action taken details for closed tickets
  const fetchActionTakenDetails = async (ticketId) => {
    setActionTakenLoading(true);
    try {
      const res = await fetch(`${API_EMPLOYEE_URL}/action-taken-details/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      if (!res.ok) throw new Error("Failed to fetch action taken details");
      const data = await res.json();
      setActionTakenDetails(data);
    } catch (err) {
      toast.error(err.message);
      setActionTakenDetails(null);
    } finally {
      setActionTakenLoading(false);
    }
  };

  // Open action taken modal
  const openActionTakenModal = (ticket) => {
    setCurrentTicketForAction(ticket);
    setIsActionTakenModalOpen(true);
    fetchActionTakenDetails(ticket.ticket_id);
  };


  // Handle submit action (for customer appeals)
  const handleSubmitAction = async () => {
    if (!actionData.status || !currentTicket) return;

    setIsSubmitting(true);
    console.log(currentTicket);
    console.log(actionData);

    try {
      const response = await fetch(`${API_BASE_URL}/tickets/appeal/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ticket_id: currentTicket.ticket_id,
          appeal_message: actionData.remarks,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to update ticket");
      }
      setIsActionModalOpen(false);
      // Refresh tickets
      const phoneNumber = localStorage.getItem("customerPhoneNumber");
      const res = await fetch(`${API_BASE_URL}/tickets/?phone=${phoneNumber}&limit=3`, {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
      toast.success("Appeal submitted successfully!");
    } catch (error) {
      toast.error("Error updating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (selectedFiles.length < 5) {
        handleFileSelect(file);
      }
    });
    if (files.length > 5) {
      toast.error("Only the first 5 files will be added");
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (selectedFiles.length < 5) {
        handleFileSelect(file);
      }
    });
    if (files.length > 5) {
      toast.error("Only the first 5 files will be added");
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }

  const formatDate1 = (datetime) => {
    const date = new Date(datetime);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const formattedDate = `${day} ${month} ${year} - ${formattedTime}`;
    return formattedDate;
  };

  return (
    <div className={`min-h-screen ${pageBg} p-4 sm:p-6 lg:p-8 relative`}>
      {/* Main content, blurred if modal is open */}
      <div
        className={
          modalTicket ||
          isUploadModalOpen ||
          isViewFileModalOpen ||
          showProfileModal
            ? "pointer-events-none select-none filter blur-md transition duration-300"
            : "transition duration-300"
        }
      >
        <h1 className={`text-3xl font-bold mb-6 ${textColor}`}>My Tickets</h1>
        <div className="space-y-4">
          {loading && (
            <div
              className={`flex flex-col items-center justify-center py-12 ${secondaryTextColor}`}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              Loading tickets...
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <svg
                className="w-8 h-8 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          )}
          {!loading && !error && tickets.length === 0 && (
            <div
              className={`flex flex-col items-center justify-center py-12 ${secondaryTextColor}`}
            >
              <svg
                className="w-12 h-12 mb-4 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              No tickets found.
            </div>
          )}
          {!loading &&
            !error &&
            [...tickets]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((t, i) => (
                <div
                  key={t.ticket_id}
                  className={`relative rounded-md overflow-hidden ${bgColor} ${
                    t.status === 1
                      ? "border-r-6 border-blue-200"
                      : t.status === 2
                      ? "border-r-6 border-yellow-200"
                      : t.status === 3
                      ? "border-r-6 border-green-200"
                      : t.status === 9
                      ? "border-r-6 border-orange-200"
                      : "border-r-6 border-gray-200"
                  }`}
                  style={{
                    boxShadow:
                      "2px 2px 4px rgba(0, 0, 0, 0.1), 2px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <span
                    className={`absolute -left-8 top-3 w-32 transform -rotate-45 text-center py-1 text-xs text-sm font-semibold shadow-md ${
                      t.status === 1
                        ? "bg-blue-200 text-blue-800"
                        : t.status === 2
                        ? "text-[9px] bg-yellow-200 text-yellow-800 pr-3"
                        : t.status === 3
                        ? "bg-green-200 text-green-800"
                        : t.status === 0
                        ? "text-[10px] bg-gray-200 text-gray-800 pr-2"
                        : t.status === 9
                        ? "bg-orange-200 text-orange-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {STATUS_LABELS[t.status] || "Unknown"}
                  </span>
                  <div className="flex flex-col md:flex-row">
                    {/* Left: QR Stub */}
                    <div
                      className={`relative border-r border-gray-400 flex flex-col items-center justify-center px-4 py-6 w-full md:w-40 text-center`}
                    >
                      <p
                        className={`px-2.5 py-0.5 rounded-sm text-xs font-semibold font-mono absolute top-5 ${
                          t.call_id == 0
                            ? "bg-purple-300 text-purple-800"
                            : "bg-blue-300 text-blue-800"
                        }`}
                      >
                        {t.call_id == "0" ? "Web" : "AI-Call"}
                      </p>
                      <div className="text-center mt-3">
                        <p className={`text-xs uppercase tracking-wide font-medium ${textColor}`}>
                          Ticket ID
                        </p>
                        <p className={`text-xl font-mono font-bold ${textColor}`}>
                          {t.ticket_id}
                        </p>
                        <div className={`p-1 rounded ${inputBg}`}>
                          <QRCode
                            value={`${VITE_SCAN_URL}/ticket/${btoa(
                              t.ticket_id.toString()
                            )}`}
                            size={78}
                            bgColor={theme === "light" ? "#ffffff" : "#111827"}
                            fgColor={theme === "light" ? "#000000" : "#ffffff"}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Center: Ticket Info */}
                    <div className={`mt-2 flex-1 px-5 py-2 space-y-4 ${bgColor}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-xl font-semibold truncate ${textColor}`}
                        >
                          <span className="inline-block align-middle mr-1 mb-1"><FaRegCreditCard /></span> {t.ticket_type}
                        </h3>
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                            t.priority === 1
                              ? "bg-red-200 text-red-800"
                              : t.priority === 2
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {t.priority == 1
                            ? "High"
                            : t.priority == 2
                            ? "Medium"
                            : "Low"}
                        </span>
                        <span
                          className={`text-xl font-semibold truncate ${textColor}`}
                        >
                          {t.auto_escalated && (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 rounded-md px-2 py-0.5 text-xs font-semibold border border-red-200 ml-2 mb-2">
                              <FaExclamationTriangle className="inline-block align-middle" />
                              Escalated Due to TAT Expiry
                            </span>
                          )}
                        </span>
                      </div>

                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 text-sm ${textColor}`}
                      >
                        <div className="flex flex-row gap-2">
                          <FaUser className="mt-0.5 font-medium" />
                          <div>
                            Name : {t.customer_name || "N/A"}
                          </div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <BsFillTelephoneFill className="mt-0.5 font-medium" />
                          <div>
                            Phone : {t.phone || "N/A"}
                          </div>
                        </div>
                        {t.incoming_phone !== 0 && (
                        <div className="flex flex-row gap-2">
                          <BsFillTelephoneFill className="mt-0.5 font-medium" />
                          <div>
                            Calling Number : {t.incoming_phone || "N/A"}
                          </div>
                        </div>
                        )}
                        <div className="flex flex-row gap-2">
                          <FaCalendarAlt className="mt-0.5 font-medium" />
                          <div>
                            Created : {formatDate1(t.created_at)}
                          </div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <FaUserTie className="mt-0.5 font-medium" />
                          <div>
                            Assigned To : {t.assigned_to_name || "N/A"}
                          </div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <FaUserCheck className="mt-0.5 font-medium" />
                          <div>
                            Assigned By : {t.assigned_by_name || "N/A"}
                          </div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <FaSyncAlt className="mt-0.5 font-medium" />
                          <div>
                            Last Updated : {formatDate1(t.updated_at)}
                          </div>
                        </div>
                      </div>

                      <div className="w-full pb-2 pt-2">
                        <div className="relative">
                          {/* Label on border line */}
                          <span
                            className={`absolute -top-2 left-4 ${inputBg} px-1 text-xs font-bold ${textColor}`}
                          >
                            Description
                          </span>
                          <div
                            className={`p-2 rounded-lg text-sm border ${textColor} ${inputBg} ${borderColor}`}
                          >
                            {t.ticket_description || "No description provided."}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div
                      className={`flex flex-col justify-between items-end p-5 ${bgColor} space-y-4`}
                    >
                      <div className="flex flex-col gap-3 justify-end w-max">
                        <button
                          onClick={() => setModalTicket(t)}
                          className="cursor-pointer p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                          title="View Details"
                        >
                          <MdVisibility className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openViewFileModal(t)}
                          disabled={!t.file_urls || t.file_urls.length === 0}
                          className={`cursor-pointer p-2 rounded-full transition-colors duration-200 ${
                            t.file_urls && t.file_urls.length > 0
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-400 text-gray-200 cursor-not-allowed cursor-pointer"
                          }`}
                          title={
                            t.file_urls && t.file_urls.length > 0
                              ? "View File"
                              : "No files available"
                          }
                        >
                          <MdDescription className="w-4 h-4" />
                        </button>
                        {(
                          t.call_id !== "0" &&
                          (
                            (t.status !== 3 && t.status !== 9 && t.closed_by_flag !== 3 && t.invalid_by_flag !== 3) ||
                            (t.status === 3 && t.closed_by_flag === 3) ||
                            (t.status === 9 && t.invalid_by_flag === 3)
                          )
                        ) && (
                          <button
                            onClick={() => openUploadModal(t)}
                            className="cursor-pointer p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                            title="Upload File"
                          >
                            <MdUpload className="w-4 h-4" />
                          </button>
                        )}
                        {/* Appeal button - only show for closed tickets */}
                        {((t.status === 3 &&
                          (t.closed_by_flag === 3)) ||
                          (t.status === 9 &&
                            (t.invalid_by_flag === 3))) && (
                          <button
                            onClick={() => {
                              setCurrentTicket(t);
                              setActionData({
                                status: t.status.toString(),
                                remarks: "",
                              });
                              setIsActionModalOpen(true);
                            }}
                            className="cursor-pointer p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                            title="Appeal Decision"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Upload File Modal */}
      {isUploadModalOpen && (
        <div
          className={`fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-40 backdrop-blur-sm ${cardBlur}`}
        >
          <div className={`${cardBg} rounded-xl p-6 w-full max-w-md shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${textColor}`}>
                Upload File
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${textColor}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Ticket ID: {currentTicketForUpload?.ticket_id}
                </label>
                <p className={`text-sm ${secondaryTextColor} mb-3`}>
                  {currentTicketForUpload?.ticket_type}
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : `${cardBorder} ${inputBg}`
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFiles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className={`font-medium ${textColor}`}>
                        {selectedFiles.length} file(s) selected
                      </span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex text-white items-center justify-between p-2 border-2 border-gray-200 rounded"
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${textColor} truncate`}
                            >
                              {file.name}
                            </p>
                            <p className={`text-xs ${secondaryTextColor}`}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="ml-2 text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    {selectedFiles.length < 5 && (
                      <p className={`text-sm ${secondaryTextColor}`}>
                        You can add {5 - selectedFiles.length} more file(s)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className={`font-medium ${textColor}`}>
                      Drop your files here, or{" "}
                      <label className="text-blue-500 cursor-pointer hover:text-blue-700">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileInputChange}
                          accept="*/*"
                          multiple
                        />
                      </label>
                    </p>
                    <p className={`text-sm ${secondaryTextColor}`}>
                      You can upload up to 5 files at once
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className={`px-4 py-2 rounded-lg border ${cardBorder} ${inputBg} ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTicketForView?.file_urls && (
        <FileViewerModal
          isOpen={isViewFileModalOpen}
          onClose={() => setIsViewFileModalOpen(false)}
          urls={currentTicketForView.file_urls || []} // ✅ must match the prop 'urls'
        />
      )}

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div
          className={`fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-40 backdrop-blur-sm ${cardBlur}`}
        >
          <div className={`${cardBg} rounded-xl p-6 w-full max-w-md shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${textColor}`}>
                Complete Your Profile
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${textColor}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Name:
                </label>
                <input
                  type="text"
                  className={`w-full p-2 rounded-lg ${inputBg} ${textColor}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Phone:
                </label>
                <input
                  type="text"
                  className={`w-full p-2 rounded-lg ${inputBg} ${textColor}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Email:
                </label>
                <input
                  type="email"
                  className={`w-full p-2 rounded-lg ${inputBg} ${textColor}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Address:
                </label>
                <textarea
                  className={`w-full p-2 rounded-lg ${inputBg} ${textColor}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Additional Information:
                </label>
                <textarea
                  className={`w-full p-2 rounded-lg ${inputBg} ${textColor}`}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleProfileComplete}
                  className={`px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700`}
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalTicket && (
        <>
          {/* Overlay for click-to-close, but transparent so blur is visible */}
          <div
            className="fixed inset-0 z-40 bg-transparent cursor-pointer"
            onClick={() => setModalTicket(null)}
          ></div>

          {/* Modal content (sharp, not blurred) */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className={`relative w-full max-w-lg mx-auto rounded-xl shadow-lg ${cardBg} border ${cardBorder} p-8 overflow-y-auto max-h-[90vh]`}
            >
              <h3 className={`text-xl font-bold mb-2 ${textColor}`}>
                {modalTicket.ticket_type}
              </h3>
              <div className={`mb-2 text-sm ${secondaryTextColor}`}>
                Ticket ID: {modalTicket.ticket_id} • Phone: {modalTicket.phone}
              </div>

              <div className="flex gap-2 mb-4">
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {STATUS_LABELS[modalTicket.status] || "Unknown"}
                </span>
              </div>

              <div className="mb-4">
                <div className={`font-semibold mb-1 ${textColor}`}>
                  Description
                </div>
                <p className={`text-sm ${textColor}`}>
                  {modalTicket.ticket_description}
                </p>
              </div>

              <div className="mb-4">
                <div className={`font-semibold mb-1 ${textColor}`}>
                  Timeline
                </div>
                {historyLoading && (
                  <div className="text-gray-400 text-sm">
                    Loading history...
                  </div>
                )}
                {historyError && (
                  <div className="text-red-600 text-sm">{historyError}</div>
                )}
                {!historyLoading && !historyError && history.length === 0 && (
                  <div className={`text-sm ${textColor}`}>
                    No history found for this ticket.
                  </div>
                )}
                {!historyLoading && !historyError && history.length > 0 && (
                  <ol className="relative border-l-2 border-blue-400 ml-2">
                    {history.map((stage, idx) => (
                      <li key={stage.id} className="mb-6 ml-4">
                        <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-1.5 border border-white"></div>
                        <div className={`font-medium ${textColor}`}>
                          {stage.remark}
                        </div>
                        <div className={`text-sm ${textColor} mb-1`}>
                          {formatDate1(stage.created_at)}
                        </div>
                        <div className={`text-sm ${textColor}`}>
                          From:{" "}
                          {STATUS_LABELS[stage.stage_from] || stage.stage_from}{" "}
                          → To:{" "}
                          {STATUS_LABELS[stage.stage_to] || stage.stage_to}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <button
                className="mt-2 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                onClick={() => setModalTicket(null)}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Action Modal */}
      {isActionModalOpen && (
        <div
          className={`fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-40 backdrop-blur-sm ${cardBlur}`}
        >
          <div className={`${cardBg} rounded-xl p-6 w-full max-w-md shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${textColor}`}>
                Update Ticket Status
              </h3>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${textColor}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Status
                </label>
                <select
                  value={actionData.status}
                  onChange={(e) =>
                    setActionData({ ...actionData, status: e.target.value })
                  }
                  required
                  className={`w-full rounded-lg border ${cardBorder} px-3 py-2 ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                >
                  <option value="">Select Status</option>
                  <option value="2">Request Review</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textColor}`}
                >
                  Remarks
                </label>
                <textarea
                  value={actionData.remarks}
                  onChange={(e) =>
                    setActionData({ ...actionData, remarks: e.target.value })
                  }
                  rows={3}
                  className={`w-full rounded-lg border ${cardBorder} px-3 py-2 ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  placeholder="Enter your remarks..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsActionModalOpen(false)}
                  className={`px-4 py-2 rounded-lg border ${cardBorder} ${inputBg} ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAction}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;