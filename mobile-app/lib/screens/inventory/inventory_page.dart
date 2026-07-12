import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/screens/inventory/vehicle_card.dart';
import 'package:shree_ganesh_autodeal_admin/screens/inventory/vehicle_details_bottomsheet.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

class InventoryPage extends StatefulWidget {
  const InventoryPage({required this.api, super.key});

  final ApiClient api;

  @override
  State<InventoryPage> createState() => _InventoryPageState();
}

class _InventoryPageState extends State<InventoryPage> {
  final searchController = TextEditingController();
  String status = 'AVAILABLE';
  bool loading = true;
  String? error;
  List<Vehicle> vehicles = [];

  @override
  void initState() {
    super.initState();
    load();
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  Future<void> load() async {
    if (!mounted) return;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      vehicles = await widget.api.getVehicles(
        search: searchController.text,
        status: status,
      );
    } catch (err) {
      error = err.toString();
    }
    if (mounted) setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: searchController,
            decoration: InputDecoration(
              hintText: 'Search by model, brand, color, number',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: IconButton(
                onPressed: load,
                icon: const Icon(Icons.arrow_forward),
              ),
              border: const OutlineInputBorder(),
            ),
            onSubmitted: (_) => load(),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['AVAILABLE', 'RESERVED', 'SOLD', 'ALL'].map((item) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(item),
                    selected: status == item,
                    onSelected: (_) {
                      setState(() => status = item);
                      load();
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          if (loading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: CircularProgressIndicator(),
              ),
            ),
          if (error != null) ErrorPanel(message: error!, onRetry: load),
          if (!loading && error == null && vehicles.isEmpty)
            const EmptyPanel(
              icon: Icons.two_wheeler_outlined,
              title: 'No vehicles found',
              subtitle: 'Add a bike or change the search filter.',
            ),
          for (final vehicle in vehicles)
            VehicleCard(
              vehicle: vehicle,
              onTap: () => showVehicleDetails(
                context,
                widget.api,
                vehicle.id,
                load,
              ),
            ),
        ],
      ),
    );
  }
}
