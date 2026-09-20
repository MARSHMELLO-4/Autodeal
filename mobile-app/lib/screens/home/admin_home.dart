import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/api_constants.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';
import 'package:shree_ganesh_autodeal_admin/core/theme/app_theme.dart';
import 'package:shree_ganesh_autodeal_admin/screens/inventory/inventory_page.dart';
import 'package:shree_ganesh_autodeal_admin/screens/reports/reports_page.dart';
import 'package:shree_ganesh_autodeal_admin/screens/vehicle/vehicle_form_screen.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

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

  Widget _buildPage() {
    return switch (index) {
      0 => InventoryPage(api: api),
      1 => VehicleFormScreen(api: api),
      _ => ReportsPage(api: api),
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 68,
        titleSpacing: 0,
        title: Row(
          children: [
            // Brand mark
            // Container(
            //   width: 44,
            //   height: 44,
            //   decoration: BoxDecoration(
            //     gradient: AppColors.brandGradient,
            //     borderRadius: BorderRadius.circular(14),
            //     boxShadow: [
            //       BoxShadow(
            //         color: AppColors.maroon800.withValues(alpha: 0.3),
            //         blurRadius: 12,
            //         offset: const Offset(0, 4),
            //       ),
            //     ],
            //   ),
            //   child: const Icon(Icons.two_wheeler, color: Colors.white, size: 24),
            // ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Row(
                  children: [
                    const Text(
                      'Shree Ganesh',
                      style: TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 18,
                        color: AppColors.ink,
                        letterSpacing: -0.3,
                      ),
                    ),
                    Text(
                      ' Autodeal',
                      style: TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 18,
                        color: Theme.of(context).colorScheme.primary,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    const SizedBox(
                      width: 8,
                      height: 8,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: AppColors.statusAvailable,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      'Owner Control Panel',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                        color: AppColors.moss.withValues(alpha: 0.9),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.maroon50,
              borderRadius: BorderRadius.circular(AppTheme.radiusFull),
              border: Border.all(color: AppColors.maroon100),
            ),
            child: const Row(
              children: [
                Icon(Icons.monitor_heart, size: 14, color: AppColors.maroon700),
                SizedBox(width: 5),
                Text(
                  'LIVE',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1,
                    color: AppColors.maroon700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: AnimatedSwitcher(
        duration: AppTheme.durationBase,
        switchInCurve: Curves.easeOutCubic,
        switchOutCurve: Curves.easeInCubic,
        transitionBuilder: (child, animation) {
          final offset = Tween<Offset>(
            begin: const Offset(0.03, 0.02),
            end: Offset.zero,
          ).animate(animation);
          return FadeTransition(
            opacity: animation,
            child: SlideTransition(position: offset, child: child),
          );
        },
        child: KeyedSubtree(key: ValueKey(index), child: _buildPage()),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.storefront_outlined),
            selectedIcon: Icon(Icons.storefront),
            label: 'Stock',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline),
            selectedIcon: Icon(Icons.add_circle),
            label: 'Add',
          ),
          NavigationDestination(
            icon: Icon(Icons.insights_outlined),
            selectedIcon: Icon(Icons.insights),
            label: 'Reports',
          ),
        ],
      ),
    );
  }
}