import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/theme/app_theme.dart';
import 'package:shree_ganesh_autodeal_admin/screens/home/admin_home.dart';

void main() {
  runApp(const AutodealAdminApp());
}

class AutodealAdminApp extends StatelessWidget {
  const AutodealAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Shree Ganesh Autodeal Admin',
      theme: ThemeData(
        colorScheme: AppTheme.lightColorScheme,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xfff6f7f5),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          color: Colors.white,
        ),
      ),
      home: const AdminHome(),
    );
  }
}
