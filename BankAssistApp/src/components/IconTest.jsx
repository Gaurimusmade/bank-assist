import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import tw from 'twrnc';
import {
  HomeIcon,
  FileTextIcon,
  PlusIcon,
  UserIcon,
  BriefcaseIcon,
  MailIcon,
  PhoneIcon,
  EyeIcon,
  UploadIcon,
  AlertTriangleIcon,
  FileTextIconSmall,
  FileIcon,
  PaperclipIcon,
  SendIcon,
  CheckIcon,
  XIcon,
  InfoIcon,
  CalendarIcon,
  ClockIcon,
  CallOutIcon,
  UserPlusIcon,
  DocumentIcon
} from './SvgIcons';

export default function IconTest() {
  const icons = [
    { name: 'Home', component: HomeIcon },
    { name: 'FileText', component: FileTextIcon },
    { name: 'Plus', component: PlusIcon },
    { name: 'User', component: UserIcon },
    { name: 'Briefcase', component: BriefcaseIcon },
    { name: 'Mail', component: MailIcon },
    { name: 'Phone', component: PhoneIcon },
    { name: 'Eye', component: EyeIcon },
    { name: 'Upload', component: UploadIcon },
    { name: 'AlertTriangle', component: AlertTriangleIcon },
    { name: 'FileTextSmall', component: FileTextIconSmall },
    { name: 'File', component: FileIcon },
    { name: 'Paperclip', component: PaperclipIcon },
    { name: 'Send', component: SendIcon },
    { name: 'Check', component: CheckIcon },
    { name: 'X', component: XIcon },
    { name: 'Info', component: InfoIcon },
    { name: 'Calendar', component: CalendarIcon },
    { name: 'Clock', component: ClockIcon },
    { name: 'CallOut', component: CallOutIcon },
    { name: 'UserPlus', component: UserPlusIcon },
    { name: 'Document', component: DocumentIcon }
  ];

  return (
    <ScrollView style={tw`flex-1 bg-gray-100 p-4`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-6 text-center`}>
        SVG Icons Test
      </Text>
      
      <View style={tw`flex-row flex-wrap justify-center gap-4`}>
        {icons.map((icon, index) => {
          const IconComponent = icon.component;
          return (
            <View key={index} style={tw`items-center bg-white p-4 rounded-lg shadow-sm`}>
              <IconComponent size={32} color="#2563eb" />
              <Text style={tw`text-sm text-gray-600 mt-2 text-center`}>
                {icon.name}
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={tw`mt-8 bg-white p-4 rounded-lg`}>
        <Text style={tw`text-lg font-semibold text-gray-800 mb-4`}>
          Icon Colors Test
        </Text>
        <View style={tw`flex-row justify-around`}>
          <View style={tw`items-center`}>
            <HomeIcon size={24} color="#ef4444" />
            <Text style={tw`text-xs text-gray-600 mt-1`}>Red</Text>
          </View>
          <View style={tw`items-center`}>
            <HomeIcon size={24} color="#10b981" />
            <Text style={tw`text-xs text-gray-600 mt-1`}>Green</Text>
          </View>
          <View style={tw`items-center`}>
            <HomeIcon size={24} color="#f59e0b" />
            <Text style={tw`text-xs text-gray-600 mt-1`}>Yellow</Text>
          </View>
          <View style={tw`items-center`}>
            <HomeIcon size={24} color="#8b5cf6" />
            <Text style={tw`text-xs text-gray-600 mt-1`}>Purple</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 