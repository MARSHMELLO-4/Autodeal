import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/api_constants.dart';
import 'package:shree_ganesh_autodeal_admin/core/theme/app_theme.dart';
import 'package:shree_ganesh_autodeal_admin/screens/home/admin_home.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");
  WidgetsFlutterBinding.ensureInitialized();
  print("using baseUrl : ${ApiConstants.apiBaseUrl}");
  runApp(const AutodealAdminApp());
}

class AutodealAdminApp extends StatelessWidget {
  const AutodealAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Shree Ganesh Autodeal',
      theme: AppTheme.light(),
      home: const AdminHome(),
    );
  }
}