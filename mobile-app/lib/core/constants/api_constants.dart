import 'package:flutter_dotenv/flutter_dotenv.dart';


class ApiConstants {
  //for emulator
  // static const apiBaseUrl = String.fromEnvironment(
  //   'API_BASE_URL',
  //   defaultValue: 'http://10.0.2.2:9090',
  // );

  // for server
  static String get apiBaseUrl {
    if (dotenv.isInitialized) {
      return dotenv.env['API_BASE_URL'] ?? 'http://localhost:8080';
    }
    return 'http://localhost:8080';
  }

  static String get apiAdminKey {
    if (dotenv.isInitialized) {
      return dotenv.env['ADMIN_API_KEY'] ?? '';
    }
    print('Warning: ADMIN_API_KEY is not set in .env file.');
    return '';
  }


  //for local server
  // static String get apiBaseUrl =>
  //     dotenv.env['API_BASE_URL_LOCAL']!;
}
