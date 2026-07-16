import 'package:flutter_dotenv/flutter_dotenv.dart';


class ApiConstants {
  //for emulator
  // static const apiBaseUrl = String.fromEnvironment(
  //   'API_BASE_URL',
  //   defaultValue: 'http://10.0.2.2:9090',
  // );

  // for server
  static String get apiBaseUrl =>
      dotenv.env['API_BASE_URL']!;

  //for local server
  // static String get apiBaseUrl =>
  //     dotenv.env['API_BASE_URL_LOCAL']!;
}
