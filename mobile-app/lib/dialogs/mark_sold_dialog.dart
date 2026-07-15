import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

Future<void> markSoldFlow(
    BuildContext context, ApiClient api, Vehicle vehicle) async {
  final priceController =
  TextEditingController(text: vehicle.price.toStringAsFixed(0));
  final buyerNameController = TextEditingController();
  final buyerPhoneController = TextEditingController();
  final notesController = TextEditingController();
  try {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Mark as sold'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                    controller: priceController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Sale price')),
                TextField(
                    controller: buyerNameController,
                    decoration: const InputDecoration(labelText: 'Buyer name')),
                TextField(
                    controller: buyerPhoneController,
                    keyboardType: TextInputType.phone,
                    decoration:
                    const InputDecoration(labelText: 'Buyer phone')),
                TextField(
                    controller: notesController,
                    decoration: const InputDecoration(labelText: 'Notes')),
              ],
            ),
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel')),
            FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Save sale')),
          ],
        );
      },
    );
    if (confirmed != true) return;
    await api.markSold(
      vehicleId: vehicle.id,
      salePrice: double.parse(priceController.text),
      buyerName: buyerNameController.text.trim(),
      buyerPhone: buyerPhoneController.text.trim(),
      notes: notesController.text.trim(),
    );
    if (context.mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Sale saved')));
    }
  } finally {
    priceController.dispose();
    buyerNameController.dispose();
    buyerPhoneController.dispose();
    notesController.dispose();
  }
}