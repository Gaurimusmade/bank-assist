import { View, Text } from 'react-native';
import tw from 'twrnc';

export default function DashboardScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Text style={tw`text-xl font-bold text-blue-600`}>Dashboard Screen</Text>
    </View>
  );
}
