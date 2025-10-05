# Elvira App - React Native Expo Project

A professionally structured React Native Expo application with modern architecture and best practices for maintainability and scalability.

## 🚀 Project Structure

```
ElviraApp/
├── App.js                  # Main application component
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration with absolute imports
├── metro.config.js        # Metro bundler configuration
├── package.json          # Dependencies and scripts
├── 
├── components/           # Reusable UI components
│   ├── calendar/        # Calendar-specific components
│   ├── messages/        # Messaging-related components
│   ├── tasks/           # Task-related components
│   ├── modals/          # Reusable modal components
│   ├── common/          # Common/reusable components
│   │   ├── Button.js    # Customizable button component
│   │   ├── Input.js     # Advanced input component with validation
│   │   └── index.js     # Component exports
│   └── ...
├── 
├── config/              # Configuration files
│   ├── supabase.js      # Supabase configuration and helpers
│   └── ...
├── 
├── constants/           # Constant values
│   ├── colors.js        # Color palette and theme
│   ├── api.js           # API endpoints and configuration
│   └── ...
├── 
├── context/             # React Context providers
│   ├── AuthContext.js   # Authentication state management
│   └── ...
├── 
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   ├── useRooms.js      # Room management hooks
│   ├── useTasks.js      # Task management hooks
│   ├── useStaffData.js  # Staff data management hooks
│   ├── index.js         # Hook exports
│   └── ...
├── 
├── navigation/          # Navigation components
│   ├── AppNavigator.js  # Main navigation structure
│   └── ...
├── 
├── screens/             # Application screens
│   ├── CalendarScreen.js
│   ├── MyTasksScreen.js
│   ├── RoomsScreen.js
│   ├── index.js         # Screen exports
│   └── ...
├── 
├── services/            # API services and external integrations
│   ├── apiClient.js     # Generic API client with error handling
│   ├── authService.js   # Authentication service
│   ├── taskService.js   # Task management service
│   ├── index.js         # Service exports
│   └── ...
├── 
├── styles/              # Global styles and themes
│   ├── globalStyles.js  # Global style definitions and constants
│   └── ...
├── 
├── utils/               # Utility functions
│   ├── helpers.js       # General helper functions
│   ├── validators.js    # Input validation utilities
│   └── ...
└── 
└── assets/             # Static assets (images, fonts, etc.)
```

## ✨ Features

### 🎯 Architecture & Code Quality
- **Clean Architecture**: Well-organized folder structure following industry best practices
- **Absolute Imports**: Configured `@` import paths for clean and maintainable imports
- **TypeScript Ready**: Structure ready for TypeScript adoption
- **Component-based Design**: Reusable, modular components with consistent props interface
- **Service Layer**: Centralized API communication with proper error handling
- **Custom Hooks**: Encapsulated business logic in reusable hooks
- **State Management**: Context API for global state with reducers

### 📱 UI/UX Components
- **Button Component**: Highly customizable with variants, sizes, loading states, and icons
- **Input Component**: Advanced input with validation, icons, security features, and error handling
- **Navigation**: Bottom tab navigation with proper theming and icons
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Theme System**: Consistent color palette and styling constants

### 🔧 Development Tools
- **Hot Reloading**: Expo development server with fast refresh
- **Code Splitting**: Organized exports with index files
- **Validation System**: Comprehensive form validation utilities
- **Error Handling**: Centralized error handling in services and hooks
- **API Client**: Generic HTTP client with timeout, retry logic, and auth headers

### 🔐 Security & Authentication
- **Auth Context**: Complete authentication state management
- **Token Management**: Secure token storage with AsyncStorage
- **Form Validation**: Client-side validation for security and UX
- **API Security**: Bearer token authentication ready

### 🛠️ Utility Functions
- **Date/Time Utilities**: Comprehensive date formatting and manipulation
- **String Helpers**: Text processing, truncation, and formatting
- **Array Operations**: Sorting, grouping, and filtering utilities
- **Object Manipulation**: Deep cloning, picking, and validation
- **Performance Helpers**: Debouncing and throttling functions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd "C:\Users\Marti\Desktop\ELVIRA-APP\ElviraApp"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device:**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `w` for web browser

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## 📦 Key Dependencies

### Core Dependencies
- **expo**: Expo SDK for React Native development
- **react-navigation**: Navigation library with bottom tabs
- **@react-native-async-storage/async-storage**: Local data persistence
- **babel-plugin-module-resolver**: Absolute imports support

### Development Dependencies
- **babel-preset-expo**: Babel preset for Expo projects
- **metro-config**: Metro bundler configuration

## 🎨 Theming & Styling

### Color System
The app uses a comprehensive color system defined in `@constants/colors.js`:
- **Primary colors**: Blue theme with variations
- **Status colors**: Success, warning, error, info
- **Neutral colors**: Grays and backgrounds
- **Elvira-specific**: Brand colors for the application

### Global Styles
Consistent styling constants in `@styles/globalStyles.js`:
- **Spacing system**: xs, sm, md, lg, xl, xxl
- **Typography**: Font sizes and weights
- **Layout helpers**: Flexbox utilities
- **Component styles**: Buttons, inputs, cards
- **Shadow system**: Consistent elevation styles

## 🔧 Configuration

### Babel Configuration
Configured for absolute imports with path mapping:
```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module-resolver', {
      alias: {
        '@': './',
        '@components': './components',
        '@screens': './screens',
        // ... more aliases
      }
    }]
  ]
};
```

### Metro Configuration
Supports absolute imports and proper module resolution:
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.alias = {
  '@': __dirname,
  '@components': __dirname + '/components',
  // ... more aliases
};
```

## 📱 App Architecture

### State Management
- **Context API**: Global state management for authentication
- **Custom Hooks**: Encapsulated business logic for tasks, rooms, staff
- **Reducers**: Predictable state updates with actions

### Service Layer
- **API Client**: Generic HTTP client with interceptors
- **Service Classes**: Dedicated services for different domains
- **Error Handling**: Consistent error responses and logging

### Component Structure
- **Atomic Design**: Reusable components with single responsibility
- **Props Interface**: Consistent and predictable component APIs  
- **Composition**: Flexible component composition patterns

### Navigation Flow
- **Bottom Tabs**: Main app navigation with three primary screens
- **Screen Headers**: Consistent header styling and branding
- **Deep Linking**: Ready for URL-based navigation

## 🔄 Data Flow

1. **Components** → Use custom hooks for state and actions
2. **Hooks** → Call service layer for API interactions  
3. **Services** → Use API client for HTTP requests
4. **API Client** → Handles authentication, errors, and responses
5. **Context** → Manages global application state

## 🚀 Next Steps

The application is ready for development with:

1. **Feature Implementation**: Add specific business logic to hooks and services
2. **API Integration**: Connect to actual backend services
3. **UI Enhancement**: Build specific components for calendar, tasks, rooms
4. **Testing**: Add unit tests and integration tests
5. **Performance**: Optimize with React.memo, useMemo, useCallback
6. **Deployment**: Build for production and deploy to app stores

## 📝 Development Guidelines

### Import Conventions
```javascript
// External libraries
import React from 'react';
import { View, Text } from 'react-native';

// Internal imports (absolute paths)
import Button from '@components/common/Button';
import { useAuth } from '@hooks';
import { COLORS } from '@constants/colors';
```

### Component Pattern
```javascript
const MyComponent = ({ 
  prop1, 
  prop2, 
  style, 
  ...rest 
}) => {
  // Component logic
  return (
    <View style={[styles.container, style]} {...rest}>
      {/* Component content */}
    </View>
  );
};
```

### Hook Pattern
```javascript
export const useCustomHook = () => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const action = async () => {
    try {
      setLoading(true);
      setError(null);
      // Action logic
      const result = await service.method();
      setState(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { state, loading, error, action };
};
```

## 🤝 Contributing

1. Follow the established folder structure
2. Use absolute imports with `@` prefix
3. Implement proper error handling
4. Add validation for user inputs
5. Maintain consistent code style
6. Create reusable components
7. Document complex functions

## 📄 License

This project is proprietary software for the Elvira application.

---

**Happy coding!** 🎉

The Elvira app is now ready for development with a solid, scalable foundation following React Native and Expo best practices.