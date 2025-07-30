import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { FileTextIcon, CheckIcon, AlertTriangleIcon, ClockIcon } from '../components/SvgIcons';

export default function DashboardScreen() {
  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Dashboard Content */}
      <View style={tw`flex-1 p-4`}>
        <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-sm`}>
          <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>Welcome to Bank Assist</Text>
          <Text style={tw`text-gray-600`}>
          Track and manage your banking complaints and requests.
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={tw`flex-row space-x-3 mb-4 gap-4`}>
          <View style={tw`flex-1 bg-blue-50 rounded-lg p-4 border border-blue-200`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View>
                <Text style={tw`text-2xl font-bold text-blue-600`}>12</Text>
                <Text style={tw`text-sm text-blue-800`}>Total Complaints</Text>
              </View>
              <FileTextIcon size={24} color="#2563eb" />
            </View>
          </View>
          <View style={tw`flex-1 bg-green-50 rounded-lg p-4 border border-green-200`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View>
                <Text style={tw`text-2xl font-bold text-green-600`}>8</Text>
                <Text style={tw`text-sm text-green-800`}>Closed Tickets</Text>
              </View>
              <CheckIcon size={24} color="#10b981" />
            </View>
          </View>
        </View>

        <View style={tw`flex-row space-x-3 mb-4 gap-4`}>
          <View style={tw`flex-1 bg-red-50 rounded-lg p-4 border border-red-200`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View>
                <Text style={tw`text-2xl font-bold text-red-600`}>3</Text>
                <Text style={tw`text-sm text-red-800`}>Invalid Tickets</Text>
              </View>
              <AlertTriangleIcon size={24} color="#ef4444" />
            </View>
          </View>
          <View style={tw`flex-1 bg-purple-50 rounded-lg p-4 border border-purple-200`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View>
                <Text style={tw`text-2xl font-bold text-purple-600`}>3 <Text style={tw`text-sm text-purple-600`}>Days</Text></Text>
                <Text style={tw`text-sm text-purple-800`}>Avg. Resolution Time</Text>
              </View>
              <ClockIcon size={24} color="#8b5cf6" />
            </View>
          </View>
        </View>

      </View>
    </View>
  );
}
