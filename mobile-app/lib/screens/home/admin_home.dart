import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/api_constants.dart';
import 'package:shree_ganesh_autodeal_admin/screens/inventory/inventory_page.dart';
import 'package:shree_ganesh_autodeal_admin/screens/reports/reports_page.dart';
import 'package:shree_ganesh_autodeal_admin/screens/vehicle/vehicle_form_screen.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminHome extends StatefulWidget {
  const AdminHome({super.key});

  @override
  State<AdminHome> createState() => _AdminHomeState();
}

class _AdminHomeState extends State<AdminHome> {
  int index = 0;
  
  // Initialize the API client once
  late final ApiClient api;

  @override
  void initState() {
    super.initState();
    api = ApiClient(ApiConstants.apiBaseUrl);
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      InventoryPage(api: api),
      VehicleFormScreen(api: api),
      ReportsPage(api: api),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Shree Ganesh Autodeal',
          style: GoogleFonts.montserrat(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
        ),
        centerTitle: false,
      ),
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.two_wheeler_outlined),
            selectedIcon: Icon(Icons.two_wheeler),
            label: 'Stock',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline),
            selectedIcon: Icon(Icons.add_circle),
            label: 'Add',
          ),
          NavigationDestination(
            icon: Icon(Icons.bar_chart_outlined),
            selectedIcon: Icon(Icons.bar_chart),
            label: 'Reports',
          ),
        ],
      ),
    );
  }
}
