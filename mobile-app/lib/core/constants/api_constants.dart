class ApiConstants {
  //for emulator
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:9090',
  );
}
